/* eslint-disable */

// keeps awarded "hanging" badge in center of screen

let recenterBigBadge; // a timeoutID

$(window).on("resize", function() {
  const $bigBadge = $(".badge__icon--big");

  if ($bigBadge.length > 0) {
    const $badgeButton = $bigBadge.closest(".badge__btn");

    clearTimeout(recenterBigBadge);

    $badgeButton.css({
      "transition": "",
      "transform": awardBadgeCss().transformHangUp,
    });

    recenterBigBadge = setTimeout(function() {
      $badgeButton.css({
        "transition": "transform 1500ms ease-in-out",
      });
    }, 0);

  }

});