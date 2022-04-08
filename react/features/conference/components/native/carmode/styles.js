import BaseTheme from '../../../../base/ui/components/BaseTheme.native';

const baseButton = {
    borderRadius: BaseTheme.shape.borderRadius,
    height: BaseTheme.spacing[7],
    marginTop: BaseTheme.spacing[3],
    marginLeft: BaseTheme.spacing[10],
    marginRight: BaseTheme.spacing[10],
    display: 'flex',
    justifyContent: 'space-around',
    height: 48,
    width: 300
};

const baseLabel = {
    display: 'flex',
    fontSize: 16,
    textTransform: 'capitalize'
};

/**
 * The styles of the native components of the feature {@code breakout rooms}.
 */
export default {

    soundDeviceButtonLabel: {
        ...baseLabel,
        color: BaseTheme.palette.text06
    },

    soundDeviceButton: {
        ...baseButton,
        backgroundColor: BaseTheme.palette.section01
    },

    endMeetingButton: {
        ...baseButton,
        backgroundColor: BaseTheme.palette.actionDanger,
        marginBottom: 60
    },

    endMeetingButtonLabel: {
        ...baseLabel,
        color: BaseTheme.palette.text01
    },
    
};
