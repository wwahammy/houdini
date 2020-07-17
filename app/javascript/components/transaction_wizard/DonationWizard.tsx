
// // License: LGPL-3.0-or-later
import * as React from "react";
// import { makeStyles, Theme, createStyles, createMuiTheme, ThemeProvider, ThemeOptions } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import { Formik, Form, useFormikContext, FormikContext } from "formik";
import AmountPane from "./AmountPane";
import { Money } from "../../common/money";
import PaymentMethodPane from "./PaymentMethodPane";
import { TransactionParams, TransactionPageProps, IPaymentMethodData } from "./types";
import NonprofitDialogHeader from "./NonprofitDialogHeader";
import useSteps from "../hooks/useSteps";
import { DialogContent } from "@material-ui/core";

// import "fontsource-roboto/latin-ext.css";
// import useSteps from "../hooks/useSteps";


// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		root: {
// 			width: '100%',
// 		},
// 		button: {
// 			marginRight: theme.spacing(1),
// 		},
// 		completed: {
// 			display: 'inline-block',
// 		},
// 		instructions: {
// 			marginTop: theme.spacing(1),
// 			marginBottom: theme.spacing(1),
// 		},
// 	}),
// );

// function getSteps() {
// 	return [{key: 'amount', title:() => "Amount", component:(props: {transactionProps:TransactionPageProps, formikContext:any) => (<AmountPane amountOptions={transactionProps.transactionInit.data.amountOptions} amount={formikContext.values.amount} finish={(amount:Money) => {
// 		formikContext.setFieldValue('amount', amount);
// 		handleNext();
// 	}}/>)}
// }








export type IInitialValues = Partial<TransactionParams>

// interface IWizardContext<T> {
// 	values: T
// }

// export function useWizardContext<T>():IWizardContext<T> {
// 	const {values} =  useFormikContext<T>();
// 	return {values};
// }

// interface IStep {
// 	title
// }




// function DonationWizard(props: TransactionPageProps): JSX.Element {


// 	const themeOptions:ThemeOptions = {};
// 	if (props.style && props.style.primary && typeof props.style.primary === 'string') {
// 		themeOptions.palette = {
// 			primary: {main: props.style.primary }
// 		};
// 	}

// 	const theme = createMuiTheme(themeOptions);


// 	return (
// 		<ThemeProvider theme={theme}>
// 			<Formik<IInitialValues> initialValues={{
// 				amount: props.transactionInit.data.amount,
// 				supporter: props.supporter,
// 				paymentMethod: null
// 			}} onSubmit={(values, formikBag) => {
// 				props.callbacks.onSuccess(values);
// 				formikBag.setSubmitting(false);
// 			}} enableReinitialize={true}>
// 				<InnerTransactionWizard {...props}/>
// 			</Formik>
// 		</ThemeProvider>
// 	);
// }

// DonationWizard.defaultProps = {
// 	nonprofit: {
// 		id: 1,
// 		name: "Fake name"
// 	},
// 	transactionInit: {
// 		type: 'donation',
// 		data: {
// 			amount: Money.fromCents(0, 'usd'),
// 			amountOptions: [500, 1000, 2500, 4000, 10000, 20000].map((i) => Money.fromCents(i, 'usd'))
// 		}
// 	},
// 	supporter: {},
// 	callbacks: {
// 		onSuccess: () => { console.log('default success');}
// 	},
// 	paymentMethods: []
// } as TransactionPageProps;


// function InnerTransactionWizard(props:TransactionPageProps) {
// 	const formikContext = useFormikContext<IInitialValues>();
// 	const classes = useStyles();
// 	steps
// 	useSteps({steps}


// 	const [disabled] = React.useState<{ [k: number]: boolean }>({


function AmountPaneWrapper(props: TransactionPageProps & { next: () => void }) {
	const formikContext = useFormikContext<IInitialValues>();
	return (<AmountPane amountOptions={props.transactionInit.data.amountOptions} amount={formikContext.values.amount} finish={(amount: Money) => {
		formikContext.setFieldValue('amount', amount);
		props.next();
	}} />);
}

function PaymentMethodPaneWrapper(props: TransactionPageProps) {
	const formikContext = useFormikContext<IInitialValues>();
	return (<PaymentMethodPane amount={formikContext.values.amount}
		paymentMethodData={formikContext.values.paymentMethod}
		paymentMethods={props.paymentMethods}
		finish={(methodData: IPaymentMethodData) => {
			formikContext.setFieldValue('paymentMethod', methodData);
			formikContext.submitForm();
		}} />);
}

// 	return (<Form>
// 		<div className={classes.root}>
// 			<Stepper nonLinear activeStep={activeStep}>
// 				{steps.map((label, index) => (
// 					<Step key={label}>
// 						<StepButton onClick={handleStep(index)} completed={completed[index]} disabled={disabled[index]}>
// 							{label}
// 						</StepButton>
// 					</Step>
// 				))}
// 			</Stepper>
// 			<div>
// 				<div>
// 					{getStepContent(activeStep)}
// 				</div>
// 			</div>
// 		</div>
// 	</Form>);
// }

function DonationWizard(props: TransactionPageProps): JSX.Element {

	return (
		<Formik<IInitialValues> initialValues={{
			amount: props.transactionInit.data.amount,
			supporter: props.supporter,
			paymentMethod: null
		}} onSubmit={(values, formikBag) => {
			props.callbacks.onSuccess(values);
			formikBag.setSubmitting(false);
		}} enableReinitialize={true}>
			<InnerDonationWizard {...props} />
		</Formik>
	);
}

function getSteps() {
	return [{
		key: 'amount',
		label: 'Amount',
		component: AmountPaneWrapper
	},
	{
		key: 'payment',
		label: 'Payment',
		component: PaymentMethodPaneWrapper
	}];
}

function InnerDonationWizard(props: TransactionPageProps) {

	const stepsState = useSteps({ steps: getSteps() });
	return (<Form>
		<NonprofitDialogHeader firstRow={props.nonprofit.name}>
			<Stepper nonLinear activeStep={stepsState.activeStep}>
				{stepsState.steps.map(({key,label}, index) => (
					<Step key={key}>
						<StepButton onClick={stepsState.handleGoto(index)} completed={stepsState.completed[index]} disabled={stepsState.completed[index]}>
							{label}
						</StepButton>
					</Step>
				))}
			</Stepper>
		</NonprofitDialogHeader>
		<DialogContent>
			{getSteps()[stepsState.activeStep].component({...props, next: stepsState.next})}
		</DialogContent>
	</Form >);
}

export default DonationWizard;