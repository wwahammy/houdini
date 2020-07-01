// License: LGPL-3.0-or-later
import * as React from "react";
import { Grid, Button } from "@material-ui/core";
import  MoneyTextField from './MoneyTextField';
import { Money, MoneyArray } from "../../common/money";
import { Field, Formik, Form } from 'formik';
import { useCustomIntl } from "../intl";



interface IAmountPaneProps {
	amountOptions: MoneyArray
	currentAmount: Money | null
	setAmount: (amount: Money) => void
	setValid: (valid: boolean) => void
}

/* pass in amount */
/*  if amount is one of the selprops.ected options, we highlight */
/*  if amount is not, we also set customAmount */
/* on submission
/*  if customAmount is set, we setAmount from parent to customAmouhnt */
/*  if not, we setAmount from amount */

function AmountPane(props: IAmountPaneProps) : JSX.Element {
	const intl = useCustomIntl();
	return (
		<Formik onSubmit={(values, formikBag) => {
			if (values.amount instanceof Money)
				props.setAmount(values.amount);
			else
				props.setAmount(Money.fromCents(parseFloat(values.amount), 'usd'));
			formikBag.setSubmitting(false);
		}} initialValues={{
			amount: props.currentAmount,
			customAmount: props.amountOptions.includes(props.currentAmount) ? Money.fromCents(0, 'usd') : (props.currentAmount || Money.fromCents(0, 'usd'))
		}} enableReinitialize={true}
		>
			{(formikProps) => (
				<Form>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Grid container justify="center">
								{props.amountOptions.map((value: Money) => {
									return <Grid item xs={4} key={value.toJSON().amount}>
										<Button variant={value.equals(formikProps.values.amount) ? "outlined" : "contained"} color="primary" onClick={() => {
											formikProps.setFieldValue('amount', value);
											formikProps.setFieldValue('customAmount', Money.fromCents(0, 'usd'));
											formikProps.submitForm();
										}}>{intl.formatMoney(value)}</Button>
									</Grid>;
								})}
								<Grid item xs={8}>
									<Grid container justify="center">
										<Grid item xs={6}>
											<Field component={MoneyTextField} name="customAmount" />
										</Grid>
										<Grid item xs={6}>
											<Button variant={"contained"} color="primary" onClick={() => {
												formikProps.setFieldValue('amount', formikProps.values.customAmount);
												formikProps.submitForm();
											}}>Next</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Form>
			)}
		</Formik>
	);
}

export default AmountPane;