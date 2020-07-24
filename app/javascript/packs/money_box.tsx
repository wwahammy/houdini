// License: LGPL-3.0-or-later
// require a root component here. This will be treated as the root of a webpack package

import React from "react";
import MoneyTextField from "../components/transaction_wizard/MoneyTextField";


export function F(props:any={})
{

	return <MoneyTextField {...props}/>;
}