// License: LGPL-3.0-or-later
import * as React from 'react';
import { action } from '@storybook/addon-actions';
import AmountPane from '../components/payment_wizard/AmountPane';
import { Money } from '../common/money'

export default { title: 'AmountPane' };

export const withAmounts = () => <AmountPane currentAmount={null} 
  amountOptions={[500, 1000, 2500, 5000, 10000, 25000, 50000, 100000].map((i) => Money.fromCents(i, 'usd'))}
  setAmount={(i:Money) => action('setAmount')} setValid={(i) => i}
/>