// License: LGPL-3.0-or-later
import type { HouID, HoudiniEvent, IDType} from '../../common';
import type Campaign from '.';
import type { CampaignGift } from '.';
import type { TrxAssignment } from '../Transaction';

export interface CampaignGiftPurchase extends TrxAssignment {
  campaign: IDType | Campaign;
  campaign_gifts: HouID[] | CampaignGift[];
  object: 'campaign_gift_purchase';
}


export type CampaignGiftPurchaseCreated = HoudiniEvent<'campaign_gift_purchase.created', CampaignGiftPurchase>;
export type CampaignGiftPurchaseUpdated = HoudiniEvent<'campaign_gift_purchase.updated', CampaignGiftPurchase>;
export type CampaignGiftPurchaseDeleted = HoudiniEvent<'campaign_gift_purchase.deleted', CampaignGiftPurchase>;