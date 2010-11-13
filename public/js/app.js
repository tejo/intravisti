var Intra = {
    bg_image: {},
    loader: {},
    init: function (bg_image) {
        Intra.bg_image = bg_image;
    },
    load_bg_image: function () {
        $.preload([Intra.bg_image.attr('src')], {
            init: function(){
                Intra.loading();
            },
            loaded_all: function () {
                setTimeout("Intra.bg_image.fadeIn()", 1000);
                Intra.loaded();
            }
        });
    },
    loading: function () {
        $("*").mousemove(function (e) {
            Intra.loader.css({
                'margin-left': e.pageX + 10,
                'margin-top': e.pageY - 30
            });
        });
    },
    loaded: function () {
        $("*").unbind('mousemove');
        Intra.loader.hide();
    },
    init_loader: function (loader) {
        Intra.loader = loader;
    }
};

$(function () {
    Intra.init($('#bgimg'));
    Intra.init_loader($('img#loader'));
    Intra.load_bg_image();

    //setTimeout("$(\"#bgimg\").fadeIn()",2250);
    // gallery.setupAjaxCallbacks();
    // gallery.flickrGet({
    //     tag: "bruggi,3g0ph0t0"
    // });
});


