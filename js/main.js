'use strict';

//animate the logos in the opening splash modal
function splashAnimation() {
	var animateTicTacToe;
	var animationInterval = 674; //674 is beat of opening music
	var logoStates = ["board","tic","tac","toe"];
	var i = 1;

	function animateTicTacToeFn() {
		$("#ttt-logo__element").addClass("ttt-logo__element--" + logoStates[i]).removeClass("ttt-logo__element--" + logoStates[i-1]);
        console.log(("#ttt-logo__element--" + logoStates[i]),("#ttt-logo__element--" + logoStates[i-1]));
        console.log($("#ttt-logo__element").attr("class"));
		if (i == 3) {
			clearInterval(animateTicTacToe);
		}
		i++;
	}
    
    setTimeout(function() {
    	$("#ttt-logo__element").slideDown(animationInterval / 4, function() {
    
    		animateTicTacToe = window.setInterval(animateTicTacToeFn, animationInterval);
    
    		setTimeout(function() {
    			$('#pokemon-logo').removeClass('u-hidden').addClass('animated rubberBand').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    				$(this).removeClass("animated rubberBand");
    			});
    		}, animationInterval * 4);
    
    	});
    }, animationInterval * 2);
}

$(function() {
    var isMobile = false;
    var playerName;
	var playerAvatar;
	var playerPokemon;
	
    // Music and sound effects settings
    var soundEffectsOn = true;
    function toggleSound() {
        if (soundEffectsOn) {
          soundEffectsOn = false;
          $("#controls__toggle--sound").addClass("controls__toggle--off").attr("title", "Sound Effects On");
      } else {
          soundEffectsOn = true;
          $("#controls__toggle--sound").removeClass("controls__toggle--off").attr("title", "Sound Effects Off");
          if (isMobile && !document.getElementById('music').paused) {
              toggleMusic();
          }
      }
    }
    
    //set music toggle functionality
    function toggleMusic() {
        var music =document.getElementById('music');
      if (music.paused == false) {
          music.pause();
          $("#controls__toggle--music").addClass("controls__toggle--off").attr("title", "Music On");
      } else {
          music.play();
          $("#controls__toggle--music").removeClass("controls__toggle--off").attr("title", "Music Off");
          if (isMobile && soundEffectsOn) {
              toggleSound();
          }
      }
    }
    $("#controls__toggle--music").click(toggleMusic);
    $("#controls__toggle--sound").click(toggleSound);
    
    function setMobileSettings() {
        if (!isMobile) { //if this is the first time tapping the page
            document.getElementById('music').play();
            toggleSound();
        }
        
        isMobile = true;
        
        var el = document.documentElement,
          rfs = el.requestFullscreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
            || el.msRequestFullscreen 
        ;
    
        rfs.call(el);
        
        //lock portrait orientation on mobile
        screen.orientation.lock("portrait");
        screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
        screen.lockOrientationUniversal("portrait");
    }
    
    // for mobile, activate music, set fullscreen, lock portrait orientation
    $('#view').on("touchstart tap", setMobileSettings);
    
    //load background map image
    new Promise(function(resolve) {
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
        if (viewHeight > 1080) {
            var backgroundSource = "./img/johto-kanto-map-3000x1316.jpg";
        } else if (viewHeight > 680) {
            var backgroundSource = "./img/johto-kanto-map-3000x1062.jpg";
        } else {
            var backgroundSource = "./img/johto-kanto-map-1921x680.jpg";
        }
        
        var background = document.createElement('img') ;
        background.src = backgroundSource;
        background.id = "background";
        background.className = "background";
        background.onload = resolve;
        $("#view").prepend(background);
        $("#background").attr('alt', "A map of the Pokemon world in the background")
        
    }) // then set horizontal scrolling animation
        .then(function() {
        
    	var backgroundScrollSpeed = 150;//higher number is slower
    	var backgroundTiming; //time in ms for full scroll of one direction
    	var backgroundTransition; //css transition value used for animation
    	var backgroundMargin; //number of horizontal pixels to scroll each direction
    	var animateBackground; //a setInterval function
    	
    	function updateBackgroundTiming() {	//triggered on load and resize.  also starts/restarts animation
    		backgroundMargin = Math.floor($("#background").width() - document.documentElement.clientWidth);
    		backgroundTiming = backgroundMargin * backgroundScrollSpeed;
    		
    		var backgroundTransition = "transform "+backgroundTiming+"ms linear"
    		var backgroundTransitionObj = {
    			transition: backgroundTransition,
    			"-webkit-transition": backgroundTransition
    		};
    		
    		$("#background").css(backgroundTransitionObj);		
    		
    		clearInterval(animateBackground);		
    		animateBackgroundFn()
    		animateBackground = window.setInterval(animateBackgroundFn, backgroundTiming * 2);
    	}
    	
    	function animateBackgroundFn(reverse) {
    		var backgroundTranslate = "translate3d(-"+backgroundMargin+"px, 0px, 0px)"
    		if (reverse) {
    			var backgroundTransform = {
    				transform: "",
    				"-webkit-transform": ""
    			}	
    		} else {
    			var backgroundTransform = {
    				transform: backgroundTranslate,
    				"-webkit-transform": backgroundTranslate
    			}	
    		}
    		$("#background").css(backgroundTransform)
    	
    		
    		if (!reverse) {
    			setTimeout(function() {
    				animateBackgroundFn(true);	
    			}, backgroundTiming)
    					
    		}
    
    	} // end animateBackgroundFn
    	
    	updateBackgroundTiming()
    	$(window).on("resize", updateBackgroundTiming);

    }); // end "then" attached to background image load promise
    
    // OAK MODAL DIALOGUES
    $("#controls").on("touchstart click", function() {
        event.stopPropagation();
    })
    
    function oak1() {
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Well, hello there!<br>It's nice to see you dropping by!</p>";
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+'</div>';
		
		$("#char-tall--oak").removeClass("u-hidden");
		$("#modal").removeClass('modal--splash');
		$("#modal__content--splash").replaceWith(modalContentOak);
		$("body").one('click', oak2);
	}
	
	function oak2() {
		console.log("oak2");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>We’ve just discovered a new pastime here in the Pokemon world.  It’s all the rage.  They call it Tic-Tac-Toe!<br>That’s why you’re here, isn’t it?</p>";
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("body").one('click', oak3);
	}
	
	function oak3() {
		console.log("oak3");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>But look at me getting ahead of myself.  I’ve forgotten my manners!  I’m Professor Oak.<br>And you are...?</p>";
		var nameInput = '<input type="text" placeholder="Type your name" class="name-input" id="name-input"></input>';
		var nameBtn = '<button type="button" class="button button--green" id="button-player-name">OK</button>';
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+nameInput+nameBtn+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("#button-player-name").one('click', oak4);
	}
	
	function oak4() {
		console.log("oak4");
		playerName = $("#name-input").val();
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Welcome, "+playerName+"!  You’ll have to forgive me, but my eyes are going bad.  Can you tell me what you look like?</p>";
		var buttonAvatarFemale = '<button type="button" class="button button--avatar" id="button-player-avatar-f" data-avatar="player-female"><div class="button__avatar button__avatar--female" id="button__avatar--female"></div></button>';
		var buttonAvatarMale = '<button type="button" class="button button--avatar" id="button-player-avatar-m" data-avatar="player-male"><div class="button__avatar button__avatar--male" id="button__avatar--male"></div></button>';
		
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+buttonAvatarFemale+buttonAvatarMale+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$(".button--avatar").one('click', function() {
			event.stopPropagation();
			playerAvatar = $(this).data().avatar;
			oak5();
		});
	}
	
	function oak5() {
		console.log("oak5");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>You look like a confident young trainer, you say?  Wonderful!  You’ll need that confidence in your challenges.</p>";
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("body").one('click', oak6);
	}
	
	function oak6() {
		console.log("oak6");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Before you play, you’ll need a pokemon.<br>I have three right here you can choose from!</p>";
		var pokeball0 = '<button type="button" class="pokeball" id="pokeball--0"><div class="pokeball__element pokeball__ball"></div><div class="pokeball__element pokeball__pokemon pokeball__pokemon--0" id="pokeball__pokemon--0"></div></button>';
		var pokeball1 = '<button type="button" class="pokeball" id="pokeball--1"><div class="pokeball__element pokeball__ball"></div><div class="pokeball__element pokeball__pokemon pokeball__pokemon--1" id="pokeball__pokemon--1"></div></button>';
		var pokeball2 = '<button type="button" class="pokeball" id="pokeball--2"><div class="pokeball__element pokeball__ball"></div><div class="pokeball__element pokeball__pokemon pokeball__pokemon--2" id="pokeball__pokemon--2"></div></button>';
		
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+pokeball0+pokeball1+pokeball2+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("body").one('click', oak7);
	}
	//end Oak modal dialogues
    
    splashAnimation();
    $("body").one('click', oak1); //first oak dialogue screen

	
})
