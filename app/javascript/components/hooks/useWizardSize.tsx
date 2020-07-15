
// License: LGPL-3.0-or-later
import React, { useContext } from 'react';


interface WizardSizeState {
	size:string
	allSizes:{[size:string]: {width:string, height:string}}
}
interface WizardSizeProviderProps extends WizardSizeState {
	children:React.ReactNode
}



const WizardSizeContext = React.createContext<WizardSizeState>({size:"0px", allSizes:{}});





export function WizardSizeProvider(props:WizardSizeProviderProps): JSX.Element {
	const {children, ...contextValue} = props;
	return <WizardSizeContext.Provider value={contextValue}>
		{children}
	</WizardSizeContext.Provider>;
}

export default function useWidgetSize(): WizardSizeState {
	return useContext(WizardSizeContext);
}