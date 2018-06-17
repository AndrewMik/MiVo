import jQuery from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/style.css";

(function ($) {
  "use strict";

  $("#mainNav").on("click", "a", function (event) {
    event.preventDefault();
    let id = $(this).attr("href");
    let top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1500);
  });

  $("body").scrollspy({
    target: "#mainNav",
    offset: 54
  });

  $(".trigger").click(function () {
    $(".navbar-collapse").collapse("hide");
  });

  let navbarCollapse = function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };

  navbarCollapse();

  $(window).scroll(navbarCollapse);
})(jQuery);
