// License: LGPL-3.0-or-later
import type { Amount, HoudiniObject, IDType, HouID, HoudiniEvent } from "../../common";
import type Nonprofit from '../';
import type Supporter from "../Supporter";
import type Transaction from './';


export interface Payment extends HoudiniObject<HouID> {
  amount: Amount;
	nonprofit: IDType | Nonprofit;
  object: 'payment';
  pending_amount: Amount;
	supporter: IDType | Supporter;
  transaction: HouID | Transaction;

}

export type PaymentCreated = HoudiniEvent<'payment.created', Payment>;
export type PaymentUpdated = HoudiniEvent<'payment.updated', Payment>;
export type PaymentDeleted = HoudiniEvent<'payment.deleted', Payment>;

