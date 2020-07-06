
// License: LGPL-3.0-or-later
import * as React from "react";
import { Button, TextField } from "@material-ui/core";
import {IPaymentMethodProps, IPaymentMethodData} from '../../PaymentMethodPane';
import {loadStripe, PaymentMethod as StripePaymentMethod} from '@stripe/stripe-js';
import {
	CardElement,
	Elements,
	useStripe,
	useElements,
	CardNumberElement,
} from '@stripe/react-stripe-js';
import { Formik, Form, Field } from "formik";
import { FormikStripeTextFieldNumber, FormikStripeTextFieldExpiry, FormikStripeTextFieldCvc } from "./commonTextFields";



interface IStripeCardDataProps extends Partial<IPaymentMethodData> {
	pmType: 'stripe',
	result?: {paymentMethod?: StripePaymentMethod}
}

const stripePromise = loadStripe("pk_test_7o2KOUlDEz5wFr91SSbfVMXE00kfO0dxlh");


function StripeCard(props:IPaymentMethodProps<IStripeCardDataProps>) : JSX.Element {

	return (
		<Elements stripe={stripePromise}>
			<InnerStripeCard {...props}/>
		</Elements>
	);
}

function InnerStripeCard(props:IPaymentMethodProps<IStripeCardDataProps>) {
	const stripe = useStripe();
	const elements = useElements();
	return (<Formik onSubmit={async (values, formikBag) => {
		const result = await stripe.createPaymentMethod({type:'card', card: elements.getElement(CardNumberElement)});
		props.setPaymentMethodData({pmType:'stripe', result});
		formikBag.setFieldError('cardNumber', 'Horribly invalid card');
		formikBag.setSubmitting(false);
	}} initialValues={{}}>
		<Form>
			<Field component={FormikStripeTextFieldNumber} name="cardNumber" label={"Card Number"} options={{iconStyle:'solid', showIcon: true}}/>
			<Field component={FormikStripeTextFieldExpiry} name="cardExpiry" label={"Card Expiration"}/>
			<Field component={FormikStripeTextFieldCvc} name="cardCvc" label={"Security Code"}/>
			<Button type={"submit"}>Next</Button>
		</Form>
	</Formik>);

}

export default StripeCard;