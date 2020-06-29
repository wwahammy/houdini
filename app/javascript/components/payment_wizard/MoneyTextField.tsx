
// License: LGPL-3.0-or-later
import * as React from "react"

import MuiTextField from '@material-ui/core/TextField';
import { fieldToTextField, TextFieldProps } from 'formik-material-ui';
import { Money } from "../../common/money";


export interface IMoneyStringAdapter {
    inputAmount:Money,
    setOutputAmount: (amount:Money) => unknown
}

export interface IMoneyStringAdapterOutput {
    amount:string,
    handleChange: (i:string) => void
}

export function useAdaptBetweenMoneyAndString(inputAmount:Money,
	setOutputAmount: (amount:Money) => unknown): IMoneyStringAdapterOutput {
	const amount = inputAmount.amount == 0 ? "" : "$" + (inputAmount.amount / 100);
	const handleChange = React.useCallback((i:string) => {
		let output:Money = Money.fromCents(0, inputAmount.currency);
		if (i != "")
			output = Money.fromCents(parseFloat(i), inputAmount.currency);
		setOutputAmount(output);
	}, [setOutputAmount, inputAmount]);
	return {amount, handleChange};
}


function MoneyTextField({ children, ...props }: TextFieldProps) {
	const { amount, handleChange } = useAdaptBetweenMoneyAndString(props.field.value,
		(i: Money) => props.form.setFieldValue(props.field.name, i));

	return <MuiTextField {...fieldToTextField(props)} value={amount} onChange={(e: React.ChangeEvent<any>) => { handleChange(e.target.value as string) }}>
		{children}
	</MuiTextField>

}

export default MoneyTextField