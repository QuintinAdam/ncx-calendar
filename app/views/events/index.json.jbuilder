json.array! @events do |event|
  # next if event.marked_as_spam_by?(current_user)
  json.extract! event, :id, :title, :body, :location, :start
  json.end event.all_day ? event.start : event.end
  json.isAllDay event.all_day
  json.category event.all_day ? 'allday' : 'time'
  json.calendarId event.category
  json.isVisible true
  json.isReadOnly current_user ? current_user.id != event.user_id : true
  json.raw do
    json.host event.host
    json.user_id event.user_id
  end
  # json.goingDuration 0
  # json.comingDuration 0
  # json.dueDateClass ''
  # json.isPending false
  # json.isFocused false
  # json.isPrivate false
  # json.attendees ''
  # json.recurrenceRule ''
  # json.state 'free'
  # json.author do
  #   json.first_name event.author.first_name
  #   json.first_name event.author.first_name
  #   json.last_name event.author.last_name
  # end
end
