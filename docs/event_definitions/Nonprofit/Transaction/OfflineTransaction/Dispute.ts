// License: LGPL-3.0-or-later
import type { HoudiniEvent } from "../../../common";
import type { CommonOfflineTransactionEntity } from '.'

export interface Dispute extends CommonOfflineTransactionEntity {
	object: 'offline_transaction_dispute';
}

export type DisputeCreated = HoudiniEvent<'offline_transaction_dispute.created', Dispute>;
export type DisputeUpdated = HoudiniEvent<'offline_transaction_dispute.updated', Dispute>;
export type DisputeDeleted = HoudiniEvent<'offline_transaction_dispute.deleted', Dispute>;