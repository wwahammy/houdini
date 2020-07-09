
// License: LGPL-3.0-or-later
import * as React from "react";
import { Button, TextField, Grid } from "@material-ui/core";
import {IPaymentMethodProps} from '../../PaymentMethodPane';
import {loadStripe, PaymentMethod as StripePaymentMethod} from '@stripe/stripe-js';
import {
	Elements,
	useStripe,
	useElements,
	IbanElement
} from '@stripe/react-stripe-js';
import { Formik, Form, Field } from "formik";
import { FormikStripeIban } from "./commonTextFields";
import { IPaymentMethodData } from "../../types";



interface IStripeCardData extends Partial<IPaymentMethodData> {
	type: 'stripe',
	result?: {paymentMethod?: StripePaymentMethod}
}
interface IStripeOptions {
	stripePromise:ReturnType<typeof loadStripe>
}




function StripeSepa(props:IPaymentMethodProps) : JSX.Element {
	const {options, ...innerProps} = props;
	return (
		<Elements stripe={options.stripePromise}>
			<InnerStripeSepa {...innerProps}/>
		</Elements>
	);
}

function InnerStripeSepa(props:Exclude<IPaymentMethodProps, 'options'>) {
	const stripe = useStripe();
	const elements = useElements();
	return (<Formik onSubmit={async (values, formikBag) => {
		if (!stripe || !elements) {
			return;
		}
		const result = await stripe.createPaymentMethod({type:'sepa_debit', sepa_debit:elements.getElement(IbanElement), billing_details: {name: 'Eric', email: 'eric@wwahammy.com'}});
		//props.setPaymentMethodData({type:'stripe', result});
		props.finish({type:'stripe',data: result});
		formikBag.setSubmitting(false);
	}} initialValues={{}} >
		<Form>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Field component={FormikStripeIban} options={{supportedCountries:['SEPA'], iconStyle: 'default'}} name="stripeIban"/>
				</Grid>
				<Grid item xs={12}>
					<Button type={"submit"} variant={"contained"} color="primary" >Next</Button>
				</Grid>
			</Grid>
		</Form>
	</Formik>);

}

export default StripeSepa;