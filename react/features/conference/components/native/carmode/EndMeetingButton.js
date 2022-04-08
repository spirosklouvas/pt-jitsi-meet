// @flow

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import EndMeetingIcon from './EndMeetingIcon';
import { appNavigate } from '../../../../app/actions';
import { createToolbarEvent, sendAnalytics } from '../../../../analytics';
import styles from './styles';

const EndMeetingButton = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onSelect = useCallback(() => {
        sendAnalytics(createToolbarEvent('hangup'));

        dispatch(appNavigate(undefined));
    }, [dispatch]);

    return (
        <Button
            icon = { EndMeetingIcon }
            accessibilityLabel={t('carmode.actions.leaveMeeting')}
            children={t('carmode.actions.leaveMeeting')}
            labelStyle={styles.endMeetingButtonLabel}
            mode='contained'
            onPress={onSelect}
            style={styles.endMeetingButton} />
    );
};

export default EndMeetingButton;
