import React, { Component, Ref, FunctionComponent } from "react";
import { StripeElementBase } from "@stripe/stripe-js";

interface IStripeInputProps {
	component:FunctionComponent<any>
  inputRef:Ref<Partial<HTMLInputElement>>
  onBlur:(...args:any[]) => void
  onChange:(...args:any[]) => void
  onFocus:(...args:any[]) => void
	[other:string]:unknown
}

export function StripeInput(props:IStripeInputProps) {

  const {
    component: Component,
    inputRef,
    id,
    className,
    disabled,
    onBlur,
    onChange,
    onFocus,
    placeholder,
		value,
		...other
  } = props;


  const [mountNode, setMountNode] = React.useState<StripeElementBase>(null);

  React.useImperativeHandle(
    inputRef,
    () => ({
      focus: () => mountNode.focus(),
      blur: () => mountNode.blur(),
      clear: () => mountNode.clear(),
    }),
    [mountNode]
  );

  return (
    <Component
      onReady={ setMountNode }
      onBlur={(...args:any[]) => { 
        onBlur(...args) 
      }}
      onChange={ (...args:any[]) => {
        console.log(args)
        onChange(...args);
      } }
      onFocus={ (...args:any[]) => {
        onFocus(args);
      }}
      placeholder={ placeholder }
      value={ value }
      disabled={ disabled }
      id={ id }
			className={ className }
			{...other}
    />
  );
}