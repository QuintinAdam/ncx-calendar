class EventsController < ApplicationController
  # before_action authenticate_user!, only: [:new, :create,:edit,:update]
  def index
    @events = Event.all
  end

  def show
  end

  def create
    if params[:user_id].present?
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
      # logger.info event["title"]
      # logger.info event["start"]["_date"]
      user = User.find(params[:user_id])
      Event.create(title: event["title"], location: event["location"], start: event["start"]["_date"], end: event["end"]["_date"], all_day: event["isAllDay"], category: event["calendarId"], host: user.name, user_id: user.id)
    end
    head :no_content
  end

  def update
    @event = Event.find(params[:id])
    if params[:user_id].present? && @event.user_id == params[:user_id].to_i
      event = JSON.parse(params["event"])
      logger.info event
      # @event.update(title: event["title"], location: event["location"], start: event["start"]["_date"], end: event["end"]["_date"], all_day: event["isAllDay"], category: event["calendarId"])
      @event.title = event["title"] if event["title"].present?
      @event.location = event["location"] if event["location"].present?
      @event.all_day = event["isAllDay"] if event["isAllDay"].present?
      @event.category = event["calendarId"] if event["calendarId"].present?
      @event.start = event["start"]["_date"] if event["start"].present? && event["start"]["_date"].present?
      @event.end = event["end"]["_date"] if event["end"].present? && event["end"]["_date"].present?
      @event.save
    else
      logger.info 'failed'
      logger.info @event.user_id
      logger.info params[:user_id].to_i
    end
    head :no_content
  end

  def destroy
    @event = Event.find(params[:id])
    if params[:user_id].present? && @event.user_id == params[:user_id].to_i
      @event.destroy
    end
    head :no_content
  end
end
