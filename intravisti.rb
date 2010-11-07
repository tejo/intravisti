require 'sinatra'
require './lib/flickr'


use Rack::Auth::Basic do |username, password|
  [username, password] == ['intra', 'visti']
end


get '/' do
  erb :index  
end

get '/photos.json' do
  fl = Flickr.new()
  photos = fl.connection('bruggi')
  puts photos
  content_type "application/json"
  return photos
end


