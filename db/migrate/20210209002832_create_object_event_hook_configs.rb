class CreateObjectEventHookConfigs < ActiveRecord::Migration[6.1]
  def change
    create_table :object_event_hook_configs do |t|
      t.string :webhook_service
      t.jsonb :configuration
      t.text :object_event_types, array: true
      t.string :inbox

      t.references :nonprofit, index: true, foreign_key: true

      t.timestamps
    end
  end
end
