# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class Transaction < ApplicationRecord
	include Model::Houidable
	include Model::Jbuilder
  include Model::Eventable
	include Model::CreatedTimeable
	
	setup_houid :trx
	add_builder_expansion :nonprofit, :supporter
	
	belongs_to :supporter
	has_one :nonprofit, through: :supporter

	has_many :transaction_assignments, inverse_of: 'trx'

	has_many :donations, through: :transaction_assignments, source: :assignable, source_type: 'ModernDonation', inverse_of: 'trx'
	has_many :ticket_purchases, through: :transaction_assignments, source: :assignable, source_type: 'TicketPurchase', inverse_of: 'trx'
	has_many :campaign_gift_purchases, through: :transaction_assignments, source: :assignable, source_type: 'CampaignGiftPurchase', inverse_of: 'trx'

	
	has_many :subtransactions
	has_many :payments, through: :subtransactions

	validates :supporter, presence: true


	def to_builder(*expand)
		init_builder(*expand) do |json|
			json.amount do 
        json.value_in_cents amount || 0
        json.currency nonprofit.currency
      end
		end
	end

	def publish_created
		Houdini.event_publisher.announce(:transaction_created, 
			to_event('transaction.created', :nonprofit, :supporter).attributes!)
	end

	def publish_updated
		Houdini.event_publisher.announce(:transaction_updated,
			to_event('transaction.updated', :nonprofit, :supporter).attributes!)
	end

	def publish_refunded
		Houdini.event_publisher.announce(:transaction_refunded,
			to_event('transaction.refunded', :nonprofit, :supporter).attributes!)
	end

	def publish_disputed
		Houdini.event_publisher.announce(:transaction_disputed,
			to_event('transaction.refunded', :nonprofit, :supporter).attributes!)
	end

	def publish_deleted
		Houdini.event_publisher.announce(:transaction_deleted,
			to_event('transaction.deleted', :nonprofit, :supporter).attributes!)
	end

	private 
	def set_created_if_needed
		write_attribute(:created, Time.now) unless read_attribute(:created)
	end
end

ActiveSupport.run_load_hooks(:houdini_transaction, Transaction)
