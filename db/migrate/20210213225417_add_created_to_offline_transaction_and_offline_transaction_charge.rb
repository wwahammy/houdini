# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class AddCreatedToOfflineTransactionAndOfflineTransactionCharge < ActiveRecord::Migration[6.1]
  def change

    [:transactions].each do |table|

      add_column table, :created, :datetime, comment: 'the moment that the offline_transaction was created. Could be earlier than created_at if the transaction was in the past.'
    end
    
  end
end
