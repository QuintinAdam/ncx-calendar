class AddUserToEvents < ActiveRecord::Migration[6.0]
  def change
    add_reference :events, :user, null: false, foreign_key: true
    add_column :events, :body, :text
    add_column :events, :host, :string
    add_column :users, :name, :string
  end
end
