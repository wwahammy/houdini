
// License: LGPL-3.0-or-later
import * as React from "react";
import { Button, Grid } from "@material-ui/core";
import {IPaymentMethodProps} from '../../PaymentMethodPane';
import {
	Elements,
	useStripe,
	useElements,
	CardElement,
} from '@stripe/react-stripe-js';
import { Formik, Form, Field } from "formik";
import { FormikStripeTextFieldCard } from "./commonTextFields";







function StripeCard(props:IPaymentMethodProps) : JSX.Element {
	const {options, ...innerProps} = props;
	return (
		<Elements stripe={options.stripePromise}>
			<InnerStripeCard {...innerProps}/>
		</Elements>
	);
}
function InnerStripeCard(props:Exclude<IPaymentMethodProps, 'options'>) {
	const stripe = useStripe();
	const elements = useElements();
	return (<Formik onSubmit={async (values, formikBag) => {
		if (!stripe || !elements) {
			return;
		}
		const result = await stripe.createPaymentMethod({type:'card', card: elements.getElement(CardElement)});
		props.finish({type:'stripe', data: result});

		formikBag.setSubmitting(false);
	}} initialValues={{}}>
		<Form>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Field component={FormikStripeTextFieldCard} name="card" label={"Credit Card"} options={{iconStyle:'solid', showIcon: true, hidePostalCode:true}}/>
				</Grid>
				<Grid item xs={12}>
					<Button type={"submit"} variant={"contained"} color="primary" >Next</Button>
				</Grid>
			</Grid>
		</Form>
	</Formik>);

}

export default StripeCard;