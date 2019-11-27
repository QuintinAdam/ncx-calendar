class AddsAllDayToEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :events, :all_day, :boolean, null: false, default: false
  end
end
