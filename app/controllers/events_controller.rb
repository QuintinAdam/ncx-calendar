class EventsController < ApplicationController
  def index
    @events = Event.all
  end

  def show
  end

  def create
    event = JSON.parse(params["event"])
    # logger.info params["event"][:title]
    # {
      # "isAllDay"=>false,
      # "category"=>"time",
      # "title"=>"ddd",
      # "start"=>{"_date"=>"2019-11-26T11:00:00.000Z"},
      # "end"=>{"_date"=>"2019-11-26T11:30:00.000Z"},
      # "dueDateClass"=>"",
      # "color"=>"#ffffff",
      # "bgColor"=>"#9e5fff",
      # "dragBgColor"=>"#9e5fff",
      # "borderColor"=>"#9e5fff",
      # "location"=>"",
      # "raw"=>{"class"=>"public"},
      # "state"=>"Busy",
      # "calendarId"=>"1"
    # }
    logger.info event
    logger.info event["title"]
    logger.info event["start"]["_date"]
    Event.create(title: event["title"], location: event["location"], start: event["start"]["_date"], end: event["end"]["_date"])
  end
end
