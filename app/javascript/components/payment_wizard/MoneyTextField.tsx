
// License: LGPL-3.0-or-later
import * as React from "react";

import MuiTextField from '@material-ui/core/TextField';
import { fieldToTextField, TextFieldProps } from 'formik-material-ui';
import { Money } from "../../common/money";


export interface ISerializeMoney {
    inputAmount:Money,
    setOutputAmount: (amount:Money) => unknown
}

export interface ISerializeMoneyOutput {
    serializedAmount:string,
    handleChange: (i:string) => void
}

/**
 * Hook for serializing a Money object to a string and back again. Particularly
 * useful for text fields.
 *
 * Example:
 * let money = new Money(100, 'usd')
 * let { serializedAmount, handleChange} = useSerializeMoney(money, (amount) => {money = amount})
 *
 * // serializedAmount gets $1.00 as a string. handleChange receives the new serializedvalue after a change
 * @param inputAmount a Money object
 * @param setOutputAmount used for passing up output of the Hook
 */
export function useSerializeMoney(inputAmount:Money,
	setOutputAmount: (amount:Money) => unknown): ISerializeMoneyOutput {
	const serializedAmount = new Intl.NumberFormat('en', {style: 'currency', 'currency': inputAmount.currency.toUpperCase()}).format(inputAmount.amount)
	const handleChange = React.useCallback((i:string) => {
		let output:Money = Money.fromCents(0, inputAmount.currency);
		if (i != "")
			output = Money.fromCents(parseFloat(i), inputAmount.currency);
		setOutputAmount(output);
	}, [setOutputAmount, inputAmount]);
	return {serializedAmount, handleChange};
}


function MoneyTextField({ children, ...props }: TextFieldProps) : JSX.Element {
	const { serializedAmount: amount, handleChange } = useSerializeMoney(props.field.value,
		(i: Money) => props.form.setFieldValue(props.field.name, i));

	return <MuiTextField {...fieldToTextField(props)} value={amount}
		onChange={(e: React.ChangeEvent<HTMLInputElement>) => { handleChange(e.target.value as string); }}>
		{children}
	</MuiTextField>;

}

export default MoneyTextField;