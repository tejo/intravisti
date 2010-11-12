var gallery = {

    images: [],

    flickrGet: function (options) {
        settings = $.extend({
            flickr_resource_uri: "/photos/",
            tag: ""
        }, options);

        $.getJSON(settings.flickr_resource_uri + settings.tag, gallery.buildImageList);
    },

    buildImageList: function (data) {
        $.each(data.photos.photo, function (i, item) {
            gallery.images.push('http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg');
        });
        gallery.preloadImages(gallery.images);
    },

    preloadImages: function (images) {
        //console.log(images);
        $.preload(images, {
            init: function (loaded, total) {
                $("#indicator").html("Loaded: " + loaded + "/" + total);
            },
            loaded: function (img, loaded, total) {
                $("#indicator").html("Loaded: " + loaded + "/" + total);
                $(img).addClass('resized');
                $("#full-screen").append(img);
                $('.resized').resize({
                    maxHeight: 150
                }).click(function () {

                    image_str = $(this).attr('src').split('_m.jpg').join('_b.jpg');
                    $.preload([image_str], {
                        init: function (loaded, total) {
                            $("#indicator").html('Loading');
                        },
                        loaded: function (img, loaded, total) {$("#indicator").html('Loaded');$('#bgimg').attr('src', image_str);
                    }, loaded_all: function (loaded, total) {}
                    });

                });


        }, loaded_all: function (loaded, total) {
            $("#indicator").html("Loaded: " + loaded + "/" + total + ". Done!");
            $('#bgimg').attr('src', gallery.images[0].split('_m.jpg').join('_b.jpg'));
        }
        });

},

    setupAjaxCallbacks: function () {
        $('body').ajaxStart(function () {
            $('#status-text').show().text("Loading...");
        });
        $('body').ajaxStop(function () {
            $('#status-text').fadeOut();
        });
        $('body').ajaxError(function (event, xhr, ajaxOptions, thrownError) {
            console.log("XHR Response: " + JSON.stringify(xhr));
        });

    }
    };

$(function () {
    gallery.setupAjaxCallbacks();
    gallery.flickrGet({
        tag: "bruggi,3g0ph0t0"
    });
});

