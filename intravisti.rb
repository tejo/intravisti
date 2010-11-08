require 'sinatra'
require './lib/flickr'

TAGS = %w(bruggi 3g0ph0t0).freeze

use Rack::Auth::Basic do |username, password|
  [username, password] == ['intra', 'visti']
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
  
  fl = Flickr.new()
  photos = fl.connection(tags)
  puts photos
  return photos
end

def has_bad_tags?(tags)
  tags.split('&')[0].split(',').each do |tag|
    return true unless TAGS.include?(tag)
  end
  false
end


