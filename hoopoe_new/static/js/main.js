$(document).ready(function() {
  svg4everybody({});
});
$(window).scroll(function() {
  $("header").toggleClass("scroll", $(this).scrollTop() > 100);
});
$(".slider").slick({
  dots: true,
  infinite: true,
  speed: 500,
  fade: true,
  cssEase: "linear"
});
