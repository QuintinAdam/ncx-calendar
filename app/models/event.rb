class Event < ApplicationRecord
  enum category: {general: 0, official: 10, workshop: 15, fitness: 20, meetup: 25, birthday: 30, party: 35}

  validates :title, :start, presence: true
end
