// License: LGPL-3.0-or-later

import * as React from "react";
import { useIntl, FormatNumberOptions, IntlShape, IntlProvider, createIntl} from "react-intl";
import { Money } from "../../common/money";

export declare type FormatMoneyOptions = Omit<FormatNumberOptions,'style'|'unit'|'unitDisplay'|'currency'>;

export declare type CustomIntlShape = IntlShape & {formatMoney:(amount:Money, opts?:FormatMoneyOptions) => string}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomIntlContext = React.createContext<CustomIntlShape>(null as any);

function rawFormatMoney(intl:IntlShape, amount:Money, opts?:FormatMoneyOptions) : string  {
	const formatter =  intl.formatters.getNumberFormat(intl.locale, {...opts,
		style: 'currency',
		currency: amount.currency.toUpperCase(),
	});

	const adjustedAmount = amount.amount / Math.pow(10, formatter.resolvedOptions().maximumFractionDigits);
	return formatter.format(adjustedAmount);
}

export function useCustomIntl() : CustomIntlShape {
	const context = React.useContext(CustomIntlContext);
	return context;
}

export function CustomIntlProvider(props:ConstructorParameters<typeof IntlProvider>[0]) : JSX.Element {
	return <IntlProvider {...props}>
		<InnerProvider>
			{props.children}
		</InnerProvider>
	</IntlProvider>;
}

// eslint-disable-next-line @typescript-eslint/ban-types
function InnerProvider({children}:React.PropsWithChildren<{}>) : JSX.Element {
	const intl = useIntl();
	const formatMoney = React.useCallback((amount:Money, opts?:FormatMoneyOptions) => {
		return rawFormatMoney(intl, amount, opts);
	}, [intl]);

	const customIntl = 	{ ...intl, formatMoney};
	return <CustomIntlContext.Provider value={customIntl}>
		{children}
	</CustomIntlContext.Provider>;
}


export function createCustomIntl(...props:Parameters<typeof createIntl>) : CustomIntlShape {

	const intl = createIntl(...props);
	const formatMoney = (amount:Money, opts?:FormatMoneyOptions) => rawFormatMoney(intl, amount, opts);

	return {...intl, formatMoney};
}