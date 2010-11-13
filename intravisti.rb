require 'sinatra'
require "haml"
require "json"
require './lib/flickr'

TAGS = %w(bruggi 3g0ph0t0 landscape).freeze

use Rack::Auth::Basic do |username, password|
  [username, password] == ['intra', 'visti']
end

configure do
  require 'dalli'
  CACHE = Dalli::Client.new()
  set :haml, :format => :html5  
end

#fake delayed image
get '/images-d/:image' do
  sleep 3
  content_type "image/jpg"
  IO.readlines('public/images/'+params[:image],'')
end


get '/test/:tags' do
  @tags = params[:tags]
  erb :index 
end



get '/' do
  haml :index  
end

get '/:tags' do
  get_photos(params[:tags])
  haml :photos 
end

get '/photos/:tags' do
  content_type "application/json"
  get_photos(params[:tags])
end

def get_photos(tags)
  puts (tags)
  not_found(haml :not_found) if has_bad_tags?(tags)

  return fetch(tags, :expire_in => 60 ) do
    Flickr.new().connection(tags)
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

