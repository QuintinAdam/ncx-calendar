class CreateEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :events do |t|
      t.string :title, null: false
      t.string :location
      t.datetime :start
      t.datetime :end
      t.integer :category, default: 0, null: false

      t.timestamps
    end
  end
end
