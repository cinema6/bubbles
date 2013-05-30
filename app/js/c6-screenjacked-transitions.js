// TRANSITIONS //
    var startScreen     = $("#startScreen"),
        inputScreen     = $("#inputScreen"),
        transition      = $(".transition_blackFade"),
        tl_startInput   = new TimelineLite({paused: true}),
        tl_expVid       = new TimelineLite({paused: true}),
        videoPlayer     = document.getElementById("player");


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


    tl_expVid.to(inputScreen, 2, {onComplete: console.log("Input fades"), alpha: 0})
                 .to(transition, 2, {onComplete: console.log("Fade in black"), opacity: 1}, "-=1")
                 .to(inputScreen, 0.5, {onComplete: console.log("display none on input"), display: "none"})
                 .to(videoPlayer, 2, {onComplete: console.log("Fade in Video"), opacity: 1}, "-=0.75")

    //transition ot video
    $(".btn_start").click(function(e) {
        tl_expVid.play();
        e.preventDefault();
        videoPlayer.delay(4500).play();
    });

    