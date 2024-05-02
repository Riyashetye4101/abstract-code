
var final_transcript = '';
var recognizing = false;
var detected = true;
// detect ios/android
var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1;
var isiPhone = ua.indexOf("iphone") > -1;

// get recording permission strat
var recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;
vaice_detected = false;


// get recording permission end
recognition.onresult = function(event) {
  var interim_transcript = '';
  if (typeof(event.results) === 'undefined') {
      recognition.onend = null;
      recognition.stop();
      $("#speech-start").show();
      if(vaice_detected === false){
        screen.triggerAction(ctx, {eventName: 'voice_deactivate'}, noop);
      }
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript = event.results[i][0].transcript;
      } else {
        interim_transcript = event.results[i][0].transcript;
      }
    }

    $("#speech-start").hide();
    
    if(isAndroid) {
        if(final_transcript !== ""){
            //action on speak start
            transcript_data = final_transcript.toLowerCase();
            // alert(transcript_data);
            if(detected === true){
                if (transcript_data === "maa" || transcript_data === "aa" || transcript_data === "ma" || transcript_data === "aaaa" || transcript_data === "maaa" || transcript_data === "m" || transcript_data === "aa" || transcript_data != "") {
                    detected = false;
                    vaice_detected = true;
                    recognition.stop();
                    // screen.triggerAction(ctx, {eventName: 'voice_detected'}, noop);
                    
                    screen.triggerAction(ctx, {eventName: 'voice_detected'}, noop);
                    navigator.vibrate(600);
                    $("#speech-start").show();
                }
            }
        }
    }
    if(isiPhone){
        if(interim_transcript !== ""){
            //action on speak start
            transcript_data = interim_transcript.toLowerCase();
            // alert(transcript_data);
            if(detected === true){
                if (transcript_data === "maa" || transcript_data === "aa" || transcript_data === "ma" || transcript_data === "aaaa" || transcript_data === "maaa" || transcript_data === "m" || transcript_data === "aa" || transcript_data != "") {
                    detected = false;
                    vaice_detected = true;
                    recognition.stop();
                    
                    // screen.triggerAction(ctx, {eventName: 'voice_detected'}, noop);
                    screen.triggerAction(ctx, {eventName: 'voice_detected'}, noop);
                    $("#speech-start").show();
                }
            }
        }
    }
    
        
    //action on speak end
    if (final_transcript || interim_transcript) {
        $("#speech-start").show();
        if(vaice_detected === false){
            screen.triggerAction(ctx, {eventName: 'voice_deactivate'}, noop);
          }
    }
};

// get final result end
// start recording
recognition.onstart = function() {
  recognizing = true;
  $("#speech-start").hide();
};
// start recording

// error block start
recognition.onerror = function(event) {
  if (event.error == 'no-speech') {
    console.log("no-speech");
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
    //   console.log("audio-capture");
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
    //   console.log("not-allowed");
      if (event.timeStamp - start_timestamp < 100) {
      } 
      else{
      }
      ignore_onend = true;
    }
};
// error block end

// recognition end start
recognition.onend = function() {
  recognizing = false;
  if (ignore_onend) {
    return;
  }
  if (!final_transcript) {
    console.log('start recording');
    $("#speech-start").show();
    if(vaice_detected === false){
        screen.triggerAction(ctx, {eventName: 'voice_deactivate'}, noop);
      }
    return;
  }
  $("#speech-start").show();
  if(vaice_detected === false){
        screen.triggerAction(ctx, {eventName: 'voice_deactivate'}, noop);
      }
};
// recognition end end


// start recording on button click start
loadJS('https://code.jquery.com/jquery-3.3.1.min.js', function () {
  $("#speech-start").on("click", function(){
    setTimeout(function(){
        if(detected === true){
            detected = false;
            if(isAndroid) {
    			navigator.vibrate(600);
    		}
            screen.triggerAction(ctx, {eventName: 'voice_detected'}, noop);
        }
    },5000);
    if (recognizing) {
      recognition.stop();
      return;
    }
    screen.triggerAction(ctx, {eventName: 'tap_action'}, noop);
    final_transcript = '';
    recognition.lang = 'en-IN';
    recognition.start();
    ignore_onend = false;
    start_timestamp = event.timeStamp;
  });
});
// start recording on button click end
// Call 'c' when the action is considered "completed".
c();