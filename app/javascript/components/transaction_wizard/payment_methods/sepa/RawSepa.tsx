// License: LGPL-3.0-or-later
import * as React from "react";
import { Button,  Grid } from "@material-ui/core";
import {IPaymentMethodProps} from '../../PaymentMethodPane';
import { Formik, Form, Field } from "formik";
import {TextField} from 'formik-material-ui';

interface SepaValues {
	sepaNumber:string
}

function RawSepa(props:Exclude<IPaymentMethodProps, 'options'>) {
	return (<Formik onSubmit={async (values, formikBag) => {

		props.finish({type:'rawSepa', data: values});

		formikBag.setSubmitting(false);
	}} initialValues={{sepaNumber: ""}}>
		<Form>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Field component={TextField} name="sepaNumber" label={"SEPA Number"} />
				</Grid>
				<Grid item xs={12}>
					<Button type={"submit"} variant={"contained"} color="primary">Next</Button>
				</Grid>
			</Grid>
		</Form>
	</Formik>);

}

export default RawSepa;