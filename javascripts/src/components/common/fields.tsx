// License: LGPL-3.0-or-later
import * as React from 'react';
import {observer} from "mobx-react";
import * as _ from 'lodash'
import {Field} from "../../../../types/mobx-react-form";
import LabeledFieldComponent from "./LabeledFieldComponent";
import {injectIntl, InjectedIntl} from 'react-intl';
import Autocomplete  = require('react-autocomplete');


export const BasicField = injectIntl(observer((props:{field:Field, intl?:InjectedIntl, wrapperClassName?:string}) =>{
    return <LabeledFieldComponent
        inputId={props.field.id} labelText={props.field.label} inError={props.field.hasError} error={props.field.error} className={props.wrapperClassName} >

        <input {...props.field.bind()} className="form-control"/>
    </LabeledFieldComponent>
}))

export const AutocompleteField = injectIntl(observer((props:{field:Field, intl?:InjectedIntl, wrapperClassName?:string, items: any[]}) =>{

  return <LabeledFieldComponent
    inputId={props.field.id} labelText={props.field.label} inError={props.field.hasError} error={props.field.error} className={props.wrapperClassName} >

    <Autocomplete items={props.items} getItemValue={(item) => item.name}
                  renderItem={(item, isHighlighted) => (
                    <div
                      className={`item ${isHighlighted ? 'item-highlighted' : ''}`}
                      key={item.name}
                    >{item.name}</div>)}
        value={props.field.value}
        inputProps={{className:"form-control"}}
        onSelect={(value) => props.field.set(value)}
        {...props.field.bind()}/>
  </LabeledFieldComponent>
}))