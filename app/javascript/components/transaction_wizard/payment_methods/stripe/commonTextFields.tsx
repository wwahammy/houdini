import React from 'react';

import {
	IbanElement,
	ElementProps,
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
	CardElement
} from '@stripe/react-stripe-js';
import {StripeIbanElementOptions, StripeCardNumberElementOptions,
	StripeCardCvcElementOptions,
	StripeCardExpiryElementOptions,
	StripeCardElementOptions,
	StripeElementStyle} from '@stripe/stripe-js';
import {StripeInput} from './StripeInput';
import merge from 'lodash/merge';

import { TextField, InputLabelProps, TextFieldProps as MuiTextFieldProps, Theme } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import { FunctionComponent } from 'react';
import { fieldToTextField, TextFieldProps} from 'formik-material-ui';

import "fontsource-roboto";
interface IStripeTextFieldProps {
	InputLabelProps?:Partial<InputLabelProps>,
	InputProps?: any
	options?: unknown
	[other:string]:unknown
}

 interface IElementIncludedTextFieldProps<TElementProps extends ElementProps> extends IStripeTextFieldProps {
	stripeElement: FunctionComponent<TElementProps>
 }

function createDefaultStripeStyle(theme:Theme):{styles:StripeElementStyle}{
	const ret:StripeElementStyle = {
		base: {
			color: theme.palette.text.primary,
			fontFamily: theme.typography.fontFamily
		}
	};

	return {styles: ret};
}

function StripeTextField<TElementProps extends ElementProps>(props:IElementIncludedTextFieldProps<TElementProps>) {
	const theme = useTheme();
	// eslint-disable-next-line react/prop-types
	const { InputLabelProps, stripeElement, InputProps, options, ...other } = props;
	// set default options
	const workingOptions = merge(options ||  {}, createDefaultStripeStyle(theme));
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
					options:workingOptions,
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

	textfieldProps.onBlur = () => {props.form.handleBlur(props.field.name);};
	textfieldProps.onChange = () => {};
	const options = props.options;
	options.disabled = textfieldProps.disabled;

	return (<StripeIban {...textfieldProps} options={options}/>);
}

export function FormikStripeTextFieldCard(props:{options:StripeCardElementOptions}  & TextFieldProps) :JSX.Element {
	const textfieldProps =  fieldToTextField(props);

	textfieldProps.onBlur = () => {props.form.handleBlur(props.field.name)};
	textfieldProps.onChange = () => {};
	const options = props.options;
	options.disabled = textfieldProps.disabled;


	return (<StripeCard {...textfieldProps} options={options}/>);
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
} as IStripeTextFieldProps & {options:StripeIbanElementOptions};


function StripeCard(props:IStripeTextFieldProps & {options:StripeCardElementOptions}): JSX.Element {
	return (
		<StripeTextField
			stripeElement={CardElement}
			{...props}
		/>);
}



