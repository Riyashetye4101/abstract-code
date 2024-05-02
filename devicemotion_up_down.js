loadJS('https://code.jquery.com/jquery-1.11.3.min.js', function () {
    // tilt code start
    up_tilt = false;
    $("#tap-overlay").click(function(){
        $(this).hide();
        up_tilt = true;
        screen.triggerAction(ctx, { eventName: 'tap_to_start' }, noop);
        getPermission();
    }); 
    
    
    function getPermission(){
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    var permission = true;
                    checkDirection();
                }
            })
            .catch(console.error);
        } else {
            var permission = true;
            checkDirection();
        }  
    }
    
    start_tilt_right_left = false;
    start_tilt_up_down = false;
    
    right_tilt = false;
    left_tilt = false;
    
    down_tilt = false;
 
    function checkDirection(){
        window.addEventListener('deviceorientation', function(event) {
            event.preventDefault();
           
            get_beta_value = event.beta.toFixed(0);
            
            unit.find("orientation_UpDown_value").setTextAction(ctx, { text: ''+get_beta_value+'' }, noop);
            
            get_value_beta = +unit.find("orientation_UpDown_value").getText();
            
            if(get_value_beta >= 36 && get_value_beta <= 57){
                    // up_tilt = false;
                    // down_tilt=false;
                    start_tilt_up_down = true;
                    // screen.triggerAction(ctx, { eventName: 'showbg' }, noop);

              
            }
            
            if( get_value_beta >=66){
                if(start_tilt_up_down === true){
                    if(up_tilt === false){
                        up_tilt = true;
                        down_tilt=false; /// riya code
                        screen.triggerAction(ctx, { eventName: 'up_tilt_action' }, noop);
                    }
                }
            }
            
            if( get_value_beta <57){
                if(start_tilt_up_down === true){
                    if(down_tilt === false){
                        up_tilt=false; /// riya code
                        down_tilt = true;
                        screen.triggerAction(ctx, { eventName: 'down_tilt_action' }, noop);
                    }
                }
            }
            
        });
    }
    // tilt code end
});
// Call 'c' when the action is considered "completed".
c();