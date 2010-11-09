require 'sinatra'
require './lib/flickr'

TAGS = %w(bruggi 3g0ph0t0).freeze

use Rack::Auth::Basic do |username, password|
  [username, password] == ['intra', 'visti']
end

configure do
  require 'dalli'
  CACHE = Dalli::Client.new()  
end


get '/' do
  erb :index  
end

get '/:tags' do
  get_photos(params[:tags]) 
end

get '/photos/:tags' do
  content_type "application/json"
  get_photos(params[:tags])
end

def get_photos(tags)
  puts (tags)
  error 404, "Photos not found" if has_bad_tags?(tags)
  
  
  
  #puts photos
  photos =  CACHE.get(tags)
  return photos unless photos.nil?
  photos = Flickr.new().connection(tags)
  CACHE.set(tags, photos, 120)
  return photos
end

def has_bad_tags?(tags)
  tags.split(',').each do |tag|
    return true unless TAGS.include?(tag)
  end
  false
end


