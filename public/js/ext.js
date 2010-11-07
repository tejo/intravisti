(function($) {
 var imgList = [];
 $.extend({
preload: function(imgArr, option) {
var setting = $.extend({
init: function(loaded, total) {},
loaded: function(img, loaded, total) {},
loaded_all: function(loaded, total) {}
}, option);
var total = imgArr.length;
var loaded = 0;

setting.init(0, total);
for(var i in imgArr) {
imgList.push($("<img />")
  .attr("src", imgArr[i])
  .load(function() {
    loaded++;
    setting.loaded(this, loaded, total);
    if(loaded == total) {
    setting.loaded_all(loaded, total);
    }
    })
  );
}

}
}); 
$.fn.resize = function(options) {

  var settings = $.extend({
scale: 1,
maxWidth: null,
maxHeight: null
}, options);

return this.each(function() {

    if(this.tagName.toLowerCase() != "img") {
    // Only images can be resized
    return $(this);
    } 

    var width = this.naturalWidth;
    var height = this.naturalHeight;
    if(!width || !height) {
    // Ooops you are an IE user, let's fix it.
    var img = document.createElement('img');
    img.src = this.src;

    width = img.width;
    height = img.height;
    }

    if(settings.scale != 1) {
    width = width*settings.scale;
    height = height*settings.scale;
    }

    var pWidth = 1;
    if(settings.maxWidth != null) {
      pWidth = width/settings.maxWidth;
    }
    var pHeight = 1;
    if(settings.maxHeight != null) {
      pHeight = height/settings.maxHeight;
    }
    var reduce = 1;

    if(pWidth < pHeight) {
      reduce = pHeight;
    } else {
      reduce = pWidth;
    }

    if(reduce < 1) {
      reduce = 1;
    }

    var newWidth = width/reduce;
    var newHeight = height/reduce;

    return $(this)
      .attr("width", newWidth)
      .attr("height", newHeight);

});
}

})(jQuery);

