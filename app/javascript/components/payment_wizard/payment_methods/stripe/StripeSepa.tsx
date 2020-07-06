
// License: LGPL-3.0-or-later
import * as React from "react";
import { Button, TextField } from "@material-ui/core";
import {IPaymentMethodProps, IPaymentMethodData} from '../../PaymentMethodPane';
import {loadStripe, PaymentMethod as StripePaymentMethod} from '@stripe/stripe-js';
import {
	Elements,
	useStripe,
	useElements,
	IbanElement
} from '@stripe/react-stripe-js';
import { Formik, Form, Field } from "formik";
import { FormikStripeIban } from "./commonTextFields";



interface IStripeCardDataProps extends Partial<IPaymentMethodData> {
	pmType: 'stripe',
	result?: {paymentMethod?: StripePaymentMethod}
}

const stripePromise = loadStripe("pk_test_7o2KOUlDEz5wFr91SSbfVMXE00kfO0dxlh");


function StripeSepa(props:IPaymentMethodProps<IStripeCardDataProps>) : JSX.Element {

	return (
		<Elements stripe={stripePromise}>
			<InnerStripeSepa {...props}/>
		</Elements>
	);
}

function InnerStripeSepa(props:IPaymentMethodProps<IStripeCardDataProps>) {
	const stripe = useStripe();
	const elements = useElements();
	return (<Formik onSubmit={async (values, formikBag) => {
		const result = await stripe.createPaymentMethod({type:'sepa_debit', sepa_debit:elements.getElement(IbanElement), billing_details: {name: 'Eric', email: 'eric@wwahammy.com'}});
		props.setPaymentMethodData({pmType:'stripe', result});
		formikBag.setSubmitting(false);
	}} initialValues={{}}>
		<Form>
			<Field component={FormikStripeIban} options={{supportedCountries:['SEPA'], iconStyle: 'default'}} name="stripeIban"/>
			<Button type={"submit"}>Next</Button>
		</Form>
	</Formik>);

}

export default StripeSepa;