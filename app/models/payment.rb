# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
# A payment represents the event where a nonprofit receives money from a supporter
# If connected to a charge, this represents money potentially debited to the nonprofit's account
# If connected to an offsite_payment, this is money the nonprofit is recording for convenience.

class Payment < ApplicationRecord
  include Model::Jbuilder
  include Model::Eventable

  # :towards,
  # :gross_amount,
  # :refund_total,
  # :fee_total,
  # :kind,
  # :date

  add_builder_expansion :nonprofit, :supporter, :subtransaction_entity
  add_builder_expansion :trx, 
    json_attrib: :transaction

  belongs_to :supporter
  belongs_to :nonprofit
  has_one :charge
  has_one :offsite_payment
  has_one :refund
  has_one :dispute
  belongs_to :donation
  has_many :tickets
  has_one :campaign, through: :donation
  has_many :events, through: :tickets
  has_many :payment_payouts
  has_many :charges

  has_one :entity_to_payment_join
  has_one :subtransaction_entity, through: :entity_to_payment_join

  has_one :subtransaction, through: :subtransaction_entity
  has_one :trx, through: :subtransaction_entity
  


  def to_builder(*expand)
    init_builder(*expand) do |json|
    end
  end

  def publish_created
  end
end
