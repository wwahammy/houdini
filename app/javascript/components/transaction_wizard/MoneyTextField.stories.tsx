// License: LGPL-3.0-or-later
import * as React from 'react';

import { Money } from '../../common/money';
import { useState, useEffect } from 'react';
import { CustomIntlProvider } from '../intl';
import { Formik, Field, useFormikContext } from 'formik';
import MoneyTextField from './MoneyTextField';
import { action } from '@storybook/addon-actions';
import { string } from 'prop-types';
import { text } from '@storybook/addon-knobs';

function FormikInner(props: { onChange:(args:{value:Money})=> void}) {
	const context = useFormikContext<{value:Money}>();
	const {value} = context.values;
	const {onChange} = props;
	useEffect(() => {
		onChange({value});
	}, [value, onChange]);

	return <><div><span aria-label="amount">{value.amount}</span><span aria-label="currency">{value.currency}</span></div>
		<Field component={MoneyTextField} name="value" aria-label="field" /></>;
}

function FormikHandler(props: { value: Money, onChange:(args:{value:Money})=> void}) {

	const {value, ...innerFormikProps} = props;
	return (<Formik initialValues={{ value }} onSubmit={() => { console.log("submitted");}} enableReinitialize={true}>
		<FormikInner {...innerFormikProps} />
	</Formik>);
}

FormikHandler.defaultProps = {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	onChange: () => {},
	locale: 'en',
};
export default { title: 'MoneyTextField' };

export function usd100() {
	const usd100 = Money.fromCents(100, 'usd');
	return <FormikHandler onChange={action('on-change')} value={usd100}/>;
}

export function jpy100() {
	const jpy100 = Money.fromCents(100, 'jpy');
	return <FormikHandler onChange={action('on-change')} value={jpy100}/>;
}

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
