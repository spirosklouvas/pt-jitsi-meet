// @flow

import React from 'react';
import { Text, View } from 'react-native';

import { getConferenceName, getConferenceTimestamp } from '../../../../base/conference/functions';
import { getFeatureFlag, MEETING_NAME_ENABLED } from '../../../../base/flags';
import { connect } from '../../../../base/redux';

import Labels from '../Labels';
import styles from '../styles';


type Props = {

    /**
     * Creates a function to be invoked when the onPress of the touchables are
     * triggered.
     */
    _createOnPress: Function,

    /**
     * Whether displaying the current conference timer is enabled or not.
     */
    _conferenceTimerEnabled: boolean,

    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string,

    /**
     * Whether displaying the current meeting name is enabled or not.
     */
    _meetingNameEnabled: boolean,

    /**
     * True if the navigation bar should be visible.
     */
    _visible: boolean
};

/**
 * Implements a navigation bar component that is rendered on top of the
 * conference screen.
 *
 * @param {Props} props - The React props passed to this component.
 * @returns {React.Node}
 */
const TitleBar = (props: Props) => (<>
    <View
        pointerEvents = 'box-none'
        style = { styles.titleBarWrapper }>
        <View
            pointerEvents = 'box-none'
            style = { styles.roomNameWrapper }>
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <Labels createOnPress = { props._createOnPress } />
            {
                props._meetingNameEnabled
                        && <View style = { styles.roomNameView }>
                            <Text
                                numberOfLines = { 1 }
                                style = { styles.roomName }>
                                { props._meetingName }
                            </Text>
                        </View>
            }
        </View>
    </View>
</>);

/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    const { hideConferenceSubject } = state['features/base/config'];

    return {
        _meetingName: getConferenceName(state),
        _meetingNameEnabled:
            getFeatureFlag(state, MEETING_NAME_ENABLED, true) && !hideConferenceSubject,
    };
}

export default connect(_mapStateToProps)(TitleBar);
