'use strict';
/*global $*/

//detect IE
var isIE = /*@cc_on!@*/false || !!document.documentMode;
if (isIE) {
	document.body.innerHTML = "<p class='browserupgrade'>You are using an <strong>outdated</strong> browser. This game is only playable with <a href='http://browsehappy.com/'>an upgraded browser</a>.</p>";
}

const TRANSITION_END = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
const ANIMATION_END = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

const POKEMON = {
    "Bulbasaur": {
        type: "grass",
        advantage: "Squirtle",
        disadvantage: "Charmander",
        evolution: [
            "Bulbasaur",
            "Ivysaur",
            "Venusaur",
            "Mega-Venusaur"
            ]
    },
    "Charmander": {
        type: "fire",
        advantage: "Bulbasaur",
        disadvantage: "Squirtle",
        evolution: [
            "Charmander",
            "Charmeleon",
            "Charizard",
            "Mega-Charizard"
            ]
    },
    "Squirtle": {
        type: "water",
        advantage: "Charmander",
        disadvantage: "Bulbasaur",
        evolution: [
            "Squirtle",
            "Wartortle",
            "Blastoise",
            "Mega-Blastoise"
            ]
    }
};

//animate the logos in the opening splash modal
function splashAnimation() {
	var animateTicTacToe;
	var animationInterval = 674; //674 is beat of opening music
	var logoStates = ["board","tic","tac","toe"];
	var i = 1;

	function animateTicTacToeFn() {
		$("#ttt-logo__element").addClass("ttt-logo__element--" + logoStates[i]).removeClass("ttt-logo__element--" + logoStates[i-1]);
		if (i == 3) {
			clearInterval(animateTicTacToe);
		}
		i++;
	}
    
    setTimeout(function() {
    	$("#ttt-logo__element").slideDown(animationInterval / 4, function() {
    
    		animateTicTacToe = window.setInterval(animateTicTacToeFn, animationInterval);
    
    		setTimeout(function() {
    			$('#pokemon-logo').removeClass('u-hidden').addClass('animated rubberBand').one(ANIMATION_END, function() {
    				$(this).removeClass("animated rubberBand").off(ANIMATION_END);
    			});
    		}, animationInterval * 4);
    
    	});
    }, animationInterval * 2);
}

