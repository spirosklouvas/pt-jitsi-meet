// @flow

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import AudioRoutePickerDialog from '../../../../mobile/audio-mode/components/AudioRoutePickerDialog';
import { openDialog } from '../../../../base/dialog/actions';
import AudioIcon from './AudioIcon';

import styles from './styles';

const SelectSoundDevice = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onSelect = useCallback(() =>
        dispatch(openDialog(AudioRoutePickerDialog))
        , [dispatch]);

    return (
        <Button
            icon = { AudioIcon }
            accessibilityLabel={t('carmode.actions.selectSoundDevice')}
            children={t('carmode.actions.selectSoundDevice')}
            labelStyle={styles.soundDeviceButtonLabel}
            mode='contained'
            onPress={onSelect}
            style={styles.soundDeviceButton} />
    );
};

export default SelectSoundDevice;
