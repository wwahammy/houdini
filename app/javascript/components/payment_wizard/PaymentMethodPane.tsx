
// License: LGPL-3.0-or-later
import * as React from "react";
import { Formik, Form } from "formik";
import Grid from "@material-ui/core/Grid";
import { Money } from "../../common/money";
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { reaction } from "mobx";

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

export interface IPaymentMethodData {
	pmType:string;
}

export interface IPaymentMethodProps<T extends IPaymentMethodData> {
	paymentMethodData:Partial<T>
  setPaymentMethodData:(i:T) => void
}



interface PaymentMethod {
	name:string
	title:string
	component:(props:IPaymentMethodProps<IPaymentMethodData>) => JSX.Element
}

interface IPaymentMethodPaneProps {
	paymentMethods: Array<PaymentMethod>
	amount:Money
	paymentMethodData: Partial<IPaymentMethodData>
	setPaymentMethodProps:(methodData:IPaymentMethodData) => void;
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
	const [value, setValue] = React.useState(0);
	const classes = useStyles();
	// eslint-disable-next-line @typescript-eslint/ban-types
	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};
	return (
		<div className={classes.root} >
			<AppBar position="static" color="default">
				<Tabs
					value={value}
					onChange={handleChange}
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
				return <TabPanel value={value} 	index={index} key={pm.name}>
					{pm.component({paymentMethodData: props.paymentMethodData,
						setPaymentMethodData:props.setPaymentMethodProps})}
				</TabPanel>;
			})}
		</div>
	);
}

export default PaymentMethodPane;