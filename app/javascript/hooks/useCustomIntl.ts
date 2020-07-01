// License: LGPL-3.0-or-later

import { useIntl, FormatNumberOptions, IntlShape, } from "react-intl";
import { Money } from "../common/money";

export declare type FormatMoneyOptions = Omit<FormatNumberOptions,'style'|'unit'|'unitDisplay'>;

function formatMoneyInner(intl:IntlShape, amount:Money, opts?:FormatMoneyOptions):string {
	const formatter =  intl.formatters.getNumberFormat(intl.locale, {...opts,
		currency: amount.currency.toUpperCase(),
	});

	const adjustedAmount = amount.amount / Math.pow(10, formatter.resolvedOptions().maximumSignificantDigits);
	return formatter.format(adjustedAmount);

}

export default function useCustomIntl() {
	const intl = useIntl();
	
}