// TRANSITIONS //
    var startScreen     = $("#startScreen"),
        inputScreen     = $("#inputScreen"),
        transition      = $(".transition_blackFade"),
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
    $(".thumbnail1").click(function() {
        tl_startInput.play()
    });
    $(".thumbnail2").click(function() {
        tl_startInput.play()
    });
    $(".thumbnail3").click(function() {
        tl_startInput.play()
    });
    $(".thumbnail4").click(function() {
        tl_startInput.play()
    });

    //transition to start screen
    $(".btn_close").click(function(e) {
        tl_startInput.reverse()
        e.preventDefault();
    });


    tl_inputVid.to(inputScreen, 2, {onComplete: console.log("Input fades"), alpha: 0})
                 .to(transition, 2, {onComplete: console.log("Fade in black"), opacity: 1}, "-=1")

    //transition to video
    $(".btn_start").click(function(e) {
        tl_inputVid.play();
        e.preventDefault();
    });