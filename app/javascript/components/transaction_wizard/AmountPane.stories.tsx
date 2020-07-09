// License: LGPL-3.0-or-later
import React from 'react';
import { action } from '@storybook/addon-actions';
import AmountPane from './AmountPane';
import { Money } from '../../common/money';

export default { title: 'AmountPane' };

export const withAmounts:() => JSX.Element = () => <AmountPane amount={Money.fromCents( 1000, 'usd')}
	amountOptions={[500, 1000, 2500, 5000, 10000, 25000, 50000].map((i) => Money.fromCents(i, 'usd'))}
	finish={action('set-amount')}
/>;