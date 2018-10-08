/* eslint-disable */

// keeps awarded "hanging" badge in center of screen

// a timeoutID
let recenterBigBadge;

$(window).on("resize", function() {
  const bigBadge = document.querySelector(".badge__icon--big");

  if (bigBadge) {

    // clear existing timer if it exists
    clearTimeout(recenterBigBadge);
    const badgeButton = bigBadge.parentElement;

    badgeButton.style.transition = "";
    badgeButton.style.transform = awardBadgeCss().transformHangUp;

    // immediate place script in event queue to add transition
    recenterBigBadge = setTimeout(function() {
      badgeButton.style.transition = "transform 1500ms ease-in-out";
    }, 0);

  }

});