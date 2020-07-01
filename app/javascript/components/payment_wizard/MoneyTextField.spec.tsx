/* eslint-disable jest/no-disabled-tests */

// License: LGPL-3.0-or-later

import React from 'react';

import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MoneyTextField from './MoneyTextField';
import { Field, Formik } from 'formik';
import { Money } from '../../common/money';
import { useState } from 'react';
import { CustomIntlProvider } from '../intl';

function FormikHandler(props:{input:Money}) {
	const [money, setMoney] = useState(props.input);
	return <CustomIntlProvider locale="en">
		<div><span aria-label="amount">{money.amount}</span><span aria-label="currency">{money.currency}</span></div>
		<Formik initialValues={{value: money }} onSubmit={(submitProps) => setMoney(submitProps.value)}>
			<Field component={MoneyTextField} name="value" aria-label="field"/>
		</Formik>
	</CustomIntlProvider>;
}

describe('MoneyTextField', () => {
	it('displays the $8.00 when Money of {800, usd} is passed in', async () => {
		expect.hasAssertions();
		const result = render(<FormikHandler input={Money.fromCents({amount:800, currency:'usd'})}/>);
		const field = result.container.querySelector("input[name=value]");
		expect(field).toHaveValue("$8.00");
		const amount = await result.findByLabelText('amount');
		const currency = await result.findByLabelText('currency');

		expect(amount).toHaveTextContent("800");
		expect(currency).toHaveTextContent("usd");
	});

	it.skip('displays the 8.00 € when Money of {800, eur} is passed in', async () => {
		expect.hasAssertions();
		const result = render(<FormikHandler input={Money.fromCents({amount:800, currency:'usd'})}/>);
		const field = result.container.querySelector("input[name=value]");
		expect(field).toHaveValue("8€");
		const amount = await result.findByLabelText('amount');
		const currency = await result.findByLabelText('currency');

		expect(amount).toHaveTextContent("800");
		expect(currency).toHaveTextContent("eur");
	});

	it.skip('displays the 800 when Money of {800, jpy} is passed in', async () => {
		expect.hasAssertions();
		const result = render(<FormikHandler input={Money.fromCents({amount:800, currency:'jpy'})}/>);
		const field = result.container.querySelector("input[name=value]");
		expect(field).toHaveValue("800¥");
		const amount = await result.findByLabelText('amount');
		const currency = await result.findByLabelText('currency');

		expect(amount).toHaveTextContent("800");
		expect(currency).toHaveTextContent("jpy");
	});
});


