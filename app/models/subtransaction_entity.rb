# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class SubtransactionEntity < ApplicationRecord
  include Model::Houidable

	setup_houid :subtrxentity

  belongs_to :subtransaction
  has_one :trx, class_name: 'Transaction', foreign_key: "transaction_id", through: :subtransaction
  has_one :supporter, through: :subtransaction
  has_one :nonprofit, through: :subtransaction

  delegated_type :entitiable, types: ['OfflineTransactionCharge']

  has_many :entity_to_payment_joins
  has_many :payments, through: :entity_to_payment_joins

  scope :with_entities, -> { includes(:entitiable) }

  delegate :to_builder, 
    :to_event,
    :publish_created,
    :publish_updated,
    :publish_deleted, to: :entitiable
end
