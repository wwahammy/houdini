// License: LGPL-3.0-or-later
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { Money } from '../../common/money';
import { useState } from 'react';
import { CustomIntlProvider } from '../intl';
import { Formik, Field } from 'formik';
import MoneyTextField from './MoneyTextField';

function FormikHandler(props: { input: Money }) {
	const [money, setMoney] = useState(props.input);
	return <CustomIntlProvider locale="en">
		<div><span aria-label="amount">{money.amount}</span><span aria-label="currency">{money.currency}</span></div>
		<Formik initialValues={{ value: money }} onSubmit={(submitProps) => setMoney(submitProps.value)}>
			<Field component={MoneyTextField} name="value" aria-label="field" />
		</Formik>
	</CustomIntlProvider>;
}

export default { title: 'MoneyTextField' };



// export function sepaOnlyPane() {
// 	return <FormikHandler paymentMethods={[
// 		{name: 'sepa', title: 'SEPA', component: StripeSepa }
// 	]} amount={Money.fromCents(1000, 'usd')} finish={action('set-payment-method-data')}
// 	paymentMethodData={{}}/>;
// }

// export function stripeCardOnlyPane() {
// 	return <PaymentMethodPane paymentMethods={[
// 		{name: 'stripeCard', title: 'Credit Card', component: StripeCard },
// 	]} amount={Money.fromCents(1000, 'usd')} finish={action('set-payment-method-data')}
// 	paymentMethodData={{}}/>;
// }

// export function stripeBothCardPane() {
// 	return <PaymentMethodPane paymentMethods={[
// 		{name: 'stripeCard', title: 'Credit Card', component: StripeCard },
// 		{name: 'stripeSEPA', title: 'SEPA', component: StripeSepa },
// 	]} amount={Money.fromCents(1000, 'usd')} finish={action('set-payment-method-data')}
// 	paymentMethodData={{}}/>;
// }
