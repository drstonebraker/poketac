'use strict';

$(function() {
    
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
        console.log(background);
        background.src = backgroundSource;
        background.id = "background";
        background.className = "background";
        background.onload = resolve;
        $("#view").prepend(background);
        $("#background").attr('alt', "A map of the Pokemon world in the background")
        
    })
        .then(function() {
        
    	var backgroundScrollSpeed = 150;
    	var backgroundTiming;
    	var backgroundTransition;
    	var backgroundMargin;
    	var animateBackground;
    	
    	function updateBackgroundTiming() {		
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
    
    
	
})
