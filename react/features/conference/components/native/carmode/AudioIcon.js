// @flow
import React from 'react';
import { Icon, IconVolumeEmpty } from '../../../../base/icons';
import BaseTheme from '../../../../base/ui/components/BaseTheme.native';

const AudioIcon = () => (<Icon
    size = { 20 }
    src = { IconVolumeEmpty }
    color = {BaseTheme.palette.text06} />);

export default AudioIcon;
