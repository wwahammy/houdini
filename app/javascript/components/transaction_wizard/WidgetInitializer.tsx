
// // License: LGPL-3.0-or-later
import * as React from "react";
import { TransactionPageProps } from "./types";
import { makeStyles, createStyles, Theme, withStyles, ThemeProvider } from "@material-ui/core/styles";
import IFrameDialog from '../common/IFrameDialog/IFrameDialog';
import { useAsync } from 'react-use'

function getSize(size: string) {
	switch (size) {
		case 'originalEmbedded':
		case 'original':
		default:
			return {
				width: '406px',
				height: '510px',
			};
	}
}

export interface WidgetInitializerProps extends TransactionPageProps {
	variant: 'modal' | 'embedded',
	size: 'original' | 'originalEmbedded',
	widgetType: string,
	widgetCustomization?: unknown
	open?: boolean
}



type ret = (...opts: any[]) => any

async function getComponentForType(type: string): Promise<(props: TransactionPageProps) => JSX.Element> {
	switch (type) {
		case 'originalDonation':
			return (await import('./DonationWizard')).default;
	}
}


// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		root: {
// 			display: 'flex',
// 			'& > *': {
// 				margin: theme.spacing(1),
// 				width: theme.spacing(16),
// 				height: theme.spacing(16),
// 			},
// 		},
// 	}),
// );

// const Dialog = withStyles((theme:Theme) => ({
// 		paperFullwidth: {
// 			margin: 0,
// 			padding: theme.spacing(1),
// 		},
// 	}))(MuiDialog);


function WidgetInitializer(props: WidgetInitializerProps): JSX.Element {
	const {
		variant,
		size,
		widgetType,
		widgetCustomization,
		open,
		...other
	} = props;

	const componentLoader = useAsync(async () => {
		return await getComponentForType(widgetType);
	}, [widgetType]);

	return (<IFrameDialog variant={variant} {...getSize(size)} open={open} >
		{
			componentLoader.loading ? <div>Loading...</div> :
				componentLoader.error ? <div> {componentLoader.error.message}</div>
					: componentLoader.value(other)
		}
	</IFrameDialog>
	);
}

export default WidgetInitializer;