import { Money, MoneyArray} from "../../common/money";
import { PaymentDescriptionProps } from "./PaymentMethodPane";

//JSON params for POST nonprofits/:id/transactions
export interface TransactionParams {
	amount:Money
	paymentMethod: IPaymentMethodData
	supporter:Supporter
}

export interface Supporter {
	id?:number
	email?: string
	name?: string
	address?: string
	city?: string
	stateCode?:string
	countryCode?:string
	postalCode?:string
}



export interface IPaymentMethodData {
	type:string;
	data:unknown;
}

interface Nonprofit {
	id: number
	name: string
}

export interface TransactionPageProps {
	nonprofit:Nonprofit
	style?: TransactionPageTheme
	transactionInit: TransactionInit
	supporter: Supporter
	callbacks: Callbacks,
	paymentMethods:Array<PaymentDescriptionProps>
}

interface Callbacks {
	onSuccess?:(values:any) => void
	onQuit?: () => void
}

interface TransactionPageTheme {
	primary: string
}


type TransactionInit = DonationInit

export interface DonationInit {
	type: 'donation',
	data?: {
		amount?: Money,
		amountOptions?:MoneyArray
		includeCustomAmount?:boolean
	}
}




