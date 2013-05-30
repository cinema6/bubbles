// TRANSITIONS //
    var startScreen     = $("#startScreen"),
        inputScreen     = $("#inputScreen"),
        endScreen       = $("#endScreen"),
        transition      = $(".transition_blackFade"),
        tl_startInput   = new TimelineLite({paused: true}),
        tl_expVid       = new TimelineLite({paused: true}),
        tl_vidEnd       = new TimelineLite({paused: true}),
        tl_endVid       = new TimelineLite({paused: true}),
        tl_endStart     = new TimelineLite({paused:true}),
        videoPlayer     = document.getElementById("player");


    // Start-to-Input //        
    tl_startInput.to(startScreen, 2, {transformOrigin: "0% 0%", 
                                      rotation: "90deg", 
                                      ease: Power3.easeIn, 
                                      alpha: 0})
      .from(inputScreen, 2, {transformOrigin: "100% 0%", 
                             rotation: "-90deg", 
                             ease: Power3.easeOut, 
                             alpha: 0,
                             onComplete: console.log("Start-to-Input Loaded 1/5"), 
                             }, "-=0.5")

    //transition to input screen
    $(".thumbnail1").click(function() {
        tl_startInput.play()
    });

    //transition to start screen
    $(".btn_close").click(function(e) {
        tl_startInput.reverse()
        e.preventDefault();
    });

    // Input-to-Vid //     
    tl_expVid.to(inputScreen, 2, {alpha: 0})
                 .to(transition, 2, {opacity: 1}, "-=1")
                 .to(inputScreen, 0.5, {display: "none"})
                 .to(videoPlayer, 2, {onComplete: console.log("Input-to-Vid Loaded 2/5"), opacity: 1}, "-=0.75")

    //transition to video
    $(".btn_start").click(function(e) {
        tl_expVid.play();
        e.preventDefault();
        setTimeout('videoPlayer.play()', 2800);
    });

    // Vid-to-End //  
    tl_vidEnd.to(endScreen, 0.1, {display: "block"})
             .to(videoPlayer, 1.5, {opacity: 0})
             .to(transition, 2, {opacity: 0})
             .to(videoPlayer, 0.1, {display: "none"})
             .to(endScreen, 2, {opacity: 1, onComplete: console.log("Vid-to-End Loaded 3/5")}, "-=2")             


    // automatically transitions when the video ends
    videoPlayer.addEventListener('ended', videoEnd, false);

    function videoEnd() {
      tl_vidEnd.play();
      console.log("Video Ended");
      setTimeout('videoPlayer.currentTime=0;', 5000);      
    }

    // End-to-Vid //  
    tl_endVid.to(endScreen, 2, {opacity: 0})
             .to(videoPlayer, 0.1, {display: "block"})
             .to(transition, 2, {opacity: 1}, "-=2")
             .to(videoPlayer, 2, {opacity: 1}, "-=0.25")
             .to(endScreen, 0.1, {display: "none", onComplete: console.log("Vid-to-End Loaded 4/5")})     


    //transition to video
    $(".btn_edit").click(function(e) {
        tl_endVid.play();
        e.preventDefault();
        setTimeout('videoPlayer.play()', 1800);
    });

    $(".btn_playAgain").click(function(e) {
        tl_endVid.play();
        e.preventDefault();
        setTimeout('videoPlayer.play()', 1800);
    });


    // End-to-Start
    tl_endStart.to(endScreen, 2, { 
        transformOrigin: "100% 0%", 
        rotation: "-90deg", 
        ease: Power3.easeIn, 
        alpha: 0
    })
    .to(startScreen, 2, {
        transformOrigin: "0% 0%",
        rotation: "0deg",
        ease: Power3.easeOut,
        alpha: 1,
        onComplete: console.log("End-to-Start Loaded 5/5")
    }, "-=0.5")


    //transition to start
    $(".btn_newVid").click(function(e) {
      tl_endStart.play();
      e.preventDefault();
    })