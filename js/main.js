'use strict';

//detect IE
var isIE = /*@cc_on!@*/false || !!document.documentMode;
if (isIE) {
	document.body.innerHTML = "<p class='browserupgrade'>You are using an <strong>outdated</strong> browser. This game is only playable with <a href='http://browsehappy.com/'>an upgraded browser</a>.</p>";
}

const TRANSITION_END = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
const ANIMATION_END = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";

const CHALLENGERS = ["Brock", "Misty", "Lt. Surge", "Erika", "Koga", "Sabrina", "Blaine", "Giovanni"];
const POKEMON = {
    "Bulbasaur": {
        type: "grass",
        advantage: "Squirtle",
        disadvantage: "Charmander",
        evolution: [
            "Bulbasaur",
            "Ivysaur",
            "Venusaur",
            "Mega Venusaur"
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
            "Mega Charizard"
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
            "Mega Blastoise"
            ]
    }
}

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
	var playerStarterPokemon;
	var playerType;
	var currentGym;
	var earnedBadges = [];
	var animateBackground; //a setInterval function
	
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
    $('body').on("touchstart", setMobileSettings);
    
    //load overworld background image
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
        background.id = "overworld";
        background.className = "overworld";
        background.onload = resolve;
        $("#view").prepend(background);
        $("#overworld").attr('alt', "A map of the Pokemon world in the background")
        
    }) // then set horizontal scrolling animation
        .then(function() {
        
    	var backgroundScrollSpeed = 150;//higher number is slower
    	var backgroundTiming; //time in ms for full scroll of one direction
    	var backgroundMargin; //number of horizontal pixels to scroll each direction
    	
    	function updateBackgroundTiming() {	//triggered on load and resize.  also starts/restarts animation
    		backgroundMargin = Math.floor($("#overworld").width() - document.documentElement.clientWidth);
    		backgroundTiming = backgroundMargin * backgroundScrollSpeed;
    		
    		var backgroundTransition = "transform "+backgroundTiming+"ms linear"
    		var backgroundTransitionObj = {
    			transition: backgroundTransition,
    			"-webkit-transition": backgroundTransition
    		};
    		
    		$("#overworld").css(backgroundTransitionObj);		
    		
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
    		$("#overworld").css(backgroundTransform)
    	
    		
    		if (!reverse) {
    			setTimeout(function() {
    				animateBackgroundFn(true);	
    			}, backgroundTiming)
    					
    		}
    
    	} // end animateBackgroundFn
    	
    	updateBackgroundTiming()
    	$(window).on("resize", updateBackgroundTiming);
		    	
    	$("#view").addClass("view--gym"); // add gym background image behind pokemon world background

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
		var nameBtn = '<button type="submit" class="button button--green" id="button-player-name">OK</button>';
		var nameForm = "<form id='nameForm'>"+nameInput+nameBtn+"</form>";
		var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+nameForm+'</div>';
		
		$("#modal__content--oak").replaceWith(modalContentOak);
		$("#button-player-name").one('click submit', oak4);
	}
	
	function oak4() {
		console.log("oak4");
		playerName = $("#name-input").val();
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
		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Some gym leaders also offer unique badges to players who can beat them.  See if you can collect all eight!</p>";
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
		$("#button-play").on('click', oak11);
	}
	
	function oak11() {
		console.log("oak11");
		//exit oak modal and enter gamespace
		$("#gamespace").removeClass("u-hidden");
	    $("#button-play").addClass("animated bounceBtn").one(ANIMATION_END, function() {
    		$(this).removeClass("animated bounceBtn");
    		var text = "<p class='modal-text modal-text--oak' id='modal-text'>Good luck!</p>";
			var modalContentOak = '<div class="modal__content modal__content--oak" id="modal__content--oak">'+text+'</div>';
			
			$("#modal__content--oak").replaceWith(modalContentOak);
    		
    		setTimeout(function() {
    			$("#modal").addClass("animated bounceOutDownCenter").one(ANIMATION_END, function() {
    				$(this).hide().removeClass("animated bounceOutDownCenter");
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
		}
		$("#overworld").css(cssVal).one(TRANSITION_END, function() {
			$(this).hide();
		});
		clearInterval(animateBackground);
	}
	//end Oak modal dialogues
	
	function showChallengers() {
		console.log("showChallengers()");
		$("#tray, #challengers").removeClass("u-blurred");
		
		// choosing a challenger
		$(".button--avatar").on("click", function() {
			currentGym = $(this).data().gymnumber;
			$("#marquee").removeClass("u-hidden");
			$("#avatar--challenger").addClass("avatar--challenger-" + currentGym); //add appropriate challenger avatar
			$(this).addClass("animated bounceOutUp").one(ANIMATION_END, function() {
				$(".button--avatar").not(this).addClass("animated fadeOutDown");
				$("#heading--challengers").addClass("animated fadeOutDown").one(ANIMATION_END, function() {
					$("#challengers").hide().addClass("u-blurred");
					$(".button--avatar, #heading--challengers").removeClass("animated fadeOutDown bounceOutUp");
					$("#marquee").addClass("marquee--drop").one(ANIMATION_END, function() {
				        $("#marquee__dialogue").addClass("marquee__dialogue--swingHinge").one(ANIMATION_END, function() {
				        		if (event.animationName === "swingHinge" && event.type === "animationend") {
					            $("#gameboard").removeClass("u-hidden").addClass("animated fadeIn");
					            playGame();
				        		}
				        });
				    });
				});
			});
		});
	} //end showChallengers
	
	function playGame() {
		$("#marquee__dialogue").off(ANIMATION_END);
		console.log("playGame()");
		// Parameters for aiSmartMove function
		const WIN   = 8;
		const BLOCK = 2;
		const SETUP = 4;
		const AI_VAL = 4;
		const PLAYER_VAL = 1;
		
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
		var cellValuesSandbox = Object.assign({}, cellValues);
		var trioVariables     = {};
		var gameTurn;
		var playerCurrentPokemon;
		var playerAdvantage;
		var challengerPokemon;
		
		// remember to empty this on new game
		var blockedTrios = [];
		
		beginGame();
		
		  // Create an return array of all empty cells on gameBoard
		function findEmptyCells() {
			console.log("findEmptyCells()");
		// Initialize an array to hold empty cells
			var emptyCells = [];
			// Loop over each cell in gameBoard, looking for empty cells
			for (var cell in gameBoard) {
			    if (gameBoard[cell] == 0) {
			      // Push empty cells into possiblePlays array
			      emptyCells.push(cell);
			    }
			}
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
	  		r1: cellValues.a1 + cellValues.a2 + cellValues.a3,
	  		r2: cellValues.b1 + cellValues.b2 + cellValues.b3,
	  		r3: cellValues.c1 + cellValues.c2 + cellValues.c3,
	  		c1: cellValues.a1 + cellValues.b1 + cellValues.c1,
	  		c2: cellValues.a2 + cellValues.b2 + cellValues.c2,
	  		c3: cellValues.a3 + cellValues.b3 + cellValues.c3,
	  		d1: cellValues.a1 + cellValues.b2 + cellValues.c3,
	  		d2: cellValues.a3 + cellValues.b2 + cellValues.c1
	  	}
	  }
	  
    function finalizeMove(turnOwner) {
	    console.log("finalizeMove("+turnOwner+")");
	    // Update Trio Variables
	    updateTrioVariables();
	    // Check for victory
	    if (!victoryCheck()) {
	      // If no victory, check for a draw
	      if (!tieGameCheck()) {
	        // If no draw for ai turn, then pass back to player
	        if (turnOwner == "challenger") {
	          playerTurn();
	        }
	        else if (TurnOwner == "player") {
	          // If made move changes value of trio variable to 6, add it to blockedTrios
	          for (var trio in trioVariables) {
	            if (trioVariables[trio] === 6 && blockedTrios.indexOf(trio) === -1) {
	              console.log("ADDED NEW TRIO TO blockedTrios");
	              blockedTrios.push(trio);
	            }
	          }
	          // If no draw for player turn, then pass to AI
	          gameTurn = "challenger";
	          switchActivePanels("challenger");
	          console.log("challenger turn");
	          aiTurnControl();
	        }
	      }
	    }
	  } // end finalizeMove()
	  
	  function playerTurn() {
	  	console.log("playerTurn()");
	    switchActivePanels("player");
	    setTimeout(function() {
	      $("#player-turn-message").removeClass("hide").addClass("bounceIn");
	    }, 100)
	
	    setTimeout(function() {
	      $("#player-turn-message").addClass("bounceOut");
	    }, 1000)
	
	    setTimeout(function() {
	      $("#player-turn-message").addClass("hide").removeClass("bounceIn").removeClass("bounceOut");
	      gameTurn = "player";
	    }, 1000)
	  }// end playerTurn()
	  
	  function updatePlayerPokemon() {
	  	console.log("updatePlayerPokemon()");
	  	//this changes player pokemon to evolved form after badges are earned
	  	var evolutionStage = Math.floor((earnedBadges.length) / 2);
	  	playerCurrentPokemon = POKEMON[playerStarterPokemon].evolution[evolutionStage];
	  }
	  
		function victoryCheck() {
			console.log("victoryCheck()");
	    // Loop over each of the trio variables
	    for (var trio in trioVariables) {
	      // If the current property's value is 3 or 12
	      if (trioVariables[trio] === 3 || trioVariables[trio] === 12) {
	        console.log("We have a winner!");
	
	        gameTurn = "";
	        if (trioVariables[trio] === 12) {
	          console.log("player has lost the game");
	          gameLossOrDraw();
	        }
	        else if (trioVariables[trio] === 3) {
	          console.log("player has won the game");
	          gameWin();
	        }
	        return true;
	      }
	    }
	    return false;
	  } // end victoryCheck()
	  
		function endOfGame() {
			console.log("endOfGame()");
	    resetGameBoard();
	    pokemonSelect();
	  }
	  
	  function gameLossOrDraw(condition) {
	  	console.log("gameLossOrDraw("+condition+")");
	    endOfGame();
	  }
	  
	  function gameWin() {
	  	console.log("gameWin()");
	    badgeCount++;
	    // Hide gameboard-cells
	    $(".game-cells").toggleClass("hide");
	    // Show Dialogue frame
	    $(".gym-dialogue-container").toggleClass("hide");
	    // Dialogue update from GYM leader: Nice job! You've won the "NAME OF BADGE"! Good luck on your journey!
	    $(".gym-dialogue-container p").text("Nice job! You've won the 'NAME OF BADGE'! Good luck on your journey!");
	    // Turn off the avatar panels (switch back to pokeball images)
	    $(".ai-avatar").html("");
	    // Award Badge (Badge appears middle of screen, fades out, fades in at the badge case)
	    $("#award-game-badge").removeClass("hide");
	    $("#award-game-badge img").addClass("tada");
	
	  }
	  
	  function resetGameBoard() {
	  	console.log("resetGameBoard()");
	
	    $(".cell-state").text(0);
	    updateGameBoard();
	    boardViewUpdate(gameBoard);
	    updateTrioVariables();
	    blockedTrios = [];
	    //$(".cell-piece").removeClass("bounceOut")
	  }
	  
		function tieGameCheck() {
			console.log("tieGameCheck()");
	    // Loop over each of the cells in gameBoard
	    for (var cell in gameBoard) {
	      // If any of the cell's states are 0
	      if (gameBoard[cell] == 0) {
	        console.log("Not a tie");
	        return false;
	      }
	    }
	    console.log("We have a tie");
	    gameLossOrDraw();
	    return true;
	  }
	
	/*AI SmartStart This function gets AI to make optimal first moves */
	
	
	  function aiSmartStart() {
	  	console.log("aiSmartStart()");
	    // This determines state of the board in order to distinguish between first and second move of game
	    var cellStateTotal = 0;
	    for (var cell in gameBoard) {
	      cellStateTotal += gameBoard[cell];
	    }
	
	    // if AI is making first move of game
	    if (cellStateTotal == 0) {
	      //move into corner or center
	        var smartStartMoves = ["a1", "a3", "b2", "c1", "c3"];
	        var randomNum = Math.floor(Math.random() * (4 - 0 + 1) + 0);
	        $("."+smartStartMoves[randomNum]).find(".cell-state").text(4);
	        console.log("Making a starting move");
	        finalizeMove("ai");
	      return true;
	    }
	    //if AI is making second move of game (player went first)
	    else if (cellStateTotal == 1) {
	      //if player moved in the middle, AI should move in corner
	      if (gameBoard.b2 == 1) {
	          var smartStartMoves = ["a1", "a3", "c1", "c3"];
	          var randomNum = Math.floor(Math.random() * (3 - 0 + 1) + 0);
	
	          $("."+smartStartMoves[randomNum]).find(".cell-state").text(4);
	          console.log("Making a starting move");
	          finalizeMove("ai");
	        return true;
	      }
	      //if player didn't move in middle, AI should move there
	      else {
	          $(".b2-state").text(4);
	          console.log("Making a starting move");
	          finalizeMove("ai");
	        return true;
	      }
	    }
	    return false;
	  } // end aiSmartStart()
	
	
	  /* AI SMART MOVE
	  Primary logic for AI's turn. Based off of the parameter passed to this function,
	  the AI knows when it can WIN, BLOCK, or make a SETUP.
	  =========================================================================== */
	  function aiSmartMove(moveType) {
	  	console.log("aiSmartMove("+moveType+")");
	    // Loop through each of the Trio Variables.
	    for (var trio in trioVariables) {
	      // If the value of the current iteration is: (8 for WIN), (2 for BLOCK), (4 for SETUP)
	      if (trioVariables[trio] == moveType) {
	        // Create an array of empty cells
	        var emptyCells = findEmptyCells();
	      }
	    }
	
	    /* AI begins making test moves in the empty cells, to see if any of the
	    moves would give it a succesful WIN/BLOCK/SETUP */
	    for (var tryMove in emptyCells) {
	      // THE TEST: Change the current cell's state to a 4
	      $("."+emptyCells[tryMove]+"-state").text(4);
	
	      // Update the virtual gameBoard
	      updateGameBoard();
	
	      // Update trioVariables, based off of the current test the AI is performing.
	      updateTrioVariables();
	
	      // Loop over each of the trio variables
	      for (var trio in trioVariables) {
	
	        /* Based off of the current test, if the current trio variable equals...
	         - 12 when testing for WIN
	         - 6 when testing for BLOCK, AND the current trio hasn't already been blocked
	         - 8 when testing for SETUP
	         ==================================================================== */
	        if (trioVariables[trio] === (moveType + 4) && blockedTrios.indexOf(trio) === -1) {
	          console.log("AI would win/block/setup if it made a move on: " + emptyCells[tryMove]);
	          $("."+emptyCells[tryMove]+"-state").text(4);
	
	          // If move is a BLOCK, add it to blockedTrios so AI ignores it on next BLOCK attempt
	          if (moveType === BLOCK) {
	            $(".ai-dialogue").text("SQUIRTLE, go for the block!");
	            blockedTrios.push(trio);
	          }
	          else if (moveType === WIN) {
	            $(".ai-dialogue").text("SQUIRTLE, finish off that POKEMON!");
	          }
	          else if (moveType === SETUP) {
	            $(".ai-dialogue").text("SQUIRTLE, go for a setup!");
	          }
	
	          finalizeMove("ai");
	          return true;
	        }
	        // If tested play doesn't result in succesful WIN/BLOCK/SETUP, convert back to empty cell
	        else {
	          $("."+emptyCells[tryMove]+"-state").text(0);
	        }
	      }
	    }
	    return false;
	  } // end aiSmartMove()
	
	  /* AI LOGIC - RANDOM MOVE
	  Makes a random play on board, based on number of available empty cells.
	  =========================================================================== */
	  function aiRandomMove() {
	  	console.log("aiRandomMove()");
	    // Create an array of empty cells, and variable to hold number of empty cells
	    var emptyCells = findEmptyCells();
	    var numberOfCells = emptyCells.length - 1;
	
	    // Create a random number between 0 and the number of empty game cells available
	    var randomPlayNum = Math.floor(Math.random() * (numberOfCells - 0 + 1) + 0);
	
	    $("."+emptyCells[randomPlayNum]).find(".cell-state").text(4);
	    console.log("Making a RANDOM move");
	    finalizeMove("ai");
	  }
	  
	  function aiMove(level) {
	  	console.log("aiMove("+level+")");
	  	if ([6,7].indexOf(level) && aiSmartStart()) {
	  		return
	  	} else if ([1,2,4,5,6,7].indexOf(level) != -1 && aiSmartMove(WIN)) {
	  		return
	  	} else if ([3,4,5,6,7].indexOf(level) != -1 && aiSmartMove(BLOCK)) {
	  		return
	  	} else if ([2,5,6,7].indexOf(level) != -1 && aiSmartMove(SETUP)) {
	  		return
	  	} else {
	  		aiRandomMove();
	  	}
	  } // end aiMove()
	  
	  /* AI TURN Control
	    - Calls appropriate level AI, depending upon badges earned by player.
	    - Controls the amount of time that AI takes to make turn.
	  =========================================================================== */
	  function aiTurnControl() {
	  	console.log("aiTurnControl()");
	    // Create a random amount of time between 4000ms and 8000ms
	    var turnTimeMin = 4000;
	    var turnTimeVariation = 4000;
	    var randomTurnTime = Math.floor((Math.random() * turnTimeVariation) + turnTimeMin);
	
	    if (randomTurnTime > 4000) {
	      $(".ai-dialogue").text("Hmmm, what should I do...");
	    }
	
	    setTimeout(function () {
	      aiMove(badgeCount);
	    }, randomTurnTime);
	  } // end aiTurnControl()
	  
	  
	  /* PLAYER TURN
	    - Handler and logic for player's cell clicks
	  =========================================================================== */
	  $(".gameboard__cell").click(function() {
	  	console.log("cell clicked");
	  	$(this).blur().prop("disabled", true);

	  	var clickedCell = $(this).data().cell;
	      // Update the cell's state value to 1
	      cellValues[clickedCell] = PLAYER_VAL;
	      // add pokemon
	      $("#" + clickedCell).addClass("pokemon pokemon--" + playerCurrentPokemon.toLowerCase());
	
	      finalizeMove("player");
	  })
	  
	  function switchActivePanels(activePlayer) {
	  	console.log("switchActivePanels("+activePlayer+")");
	    $(".marquee__avatar-box").removeClass("marquee__avatar-box--active");
	    $("#marquee__avatar-box--" + activePlayer).addClass("marquee__avatar-box--active");
	  }
	  
	  function setChallengerPokemon() {
	  	console.log("setChallengerPokemon()");
	  	var evolutionStage = Math.floor(currentGym / 2);
	  	if (currentGym != 7) {
	  		playerAdvantage = Math.floor(Math.random() * 2) === 0 ? "advantage" : "disadvantage"; // coin flip
	  	} else { // gym 7 challenger always goes first
	  		playerAdvantage = "disadvantage";
	  	}
	  	challengerPokemon = POKEMON[POKEMON[playerStarterPokemon][playerAdvantage]].evolution[evolutionStage];
	  }
	  
	  function beginGame() {
	  	console.log("beginGame()");
	  	updatePlayerPokemon();
	  	setChallengerPokemon();
	  	
	  	var challengerAdvantage = playerAdvantage === "advantage" ? "a disadvantage." : "an advantage.";
	  	
	  	var advantageMessage = "Challenger " + CHALLENGERS[currentGym] + "'s " + challengerPokemon + " has " + challengerAdvantage;
	  	
	  	marqueeMessage(advantageMessage, "announce", whoGoesFirst);
	  	
	  	function whoGoesFirst() {
	  		console.log("whoGoesFirst()");
	  		if (playerAdvantage === "advantage") {
		  		marqueeMessage("You go first!", "announce");
		  		setGameTurn("player");
		  	} else {
		  		marqueeMessage(CHALLENGERS[currentGym] + " goes first.", "announce");
		  		setGameTurn("challenger");
		  	}
	  	}

	  }
	  
	  function marqueeMessage(message, speakOrAnnounce, callback) {
	  	console.log("marqueeMessage("+message+", "+speakOrAnnounce+")");
	  	var onClasses;
	  	var offClasses;
	  	
	  	if (speakOrAnnounce === "announce") {
	  		onClasses = "animated bounceInRight";
	  		offClasses = "animated bounceOutLeft";
	  	} else {
	  		onClasses = "speak";
	  		offClasses = "unspeak";
	  	}

	  	$("#marquee__dialogue__text").text(message).addClass(onClasses).one(ANIMATION_END, function(){
	  			$(this).removeClass(onClasses);
	  		});
	  	
	  	setTimeout(function() {
	  		$("#marquee__dialogue__text").addClass(offClasses).one(ANIMATION_END, function(){
	  			$(this).removeClass(offClasses).text("");
	  			if (callback) {
		  			callback();
		  		}
	  		});
	  	}, 3000);
	  }
	  
	  function setGameTurn(activePlayer) {
	  	console.log("setGameTurn("+activePlayer+")");
	  	gameTurn = activePlayer;
	  	switchActivePanels(activePlayer);
	  	if (activePlayer == "player") {
	  		for (var cell in cellValues) {
	  			if (cellValues[cell] == 0) {
	  				$( "#gameboard__cell--" + cell ).prop( "disabled", false ); //enable empty cells
	  			}
	  		}
	  	} else {
	  		$( ".gameboard__cell" ).prop( "disabled", true ); //disable all cells
	  	}
	  }
	  
	} // end playGame();
	
	
    
    splashAnimation();
    $("body").one('click', oak1);//first oak dialogue screen
    
	
}) // end document.ready function
