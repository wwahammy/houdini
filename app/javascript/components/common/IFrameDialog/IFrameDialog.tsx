import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';

const useStyles = makeStyles((theme: Theme) => createStyles(({
	/* Styles applied to the root element. */
	root: {
		'@media print': {
			// Use !important to override the Modal inline-style.
			position: 'absolute !important',
		},
	},
	/* Styles applied to the container element if `scroll="paper"`. */
	scrollPaper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	/* Styles applied to the container element. */
	container: {
		height: '100%',
		'@media print': {
			height: 'auto',
		},
		// We disable the focus ring for mouse, touch and keyboard users.
		outline: 0,
	},
	/* Styles applied to the `Paper` component. */
	paper: {
		margin: 0,
		position: 'relative',
		overflowY: 'auto', // Fix IE 11 issue, to remove at some point.
		'@media print': {
			overflowY: 'visible',
			boxShadow: 'none',
		},
	},
	/* Styles applied to the `Paper` component if `scroll="paper"`. */
	paperScrollPaper: {
		display: 'flex',
		flexDirection: 'column',
		maxHeight: 'calc(100%)',
	},
	/* Styles applied to the `Paper` component if `scroll="body"`. */
	paperScrollBody: {
		display: 'inline-block',
		verticalAlign: 'middle',
		textAlign: 'left', // 'initial' doesn't work on IE 11
	},
	/* Styles applied to the `Paper` component if `maxWidth="xl"`. */
	paperWidthXl: {
		maxWidth: (props: any) => props.width,
		maxHeight: (props: any) => props.height
	},
	/* Styles applied to the `Paper` component if `fullWidth={true}`. */
	paperFullWidth: {
		width: 'calc(100%)',
		height: 'calc(100%)',
	},
})));

function getVariantProps(variant: IFrameDialogVariant): Partial<DialogProps> {
	return variant === 'embedded' ? {
		disableBackdropClick: true,
		disableEscapeKeyDown: true,
		BackdropProps: { invisible: true }
	} : {
		disableBackdropClick: false,
		disableEscapeKeyDown: false,
		BackdropProps: { invisible: false }
	};
}

export type IFrameDialogVariant = 'embedded' | 'modal'

interface IFrameDialogProps extends Partial<DialogProps> {
	width: string,
	height: string
	variant: IFrameDialogVariant
	open: boolean
}


export default function IFrameDialog(props: IFrameDialogProps): JSX.Element {

	const {
		width,
		height,
		variant,
		open,
		...other
	} = props;

	const classes = useStyles({ width, height });

	return <Dialog classes={classes} open={open} fullWidth={true} maxWidth={'xl'} PaperProps={{ elevation: 1, role: null }} disablePortal={false} {...getVariantProps(variant)} {...other}>
	</Dialog>;
}

IFrameDialog.defaultProps = {open: true};
