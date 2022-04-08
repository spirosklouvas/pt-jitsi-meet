// @flow

import BaseTheme from '../../../../../base/ui/components/BaseTheme.native';

const DEFAULT_SIZE = 65;

/**
 * The styles of the feature base/participants.
 */
export default {

    avatarContainer: (size: number = DEFAULT_SIZE) => {
        return {
            borderRadius: size / 2,
            height: size,
            maxHeight: size,
            justifyContent: 'center',
            overflow: 'hidden',
            width: size,
            maxWidth: size,
            flex: 1,
            zIndex: 1,
            elevation: 1,
        };
    },

    initialsText: (size: number = DEFAULT_SIZE) => {
        return {
            color: 'white',
            fontSize: size * 0.45,
            fontWeight: '100'
        };
    },

    initialsContainer: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: BaseTheme.palette.ui03
    },

    unmuted: {
        borderWidth: 4,
        borderColor: "#1EC26A"
    }
};