$(function() {
  var isMobile = false;
  var playerName;
	var playerAvatar;
	var playerStarterPokemon;
	var playerType;
	var currentGym;
	var earnedBadges = [];
	var animateBackground; //a setInterval function
	const CHALLENGERS = function() {
	  return {
      0: {
        name: "Brock",
        victoryMessages: [
          "Wow. That went fast.",
          "You're really good at this game!",
          "Here, take this BOULDER BADGE",
          "You deserve it!"
          ],
        tieMessages: [],
        lossMessages: []
      },
      1: {
        name: "Misty",
        victoryMessages: [
          "What? No way!",
          "That's not fair!",
          "Can't we do a rematch?",
          "Oh well. Here's your CASCADE BADGE"
          ],
        tieMessages: [],
        lossMessages: []
      },
      2: {
        name: "Lt. Surge",
        victoryMessages: [
          "Oh boy!",
          "You are one tough cookie!",
          "But I'll bet you just got lucky",
          "Luck or not, this THUNDER BADGE is yours"
          ],
        tieMessages: [],
        lossMessages: []
      },
      3: {
        name: "Erika",
        victoryMessages: [
          "Hey, good for you!",
          "You won! Congratulations!",
          "You must have trained hard for this",
          "Let me give you this RAINBOW BADGE"
          ],
        tieMessages: [],
        lossMessages: []
      },
      4: {
        name: "Koga",
        victoryMessages: [
          "You came out of nowhere!",
          "I couldn't outmaneuver you, " + playerName,
          "You're on your way to becoming a true master",
          "This SOUL BADGE will show what you're capable of"
          ],
        tieMessages: [],
        lossMessages: []
      },
      5: {
        name: "Sabrina",
        victoryMessages: [
          "I underestimated you, " + playerName,
          "I'm going to have to meditate on what went wrong",
          "I see more victories in your future",
          "Take this MARSH BADGE with you as you go"
          ],
        tieMessages: [],
        lossMessages: []
      },
      6: {
        name: "Blaine",
        victoryMessages: [
          "HAHA, we have a winner!",
          "Riddle me this:",
          "What do winners win?",
          "A VOLCANO BADGE, that's what!"
          ],
        tieMessages: [],
        lossMessages: []
      },
      7: {
        name: "Giovanni",
        victoryMessages: [
          "No. It isn't possible",
          "How!? I never lose!",
          "The is the end of me",
          "..."
          ],
        tieMessages: [],
        lossMessages: []
      }
    }
	}
	
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
            $("#controls__toggle--music").removeClass("controls__toggle--off").attr("title", "Music Off");
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
    $('body').on("touchstart", setMobileSettings);
    
    //load overworld background image
    new Promise(function(resolve) {
    		var backgroundSource;
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    
        if (viewHeight > 1080) {
            backgroundSource = "./img/johto-kanto-map-3000x1316.jpg";
        } else if (viewHeight > 680) {
            backgroundSource = "./img/johto-kanto-map-3000x1062.jpg";
        } else {
            backgroundSource = "./img/johto-kanto-map-1921x680.jpg";
        }
        
        var background = document.createElement('img') ;
        background.src = backgroundSource;
        background.id = "overworld";
        background.className = "overworld";
        background.onload = resolve;
        $("#view").prepend(background);
        $("#overworld").attr('alt', "A map of the Pokemon world in the background");
        
    }) // then set horizontal scrolling animation
        .then(function() {
          
      var bgAnimationFwd = true;
        
    	var backgroundScrollSpeed = 150;//higher number is slower
    	var backgroundTiming; //time in ms for full scroll of one direction
    	var backgroundMargin; //number of horizontal pixels to scroll each direction
    	var backgroundMarginRight; //pixel width of right-overflow
    	
    	function updateBackgroundTiming() {	//triggered on load and resize.  also starts/restarts animation
  
    	  if (event) {
    	    clearTimeout(animateBackground);
    	    backgroundMarginRight = Math.floor($("#overworld").offset().left + $("#overworld").width() - document.documentElement.clientWidth); // pixel width of right-overflow of overworld
    	    if (bgAnimationFwd) {
      		  backgroundMargin = backgroundMarginRight;
    	    } else {
    	      backgroundMargin = Math.floor(-$("#overworld").offset().left); // pixel width of left-overflow of overworld
    	    }
    	    if (backgroundMarginRight < 0) {
      		  backgroundMargin = 0;
      		  bgAnimationFwd = true;
        	}
      		
    	  } else {
    	    backgroundMargin = Math.floor($("#overworld").width() - document.documentElement.clientWidth);
    	  }
    	  
    		backgroundTiming = backgroundMargin * backgroundScrollSpeed;
    		
    		var backgroundTransition = backgroundMargin == 0 ? "" : "transform "+backgroundTiming+"ms linear";
    		var backgroundTransitionObj = {
    			transition: backgroundTransition,
    			"-webkit-transition": backgroundTransition
    		};
    		
    		$("#overworld").css(backgroundTransitionObj);		
    		
    		animateBackgroundFn();
    	}
    	
    	function animateBackgroundFn() {
    		var backgroundTransform;
    		var backgroundTranslate;

    		if (bgAnimationFwd) {
    		  var backgroundOverflow = Math.floor($("#overworld").width() - document.documentElement.clientWidth);
    		  backgroundTranslate = "translate3d(-"+backgroundOverflow+"px, 0px, 0px)";
    		  backgroundTransform = {
    				transform: backgroundTranslate,
    				"-webkit-transform": backgroundTranslate
    			};
    		} else {
    			backgroundTransform = {
    				transform: "",
    				"-webkit-transform": ""
    			};
    		}
    		$("#overworld").css(backgroundTransform);
    	
  			animateBackground = setTimeout(function() {
  			  bgAnimationFwd = bgAnimationFwd ? false : true; //reverse direction
  				updateBackgroundTiming();
  			}, backgroundTiming);
    
    	} // end animateBackgroundFn
    	
    	updateBackgroundTiming();
    	$(window).on("resize focus", updateBackgroundTiming).on("blur", function() {
    	  $("#overworld").css({"transform": "translateX(" + $("#overworld").offset().left + "px)", "transition": ""}); // pause animation so it doesn't jump on refocus
    	});
    	
		    	
    	$("#view").addClass("view--gym"); // add gym background image behind pokemon world background

    }); // end "then" attached to background image load promise
    
    $(window).keypress(function(e) {
        if ((e.which === 32 || e.which === 13) && document.activeElement == document.body) {
            $("body").trigger("click"); //advance to next screen if pressing enter or space
        }
    });
        
    // OAK MODAL DIALOGUES
    $("#controls").on("touchstart click", function() {
        event.stopPropagation();
    });
    
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
		var nameBtn = '<button type="submit" class="button button--green" id="button-player-name">OK</button>';
		var nameForm = "<form id='nameForm'>"+nameInput+nameBtn+"</form>";
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+nameForm+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("#button-player-name").on('click submit', function() {
			if ($("#name-input").val() == "") {
				$("#modal-text").text("Please, tell me your name.");
			} else {
				playerName = $("#name-input").val();
				oak4();
			}
			return false;
		});
	}
	
	function oak4() {
		console.log("oak4");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Welcome, "+playerName+"!  You’ll have to forgive me, but my eyes are going bad.  Can you tell me what you look like?</p>";
		var buttonAvatarFemale = '<button type="button" class="button button--avatar button--avatar--player" id="button-player-avatar-f" data-avatar="female"><div class="button__avatar avatar avatar--female" id="button__avatar--female"></div></button>';
		var buttonAvatarMale = '<button type="button" class="button button--avatar button--avatar--player" id="button-player-avatar-m" data-avatar="male"><div class="button__avatar avatar avatar--male" id="button__avatar--male"></div></button>';
		
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+buttonAvatarFemale+buttonAvatarMale+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$(".button--avatar--player").one('click', function() {
			event.stopPropagation();
			playerAvatar = $(this).data().avatar;
			$("#avatar--player").addClass("avatar--" + playerAvatar);
			oak5();
		});
		
		return false; //prevent default submit behavior on name input
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
		var pokeball0 = '<button type="button" data-pokemon="Bulbasaur" class="pokeball" id="pokeball--0"><div class="pokeball__element pokeball__ball"></div><div class="pokeball__element pokeball__pokemon pokeball__pokemon--0" id="pokeball__pokemon--0"></div></button>';
		var pokeball1 = '<button type="button" data-pokemon="Charmander" class="pokeball" id="pokeball--1"><div class="pokeball__element pokeball__ball"></div><div class="pokeball__element pokeball__pokemon pokeball__pokemon--1" id="pokeball__pokemon--1"></div></button>';
		var pokeball2 = '<button type="button" data-pokemon="Squirtle" class="pokeball" id="pokeball--2"><div class="pokeball__element pokeball__ball"></div><div class="pokeball__element pokeball__pokemon pokeball__pokemon--2" id="pokeball__pokemon--2"></div></button>';
		
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+pokeball0+pokeball1+pokeball2+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		
		function choosePokemon() {
		    event.stopPropagation();
			playerStarterPokemon = $(this).data().pokemon;
			playerType = POKEMON[playerStarterPokemon].type;
			oak7();
		}
		
		if (isMobile) {
		    $(".pokeball").on('touchstart', function() {
		        var isFocused = $(this).hasClass("pokeball--focus");
		        $(".pokeball").removeClass("pokeball--focus").off('touchstart', choosePokemon);
		        if (isFocused) {
		            $(this).one('click', choosePokemon);//do not use touchstart on this
		        }
		        $(this).toggleClass("pokeball--focus");
		    });
		} else {
		    $(".pokeball").one('click', choosePokemon);
		}
	}
	
	function oak7() {
		console.log("oak7");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>So you chose a "+playerStarterPokemon+"!<br><br>Because "+playerStarterPokemon+" is "+playerType+"-type, you’ll have an advantage against "+POKEMON[POKEMON[playerStarterPokemon].advantage].type+"-type pokemon, but a disadvantage against "+POKEMON[POKEMON[playerStarterPokemon].disadvantage].type+"-type pokemon.</p>";
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("body").one('click', oak8);
	}
	
	function oak8() {
		console.log("oak8");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>There are eight different gym leaders you can challenge.<br><br>Some of them are tougher than others!</p>";
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("body").one('click', oak9);
	}
	
	function oak9() {
		console.log("oak9");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Some gym leaders also offer unique badges to players who can beat them.  With enough badges, you might even see your pokemon evolve. See if you can collect all eight!</p>";
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("body").one('click', oak10);
	}
	
	function oak10() {
		console.log("oak10");
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Are you ready to play?</p>";
		var buttonPlay = '<button type="button" class="button button--green" id="button-play">Ready!</button>';
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+buttonPlay+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("#button-play").one('click', oak11);
	}
	
	function oak11() {
		console.log("oak11");
		//exit oak modal and enter gamespace
		$("#gamespace").removeClass("u-hidden");
	    $("#button-play").addClass("animated bounceBtn").one(ANIMATION_END, function() {
    		$(this).removeClass("animated bounceBtn").off(ANIMATION_END);
    		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Good luck!</p>";
			var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+'</div>';
			
			$("#modal__content--oak").replaceWith(modalContentOak);
    		
    		setTimeout(function() {
    			$("#modal").addClass("animated bounceOutDownCenter").one(ANIMATION_END, function() {
    				$(this).hide().removeClass("animated bounceOutDownCenter").off(ANIMATION_END);
    				showChallengers();
    			});
    		}, 1000);
    	});
    	
    	//zoom into overworld
    	var transitionDuration = 700;
    	var transitionEasing = "cubic-bezier(.9,0,.96,.5)";
    	var translateVal = $("#overworld").offset().left;
    	var transformVal = "translateX(" + translateVal + "px) scale(50)";
		var transitionVal = "transform "+transitionDuration+"ms "+transitionEasing+", opacity "+transitionDuration+"ms "+transitionEasing;
		var originVal = ($(window).width() / 2) - translateVal; //distance from left of overworld to viewport center
		var cssVal = {
		    "transform": transformVal,
		    "-webkit-transform": transformVal,
		    "transform-origin": originVal + "px center",
		    "-webkit-transform-origin": originVal + "px center",
		    "transition": transitionVal,
		    "-webkit-transition": transitionVal,
		    "opacity": "0"
		};
		$("#overworld").css(cssVal).one(TRANSITION_END, function() {
			$(this).hide().off(TRANSITION_END);
		});
		clearTimeout(animateBackground);
	}
	//end Oak modal dialogues
	
	function showChallengers() {
		console.log("showChallengers()");
		$("#tray").removeClass("u-blurred");
		$("#challengers").removeClass("u-blurred").one(TRANSITION_END, function() {
		  $( ".button--avatar" ).prop( "disabled", false ); //enable buttons
		});
		
		// choosing a challenger
		$(".button--avatar").on("click", function() {
		  $( ".button--avatar" ).prop( "disabled", true ); //disable buttons
			currentGym = $(this).data().gymnumber;
			$("#marquee").removeClass("u-hidden");
			$("#avatar--challenger").addClass("avatar--challenger-" + currentGym); //add appropriate challenger avatar
			$(".button--avatar").off("click");
			$(this).addClass("animated bounceOutUp button--no-outline").one(ANIMATION_END, function() {
			  console.log("now fadeoutdown buttons");
			  $(this).off(ANIMATION_END);
				$(".button--avatar").not(this).addClass("animated fadeOutDown");
				$("#heading--challengers").addClass("animated fadeOutDown").one(ANIMATION_END, function() {
				  $(this).off(ANIMATION_END);
					$("#challengers").hide().addClass("u-blurred");
					$(".button--avatar, #heading--challengers").removeClass("animated fadeOutDown bounceOutUp button--no-outline");
					$("#marquee").addClass("marquee--drop").one(TRANSITION_END, function() {
            $(this).off(TRANSITION_END);
		        $("#marquee__dialogue").addClass("marquee__dialogue--swingHinge");
		        console.log("****************************");
		        console.log(event);
		        setTimeout(function() {
		            $("#gameboard").removeClass("u-hidden").addClass("animated fadeIn");
		            $("#marquee__dialogue__text").flowtype({minFont : 13});
		            playGame();
		        },1000);
          });
				});
			});
		});
	} //end showChallengers
	
	function playGame() {
		$("#marquee__dialogue").off(ANIMATION_END);
		console.log("playGame()");
		/*Parameters for aiSmartMove function.  cellValues represents virtual gameboard with human pieces represented by the number 1, and ai pices represented by the number 4.  adding the total value in each row, column, and diagonal allows for detecting winning moves, blocking moves, etc.*/
		const WIN   = 8;
		const BLOCK = 2;
		const SETUP = 4;
		const CHALLENGER_VAL = 4;
		const PLAYER_VAL = 1;
		const TRIO_CELLS = {
		  c1: ["a1","a2","a3"],
  		c2: ["b1","b2","b3"],
  		c3: ["c1","c2","c3"],
  		r1: ["a1","b1","c1"],
  		r2: ["a2","b2","c2"],
  		r3: ["a3","b3","c3"],
  		d1: ["a1","b2","c3"],
  		d2: ["a3","b2","c1"]  
		};
		const EDGES = ["b1","a2","c2","b3"];
		const CORNERS = ["a1","c1","a3","c3"];
		const CENTER = ["b2"];
		
		// a virtual gameboard containing values based on which cells have been played
		var cellValues = {
			a1: 0,
			b1: 0,
			c1: 0,
			a2: 0,
			b2: 0,
			c2: 0,
			a3: 0,
			b3: 0,
			c3: 0
		};
		console.log(cellValues);
		var trioVariables     = {};
		var gameTurn = "";
		var playerCurrentPokemon = "";
		var playerAdvantage = "";
		var challengerPokemon = "";
		var dialogue = {};
		var msgTimer;
		
		
		beginGame();
		
		  // Create and return array of all empty cells on gameBoard, or in array if passed as arguemnt
		function findEmptyCells(array) {
			console.log("findEmptyCells("+array+")");
		// Initialize an array to hold empty cells
			var emptyCells = [];
			var potentialCells = array || Object.keys(cellValues);
			console.log("potential empty cells: "+potentialCells);
			// Loop over each cell in gameBoard, looking for empty cells
			for (var cell in potentialCells) {
			    if (cellValues[potentialCells[cell]] == 0) {
			      // Push empty cells into possiblePlays array
			      emptyCells.push(potentialCells[cell]);
			    }
			}
			console.log("found empty: "+emptyCells);
			return emptyCells;
		}
		
	  /* TRIO VARIABLES
	      Each trio variable represents the current state each possible winning combination.
	      - A player owned cell has a state value of 1, so a winning trio variable has a value of 3.
	      - Used for allowing ai to make test plays to find optimal play.
	      =========================================================================== */
	  function updateTrioVariables() {
	  	console.log("updateTrioVariables()");
	  	trioVariables = {
	  		c1: cellValues.a1 + cellValues.a2 + cellValues.a3,
	  		c2: cellValues.b1 + cellValues.b2 + cellValues.b3,
	  		c3: cellValues.c1 + cellValues.c2 + cellValues.c3,
	  		r1: cellValues.a1 + cellValues.b1 + cellValues.c1,
	  		r2: cellValues.a2 + cellValues.b2 + cellValues.c2,
	  		r3: cellValues.a3 + cellValues.b3 + cellValues.c3,
	  		d1: cellValues.a1 + cellValues.b2 + cellValues.c3,
	  		d2: cellValues.a3 + cellValues.b2 + cellValues.c1
	  	};
	  	console.log(trioVariables);
	  }
	  
    function finalizeMove(turnOwner) {
	    console.log("finalizeMove("+turnOwner+")");
	    // Update Trio Variables
	    updateTrioVariables();
	    // Check for victory and tie
	    if (!victoryCheck() && !tieGameCheck()) {
	    	if (turnOwner === "player") {
	    		setGameTurn("challenger");
	    	} else if (turnOwner === "challenger") {
	    		setGameTurn("player");
	    	}
	    } 
	  } // end finalizeMove()
	  
	  function updatePlayerPokemon() {
	  	console.log("updatePlayerPokemon()");
	  	//this changes player pokemon to evolved form after badges are earned
	  	var evolutionStage = Math.floor((earnedBadges.length) / 2);
	  	playerCurrentPokemon = POKEMON[playerStarterPokemon].evolution[evolutionStage];
	  	console.log("player pokemon is "+playerCurrentPokemon);
	  }
	  
		function victoryCheck() {
			console.log("victoryCheck()");
	    // Loop over each of the trio variables
	    for (var trio in trioVariables) {
	      // If the current property's value is 3 or 12
	      if (trioVariables[trio] === 3 || trioVariables[trio] === 12) {
	        console.log("We have a winner!");
	
	        setGameTurn("");
	        if (trioVariables[trio] === 12) {
	          console.log("player has lost the game");
	          gameLostOrTied("lost", trio);
	        }
	        else if (trioVariables[trio] === 3) {
	          console.log("player has won the game");
	          gameWin(trio);
	        }
	        return true;
	      }
	    }
	    return false;
	  } // end victoryCheck()
	  
    function endOfGame() {
			console.log("endOfGame()");
			$( ".gameboard__cell" ).prop( "disabled", true ); //disable all cells
	    //resetGameBoard();
	    //pokemonSelect();
	  }
	  
	  function gameLostOrTied(lostOrTied, trio) {
	  	console.log("gameLostOrTied("+lostOrTied+", "+trio+")");
	  	lostOrTiedAnimation(lostOrTied, trio);
	    endOfGame();
	  }
	  
	  function gameWin(trio) {
	  	console.log("gameWin()");
	    victoryAnimation(trio, true);
	    endOfGame();
/*
	    // Show Dialogue frame
	    $(".gym-dialogue-container").toggleClass("hide");
	    // Dialogue update from GYM leader: Nice job! You've won the "NAME OF BADGE"! Good luck on your journey!
	    $(".gym-dialogue-container p").text("Nice job! You've won the 'NAME OF BADGE'! Good luck on your journey!");
	    // Turn off the avatar panels (switch back to pokeball images)
	    $(".ai-avatar").html("");
	    // Award Badge (Badge appears middle of screen, fades out, fades in at the badge case)
	    $("#award-game-badge").removeClass("hide");
	    $("#award-game-badge img").addClass("tada");
*/
	  }
	  
		function tieGameCheck() {
			console.log("tieGameCheck()");
	    // Loop over each of the cells in gameBoard
	    for (var cell in cellValues) {
	      // If any of the cell's states are 0
	      if (cellValues[cell] == 0) {
	        console.log("Not a tie");
	        return false;
	      }
	    }
	    console.log("We have a tie");
	    gameLostOrTied("tied");
	    return true;
	  }
	
	/*AI SmartStart This function gets AI to make optimal first moves */
	
	
	  function aiSmartStart() {
	  	console.log("aiSmartStart()");
	  	var smartStartMoves;
	  	
	    // This determines state of the board in order to distinguish between first and second move of game
	    var cellStateTotal = sumCellValues();
	    
	    switch (cellStateTotal) {
	      case 1:
	      	var edgeMove = [cellValues.b1, cellValues.a2, cellValues.c2, cellValues.b3].indexOf(1);
	        if (cellValues.b2 == 1) { //if human player moved in middle, challenger should move in corner
	          smartStartMoves = ["a1", "a3", "c1", "c3"];
	        } else if (edgeMove != -1) { //if human player moved on edge
	        	switch (edgeMove) { //move in corner next to edgeMove
	        		case 0:
	        			smartStartMoves = ["a1", "c1"];
	        			break;
	        		case 1:
	        			smartStartMoves = ["a1", "a3"];
	        			break;
	        		case 2: 
	        			smartStartMoves = ["c1", "c3"];
	        			break;
	        		case 3:
	        			smartStartMoves = ["a1", "c3"];
	        			break;
	        	}
	        } else { //if human player moved in corner, challenger should move in middle
	          smartStartMoves = ["b2"];
	        }
	        break;
        case 0: //if human player hasn't moved at all
          smartStartMoves = ["a1", "a3", "b2", "c1", "c3"];
          break;
        default:
          return false;
	    }
			
			marqueeMessage(randomPick(dialogue.start), "speak");
      makeMove("challenger", randomPick(smartStartMoves));
      console.log("Making a starting move");
      return true;
	  } // end aiSmartStart()
	
	
	  /* AI SMART MOVE
	  Primary logic for AI's turn. Based off of the parameter passed to this function,
	  the AI knows when it can WIN, BLOCK, or make a SETUP.
	  =========================================================================== */
	  function aiSmartMove(moveType, unbeatable) {
	  	console.log("aiSmartMove("+moveType+", "+unbeatable+")");
	  	var emptyCells = [];
	    // Loop through each of the Trio Variables.
	    for (var trio in trioVariables) {
	      // If the value of the current iteration is: (8 for WIN), (2 for BLOCK), (4 for SETUP)
	      if (trioVariables[trio] == moveType) {
	        // Create an array of empty cells
	        console.log("money trio found: "+trio+", "+moveType);
	        console.log(emptyCells);
	        console.log(findEmptyCells(trio));
	        emptyCells = emptyCells.concat(findEmptyCells(TRIO_CELLS[trio]));
	        console.log("new array of empty cells: "+emptyCells);
	      }
	    }
	    if (unbeatable) {
	    	emptyCells = useDoubleValues(emptyCells);
	    	console.log("making a double? "+emptyCells);
	    }
	    console.log("final empty cells to choose from: "+emptyCells);
	    if (emptyCells.length > 0) {
	    	marqueeMessage(randomPick(dialogue[moveType]), "speak");
	    	makeMove("challenger", randomPick(emptyCells));
	    	console.log("making a "+moveType+" move");
	    	return true;
	    } else {
	    	return false;
	    }
	  } // end aiSmartMove()
	
	  /* AI LOGIC - RANDOM MOVE
	  Makes a random play on board, based on number of available empty cells.
	  =========================================================================== */
	  function aiRandomMove() {
	  	console.log("aiRandomMove()");
	    // Create an array of empty cells, and variable to hold number of empty cells
	    var emptyCells = findEmptyCells();
	    
	    marqueeMessage(randomPick(dialogue.random), "speak");
	    makeMove("challenger", randomPick(emptyCells));
	
	    console.log("Making a RANDOM move");
	  }
	  
	  function aiMove(level) {
	  	console.log("aiMove("+level+")");
	  	if (
	  		!([6,7].indexOf(level) != -1 && aiSmartStart()) && //try smartStart on appropriate ai level
	  		!([1,2,4,5,6,7].indexOf(level) != -1 && aiSmartMove(WIN)) && //try win on appropriate ai level
	  		!([3,4,5,6,7].indexOf(level) != -1 && aiSmartMove(BLOCK)) && //try block on appropriate ai level
	  		!([7].indexOf(level) != -1 && aiSmartCounter()) && //unbeatable second ai move
	  		!([7].indexOf(level) != -1 && aiSmartMove(SETUP, true)) && //make unbeatable setup move
	  		!([2,5,6].indexOf(level) != -1 && aiSmartMove(SETUP)) //try setup on appropriate ai level
	  		) {
	  			aiRandomMove(); //make random move is no better move available
	  	}
	  } // end aiMove()
	  
	  function aiSmartCounter() {
	  	console.log("aiSmartCounter()");
	  	var cellTotal = sumCellValues();
	  	var playerMoves = getKeysByValue(cellValues, PLAYER_VAL);
	  	var challengerMoves = getKeysByValue(cellValues, CHALLENGER_VAL);
	  	
	  	switch (cellTotal) {
	  		case 5: // third move of game (challenger went first)
	  			if (CORNERS.indexOf(challengerMoves[0]) != -1) { //if challenger first moved in corner
		  			if (EDGES.indexOf(playerMoves[0]) != -1) { //if player first moved in edge
		  				console.log("making a type 1 counter move");
		  				makeMove("challenger", CENTER[0]); //move in center
		  			} else if (CORNERS.indexOf(playerMoves[0]) != -1) { //if player first moved in corner
		  				console.log("making a type 2 counter move");
		  				makeMove("challenger", randomPick(findEmptyCells(CORNERS))); //move in either free corner
		  			} else { //if player first moved in center
		  				//move in opposite corner from first move
		  				if (TRIO_CELLS.d1.indexOf(challengerMoves[0]) != -1) { // if challenger first moved in a d1 corner
		  					console.log("making a type 3 counter move");
		  					makeMove("challenger", findEmptyCells(TRIO_CELLS.d1)[0]);
		  				} else { //if challenger first moved in a d2 corner
		  					console.log("making a type 3 counter move");
		  					makeMove("challenger", findEmptyCells(TRIO_CELLS.d2)[0]);
		  				}
		  			}
	  			} else { //if challenger first moved in center
	  				if (EDGES.indexOf(playerMoves[0]) != -1) { //if player first moved in edge
	  					console.log("making a type 4 counter move");
	  					makeMove("challenger", randomPick(CORNERS));
	  				} else { //if player first moved in corner
	  					return false;
	  				}
	  			}
	  			marqueeMessage(randomPick(dialogue.counter), "speak");
	  			return true;
	  		case 6: // fourth move of game (player went first)
	  			if (cellValues[CENTER[0]] == 4) { // if player first move was corner
	  				if (findEmptyCells(EDGES).length == 4) { //if player second move was corner
	  					console.log("making a type 6 counter move");
	  					makeMove("challenger", randomPick(EDGES));
	  				} else { // if player second move was edge
	  					var cornerMove = CORNERS.find(function(element) {
	  						return playerMoves.indexOf(element) != -1;
	  					});
	  					var edgeMove = EDGES.find(function(element) {
	  						return playerMoves.indexOf(element) != -1;
	  					});
	  					var doubleBlock = findEmptyCells(CORNERS).find(function(element) { //find cell that blocks both player's corner move and edge move
	  						for (var trio in TRIO_CELLS) {
	  							if (["c1", "c3", "r1", "r3"].indexOf(trio) != -1 && TRIO_CELLS[trio].indexOf(cornerMove) != -1 && TRIO_CELLS[trio].indexOf(element) != -1) { //if trio is an appropriate row or column and includes both element and player's corner move
	  								for (var trio2 in TRIO_CELLS) {
			  							if (["c1", "c3", "r1", "r3"].indexOf(trio2) != -1 && TRIO_CELLS[trio2].indexOf(edgeMove) != -1 && TRIO_CELLS[trio2].indexOf(element) != -1) { //if trio2 is an appropriate row or column and includes both element and player's edge move
			  								return true; //returning .find callback, not aiSmartCounter()
			  							}
			  						}
	  							}
	  						}
	  						return false; //returning .find callback, not aiSmartCounter()
	  					});
	  					console.log("making a type 7 counter move.  doubleBlock: "+doubleBlock);
	  					makeMove("challenger", doubleBlock);
	  				}
	  			} else { //player first move was in edge
	  				console.log("making a type 8 counter move");
	  				makeMove("challenger", CENTER[0]);
	  			}
	  			marqueeMessage(randomPick(dialogue.counter), "speak");
	  			return true;
	  		default:
	  			return false;
	  	}
	  } // end aiCounterMove()
	  
	  function useDoubleValues(array) { //takes array of cells and returns the array with only the duplicate values, else the same array if not duplicate values
	  console.log("useDoubleValues("+array+")");
	  	var dupVals = [];
	  	for (var i in array) {
	  		if (count(array, array[i]) > 1 && dupVals.indexOf(array[i]) == -1) {
	  			console.log("double value: "+[array[i]]);
	  			dupVals.push(array[i]);
	  		}
	  	}
	  	console.log("doubleVales returning: "+dupVals.length == 0 ? array : dupVals);
	  	return dupVals.length == 0 ? array : dupVals;
	  }
	  
	  /* AI TURN Control
	    - Calls appropriate level AI, depending upon badges earned by player.
	    - Controls the amount of time that AI takes to make turn.
	  =========================================================================== */
	  function aiTurnControl() {
	  	console.log("aiTurnControl()");
	    // Create a random amount of time between 4000ms and 8000ms
	    var turnTimeMin = 2000;
	    var turnTimeVariation = 4000;
	    var randomTurnTime = randomPick([Math.floor(Math.random() * turnTimeVariation), 0]) + turnTimeMin;
	
	    if (randomTurnTime > 3000) {
	      setTimeout(function() {
	        marqueeMessage(randomPick(dialogue.thinking), "speak");
	      }, 1000);
	    }
	    console.log("* turnTime: "+ randomTurnTime);
	    setTimeout(function () {
	      console.log("moving: " + Date.now());
	      aiMove(currentGym);
	    }, randomTurnTime);
	  } // end aiTurnControl()
	  
	  
	  /* PLAYER TURN
	    - Handler and logic for player's cell clicks
	  =========================================================================== */
	  $(".gameboard__cell").on("click", function() {
	  	console.log("cell clicked");
	  	$(this).blur().prop("disabled", true);

	    makeMove("player", $(this).data().cell);
	  });
	  
	  function switchActivePanels(activePlayer) {
	  	console.log("switchActivePanels("+activePlayer+")");
	    $(".marquee__avatar-box").removeClass("marquee__avatar-box--active");
	    $("#marquee__avatar-box--" + activePlayer).addClass("marquee__avatar-box--active");
	  }
	  
	  function setChallengerPokemon() {
	  	console.log("setChallengerPokemon()");
	  	var evolutionStage = Math.floor(currentGym / 2);
	  	
  		playerAdvantage = Math.floor(Math.random() * 2) === 0 ? "advantage" : "disadvantage"; // coin flip
	  	
	  	challengerPokemon = POKEMON[POKEMON[playerStarterPokemon][playerAdvantage]].evolution[evolutionStage];
	  	console.log("challenger pokemon is "+challengerPokemon);
	  }
	  
	  function beginGame() {
	  	console.log("beginGame()");
	  	updatePlayerPokemon();
	  	setChallengerPokemon();
	  	updateTrioVariables();
	  	
	  	dialogue = {
  			thinking: [
  				"Hmm... what should I do", 
  				"Let me think a second",
  				"You're better than I thought",
  				"Let's see here...",
  				"What do you think, " + challengerPokemon,
  				"This is a tough one"
  			],
  			start: [
  				"Let's do this, " + challengerPokemon,
  				"Start it right, " + challengerPokemon,
  				challengerPokemon + ", show them who's boss!",
  				"This is going to be easy"
  			],
  			8: [ //win
  				"Go for the win, " + challengerPokemon + "!",
  				"We've got this, " + challengerPokemon,
  				"It's over, " + playerName, 
  				"I knew this would be easy",
  				"It feels good to win",
  				"Better luck next time, " + playerName + "!"
  				],
  			counter: [
  				"You know what to do, " + challengerPokemon,
  				"Remember your training, " + challengerPokemon,
  				"Get 'em back, " + challengerPokemon,
  				"Play smart, " + challengerPokemon
  				],
  			2: [ // block
  				"Keep a sharp eye, " + challengerPokemon,
  				"Don't let them win, " + challengerPokemon,
  				"We need to block them!",
  				"I see what you're doing there",
  				"You won't win that easy, " + playerName
  				],
  			4: [ //setup
  				"Think ahead, " + challengerPokemon,
  				"I'm going to try to be sneaky",
  				"Let's see how you handle this!"
  				],
  			random: [
  				challengerPokemon + ", give it your best shot",
  				"I'm trusting you, " + challengerPokemon,
  				"Make it a good one, " + challengerPokemon,
  				"Go for it, " + challengerPokemon
  				]
  		};
	  	
	  	var challengerAdvantage = playerAdvantage === "advantage" ? "a disadvantage." : "an advantage.";
	  	
	  	var advantageMessage = "Challenger " + CHALLENGERS()[currentGym].name + "'s " + challengerPokemon + " has " + challengerAdvantage;
	  	
	  	marqueeMessage(advantageMessage, "announce", whoGoesFirst);
	  	
	  	function whoGoesFirst() {
	  		console.log("whoGoesFirst()");
	  		var gameTurn;
	  		if (playerAdvantage === "advantage") {
		  		marqueeMessage("You go first!", "announce");
		  		gameTurn = "player";
		  	} else {
		  		marqueeMessage(CHALLENGERS()[currentGym].name + " goes first.", "announce");
		  		gameTurn = "challenger";
		  	}
		  	
		  	setTimeout(function() {
		  		setGameTurn(gameTurn);
		  		$("#gameboard").removeClass("animated fadeIn");
		  	}, 3000);
	  	}

	  }
	  
	  function marqueeMessage(message, speakOrAnnounce, callback) {
	  	console.log("marqueeMessage("+message+", "+speakOrAnnounce+")");
	  	console.log(Date.now());
	  	var onClasses;
	  	var offClasses;
	  	
	  	if (speakOrAnnounce === "announce") {
	  		onClasses = "animated bounceInRight";
	  		offClasses = "animated bounceOutLeft";
	  	} else {
	  		onClasses = "speak";
	  		offClasses = "unspeak";
	  	}
      
      console.log("* add on class: "+Date.now()+message);
      clearTimeout(msgTimer); //cancel any previous "off" animation
	  	$("#marquee__dialogue__text").off(ANIMATION_END).finish().removeClass("animated bounceInRight bounceOutLeft speak unspeak").text(message).addClass(onClasses).one(ANIMATION_END, function(){ //cancel any previous "off" animation before adding new one
	  	  console.log("* remove on class: "+Date.now()+message);
	  			$(this).removeClass(onClasses).off(ANIMATION_END);
	  		});
	  	
	  	msgTimer = setTimeout(function() {
	  	  console.log("* add off class: "+Date.now()+message);
	  		$("#marquee__dialogue__text").addClass(offClasses).one(ANIMATION_END, function() {
	  		  console.log("* remove off class: "+Date.now()+message);
	  			$(this).removeClass(offClasses).text("");
	  			if (callback) {
		  			callback();
		  		}
	  		});
	  	}, 2500);
	  	
	  	
	  }
	  
	  function setGameTurn(activePlayer) {
	  	console.log("setGameTurn("+activePlayer+")");
	  	gameTurn = activePlayer;
	  	switchActivePanels(activePlayer);
	  	console.log("cellValues: "+cellValues);
	  	if (activePlayer == "player") {
	  		for (var cell in cellValues) {
	  			if (cellValues[cell] == 0) {
	  				console.log("enabling cell "+cell);
	  				$( "#gameboard__cell--" + cell ).prop( "disabled", false ); //enable empty cells
	  			}
	  		}
	  	} else {
	  		$( ".gameboard__cell" ).prop( "disabled", true ); //disable all cells
	  		if (activePlayer == "challenger") {
	  		    aiTurnControl();
	  		} else {
	  		  $(".marquee__avatar-box").removeClass("marquee__avatar-box--active");//remove green indicator on avatars
	  		}
	  	}
	  }
	  
	  function makeMove(player, cell) {
	  	console.log("makeMove("+player+", "+cell+")");
	  	var value;
	  	var pokemon;
	  	var delay;
	  	if (player === "player") {
	  		value = PLAYER_VAL;
	  		pokemon = playerCurrentPokemon.toLowerCase();
	  		delay = 0;
	  	} else if (player === "challenger") {
	  		value = CHALLENGER_VAL;
	  		pokemon = challengerPokemon.toLowerCase();
	  		delay = 700; //so move is made after dialogue
	  	}
	  	
	  	setTimeout(function() {
  	  	//update value in virtual gameboard
  	  	cellValues[cell] = value;
  	  	//add pokemon icon to visual gameboard
  	  	$("#" + cell).addClass("animated pokemon--bounce pokemon pokemon--" + pokemon).one(ANIMATION_END, function() {
  	  	  $(this).removeClass("animated pokemon--bounce").addClass("pokemon--wiggle").off(ANIMATION_END);
  	  	});
  	  	
  	  	finalizeMove(player);
	  	}, delay)
	  }
	  
	  function randomPick(array) {
	    console.log("randomPick("+array+")");
	  	return array[Math.floor(Math.random() * array.length)];
	  }
	  
	  function count(array, element) {
	  	console.log("count("+array+", "+element+")");
	  	var count = 0;
	  	for (var i in array) {
	  		if (element == array[i]) {
	  			count++;
	  		}
	  	}
	  	console.log("count: "+count);
	  	return count;
	  }
	  
	  function sumCellValues() {
	  	console.log("function sumCellValues()");
	  	var sum = 0;
	  	for (var cell in cellValues) {
	      sum += cellValues[cell];
	    }
	    console.log("sum: "+sum);
	    return sum;
	  }
	  
	  function getKeysByValue(obj, val) {
	  	console.log("getKeyByValue("+obj+", "+val+")");
	  	var keys = [];
	  	for( var key in obj ) {
				if( obj[key] == val ) {
				  keys.push(key);
				}
    	}
    	return keys;
	  }
	  
	  function fadeOutGameboard() {
	    console.log("fadeOutGameboard()");
	    $("#gameboard").addClass("animated fadeOut").one(ANIMATION_END, function() {
        $(".pokemon").attr("class", "");
        $(this).removeClass("animated fadeOut").addClass("u-hidden").off(ANIMATION_END);
      });
	  }
	  
	  function lostOrTiedAnimation(lostOrTied, trio) {
	    console.log("lostOrTiedAnimation("+lostOrTied+", "+trio+")");
	    
	    var $queueObj = $({});
	    
	    $(".pokemon").removeClass("pokemon--wiggle"); 
	    $("#game-end-wordart").removeClass("u-hidden");
	    
	    $queueObj
	      .delay(350, "lostOrTiedAnimation")
	      .queue("lostOrTiedAnimation", function(next) {
	        var wordLength = $("#game-end-wordart__element--"+lostOrTied+" > .letter-container").length;
	        var delay = 100;
	        
	        $("#game-end-wordart__element--"+lostOrTied+" .letter__element").each(function(i, e) {
	          console.log("index: "+i);
	          setTimeout(function() {
	            console.log("setTimeout index: "+i);
	            console.log($(e));
              $(e).removeClass("u-hidden").addClass("wordart__element--bounceInOut").one(ANIMATION_END, function() {
                $(this).removeClass("wordart__element--bounceInOut").addClass("u-hidden").off(ANIMATION_END);
              });
            }, delay * i, e);
	        });
	        /*
          function lostOrTiedWordartAnimation(lostOrTied, index, delay) {
            console.log("lostOrTiedWordartAnimation("+lostOrTied+", "+index+", "+delay+")");
            setTimeout(function() {
              $("#"+lostOrTied+"__element--"+index).removeClass("u-hidden").addClass("wordart__element--bounceInOut").one(ANIMATION_END, function() {
                $(this).removeClass("wordart__element--bounceInOut").addClass("u-hidden").off(ANIMATION_END);
              });
              if (index < 7) {
                lostOrTiedWordartAnimation(lostOrTied, index + 1, delay + initialDelay );
              }
            }, delay);
          }*/
	        setTimeout(fadeOutGameboard, 4000);
	         //next();
	      });
	      
	      $queueObj.dequeue("lostOrTiedAnimation");
	  }
	  
	  
	  function victoryAnimation(trio, gameWon) {
	    console.log("victoryAnimation("+trio+", "+gameWon+")");
	    var viewWidth = document.documentElement.clientWidth;
	    var gradientSlowLoc = (viewWidth / 2) + (viewWidth / 10) + 100;
	    var gradientFastLoc = gradientSlowLoc + (viewWidth / 15);
	    var gradientFinalLoc = viewWidth + 200;
	    var gradientSpeed0 = viewWidth * 150 / 1000 + 150;
	    var gradientSpeed1 = 1000;
	    var gradientSpeed2 = viewWidth * 40 / 1000 + 150;
	    //var wordartDelay = gradientSpeed0 / gradientSlowLoc * ((viewWidth - 230) / 2 + 125);
	    //var wordartSpeed = gradientSpeed0 / gradientSlowLoc * 230;
	    //var gradientLocs = [gradientSlowLoc, gradientFastLoc, gradientFinalLoc];
	    //var gradientSpeeds = [gradientSpeed0, gradientSpeed1, gradientSpeed2];
	    var $victoryTrio = $("#"+TRIO_CELLS[trio][0]+", #"+TRIO_CELLS[trio][1]+", #"+TRIO_CELLS[trio][2]);
	    var $queueObj = $({});
	    
	    $(".pokemon").removeClass("pokemon--wiggle"); 
	    
	    $queueObj
	      .delay(350, "victoryAnimation")
	      .queue("victoryAnimation", function(next) {
	         $victoryTrio.addClass("pokemon--victoryGrow");
	         
	         setTimeout(function() {
	           $("#gameboard").addClass("animated fadeOut").one(ANIMATION_END, function() {
	             $(".pokemon").attr("class", "");
	             $(this).removeClass("animated fadeOut").addClass("u-hidden").off(ANIMATION_END);
	           });
	         }, 4000);
	         next();
	      })
	      .delay(1000, "victoryAnimation")
	      .queue("victoryAnimation", function(next) {
	        for (var cell in cellValues) {
	          if (TRIO_CELLS[trio].indexOf(cell) == -1) { //cell isn't in winning trio
	            if (cellValues[cell] == PLAYER_VAL) {
	              $("#"+cell).addClass("pokemon--rotateLeft");
	            } else if (cellValues[cell] == CHALLENGER_VAL) {
	               $("#"+cell).addClass("pokemon--rotateRight");
	            }
	            $("#pokemon-container--"+cell).addClass("pokemon-container--fadeOutDown");
	          }
	        }
	        
	        $(".pokemon").not($victoryTrio).last().one(ANIMATION_END, next);
	      })
	      .queue("victoryAnimation", function(next) {
	         $(".pokemon").not($victoryTrio).last().off(ANIMATION_END);
	         $(".pokemon").not($victoryTrio).attr("class", "");
	         $(".pokemon-container").removeClass("pokemon-container--fadeOutDown");
	         if (gameWon) {
	           next();
	         } else {
	           $queueObj.clearQueue("victoryAnimation");
	         }
	      })
	      .queue("victoryAnimation", function(next) {
	        $("#game-end-wordart__element--victory, #game-end-wordart").removeClass("u-hidden");
	        $(".victory-container").css({"transition-duration": gradientSpeed0 + "ms"}).addClass("victory-container--showing");
	        
	         $("#victory-gradient--r").css({transform: "translate(-"+gradientSlowLoc+"px)", "-webkit-transform": "translate(-"+gradientSlowLoc+"px)", "transition-duration": gradientSpeed0 + "ms", "-webkit-transition-duration": gradientSpeed0 + "ms"});
	         console.log($("#victory-gradient--r").attr("style"));
	         console.log(Date.now());
	         console.log(event);
	         $("#victory-gradient--l").css({transform: "translate("+gradientSlowLoc+"px)", "-webkit-transform": "translate("+gradientSlowLoc+"px)", "transition-duration": gradientSpeed0 + "ms", "-webkit-transition-duration": gradientSpeed0 + "ms"}).one(TRANSITION_END, next);
	      })
	      .queue("victoryAnimation", function(next) {
	         $("#victory-gradient--r").css({transform: "translate(-"+gradientFastLoc+"px)", "-webkit-transform": "translate(-"+gradientFastLoc+"px)", "transition-duration": gradientSpeed1 + "ms", "-webkit-transition-duration": gradientSpeed1 + "ms"});
	         console.log($("#victory-gradient--r").attr("style"));
	         console.log(Date.now());
	         console.log(event);
	         $("#victory-gradient--l").off(TRANSITION_END).css({transform: "translate("+gradientFastLoc+"px)", "-webkit-transform": "translate("+gradientFastLoc+"px)", "transition-duration": gradientSpeed1 + "ms", "-webkit-transition-duration": gradientSpeed1 + "ms"}).one(TRANSITION_END, next);
	      })
	      .queue("victoryAnimation", function(next) {
	         $("#victory-gradient--r").css({transform: "translate(-"+gradientFinalLoc+"px)", "-webkit-transform": "translate(-"+gradientFinalLoc+"px)", "transition-duration": gradientSpeed2 + "ms", "-webkit-transition-duration": gradientSpeed2 + "ms"});
	         console.log($("#victory-gradient--r").attr("style"));
	         console.log(Date.now());
	         console.log(event);
	         $("#victory-gradient--l").off(TRANSITION_END).css({transform: "translate("+gradientFinalLoc+"px)", "-webkit-transform": "translate("+gradientFinalLoc+"px)", "transition-duration": gradientSpeed2 + "ms", "-webkit-transition-duration": gradientSpeed2 + "ms"}).one(TRANSITION_END, next);
	      })
	      .queue("victoryAnimation", function(next) {
	         $("#victory-gradient--r, #victory-gradient--l").off(TRANSITION_END).css({transform: "", "-webkit-transform": "", "transition-duration": "", "-webkit-transition-duration": ""});
	         next();
	      })
	      .delay(1000, "victoryAnimation")
	      .queue("victoryAnimation", function(next) {
	         $("#game-end-wordart__element--victory").addClass("animated fadeOutDown").one(ANIMATION_END, next);
	      })
	      .queue("victoryAnimation", function(next) {
	         $("#game-end-wordart__element--victory, #game-end-wordart").addClass("u-hidden").removeClass("animated fadeOutDown").off(ANIMATION_END);
	         $(".victory-container").css({"transition-duration": ""}).removeClass("victory-container--showing");
	         next();
	      })
	      .delay(500, "victoryAnimation")
	      .queue("victoryAnimation", function() {
          console.log("badge earned?: "+ (earnedBadges.indexOf(currentGym) == -1));
          console.log("earnedBadges: "+earnedBadges);
          console.log("gym: "+currentGym);
          if (earnedBadges.indexOf(currentGym) == -1) {
            victoryDialogue();
          } else {
           endGame();
          }
	      });
	      
      $queueObj.dequeue("victoryAnimation");
	    
	    /* doesn't work.  not sure why.
	    for (var i=0; i < 3; i++) {
	      $("#victory-gradient--r").queue(function(next) {
	        $(this).css({transform: "translate(-"+gradientLocs[i]+"px)", "-webkit-transform": "translate(-"+gradientLocs[i]+"px)", "transition-duration": gradientSpeeds[i] + "ms", "-webkit-transition-duration": gradientSpeeds[i] + "ms"}).one(TRANSITION_END, next);
	      });
	    }
	    */
	  } //end victoryAnimation(trio)
	  
	  function victoryDialogue() {
	    console.log("victoryDialogue()");
	    
	    marqueeMessage(CHALLENGERS()[currentGym].victoryMessages[0], "speak", function() {
	      marqueeMessage(CHALLENGERS()[currentGym].victoryMessages[1], "speak", function() {
  	      marqueeMessage(CHALLENGERS()[currentGym].victoryMessages[2], "speak", function() {
    	      marqueeMessage(CHALLENGERS()[currentGym].victoryMessages[3], "speak", awardBadge);
  	      });
	      });
	    });
	  }
	  
	  function awardBadge() {
      earnedBadges.push(currentGym);
    
      var badgeTopPosition = $("#badge__icon--" + currentGym).offset().top;
        var centerTopPosition = $('.screen-center').offset().top;
        var badgeLeftPosition = $("#badge__icon--" + currentGym).offset().left;
        var centerLeftPosition = $('.screen-center').offset().left;
    
        var awardBadgeCss = {
          top: centerTopPosition - badgeTopPosition - 15, //15 is half the screen-center width
          left: centerLeftPosition - badgeLeftPosition - 15,
          transform: "",
          animation: "",
        };
    
      var unAwardBadgeCss = {
        top: "",
        left: "",
        animation: "",
        transform: "",
        transition: "transform 750ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }
      
      var translateValue = "translate3d("+awardBadgeCss.left+"px, "+awardBadgeCss.top+"px, 0px)"
        
      var transformBadge = {
        top: "",
        left: "",
        animation: "none",
        transform: translateValue + " scale(4.5)",
      }
      
      var bigBadgeActive = {
        transition: "all 50ms ease-in",
        transform: translateValue + " scale(4.5)",
      }
      
      function bigBadgeHoverFn() {
        $(this).one(ANIMATION_END, function() {
          $(this).css(transformBadge).off(ANIMATION_END);
        });
      }
      
      function bigBadgeUnhoverFn() {
        if ($(this).hasClass("badge__icon--big")) {
          $(this).css(awardBadgeCss);
        }
      }
      
    function badgeWon(badgeNum) {
    $("img", "#badge__icon--" + badgeNum).addClass("u-invisible");
    $("#badge__icon--" + badgeNum).removeClass("u-invisible");
    $("#badge__shimmer--" + badgeNum).addClass("u-invisible");
    
    
    
    $("#badge__icon--" + badgeNum).css(awardBadgeCss).addClass("animated zoomInDown badge__icon--big").one(ANIMATION_END, function() {
      $(this).off(ANIMATION_END).removeClass("animated zoomInDown").addClass("badge__icon--hang").mouseenter( bigBadgeHoverFn ).mouseleave( bigBadgeUnhoverFn ).one("mousedown", function() {    $(this).css(bigBadgeActive).removeClass("badge__icon--big badge__icon--hang").off("mousedown");
      }).one("mouseup", function() {
        $(this).off("mouseup").css(unAwardBadgeCss).one(TRANSITION_END, function() {
          $(this).off(TRANSITION_END);
          $("img", ".badge__icon").removeClass("u-invisible");
          $(".badge__shimmer").removeClass("u-invisible");
    
          badgeShimmer(currentGym);
          setTimeout(function() {
            endGame();
          }, 1000);
        });
      });
    });
    
    }
    
    badgeWon(currentGym);
    } //end awardBadge()
	  
	} // end playGame();
	
	function endGame() {
	  console.log("endGame()");
	  $("#marquee").removeClass("marquee--drop").one(TRANSITION_END, function() {
	    $(this).off(TRANSITION_END);
	    $("#marquee__dialogue").removeClass("marquee__dialogue--swingHinge");
	    $("#marquee").addClass("u-hidden");
	    $(".gameboard__cell").off("click");
	    $("#avatar--challenger").removeClass("avatar--challenger-" + currentGym);
	    $("#challengers").show();
	    showChallengers();
	  });
	  
	}
	
	/*this function moves the gradient image across the badge to create the shimmer*/
  function badgeShimmer(badgeNum){
    $("#badge__icon--" + badgeNum + " > span").stop();
     $("#badge__icon--" + badgeNum + " > span").css('background-position', '-40px -40px').animate({'background-position': '38px 38px'}, 450);
  }
  
  $(".badge__screen").mouseenter(function() {
    badgeShimmer($(this).data().badgenumber);
  });
	
	
    
    splashAnimation();
    $("body").one('click', oak1);//first oak dialogue screen
    
	
}); // end document.ready function
