// @flow
import React from 'react';
import { Icon, IconHangup } from '../../../../base/icons';
import BaseTheme from '../../../../base/ui/components/BaseTheme.native';

const EndMeetingIcon = () => (<Icon
    size = { 20 }
    src = { IconHangup }
    color = {BaseTheme.palette.icon01} />);

export default EndMeetingIcon;
