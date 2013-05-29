// TRANSITIONS //
    var startScreen     = $(".startScreen"),
        inputScreen     = $(".inputScreen"),
        transition      = $(".transition_blackFade"),
        videoPlayer     = $("#player");         
        tl_startInput   = new TimelineLite({paused: true}),
        tl_inputVid     = new TimelineLite({paused: true});

    // ANIMATIONS //        
    tl_startInput.to(startScreen, 2, {onComplete: console.log("Start leaves"), 
                                      transformOrigin: "0% 0%", 
                                      rotation: "90deg", 
                                      ease: Power3.easeIn, 
                                      alpha: 0})
      .from(inputScreen, 2, {onComplete: console.log("Input comes in"), 
                             transformOrigin: "100% 0%", 
                             rotation: "-90deg", 
                             ease: Power3.easeOut, 
                             alpha: 0,}, "-=0.5")

    //transition to input screen
    $(".category__frame").click(function() {
        tl_startInput.play()
    });

    //transition to start screen
    $(".inputScreen__btnClose").click(function(e) {
        tl_startInput.reverse()
        e.preventDefault();
    });

    tl_inputVid.to(inputScreen, 2, {onComplete: console.log("Input fades"), alpha: 0})
                 .to(transition, 2, {onComplete: console.log("Fade in black"), opacity: 1}, "-=1")
                 .to(inputScreen, 0.5, {onComplete: console.log("display none on input"), display: "none"})
                 .to(videoPlayer, 2, {onComplete: console.log("Fade in Video"), opacity: 1}, "-=0.75")             

    //transition to video
    $(".question__btnStart").click(function(e) {
        tl_inputVid.play();
        e.preventDefault();
    });