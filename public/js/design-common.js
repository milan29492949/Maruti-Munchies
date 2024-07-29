if (document.getElementById("home-slider")) {
  $(document).ready(function () {
    var owl = $("#home-slider");

    owl.owlCarousel({
      navigation: false,
      singleItem: true,
      items: 1,
      dots: false,
      rewind: true,
      autoplay: true,
      autoHeight: true,
    });
  });
}

if (document.getElementById("flavour-slider")) {
  $(document).ready(function () {
    var owl = $("#flavour-slider");
    owl.owlCarousel({
      nav: true,
      loop: true,
      items: 3,
      dots: false,
      rewind: true,
      center: true,
      navText: [
        '<i class="ion-ios-arrow-thin-left"><span>Prev</span></i>',
        '<i class="ion-ios-arrow-thin-right"><span>Next</span></i>',
      ],
      autoplay: true,
      slideTransition: "linear",
      autoplayHoverPause: false,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
        },
        767: {
          items: 1,
        },
        1000: {
          items: 3,
        },
      },
    });
  });
}

if ($(".fancy").length) {
  $(".fancybox").fancybox({
    padding: 0,
    keyboard: false,
  });
}

$(document).ready(function () {
  AOS.init({
    easing: "ease-in-out-sine",
    disable: "mobile",
  });
});

//===== Back to top

// Scroll Event
$(window).on("scroll", function () {
  var scrolled = $(window).scrollTop();
  if (scrolled > 300) $(".go-top").addClass("active");
  if (scrolled < 300) $(".go-top").removeClass("active");
});

// Click Event
$(".go-top").on("click", function () {
  $("html, body").animate(
    {
      scrollTop: "0",
    },
    1200
  );
});

// qty

jQuery(document).ready(($) => {
  $(".qty-input").on("click", ".plus", function (e) {
    let $input = $(this).prev("input.qty-number");
    let val = parseInt($input.val());
    $input.val(val + 1).change();
  });

  $(".qty-input").on("click", ".minus", function (e) {
    let $input = $(this).next("input.qty-number");
    var val = parseInt($input.val());
    if (val > 0) {
      $input.val(val - 1).change();
    }
  });
});

// mobile-memu

jQuery(document).ready(($) => {
  $(".navbar").on("click", ".navbar-toggler", function (e) {
    (".navbar-nav").addClass("menu-active")
  });
});
