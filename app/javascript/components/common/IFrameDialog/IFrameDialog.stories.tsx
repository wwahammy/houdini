// License: LGPL-3.0-or-later
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number, array, color, optionsKnob } from "@storybook/addon-knobs";

import IFrameDialog from './IFrameDialog';
import { Grid, Paper, DialogTitle, DialogContent } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		topPane: {
			padding: theme.spacing(2),
			textAlign: 'center',
			backgroundColor: 'purple',
		},
		// bottomPane: {
		// 	flexBasis: 'flex',
		// 	justifyContent: 'center',
		// 	alignItems: 'center',
		// 	overflowY: 'scroll'
		// }
	}),
);

const useTopPaneStyles = makeStyles(() => ({
	/* Styles applied to the root element. */
	root: {
		margin: 0,
		height: '25px',
		flex: '0 0 auto',
		padding: 0
	},
}));


function TopPane(props: { children: any }) {
	const classes = useTopPaneStyles();
	return <div className={classes.root}>
		{props.children}
	</div>;
}



export default {
	title: 'IFrameDialog',
	decorators: [withKnobs]
};

export function basicDialog() {

	const width = number("Width of IFrameDialog", 510, { min: 300, max: 700 });
	const height = number("Height of IFrameDialog", 406, { min: 200, max: 500 });

	const variant = optionsKnob('Variant',
		{ Embedded: 'embedded', Modal: 'modal' }, 'embedded', { display: 'inline-radio' });

	const open = boolean("Open?", true);
	const dialogTitleStyles = useTopPaneStyles();
	return <IFrameDialog width={`${width}px`} height={`${height}px`} variant={variant} open={open}>
		<DialogTitle disableTypography={true} style={{ backgroundColor: 'purple' }} classes={dialogTitleStyles}>
			The top section
		</DialogTitle>
		<DialogContent dividers={false}>
			<p>state one</p>
			<p>state two</p>
			<p>state three</p>
			<p>state four</p>
			<p>state five</p>
			<p>state six</p>
			<p> state seven</p>
			<p> state event longer</p>
			<p> state event longer</p><p> state event longer</p><p> state event longer</p><p> state event longer</p><p> state event longer</p><p> state event longer</p><p> state event longer</p>
		</DialogContent>
	</IFrameDialog>;
}
