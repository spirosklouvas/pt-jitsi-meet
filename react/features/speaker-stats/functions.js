// @flow

import _ from 'lodash';

import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { initUpdateStats } from './actions';
import {
    SPEAKER_STATS_RELOAD_INTERVAL
} from './constants';

import {
    getParticipantById,
    PARTICIPANT_ROLE,
    getLocalParticipant
} from '../base/participants';
import { objectSort } from '../base/util';

/**
 * Checks if the speaker stats search is disabled.
 *
 * @param {*} state - The redux state.
 * @returns {boolean} - True if the speaker stats search is disabled and false otherwise.
 */
export function isSpeakerStatsSearchDisabled(state: Object) {
    return state['features/base/config']?.disableSpeakerStatsSearch;
}

/**
 * Gets whether participants in speaker stats should be ordered or not, and with what priority.
 *
 * @param {*} state - The redux state.
 * @returns {Array<string>} - The speaker stats order array or an empty array.
 */
export function getSpeakerStatsOrder(state: Object) {
    return state['features/base/config']?.speakerStatsOrder ?? [
        'role',
        'name',
        'hasLeft'
    ];
}

/**
 * Gets speaker stats.
 *
 * @param {*} state - The redux state.
 * @returns {Object} - The speaker stats.
 */
export function getSpeakerStats(state: Object) {
    return state['features/speaker-stats']?.stats ?? {};
}

/**
 * Gets speaker stats search criteria.
 *
 * @param {*} state - The redux state.
 * @returns {string | null} - The search criteria.
 */
export function getSearchCriteria(state: Object) {
    return state['features/speaker-stats']?.criteria;
}

/**
 * Gets if speaker stats reorder is pending.
 *
 * @param {*} state - The redux state.
 * @returns {boolean} - The pending reorder flag.
 */
export function getPendingReorder(state: Object) {
    return state['features/speaker-stats']?.pendingReorder ?? false;
}

/**
 * Get sorted speaker stats based on a configuration setting.
 *
 * @param {Object} state - The redux state.
 * @param {Object} stats - The current speaker stats.
 * @returns {Object} - Ordered speaker stats.
 * @public
 */
export function getSortedSpeakerStats(state: Object, stats: Object) {
    const orderConfig = getSpeakerStatsOrder(state);

    if (orderConfig) {
        const enhancedStats = getEnhancedStatsForOrdering(state, stats, orderConfig);
        const sortedStats = objectSort(enhancedStats, (currentParticipant, nextParticipant) => {
            if (orderConfig.includes('hasLeft')) {
                if (nextParticipant.hasLeft() && !currentParticipant.hasLeft()) {
                    return -1;
                } else if (currentParticipant.hasLeft() && !nextParticipant.hasLeft()) {
                    return 1;
                }
            }

            let result;

            for (const sortCriteria of orderConfig) {
                switch (sortCriteria) {
                case 'role':
                    if (!nextParticipant.isModerator && currentParticipant.isModerator) {
                        result = -1;
                    } else if (!currentParticipant.isModerator && nextParticipant.isModerator) {
                        result = 1;
                    } else {
                        result = 0;
                    }
                    break;
                case 'name':
                    result = (currentParticipant.displayName || '').localeCompare(
                        nextParticipant.displayName || ''
                    );
                    break;
                }

                if (result !== 0) {
                    break;
                }
            }

            return result;
        });

        return sortedStats;
    }
}

/**
 * Enhance speaker stats to include data needed for ordering.
 *
 * @param {Object} state - The redux state.
 * @param {Object} stats - Speaker stats.
 * @param {Array<string>} orderConfig - Ordering configuration.
 * @returns {Object} - Enhanced speaker stats.
 * @public
 */
function getEnhancedStatsForOrdering(state, stats, orderConfig) {
    if (!orderConfig) {
        return stats;
    }

    for (const id in stats) {
        if (stats[id].hasOwnProperty('_hasLeft') && !stats[id].hasLeft()) {
            if (orderConfig.includes('role')) {
                const participant = getParticipantById(state, stats[id].getUserId());

                stats[id].isModerator = participant && participant.role === PARTICIPANT_ROLE.MODERATOR;
            }
        }
    }

    return stats;
}

/**
 * Filter stats by search criteria.
 *
 * @param {Object} state - The redux state.
 * @param {Object | undefined} stats - The unfiltered stats.
 *
 * @returns {Object} - Filtered speaker stats.
 * @public
 */
export function filterBySearchCriteria(state: Object, stats: ?Object) {
    const filteredStats = _.cloneDeep(stats ?? getSpeakerStats(state));
    const criteria = getSearchCriteria(state);

    if (criteria !== null) {
        const searchRegex = new RegExp(criteria, 'gi');

        for (const id in filteredStats) {
            if (filteredStats[id].hasOwnProperty('_isLocalStats')) {
                const name = filteredStats[id].getDisplayName();

                filteredStats[id].hidden = !name || !name.match(searchRegex);
            }
        }
    }

    return filteredStats;
}

/**
 * Reset the hidden speaker stats.
 *
 * @param {Object} state - The redux state.
 * @param {Object | undefined} stats - The unfiltered stats.
 *
 * @returns {Object} - Speaker stats.
 * @public
 */
export function resetHiddenStats(state: Object, stats: ?Object) {
    const resetStats = _.cloneDeep(stats ?? getSpeakerStats(state));

    for (const id in resetStats) {
        if (resetStats[id].hidden) {
            resetStats[id].hidden = false;
        }
    }

    return resetStats;
}

export function useSpeakerStats(periodicUpdate = true) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const conference = useSelector(state => state['features/base/conference'].conference);
    const { stats: speakerStats} = useSelector(state => state['features/speaker-stats']);
    const localParticipant = useSelector(getLocalParticipant);
    const { enableDisplayFacialExpressions } = useSelector(state => state['features/base/config']) || {};
    const { facialExpressions: localFacialExpressions } = useSelector(
        state => state['features/facial-recognition']) || {};

    /**
     * Update the internal state with the latest speaker stats.
     *
     * @returns {Object}
     * @private
     */
    const getLocalSpeakerStats = useCallback(() => {
        if (!conference) {
            return null;
        }
        const stats = conference.getSpeakerStats();

        for (const userId in stats) {
            if (stats[userId]) {
                if (stats[userId].isLocalStats()) {
                    const meString = t('me');

                    stats[userId].setDisplayName(
                        localParticipant.name
                            ? `${localParticipant.name} (${meString})`
                            : meString
                    );
                    if (enableDisplayFacialExpressions) {
                        stats[userId].setFacialExpressions(localFacialExpressions);
                    }
                }

                if (!stats[userId].getDisplayName()) {
                    stats[userId].setDisplayName(
                        conference.getParticipantById(userId)?.name
                    );
                }
            }
        }

        return stats;
    });

    const updateStats = useCallback(
        () => dispatch(initUpdateStats(getLocalSpeakerStats)),
        [ dispatch, initUpdateStats ]);

    useEffect(() => {
        let intervalId = null;
        if (periodicUpdate) {
            intervalId = setInterval(() => {
                updateStats();
            }, SPEAKER_STATS_RELOAD_INTERVAL);
        }

        return () => {
            if (periodicUpdate) {
                clearInterval(intervalId);
            }
        };
    }, []);

    const localSpeakerStats = Object.keys(speakerStats).length === 0 ? getLocalSpeakerStats() : speakerStats;
    return localSpeakerStats;
}
