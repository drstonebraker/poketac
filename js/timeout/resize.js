/* eslint-disable */

// keeps awarded "hanging" badge in center of screen

let recenterBigBadge; // a timeoutID

$(window).on("resize", function() {
  const bigBadge = document.querySelector(".badge__icon--big");

  if (bigBadge) {

    clearTimeout(recenterBigBadge);
    const badgeButton = bigBadge.parentElement;

    badgeButton.style.transition = "";
    badgeButton.style.transform = awardBadgeCss().transformHangUp;

    recenterBigBadge = setTimeout(function() {
      badgeButton.style.transition = "transform 1500ms ease-in-out";
    }, 0);

  }

});