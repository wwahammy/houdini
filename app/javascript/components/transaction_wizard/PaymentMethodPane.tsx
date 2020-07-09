
// License: LGPL-3.0-or-later
import * as React from "react";

import { Money } from "../../common/money";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { IPaymentMethodData } from "./types";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_7o2KOUlDEz5wFr91SSbfVMXE00kfO0dxlh");
interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}



export interface IPaymentMethodProps {
	paymentMethodData:Partial<IPaymentMethodData>
	options?:any
  finish:(i:IPaymentMethodData) => void
}



export interface PaymentDescriptionProps {
	name:string
	title:string
	component:(props:IPaymentMethodProps) => JSX.Element
}

interface IPaymentMethodPaneProps {
	paymentMethods: Array<PaymentDescriptionProps>
	amount:Money
	paymentMethodData: Partial<IPaymentMethodData>
	finish:(methodData:IPaymentMethodData) => void;
}

function a11yProps(index: any) {
	return {
		id: `scrollable-auto-tab-${index}`,
		'aria-controls': `scrollable-auto-tabpanel-${index}`,
	};
}
const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
}));

function PaymentMethodPane(props:IPaymentMethodPaneProps) : JSX.Element {
	const [tab, setTab] = React.useState(0);
	const classes = useStyles();
	// eslint-disable-next-line @typescript-eslint/ban-types
	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setTab(newValue);
	};
	return (
		<div className={classes.root} >
			<AppBar position="static" color="default">
				<Tabs
					value={tab}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					aria-label="scrollable auto tabs example"
				>{
						props.paymentMethods.map((pm, index) => {
							return <Tab label={pm.title} key={pm.name} {...a11yProps(index)}/>;
						})
					}
				</Tabs>
			</AppBar>
			{props.paymentMethods.map((pm,index) => {
				return <TabPanel value={tab} 	index={index} key={pm.name}>
					{pm.component({paymentMethodData: props.paymentMethodData,
						finish:props.finish,
						options:{stripePromise}
					})}
				</TabPanel>;
			})}
		</div>
	);
}

export default PaymentMethodPane;