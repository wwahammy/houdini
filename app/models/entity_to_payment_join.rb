# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class EntityToPaymentJoin < ApplicationRecord
  include Model::Houidable
	
	setup_houid :etpj

  belongs_to :subtransaction_entity
  belongs_to :payment
end
