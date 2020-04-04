$(document).ready(function () {
  //Показывает body у спойлера и добавляет ему класс active
  $(".spoiler__header").click(function () {
    $(this).next(".spoiler__body").slideToggle("fast");
    $(this).toggleClass("active");
  });
});

$(document).ready(function () {
  //Переключает видимость пароля
  $("#password-toggle").change(function () {
    if ($(this).is(":checked")) {
      // Проверяет состояние
      $("#password").attr("type", "text"); // Меняет аттрибут
      $(".eye-image").addClass("closed-eye"); // Меняет иконку глаза
      $(".eye-image").removeClass("open-eye");
    } else {
      $("#password").attr("type", "password"); // Меняет аттрибут
      $(".eye-image").addClass("open-eye"); // Меняет иконку глаза
      $(".eye-image").removeClass("closed-eye");
    }
  });
});

$(function () {
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
  });
});
$(function () {
  $("#datepicker").datepicker($.datepicker.regional["ru"]);
});

// Для плейсхолдера, который превращается в лейбл
$(".input").on("focus", function () {
  $(this).addClass("active").siblings(".placeholder").addClass("active");
});
$(".input").on("blur", function () {
  if ($.trim($(this).val()) == "") {
    $(this)
      .removeClass("active")
      .siblings(".placeholder.active")
      .removeClass("active");
  }
});

//Для селекта jqueryui
$(function () {
  $(".input--select").selectmenu();

  $("#number") //Для скролла в селекте, если много пунктов. Поменять класс
    .selectmenu()
    .selectmenu("menuWidget")
    .addClass("overflow");
});

//Для фейд-ина при загрузке
$(document).ready(function () {
  $(".fadeIn").addClass("loaded"), $(".fadeIn-100").addClass("loaded");
});

$(document).ready(function () {
  //Переключает видимость пароля
  $(".menu-wrapper").on("click", function () {
    if ($(".menu-wrapper").hasClass("not-active")) {
      $(".menu__hamburger, .menu-wrapper, .menu__background").removeClass(
        "not-active"
      );
      $(".menu__hamburger, .menu-wrapper, .menu__background").addClass(
        "active"
      );

      $(".hero__content, .section__content").addClass("transparent");
    } else {
      $(".menu__hamburger, .menu-wrapper, .menu__background").addClass(
        "not-active"
      );
      $(".menu__hamburger, .menu-wrapper, .menu__background").removeClass(
        "active"
      );
      $(".hero__content, .section__content").removeClass("transparent");
    }
  });
});

$(document).ready(function () {
  // Скрытие по клике на меню

  $("body").click(function (event) {
    if ($(".menu-wrapper").hasClass("active")) {
      $target = $(event.target);
      if (
        !$target
          .closest($(".menu__hamburger, .menu-wrapper, .menu__background"))
          .hasClass("active")
      ) {
        $(".menu__hamburger, .menu-wrapper, .menu__background").addClass(
          "not-active"
        );
        $(".menu__hamburger, .menu-wrapper, .menu__background").removeClass(
          "active"
        );
        $(".hero__content, .section__content").removeClass("transparent");
      }
    }
  });
});

//Для смены цвета меню после hero
$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  var hero = $(".hero").height() + 100;

  if (scroll >= hero) {
    $(".menu-wrapper").addClass("menu-wrapper--background");
  } else {
    $(".menu-wrapper").removeClass("menu-wrapper--background");
  }
});

$(document).ready(function () {
  //
  $(function () {
    var location = window.location.href;
    var cur_url = location.split("/").pop();

    $(".menu li ").each(function () {
      var link = $(this).find("a").attr("href");

      if (cur_url == link) {
        $(this).addClass("current");
      }
    });
  });
});
