/* eslint-disable */

// keeps awarded "hanging" badge in center of screen

window.addEventListener("resize", function() {
  const bigBadge = document.querySelector(".badge__icon--big");

  if (bigBadge) {

    const badgeButton = bigBadge.parentElement;

    badgeButton.style.transition = "";
    badgeButton.style.transform = awardBadgeCss().transformHangUp; // "translate()"

    badgeButton.style.transition = "transform 1500ms ease-in-out";

  }

});