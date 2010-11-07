require 'sinatra'
require './lib/flickr'

TAGS = %w(bruggi 3g0ph0t0).freeze

use Rack::Auth::Basic do |username, password|
  [username, password] == ['intra', 'visti']
end


get '/' do
  erb :index  
end

get '/photos/:tags' do

  puts params[:tags]
  error 404, "Photos not found" if has_bad_tags?(params[:tags])
  
  fl = Flickr.new()
  photos = fl.connection(params[:tags])
  content_type "application/json"
  return photos
end

def has_bad_tags?(tags)
  tags.split('&')[0].split(',').each do |tag|
    return true unless TAGS.include?(tag)
  end
  false
end


