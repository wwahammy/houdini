class AddColumnDefaultToRdActive < ActiveRecord::Migration
  def change
    change_column_null :recurring_donations, :active, false, false
  end
end
