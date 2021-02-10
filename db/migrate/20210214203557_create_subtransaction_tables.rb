# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
class CreateSubtransactionTables < ActiveRecord::Migration[6.1]
  def change
    create_table :subtransactions, id: :string do |t|
      t.references :transaction, foreign_key: true, type: :string, null: false
      t.references :subtransactable, polymorphic: true, type: :string, null: false, index: {unique: true}
      t.timestamps
    end

    create_table "offline_transactions", id: :string do |t|
      t.integer "amount", null: false
      t.datetime "created", comment: 'the moment that the subtransaction was created. Could be earlier than created_at if the transaction was in the past.'
      t.timestamps
    end

    create_table :subtransaction_entities, id: :string do |t|
      t.references :subtransaction, type: :string, foreign_key: true
      t.references :entitiable, polymorphic: true, type: :string
      t.timestamps
    end

    create_table :offline_transaction_charges, id: :string do |t|
      t.integer :amount, null: false
      t.datetime "created", comment: 'the moment that the subtransaction_entity was created. Could be earlier than created_at if the transaction was in the past.'
      t.timestamps
    end

    create_table :entity_to_payment_joins do |t|
      t.references :subtransaction_entity, type: :string, foreign_key: true
      t.references :payment, foreign_key: true
      t.timestamps
    end
  end
end
