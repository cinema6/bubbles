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

    function inputReset() {
      inputScreen.css({
        "-webkit-transform": "rotate(-90deg)", 
        "-webkit-transform-origin" : "100% 0%",
        "display": "block",
        "opacity": "1"
      })
      console.log("* Input Styles Reset *");      
    }

    function vidReset() {
      videoPlayer.style.display==="block";
      videoPlayer.style.opacity==="0";
      console.log("* Vid Styles Reset *");
    }

    function endReset() {
      endScreen.css({
        "-webkit-transform": "rotate(0)", 
        "-webkit-transform-origin" : "100% 0%",
        "display": "none",
        "opacity": "0"
      })
      console.log("* End Styles Reset *");      
    }

    // Start-to-Input //        
    tl_startInput.to(startScreen, 2, {
        transformOrigin: "0% 0%", 
        rotation: "90deg", 
        ease: Power3.easeIn, 
        alpha: 0})

      .to(inputScreen, 2, { 
        transformOrigin: "100% 0%", 
        rotation: "0", 
        ease: Power3.easeOut, 
        alpha: 1}, "-=0.5");

    //transition to input screen
    $(".thumbnail1").click(function() {
        inputReset();
        tl_startInput.play()
        tl_startInput.seek(0);
        console.log("Transition to Input");
    });

    //transition to start screen
    $(".btn_close").click(function(e) {
        tl_startInput.reverse()
        e.preventDefault();
        console.log("Transition to Start");
    });

    // Input-to-Vid //     
    tl_expVid.to(inputScreen, 2, {opacity: 0})
             .to(transition, 2, {opacity: 1}, "-=1")
             .to(videoPlayer, 2, {display: "block", opacity: 1}, "-=1")
             .to(inputScreen, 0.1, {display: "none"});

    //transition to video
    $(".btn_start").click(function(e) {
        e.preventDefault();
        tl_expVid.play();
        setTimeout('videoPlayer.play()', 2800);
        tl_expVid.seek(0);
        console.log("Transition to Video (Start)");  
    });

    // Vid-to-End //  
    tl_vidEnd.to(endScreen, 0.1, {display: "block", opacity: "0"})
             .to(videoPlayer, 1.5, {opacity: 0})
             .to(transition, 2, {opacity: 0}, "-=0.5")
             .to(videoPlayer, 0.1, {display: "none"})
             .to(endScreen, 2, {opacity: 1}, "-=2");             


        // automatically transitions when the video ends
        videoPlayer.addEventListener('ended', videoEnd, false);

        function videoEnd() {
          vidReset();
          endReset();
          //console.log(getComputedStyle(videoPlayer));
          tl_vidEnd.play(); 
          console.log("Video Ended, Transition to End"); 
          setTimeout('videoPlayer.currentTime=0;', 5000); 
          tl_vidEnd.seek(0);
        }

    // End-to-Vid //  
    tl_endVid.to(endScreen, 2, {opacity: 0})
             .to(videoPlayer, 0.1, {display: "block"})
             .to(transition, 2, {opacity: 1}, "-=2")
             .to(videoPlayer, 2, {opacity: 1}, "-=0.25")
             .to(endScreen, 0.1, {display: "none"});      

        //transition to video 1 day
        $(".btn_edit").click(function(e) {   
            tl_endVid.play();
            e.preventDefault();
            setTimeout('videoPlayer.play()', 1800);
            tl_endVid.seek(0);
            console.log("Transition to Video (Edit)");
        });

        $(".btn_playAgain").click(function(e) {
            tl_endVid.play();
            e.preventDefault();
            setTimeout('videoPlayer.play()', 1800);
            tl_endVid.seek(0);
            console.log("Transition to Video (Replay)");
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
        alpha: 1
    }, "-=0.5");


        //transition to start
        $(".btn_newVid").click(function(e) {
          tl_endStart.play();
          e.preventDefault();
          tl_endStart.seek(0);
          console.log("Transition to New Video");
        });