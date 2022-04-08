import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Icon, IconCircleActive, IconCircleInactive } from '../../../base/icons';

const NavigationThumb = ({ thumbsNumber, selectedThumb}) => (
    <SafeAreaView
        style ={{
            alignSelf: 'center',
            flexDirection: 'row',
            position: 'absolute',
            bottom: 13,
            height: 8,
            flex: 1
        }}>
        {new Array(thumbsNumber).fill(0).map((_, index) =>
            <Icon
                size= {8}
                src= { index + 1 === selectedThumb ? IconCircleActive : IconCircleInactive}
                style={{marginRight: 10}} />
        )}
    </SafeAreaView>
)

export default NavigationThumb;
