// // License: LGPL-3.0-or-later
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number, array, color, optionsKnob } from "@storybook/addon-knobs";
import { Money } from '../../common/money';
import DonationWizard from './DonationWizard';
import { TransactionPageProps, Supporter, DonationInit } from './types';
import { isInteger } from 'lodash';
import { PaymentDescriptionProps } from './PaymentMethodPane';
import StripeCard from './payment_methods/stripe/StripeCard';
import StripeSepa from './payment_methods/stripe/StripeSepa';
import RawSepa from './payment_methods/sepa/RawSepa';
import WidgetInitializer, { WidgetInitializerProps } from './WidgetInitializer';



export default { title: 'WidgetInitializer',
	decorators: [withKnobs]
};

export function donationWidgetInitializer() {
	const amountGroupId = 'Amount';
	const amountOptionsGroupId = 'Amount Options';
	const paymentMethodsGroupId = 'Payment Methods';

	const supporterGroupId = 'Supporter Options';
	const nonprofitGroupId = 'Nonprofit Options';
	const styleGroupId = "Style Options";

	const passAmount = boolean('Pass Amount?', true, amountGroupId);
	const passAmountOptions = boolean('Pass Amount Options?', true, amountOptionsGroupId);

	const passSupporter = boolean('Pass Supporter Info?', false);

	let supporter:Supporter = {
		email: text('Email', '', supporterGroupId ),
		name: text('Name', '', supporterGroupId ),
		address: text('Address', '', supporterGroupId ),
		city: text('City', '', supporterGroupId ),
		stateCode: text('State Code', '', supporterGroupId ),
		countryCode: text('Country Code', '', supporterGroupId ),
		postalCode: text('Postal Code', '', supporterGroupId),
	};
	if (passSupporter){
		supporter = {};
	}
	const amountOptions = array('Amount Options (in cents)', ['500', '1000', '2500', '5000', '10000', '25000', '50000'], "|", amountOptionsGroupId);

	const donationData: DonationInit["data"] = {
		amount: Money.fromCents(number('Amount', 0,{}, amountGroupId), 'usd'),
		amountOptions: amountOptions.map((i) => parseFloat(i)).filter((i) => isInteger(i)).map((i) => Money.fromCents(i, 'usd')),
		includeCustomAmount: boolean('Include Custom Amount?', true, amountGroupId)
	};
	if (!passAmount)
		delete donationData.amount;
	if (!passAmountOptions) {
		delete donationData.amountOptions;
	}

	const paymentMethodProps: PaymentDescriptionProps[] = [];
	if(boolean('Pay by Stripe Credit Card?', true, paymentMethodsGroupId))
	{
		paymentMethodProps.push({name: 'stripeCard', title: 'Credit Card', component:StripeCard});
	}

	if (boolean('Pay by Stripe SEPA?', true, paymentMethodsGroupId)) {
		paymentMethodProps.push({name: 'stripeSepa', title: 'SEPA', component:StripeSepa});
	}

	if (boolean('Pay by Raw SEPA?', true, paymentMethodsGroupId)) {
		paymentMethodProps.push({name: 'rawSepa', title: 'Raw SEPA', component:RawSepa});
	}

	const props:WidgetInitializerProps = {
		nonprofit: {
			id: number('Nonprofit ID', 1, {}, nonprofitGroupId),
			name: text("Nonprofit name", 'Fun name', nonprofitGroupId)
		},
		transactionInit:{
			type: 'donation',
			data: donationData
		},
		supporter,
		callbacks: {
			onSuccess: action('on-success')
		},
		paymentMethods: paymentMethodProps,
		style: {
			primary: color('Primary color', '#3f51b5', styleGroupId)
		},
		variant: optionsKnob('Variant', {"Modal": 'modal', "Embedded":"embedded"}, 'modal', {display:'inline-radio'}),
		widgetType: 'originalDonation',
		size: 'original'
	};


	return <WidgetInitializer {...props}/>;
}
