json.array! @events do |event|
  # next if event.marked_as_spam_by?(current_user)
  json.extract! event, :id, :title, :location, :start, :end
  json.isAllDay false
  # json.goingDuration 0
  # json.comingDuration 0
  json.isVisible true
  json.category 'time'
  json.dueDateClass ''
  json.isPending false
  json.isFocused false
  json.isReadOnly true
  json.isPrivate false
  json.attendees ''
  json.recurrenceRule ''
  json.state ''
  # json.author do
  #   json.first_name event.author.first_name
  #   json.first_name event.author.first_name
  #   json.last_name event.author.last_name
  # end
end
