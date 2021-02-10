# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class OfflineTransactionCharge < ApplicationRecord
	include Model::SubtransactionEntitiable
	include Model::CreatedTimeable

	setup_houid :offtrxchrg

	has_one :subtransactable_entity
	has_many :payments, through: :subtransactable_entity

	def to_builder(*expand)
		init_builder(*expand) do  |json|
		 
		end
	end

	def publish_created

	end
end
