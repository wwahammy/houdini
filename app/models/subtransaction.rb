# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class Subtransaction < ApplicationRecord
  include Model::Houidable
  setup_houid :subtrx

  belongs_to :trx, class_name: 'Transaction', foreign_key: "transaction_id"
  has_one :supporter, through: :trx
  has_one :nonprofit, through: :trx
  
  has_many :subtransaction_entities
  has_many :payments, through: :subtransaction_entities

  delegated_type :subtransactable, types: %w[ OfflineTransaction ]
  
  scope :with_subtransactables, -> { includes(:subtransactable) }

  delegate :to_builder, :to_event, :publish_created, :publish_updated, :publish_deleted, to: :subtransactable
end
