// License: LGPL-3.0-or-later
import type { IDType, HouID, HoudiniEvent, HoudiniObject, Amount } from "../../../common";
import type Transaction from '..'
import type { Subtransaction, Payment } from "..";
import type { Charge, Refund, Dispute } from '.';
import type Nonprofit from "../..";
import type Supporter from "../../Supporter";

export interface CommonOfflineTransactionEntity extends HoudiniObject<HouID> {
	amount: Amount;
	amount_pending: Amount;
	created_at: Date;
	deleted: boolean;
	fees: Amount;
	net_amount: Amount;
	nonprofit: IDType | Nonprofit;
	offline_transaction: HouID | OfflineTransaction
	payments: IDType | Payment;
	transaction: Transaction;
	status: string
	supporter: IDType | Supporter
}

export default interface OfflineTransaction extends Subtransaction {
	charges: HouID[] | Charge[]
	deleted: boolean;
	object: 'offline_transaction';
	payment_id?: string | null;
	payment_type: 'check' | 'cash';
	payments: IDType[] | Payment[];
	refunds: HouID[] | Refund[];
	disputes: HouID[] | Dispute[];
}

export type OfflineTransactionCreated = HoudiniEvent<'offline_transaction.created', OfflineTransaction>;
export type OfflineTransactionUpdated = HoudiniEvent<'offline_transaction.updated', OfflineTransaction>;
export type OfflineTransactionRefunded = HoudiniEvent<'offline_transaction.refunded', OfflineTransaction>;
export type OfflineTransactionDisputed = HoudiniEvent<'offline_transaction.disputed', OfflineTransaction>;
export type OfflineTransactionDeleted = HoudiniEvent<'offline_transaction.deleted', OfflineTransaction>;

export * from './Charge';
export * from './Dispute';
export * from './Refund';