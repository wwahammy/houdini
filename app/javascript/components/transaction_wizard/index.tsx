
// License: LGPL-3.0-or-later
import * as React from "react";
import { makeStyles, Theme, createStyles, createMuiTheme, ThemeProvider, ThemeOptions } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import { Formik, Form, useFormikContext } from "formik";
import AmountPane from "./AmountPane";
import { Money } from "../../common/money";
import PaymentMethodPane from "./PaymentMethodPane";
import { TransactionParams, TransactionPageProps, IPaymentMethodData } from "./types";

import "fontsource-roboto/latin-ext.css";


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
		},
		button: {
			marginRight: theme.spacing(1),
		},
		completed: {
			display: 'inline-block',
		},
		instructions: {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1),
		},
	}),
);

function getSteps() {
	return ['Amount', 'Complete'];
}








export type IInitialValues = Partial<TransactionParams>

interface IWizardContext<T> {
	values: T
}

export function useWizardContext<T>():IWizardContext<T> {
	const {values} =  useFormikContext<T>();
	return {values};
}




function TransactionWizard(props: TransactionPageProps): JSX.Element {


	const themeOptions:ThemeOptions = {};
	if (props.style && props.style.primary && typeof props.style.primary === 'string') {
		themeOptions.palette = {
			primary: {main: props.style.primary }
		};
	}

	const theme = createMuiTheme(themeOptions);


	return (
		<ThemeProvider theme={theme}>
			<Formik<IInitialValues> initialValues={{
				amount: props.transactionInit.data.amount,
				supporter: props.supporter,
				paymentMethod: null
			}} onSubmit={(values, formikBag) => {
				props.callbacks.onSuccess(values);
				formikBag.setSubmitting(false);
			}} enableReinitialize={true}>
				<InnerTransactionWizard {...props}/>
			</Formik>
		</ThemeProvider>
	);
}

TransactionWizard.defaultProps = {
	nonprofit: {
		id: 1,
		name: "Fake name"
	},
	transactionInit: {
		type: 'donation',
		data: {
			amount: Money.fromCents(0, 'usd'),
			amountOptions: [500, 1000, 2500, 4000, 10000, 20000].map((i) => Money.fromCents(i, 'usd'))
		}
	},
	supporter: {},
	callbacks: {
		onSuccess: () => { console.log('default success');}
	},
	paymentMethods: []
} as TransactionPageProps;


function InnerTransactionWizard(props:TransactionPageProps) {
	const formikContext = useFormikContext<IInitialValues>();
	const classes = useStyles();


	const [activeStep, setActiveStep] = React.useState(0);
	const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>({});
	const [disabled] = React.useState<{ [k: number]: boolean }>({});
	const steps = getSteps();

	const totalSteps = () => {
		return steps.length;
	};

	const completedSteps = () => {
		return Object.keys(completed).length;
	};

	const isLastStep = () => {
		return activeStep === totalSteps() - 1;
	};

	const allStepsCompleted = () => {
		return completedSteps() === totalSteps();
	};

	const handleNext = () => {
		const newActiveStep =
			isLastStep() && !allStepsCompleted()
				? // It's the last step, but not all steps have been completed,
				// find the first step that has been completed
				steps.findIndex((step, i) => !(i in completed))
				: activeStep + 1;
		setActiveStep(newActiveStep);
	};


	const handleStep = (step: number) => () => {
		setActiveStep(step);
	};



	const getStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (<AmountPane amountOptions={props.transactionInit.data.amountOptions} amount={formikContext.values.amount} finish={(amount:Money) => {
					formikContext.setFieldValue('amount', amount);
					handleNext();
				}}/>);
			case 1:
				return (<PaymentMethodPane amount={formikContext.values.amount}
					paymentMethodData={formikContext.values.paymentMethod}
					paymentMethods={props.paymentMethods}
					finish={(methodData:IPaymentMethodData) => {
						formikContext.setFieldValue('paymentMethod', methodData);
						formikContext.submitForm();
					}}/>);
			default:
				return 'Unknown step';
		}
	};


	return (<Form>
		<div className={classes.root}>
			<Stepper nonLinear activeStep={activeStep}>
				{steps.map((label, index) => (
					<Step key={label}>
						<StepButton onClick={handleStep(index)} completed={completed[index]} disabled={disabled[index]}>
							{label}
						</StepButton>
					</Step>
				))}
			</Stepper>
			<div>
				<div>
					{getStepContent(activeStep)}
				</div>
			</div>
		</div>
	</Form>);
}

export default TransactionWizard;