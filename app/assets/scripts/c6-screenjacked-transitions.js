// TRANSITIONS //
    var startScreen     = $(".startScreen"),
        inputScreen     = $(".inputScreen"),
        endScreen       = $(".endScreen"),
        transition      = $(".transition_blackFade"),
        videoPlayer     = document.getElementById("player");         
        tl_startInput   = new TimelineLite({paused: true}),
        tl_inputVid     = new TimelineLite({paused: true});


    // ANIMATIONS //  

    //timeline for start-to-input      
    tl_startInput.to(startScreen, 2, {transformOrigin: "0% 0%", 
                                      rotation: "90deg", 
                                      ease: Power3.easeIn, 
                                      alpha: 0})
      .from(inputScreen, 2, {transformOrigin: "100% 0%", 
                             rotation: "-90deg", 
                             ease: Power3.easeOut, 
                             alpha: 0,
                             onComplete: console.log("Start-to-Input Timeline Loaded"),}, "-=0.5")

    //transition to input screen
    $(".category__item").click(function() {
        tl_startInput.play()
    });

    //transition to start screen
    $(".inputScreen__btnClose").click(function(e) {
        tl_startInput.reverse()
        e.preventDefault();
    });


    //timeline for input-to-video
    tl_inputVid.to(inputScreen, 2, {alpha: 0})
                 .to(transition, 2, {opacity: 1}, "-=1")
                 .to(inputScreen, 0.1, {display: "none"}) //needed so Input elements aren't overlaying the control on the video
                 .to(videoPlayer, 2, {opacity: 1, onComplete: console.log("Input-to-Video Timeline Loaded")}, "-=0.75")             

    //transition to video
    $(".question__btnStart").click(function(e) {
        tl_inputVid.play();
        e.preventDefault();
        videoPlayer.play();
    });


    //timeline for video-to-end
    tl_vidEnd.to(videoPlayer, 2, {opacity: 0})
             .to(transition, 2, {opacity: 0}, "-=0.75")
             .to(endScreen, 0.1, {display: "block"})
             .to(videoPlayer, 0.1, {display: "none"})
             .to(transition, 0.1, {display: "none"})
             .from(endScreen, 2, {opacity: 1, onComplete: console.log("Vid-to-End Timeline Loaded")})

    //transition to end screen
      //when videoPlayer ends()?, play tl_vidEnd

    //return to video (replay, edit)
      //reverse() tl_vidEnd on click()

    //new video
      //build new timeline to swoop in startScreen

    //do shares need a transition?? I'm thinking not