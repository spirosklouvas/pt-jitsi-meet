// @flow

import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { isMobileBrowser } from '../../../base/environment/utils';
import ConnectionIndicator from '../../../connection-indicator/components/web/ConnectionIndicator';
import { LAYOUTS } from '../../../video-layout';
import { STATS_POPOVER_POSITION } from '../../constants';
import { getIndicatorsTooltipPosition } from '../../functions.web';

import RaisedHandIndicator from './RaisedHandIndicator';
import StatusIndicators from './StatusIndicators';
import VideoMenuTriggerButton from './VideoMenuTriggerButton';

import { FACIAL_EXPRESSION_EMOJIS } from '../../../facial-recognition/constants.js';


declare var interfaceConfig: Object;

type Props = {

    /**
     * The current layout of the filmstrip.
     */
    currentLayout: string,

    /**
     * Hide popover callback.
     */
    hidePopover: Function,

    /**
     * Class name for the status indicators container.
     */
    indicatorsClassName: string,

    /**
     * Whether or not the thumbnail is hovered.
     */
    isHovered: boolean,

    /**
     * Whether or not the indicators are for the local participant.
     */
    local: boolean,

    /**
     * Id of the participant for which the component is displayed.
     */
    participantId: string,

    /**
     * Whether popover is visible or not.
     */
    popoverVisible: boolean,

    /**
     * Show popover callback.
     */
    showPopover: Function
}

const useStyles = makeStyles(() => {
    return {
        container: {
            display: 'flex',

            '& > *:not(:last-child)': {
                marginRight: '4px'
            }
        }
    };
});

function lfe_to_emoji(lastFacialExpression) {
    if (lastFacialExpression in FACIAL_EXPRESSION_EMOJIS) {
        return FACIAL_EXPRESSION_EMOJIS[lastFacialExpression];
    } else if (lastFacialExpression === "INITIAL_LAST_FACIAL_EXPRESSION" ||
        lastFacialExpression === "unknown") {
        return "";
    } else {
        return lastFacialExpression;
    }
}

const LocalEmotionIndicator = () => {
    const { lastFacialExpression: lfe } = useSelector(state => state['features/facial-recognition']);

    return (
        <>
            <div className = "thumbnailFacialExpressionIndicator">
                <span>{ lfe_to_emoji(lfe.emotion) }</span>
            </div>
        </>
    )

}

const RemoteEmotionIndicator = ({
    participantId
}) => {
    const conference = useSelector(state => state['features/base/conference'].conference);
    const [lfe, setLfe] = useState("");

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (conference && participantId) {
                const stats = conference.getSpeakerStats();
                if (stats[participantId]) {
                    if (!stats[participantId].isLocalStats()) {
                        const newLfe = stats[participantId].getLastFacialExpression();
                        if (newLfe != lfe) {
                            setLfe(newLfe);
                        }
                    }
                }
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <div className = "thumbnailFacialExpressionIndicator">
                <span>{ lfe_to_emoji(lfe) }</span>
            </div>
        </>
    )

}

const EmotionIndicator = ({
    local,
    participantId
}) => local ? (<LocalEmotionIndicator />) : ( <RemoteEmotionIndicator participantId = {participantId} />);

const ThumbnailTopIndicators = ({
    currentLayout,
    hidePopover,
    indicatorsClassName,
    isHovered,
    local,
    participantId,
    popoverVisible,
    showPopover
}: Props) => {
    const styles = useStyles();

    const _isMobile = isMobileBrowser();
    const { NORMAL = 16 } = interfaceConfig.INDICATOR_FONT_SIZES || {};
    const _indicatorIconSize = NORMAL;
    const _connectionIndicatorAutoHideEnabled = Boolean(
        useSelector(state => state['features/base/config'].connectionIndicators?.autoHide) ?? true);
    const _connectionIndicatorDisabled = _isMobile
        || Boolean(useSelector(state => state['features/base/config'].connectionIndicators?.disabled));

    const showConnectionIndicator = isHovered || !_connectionIndicatorAutoHideEnabled;

    return (
        <>
            <div className = { styles.container }>
                {!_connectionIndicatorDisabled
                    && <ConnectionIndicator
                        alwaysVisible = { showConnectionIndicator }
                        enableStatsDisplay = { true }
                        iconSize = { _indicatorIconSize }
                        participantId = { participantId }
                        statsPopoverPosition = { STATS_POPOVER_POSITION[currentLayout] } />
                }
                <RaisedHandIndicator
                    iconSize = { _indicatorIconSize }
                    participantId = { participantId }
                    tooltipPosition = { getIndicatorsTooltipPosition(currentLayout) } />
                {currentLayout !== LAYOUTS.TILE_VIEW && (
                    <div className = { clsx(indicatorsClassName, 'top-indicators') }>
                        <StatusIndicators
                            participantID = { participantId }
                            screenshare = { true } />
                    </div>
                )}
            </div>
            <div className = { styles.container }>
                <EmotionIndicator
                    local = { local }
                    participantId = { participantId } />
                <VideoMenuTriggerButton
                    hidePopover = { hidePopover }
                    local = { local }
                    participantId = { participantId }
                    popoverVisible = { popoverVisible }
                    showPopover = { showPopover }
                    visible = { isHovered } />
            </div>
        </>);
};

export default ThumbnailTopIndicators;
