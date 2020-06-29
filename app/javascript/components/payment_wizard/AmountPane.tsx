
// License: LGPL-3.0-or-later
import * as React from "react"
import { Grid, Button } from "@material-ui/core";
import { TextField } from 'formik-material-ui';
import { Money, MoneyArray } from "../../common/money";
import { Field, useFormikContext, Formik, Form } from 'formik';


interface IAmountPaneProps {
  amountOptions: MoneyArray
  currentAmount: Money | null
  setAmount: (amount: Money) => void
  setValid: (valid: boolean) => void
}

/* pass in amount */
/*  if amount is one of the selected options, we highlight */
/*  if amount is not, we also set customAmount */
/* on submission
/*  if customAmount is set, we setAmount from parent to customAmouhnt */
/*  if not, we setAmount from amount */

function AmountPane(props: IAmountPaneProps) {

  return (
    <Formik onSubmit={(values, formikBag) => {
      if (values.amount instanceof Money)
        props.setAmount(values.amount)
      else
        props.setAmount(Money.fromCents(parseFloat(values.amount), 'usd'))
    }} initialValues={{
      amount: props.currentAmount,
      customAmount: props.amountOptions.includes(props.currentAmount) ? "" : (props.currentAmount || "")
    }}
      enableReinitialize={true}
    >
      {(formikProps) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container justify="center">
                {props.amountOptions.map((value:Money) => {
                  return <Grid item xs={4}>
                    <Button variant={"contained"} color="primary" onClick={() => {
                      formikProps.setFieldValue('amount', value); 
                      formikProps.setFieldValue('customAmount', "");
                      formikProps.submitForm()
                    }}>${value.amountInCents}</Button>
                  </Grid>
                })}
                <Grid item xs={8}>
                  <Grid container justify="center">
                    <Grid item xs={6}>
                      <Field component={TextField} name="customAmount"/>
                    </Grid>
                    <Grid item xs={6}>
                    <Button variant={"contained"} color="primary" onClick={() => {
                      formikProps.setFieldValue('amount', formikProps.values.customAmount); 
                      formikProps.submitForm()
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

export default AmountPane