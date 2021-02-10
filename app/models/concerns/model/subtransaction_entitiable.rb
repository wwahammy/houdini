# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
module Model::SubtransactionEntitiable
	extend ActiveSupport::Concern

	included do
		include Model::Houidable
		include Model::Jbuilder
		include Model::Eventable

		add_builder_expansion :nonprofit, :supporter, :payments

		add_builder_expansion :trx, 
			json_attrib: :transaction

		has_one :subtransaction_entity, as: :entitiable, touch: true
		has_one :trx, through: :subtransaction_entity
		has_one :supporter, through: :subtransaction_entity
  	has_one :nonprofit, through: :subtransaction_entity
		
		has_one :subtransaction, through: :subtransaction_entity
		has_many :payments, through: :subtransaction_entity
		
	end
end
