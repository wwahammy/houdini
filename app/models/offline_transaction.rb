# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class OfflineTransaction < ApplicationRecord
	include Model::Subtransactable
	include Model::CreatedTimeable

	setup_houid :offlinetrx

	def to_builder(*expand)
		init_builder(*expand) do |json|
			json.(self, :created)
			json.amount do 
        json.value_in_cents amount || 0
        json.currency nonprofit.currency
      end

			if expand.include? :payments 
				json.payments payments do |py|
					json.merge! py.to_builder.attributes!
				end
			else
				json.payments payments.pluck(:id)
			end
		end
	end


	def publish_created
		Houdini.event_publisher.announce(:offline_transaction_created, 
			to_event('offline_transaction.created', :nonprofit, :trx, :supporter, :payments).attributes!)
	end
end
