// License: LGPL-3.0-or-later
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import PaymentMethodPane from './PaymentMethodPane';
import StripeSepa from './payment_methods/stripe/StripeSepa';
import StripeCard from './payment_methods/stripe/StripeCard';
import { Money } from '../../common/money';



export default { title: 'PaymentPane' };

export function sepaOnlyPane() {
	return <PaymentMethodPane paymentMethods={[
		{name: 'sepa', title: 'SEPA', component: StripeSepa }
	]} amount={Money.fromCents(1000, 'usd')} finish={action('set-payment-method-data')}
	paymentMethodData={{}}/>;
}

export function stripeCardOnlyPane() {
	return <PaymentMethodPane paymentMethods={[
		{name: 'stripeCard', title: 'Credit Card', component: StripeCard },
	]} amount={Money.fromCents(1000, 'usd')} finish={action('set-payment-method-data')}
	paymentMethodData={{}}/>;
}

export function stripeBothCardPane() {
	return <PaymentMethodPane paymentMethods={[
		{name: 'stripeCard', title: 'Credit Card', component: StripeCard },
		{name: 'stripeSEPA', title: 'SEPA', component: StripeSepa },
	]} amount={Money.fromCents(1000, 'usd')} finish={action('set-payment-method-data')}
	paymentMethodData={{}}/>;
}
