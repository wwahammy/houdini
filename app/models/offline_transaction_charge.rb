# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class OfflineTransactionCharge < ApplicationRecord
	include Model::SubtransactionEntitiable
	include Model::CreatedTimeable

	setup_houid :offtrxchrg

	def to_builder(*expand)
		init_builder(*expand) do  |json|
			if expand.include? :payments 
				json.payments payments do |py|
					json.merge! py.to_builder
				end
			else
				json.payments payments&.pluck(:id)
			end
		end
	end

	def publish_created
		Houdini.event_publisher.announce(:offline_transaction_charge_created, 
			to_event('offline_transaction_charge.created', :nonprofit, :trx, :supporter, :payments).attributes!)
	end
end
