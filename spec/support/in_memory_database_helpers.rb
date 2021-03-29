# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/master/LICENSE
module InMemoryDatabaseHelpers
  extend ActiveSupport::Concern

  class_methods do
    def switch_to_SQLite(&block)
      before(:all) { switch_to_in_memory_database(&block) }
      after(:all)  { switch_back_to_test_database }
    end
  end

  private

  def switch_to_in_memory_database(&block)
    raise 'No migration given' unless block_given?

    ActiveRecord::Migration.verbose = false
    ApplicationRecord.establish_connection(adapter: 'sqlite3', database: ':memory:')
    ActiveRecord::Schema.define(version: 1, &block)
  end

  def switch_back_to_test_database
    ApplicationRecord.establish_connection(ApplicationRecord.configurations.configs_for(env_name: 'test').first)
  end
end
