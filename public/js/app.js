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
                Intra.bg_image.fadeIn();
                Intra.loaded();
                setTimeout('Intra.load_navbar()',1000)
            }
        });
    },
    load_navbar: function(){
        $.preload(['/images/logo.png'],{
            loaded_all: function(){
                $('#left-column').fadeIn(function(){
                  setTimeout(function(){$('ul#menu').fadeIn()},500)
                });  
              }
        });
    },
    loading: function () {
        $("html").mousemove(function (e) {
            Intra.loader.css({
                'margin-left': e.pageX + 10,
                'margin-top': e.pageY - 30
            });
        });
    },
    loaded: function () {
        $("html").unbind('mousemove');
        Intra.loader.css({'margin-top': -1000});
    },
    init_loader: function (loader) {
        Intra.loader = loader;
    }
};

$(function () {
    Intra.init($('#bgimg'));
    Intra.init_loader($('img#loader'));
    Intra.load_bg_image();

    var current_img = 0;
    $('img#logo').click(function () {
        next();
    });

    function next() {
        current_img = current_img + 1;
        load_image(current_img);
        if ((bgimages.length - 1) == current_img) {
            current_img = -1;
        }

    }

    function prev() {
        if (current_img == -1 || current_img == 0) {
            current_img = bgimages.length;
        }
        current_img = current_img - 1;
        load_image(current_img);
    }

    function load_image(index) {
        Intra.loading();
        $.preload([bgimages[index]], {
            loaded_all: function () {
                Intra.loaded();
                $('#pattern').hide();
                $('#menu').fadeOut();
                $('#bgimg').fadeOut(function () {
                    $(this).attr('src', bgimages[index]).fadeIn(); 
                });
            }
        });
    }

    $('html').bind('keyup  keypress', function (e) {
        if (e.keyCode == '32') {
            $('#pattern').toggle()
            e.preventDefault();
        } else if (e.keyCode == '39') {
            next();
        } else if (e.keyCode == '37') {
            prev();
        }
    });

    //$('*').mousemove(function() {
     //$('#menu').fadeIn();
    //})

    $('#menu a').css({
        'background-position': "0 0"
    }).mouseover(function () {
        $(this).stop().animate({
            'background-position': "-175px 0"
        }, {
            duration: 200
        })
    }).mouseout(function () {
        $(this).stop().animate({
            'background-position': "-300px 0"
        }, {
            duration: 200,
            complete: function () {
                $(this).css({
                    'background-position': "0 0"
                })
            }
        })
    });


})





