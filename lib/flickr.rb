require 'net/http'
require 'uri'

class Flickr
    
  def uri(tags)
"http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7cb087d5c47cf5b3abc506d250182c60&group_id=1571970@N23&tags=#{tags}&tag_mode=all&lang=en-us&format=json&nojsoncallback=1"    
  end
  def connection(tags)
    puts 'flikr hit'
    Net::HTTP.get URI.parse(uri(tags))
  end

end
