// License: LGPL-3.0-or-later
import type { Amount, HoudiniObject, IDType, HouID, PolymorphicID, HoudiniEvent } from "../../common";
import type Nonprofit from '../';
import type Supporter from "../Supporter";
import type { Payment } from "./Payment";

export interface Subtransaction extends HoudiniObject<HouID>, TrxDescendent {
	amount: Amount;
	amount_pending: Amount;
	amount_refunded: Amount;
	created_at: Date;
	fees: Amount;
	net_amount: Amount;
	type: 'subtransaction';
}

/**
 * Every descendent of a Transaction object will have the following three fields
 */
export interface TrxDescendent {
	/**
	 * The nonprofit of the transaction is assigned to.
	 */
	nonprofit: IDType | Nonprofit;
	/**
	 * The supporter of the transaction
	 */
	supporter: IDType | Supporter;
	/**
	 * The transaction itself
	 */
  transaction: HouID | Transaction;
}

/**
 * Every transaction assignment, including Donation, TicketPurchase, CampaignGiftPurchase
 * must have an amount and the type 'trx_assignment' set.
 */
export interface TrxAssignment extends HoudiniObject<HouID>, TrxDescendent {
	amount: Amount;
	type: 'trx_assignment';
}

export default interface Transaction extends HoudiniObject<HouID> {
  amount: Amount;
	amount_disputed: Amount;
	amount_refunded: Amount;
	created_at: Date;
	deleted: boolean;
	net_amount: Amount;
	nonprofit: IDType | Nonprofit;
	object: 'transaction';
	payments: IDType[] | Payment[];
	status: string;
//	status: "not-submitted"|"created" | "waiting-on-supporter" | "failed" | "completed";
	subtransactions: PolymorphicID[] | Subtransaction[];
	supporter: IDType | Supporter;
	transaction_assignments: PolymorphicID[] | TrxAssignment[];
}

export type TransactionCreated = HoudiniEvent<'transaction.created', Transaction>;
export type TransactionUpdated = HoudiniEvent<'transaction.updated', Transaction>;
export type TransactionRefunded = HoudiniEvent<'transaction.refunded', Transaction>;
export type TransactionDisputed = HoudiniEvent<'transaction.disputed', Transaction>;
export type TransactionDeleted = HoudiniEvent<'transaction.deleted', Transaction>;

export * from './Payment';
export * from './Donation';
export * from './OfflineTransaction';
export {default as OfflineTransaction} from './OfflineTransaction';
