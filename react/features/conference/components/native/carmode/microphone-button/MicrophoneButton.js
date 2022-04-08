// @flow

import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, IconMicrophone, IconMicrophoneEmptySlash } from '../../../../../base/icons';

import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { muteLocal } from '../../../../../video-menu/actions';
import { MEDIA_TYPE } from '../../../../../base/media';
import { isLocalTrackMuted } from '../../../../../base/tracks';
import { isAudioMuteButtonDisabled } from '../../../../../toolbox/functions.any';
import { getFeatureFlag, AUDIO_MUTE_BUTTON_ENABLED } from '../../../../../base/flags';

/**
 * Implements a stateless avatar component that renders an avatar purely from what gets passed through
 * props.
 */
const MicrophoneButton = ({ size }) => {
    const dispatch = useDispatch();
    const audioMuted = useSelector(state => isLocalTrackMuted(state['features/base/tracks'], MEDIA_TYPE.AUDIO));
    const disabled = useSelector(state => state['features/base/config'].startSilent || isAudioMuteButtonDisabled(state));
    const enabledFlag = useSelector(state => getFeatureFlag(state, AUDIO_MUTE_BUTTON_ENABLED, true));

    if (!enabledFlag) {
        return null;
    }

    const toggleMute = useCallback(() => {
        !disabled && dispatch(muteLocal(!audioMuted, MEDIA_TYPE.AUDIO))
    }, [audioMuted, disabled]);

    return (
        <TouchableOpacity
            onPress={toggleMute}
        >
            <View
                style={[
                    styles.avatarContainer(size),
                    !audioMuted && styles.unmuted
                ]}>
                <View
                    style={ styles.initialsContainer }>
                    <Icon
                        src={ audioMuted ? IconMicrophoneEmptySlash : IconMicrophone}
                        style={styles.initialsText(size)} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default MicrophoneButton;