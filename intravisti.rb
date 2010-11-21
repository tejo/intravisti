require 'sinatra'
require "haml"
require "json"
require './lib/flickr'

BG_IMAGES = {:home => 'home.jpg', :landscape => 'landscape.jpg', :macro1 => 'macro1.jpg', :macro2 => 'macro2.jpg' }
IMAGE_PATH = '/images/' 
TAGS = %w(bruggi landscape macro1 macro2).freeze


use Rack::Auth::Basic do |username, password|
  [username, password] == ['intra', 'visti']
end

configure do
  require 'dalli'
  CACHE = Dalli::Client.new()
  set :haml, :format => :html5
end

helpers do
  def flkrimg(photo)
    "http://farm#{photo['farm']}.static.flickr.com/#{photo['server']}/#{photo['id']}_#{photo['secret']}_m.jpg"
  end
end

#fake delayed images
get '/images-d/:image' do
  sleep 6
  content_type "image/jpg"
  IO.readlines('public/images/'+params[:image],'')
end

get '/' do
  @bg_images = BG_IMAGES.collect {|o| IMAGE_PATH+o[1] }.sort.to_json
  @bg_image = IMAGE_PATH+BG_IMAGES[:home]
  haml :index  
end

get '/:tags' do
  tag = params[:tags]
  @photos = get_photos(params[:tags])
  @bg_image = IMAGE_PATH+BG_IMAGES[tag.to_sym]
  haml :photos 
end

get '/photos/:tags' do
  content_type "application/json"
  get_photos(params[:tags])
end

def get_photos(tags)
  puts (tags)
  not_found(haml :not_found) if has_bad_tags?(tags)

  return fetch(tags, :expire_in => 60*60 ) do
    JSON.parse(Flickr.new().connection(tags))
  end
end

def has_bad_tags?(tags)
  tags.split(',').each do |tag|
    return true unless TAGS.include?(tag)
  end
  false
end

def fetch(name, options = {})
  value = CACHE.get(name)
  if block_given? && value.nil?
    CACHE.set(name, value = yield, options[:expire_in] || 86400)
  end
  value
end

