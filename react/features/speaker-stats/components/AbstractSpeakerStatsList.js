// @flow

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { useSpeakerStats } from '../functions'


/**
 * Component that renders the list of speaker stats.
 *
 * @param {Function} speakerStatsItem - React element tu use when rendering.
 * @param {Object} itemStyles - Styles for the speaker stats item.
 * @returns {Function}
 */
const abstractSpeakerStatsList = (speakerStatsItem: Function, itemStyles?: Object): Function[] => {
    const { t } = useTranslation();
    const { showFacialExpressions } = useSelector(state => state['features/speaker-stats']);
    const { defaultRemoteDisplayName } = useSelector(
        state => state['features/base/config']) || {};

    const localSpeakerStats = useSpeakerStats();
    const userIds = Object.keys(localSpeakerStats).filter(id => localSpeakerStats[id] && !localSpeakerStats[id].hidden);

    return userIds.map(userId => {
        const statsModel = localSpeakerStats[userId];
        const props = {};

        props.isDominantSpeaker = statsModel.isDominantSpeaker();
        props.dominantSpeakerTime = statsModel.getTotalDominantSpeakerTime();
        props.participantId = userId;
        props.hasLeft = statsModel.hasLeft();
        if (showFacialExpressions) {
            props.facialExpressions = statsModel.getFacialExpressions();
        }
        props.hidden = statsModel.hidden;
        props.showFacialExpressions = showFacialExpressions;
        props.displayName = statsModel.getDisplayName() || defaultRemoteDisplayName;
        if (itemStyles) {
            props.styles = itemStyles;
        }
        props.t = t;

        return speakerStatsItem(props);
    });
};


export default abstractSpeakerStatsList;
