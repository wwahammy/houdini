import React from 'react';

import {
	IbanElement,
	ElementProps,
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
	CardNumberElementProps
} from '@stripe/react-stripe-js';
import {StripeIbanElementOptions, StripeCardNumberElementOptions,
	StripeCardCvcElementOptions,
	StripeCardExpiryElementOptions,
	StripeIbanElementChangeEvent,
	StripeElementChangeEvent} from '@stripe/stripe-js';
import {StripeInput} from './StripeInput';

import { TextField, InputLabelProps, TextFieldProps as MuiTextFieldProps } from "@material-ui/core";
import { FunctionComponent } from 'react';
import { fieldToTextField, TextFieldProps} from 'formik-material-ui';
import { useCallback } from '@storybook/addons';
import { format } from 'sinon';

interface IStripeTextFieldProps {
	InputLabelProps?:Partial<InputLabelProps>,
	InputProps?: any
	options?: unknown
	[other:string]:unknown
}

 interface IElementIncludedTextFieldProps<TElementProps extends ElementProps> extends IStripeTextFieldProps {
	stripeElement: FunctionComponent<TElementProps>
 }

function StripeTextField<TOptions extends Record<string, unknown>,
	TElementProps extends ElementProps>(props:IElementIncludedTextFieldProps<TElementProps>) {
	// eslint-disable-next-line react/prop-types
	const { InputLabelProps, stripeElement, InputProps, options, ...other } = props;

	return (
		<TextField
			fullWidth
			InputLabelProps={{
				...InputLabelProps,
				shrink: true
			}}
			InputProps={{
				...InputProps,
				inputProps: {
					component: stripeElement,
					options:options,
				},
				inputComponent: StripeInput
			}}
			{...other}
		/>
	);
}

export function FormikStripeTextFieldNumber(props:{options:StripeCardNumberElementOptions}  & TextFieldProps) :JSX.Element {
	const textfieldProps = fieldToTextField(props);
	const options = {...props.options, disabled: textfieldProps.disabled};
	const {field, form} = props;
	const onBlur = () => {
		form.handleBlur(field.name);
	};
	return (<StripeTextFieldNumber {...textfieldProps} onBlur={onBlur} options={options}/>);
}

function StripeTextFieldNumber(props:{options:StripeCardNumberElementOptions}  & MuiTextFieldProps) : JSX.Element {

	return (
		<StripeTextField
			stripeElement={CardNumberElement}
			{...props}
		/>
	);
}


export function FormikStripeTextFieldExpiry(props:{options:StripeCardExpiryElementOptions}  & TextFieldProps) :JSX.Element {
	const textfieldProps = fieldToTextField(props);
	const {field, form} = props;
	const onBlur = () => {
		form.handleBlur(field.name);
	};
	return (<StripeTextFieldExpiry {...textfieldProps} onBlur={onBlur} options={props.options}/>);
}

function StripeTextFieldExpiry(props:MuiTextFieldProps & {options:StripeCardExpiryElementOptions}) : JSX.Element {
	return (
		<StripeTextField
			stripeElement={CardExpiryElement}
			{...props}
		/>
	);
}

export function FormikStripeTextFieldCvc(props:{options:	StripeCardCvcElementOptions}  & TextFieldProps) :JSX.Element {
	const textfieldProps = fieldToTextField(props);
	const {field, form} = props;
	const onBlur = () => {
		form.handleBlur(field.name);
	};
	return (<StripeTextFieldCvc {...textfieldProps} onBlur={onBlur} options={props.options}/>);
}

function StripeTextFieldCvc(props:{options:	StripeCardCvcElementOptions}  & MuiTextFieldProps) : JSX.Element {
	return (
		<StripeTextField
			stripeElement={CardCvcElement}
			{...props}
		/>
	);
}


export function FormikStripeIban(props:{options:StripeIbanElementOptions}  & TextFieldProps) :JSX.Element {
	const textfieldProps =  fieldToTextField(props);

	textfieldProps.onBlur = () => {props.form.handleBlur(props.field.name)};
	textfieldProps.onChange = () => {}
	const options = props.options
	options.disabled = textfieldProps.disabled
	

	return (<StripeIban {...textfieldProps} options={options}/>);
}


function StripeIban(props:IStripeTextFieldProps & {options:StripeIbanElementOptions}) : JSX.Element {
	return (
		<StripeTextField
			stripeElement={IbanElement}
			{...props}
		/>
	);
}

StripeIban.defaultProps = {
	InputLabelProps: {},
	InputProps: {},
};


function useStripeCallbacksToFormik(props: TextFieldProps) {
	const textfieldProps = fieldToTextField(props);
	const oldOnBlur = textfieldProps.onBlur;
	const oldOnChange = textfieldProps.onChange;
	const {form, field} = props;
	const {name} = field;
	const onBlur = useCallback(() => {
		form.handleBlur(name);
	}, [oldOnBlur, form, name]);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	const onChange = useCallback((e:StripeElementChangeEvent) => {}, [oldOnChange ]);

	return {onBlur, onChange, ...textfieldProps};
}

