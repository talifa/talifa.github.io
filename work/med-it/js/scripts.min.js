$(function() {
    particlesJS.load('particles-js', 'js/particles.json', function() {
        console.log('callback - particles.js config loaded');
    });
});
$(window).on("load", function() {
    $(window).scroll(function() {
        var windowBottom = $(this).scrollTop() + $(this).innerHeight();
        $(".hideme").each(function() {
            /* Check the location of each desired element */
            var objectBottom = $(this).offset().top + $(this).outerHeight();

            /* If the element is completely within bounds of the window, fade it in */
            if (objectBottom < windowBottom) { //object comes into view (scrolling down)
                if ($(this).css("opacity") == 0) { $(this).fadeTo(500, 1); }
            } else { //object goes out of view (scrolling up)
                if ($(this).css("opacity") == 1) { $(this).fadeTo(500, 0); }
            }
        });
    }).scroll(); //invoke scroll-handler on page-load
});





$(document).ready(function() {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene);
    var scene_1 = document.getElementById('scene_1');
    var parallaxInstance = new Parallax(scene_1);
});
new WOW().init();
$(function() {

    $('#popupbutton').fancybox({
        'padding': 37,
        'overlayOpacity': 0.87,
        'overlayColor': '#fff',
        'transitionIn': 'none',
        'transitionOut': 'none',
        'titlePosition': 'inside',
        'centerOnScroll': true,

        'minWidth': 350,
        'minHeight': 300

    });


    $("#form-feedback").submit(function(event) {

        if ($('#name').val() == "") {
            $('#bthrow_error_name').fadeIn(1000).html('Представьтесь, пожалуйста.');
        } else if ($('#email').val() == "") {
            $('#bthrow_error_name').empty();
            $('#bthrow_error_email').fadeIn(1000).html('Как с Вами связаться?');
        } else {
            var postForm = {
                'name': $('#name').val(),
                'company': $('#company').val(),
                'email': $('#email').val()
            };
            

 $.ajax({ //Process the form using $.ajax()
                        type        : 'POST', //Method type
                        url         : 'feedback.php', //Your form processing file url
                        data        : postForm, //Forms name
                        dataType    : 'json',
                        success     : function(data) {
                            
                        if (!data.success) { //If fails
                            if (data.errors.name) { //Returned if any error from process.php
                                $('.throw_error').fadeIn(1000).html(data.errors.name); //Throw relevant error
                            }
                        } else {
                                $('#form-feedback').fadeIn(1000).append('<p>' + data.posted + '</p>'); //If successful, than throw a success message
                            }
                        },
        error: function (xhr, desc, err)
        {
            console.log("error");

        }
                    });
        }
         

        event.preventDefault();

    });

});


jQuery(document).ready(function($) {
    $('.my-slider').unslider({
        infinite: true
    });
});
// $(document).ready(function(){
//   $("#menu1").on("click","a", function (event) {
//     //отменяем стандартную обработку нажатия по ссылке
//     event.preventDefault();

//     //забираем идентификатор бока с атрибута href
//     var id  = $(this).attr('href'),

//     //узнаем высоту от начала страницы до блока на который ссылается якорь
//       top = $(id).offset().top;

//     //анимируем переход на расстояние - top за 1500 мс
//     $('body,html').animate({scrollTop: top}, 1500);
//   });
// });



jQuery(document).ready(function() {
    jQuery('.orange-figure').viewportChecker({
        classToAdd: 'orange-figure-wow ',
        offset: 100
    });
    const tilt = $('.js-tilt').tilt();
});




/*Called after UL*/



new ElastiStack(document.getElementById('elasticstack'), {
    // distDragBack: если пользователь не зашёл за пределы, возвращаем изображение на место 
    distDragBack: 10,
    // distDragMax: если выходит за эти пределы, убираем изображение 
    distDragMax: 100,
    // колбэк 
    onUpdateStack: function(current) { return false; }
});

$(document).ready(function() {
    $('#line_icon_2').on('click', function(event) {
        if ($('#line_icon_1').hasClass('line_icon_1_active')) {
            $('#line_icon_1').removeClass('line_icon_1_active');
            $('#line_icon_2').addClass('line_icon_2_active');
            $('.elasticstack').hide();
            $('#projects__list_mobile').show();
        }
        //    else {
        // $('#line_icon_1').addClass('line_icon_1_active');
        //        $('#line_icon_2').removeClass('line_icon_2_active');

        //        $('.elasticstack').show();
        //        $('#projects__list_mobile').hide();
        //    }
    });
    $('#line_icon_1').on('click', function(event) {
        if ($('#line_icon_2').hasClass('line_icon_2_active')) {
            $('#line_icon_2').removeClass('line_icon_2_active');
            $('#line_icon_1').addClass('line_icon_1_active');
            $('.elasticstack').show();
            $('#projects__list_mobile').hide();
        }
        // else {
        //           $('#line_icon_2').addClass('line_icon_2_active');
        //     $('#line_icon_1').removeClass('line_icon_1_active');
        //     $('.elasticstack').hide();
        //     $('#projects__list_mobile').show();
        // }
    });
   


});


