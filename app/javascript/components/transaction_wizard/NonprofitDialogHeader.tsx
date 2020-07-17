
// License: LGPL-3.0-or-later
import * as React from "react";
import { DialogTitle, Grid } from "@material-ui/core";


interface INonprofitDialogHeaderProps {
	firstRow: string,
	secondRow?: string,
	image?: string,
	imageAlt?: string,
	children?: React.ReactNode
}
{/* <DialogTitle disableTypography={true} style={{ backgroundColor: 'purple' }} classes={dialogTitleStyles}>
			The top section
		</DialogTitle> */}

function NonprofitDialogHeader(props: INonprofitDialogHeaderProps): JSX.Element {

	return (
		<Grid container>
			{props.image ?
				<Grid item>
					<img src={props.image} alt={props.imageAlt} />
				</Grid> : ""
			}
			<Grid item xs={12} container>
				<Grid item xs={12}>
					<h2>{props.firstRow}</h2>
				</Grid>
				{
					props.secondRow ? <Grid item xs={12}>
						<p>{props.secondRow}</p>
					</Grid> : ""
				}
			</Grid>
			{props.children ? <Grid item xs={12}>
				{props.children}
			</Grid> : ""}
		</Grid>
	);
}

export default NonprofitDialogHeader;