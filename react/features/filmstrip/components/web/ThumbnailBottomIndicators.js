// @flow

import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isDisplayNameVisible, isNameReadOnly } from '../../../base/config/functions.any';
import DisplayName from '../../../display-name/components/web/DisplayName';
import { LAYOUTS } from '../../../video-layout';

import StatusIndicators from './StatusIndicators';

import { useSpeakerStats } from '../../../speaker-stats/functions'
import { createLocalizedTime } from '../../../speaker-stats/components/timeFunctions';
import { IconDominantSpeaker } from '../../../base/icons';
import { BaseIndicator } from '../../../base/react';
import { getIndicatorsTooltipPosition } from '../../functions.web';

declare var interfaceConfig: Object;

type Props = {

    /**
     * The current layout of the filmstrip.
     */
    currentLayout: string,

    /**
     * Class name for indicators container.
     */
    className: string,

    /**
     * Whether or not the indicators are for the local participant.
     */
    local: boolean,

    /**
     * Id of the participant for which the component is displayed.
     */
    participantId: string
}

const useStyles = makeStyles(() => {
    return {
        nameContainer: {
            display: 'flex',
            overflow: 'hidden',
            padding: '2px 0',

            '&>div': {
                display: 'flex',
                overflow: 'hidden'
            },

            '&:first-child': {
                marginLeft: '6px'
            }
        }
    };
});

function analyzeParticipantTimes(localSpeakerStats, t) {
    if (!localSpeakerStats) {
        return [false, ""];
    }

    let localParticipantTime = 0;
    let remoteParticipantTimes = {};
    for (const userId in localSpeakerStats) {
        const userStats = localSpeakerStats[userId];
        if (userStats.isLocalStats()) {
            localParticipantTime = userStats.getTotalDominantSpeakerTime();
        } else {
            remoteParticipantTimes[userStats.getUserId()] = userStats.getTotalDominantSpeakerTime();
        }
    }

    return [localParticipantTime, remoteParticipantTimes, true, createLocalizedTime(localParticipantTime, t)];
}

const LocalTimeSpokenIndicator = () => {
    const localSpeakerStats = useSpeakerStats(true);
    const { t } = useTranslation();

    const [ localParticipantTime, remoteParticipantTimes, shouldDisplayNotice, noticeMessage ] =
        analyzeParticipantTimes(localSpeakerStats, t);

    return (
        <>
            <div className = "timeSpokenIndicator">
                <span>{ createLocalizedTime(localParticipantTime, t) }</span>
            </div>
        </>
    )
}

const RemoteTimeSpokenIndicator = ({
    participantId
}) => {
    const localSpeakerStats = useSpeakerStats(false);
    const { t } = useTranslation();

    const [ localParticipantTime, remoteParticipantTimes, shouldDisplayNotice, noticeMessage ] =
        analyzeParticipantTimes(localSpeakerStats, t);

    return (
        <>
        {remoteParticipantTimes.hasOwnProperty(participantId)
            && <div className = "timeSpokenIndicator">
                <span>
                    { createLocalizedTime(remoteParticipantTimes[participantId], t) }
                </span>
            </div>
        }
        </>
    )
}

const TimeSpokenIndicator = ({
    local,
    participantId,
    currentLayout
}) => {
    const tooltipPosition = getIndicatorsTooltipPosition(currentLayout);
    return (
        <>
        <BaseIndicator
            icon = { IconDominantSpeaker }
            iconId = 'dominant-speaker'
            iconSize = { 15 }
            id = 'time-spoken'
            tooltipKey = 'speakerStats.speakerTime'
            tooltipPosition = { tooltipPosition } />
        {local
            ? <LocalTimeSpokenIndicator />
            :  <RemoteTimeSpokenIndicator participantId = {participantId} />
        }
        </>
    )

}

const ThumbnailBottomIndicators = ({
    className,
    currentLayout,
    local,
    participantId
}: Props) => {
    const styles = useStyles();
    const _allowEditing = !useSelector(isNameReadOnly);
    const _defaultLocalDisplayName = interfaceConfig.DEFAULT_LOCAL_DISPLAY_NAME;
    const _showDisplayName = useSelector(isDisplayNameVisible);

    return (<div className = { className }>
        <StatusIndicators
            audio = { true }
            moderator = { true }
            participantID = { participantId }
            screenshare = { currentLayout === LAYOUTS.TILE_VIEW } />
        {
            _showDisplayName && (
                <span className = { styles.nameContainer }>
                    <DisplayName
                        allowEditing = { local ? _allowEditing : false }
                        currentLayout = { currentLayout }
                        displayNameSuffix = { local ? _defaultLocalDisplayName : '' }
                        elementID = { local ? 'localDisplayName' : `participant_${participantId}_name` }
                        participantID = { participantId } />
                </span>
            )
        }
        <TimeSpokenIndicator
            local = { local }
            participantId = { participantId }
            currentLayout = { currentLayout } />
    </div>);
};

export default ThumbnailBottomIndicators;
