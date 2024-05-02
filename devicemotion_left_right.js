loadJS('https://code.jquery.com/jquery-1.11.3.min.js', function () {
    // tilt code start
    $("#tap-overlay").click(function(){
        $(this).hide();
        
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
    up_tilt = false;
    down_tilt = false;
    
    function checkDirection(){
        window.addEventListener('deviceorientation', function(event) {
            event.preventDefault();
            get_gamma_value = event.gamma.toFixed(0);
           
            
            unit.find("orientation_RightLeft_value").setTextAction(ctx, { text: ''+get_gamma_value+'' }, noop);
           
        
            get_value_gamma = +unit.find("orientation_RightLeft_value").getText();
            
            if(get_value_gamma > -24 && get_value_gamma < 24){
                // if(start_tilt_right_left === false){
                    start_tilt_right_left = true;
                    right_tilt=false;
                    left_tilt=false;
                // }
            }
            
            if(get_value_gamma > 25 && get_value_gamma < 75){
                if(start_tilt_right_left === true){
                    if(!right_tilt){
                        right_tilt=true;
                        left_tilt=false;
                         screen.triggerAction(ctx, { eventName: 'right_tilt_action' }, noop);
                         
                    }
                       

                }
            }
            if(get_value_gamma >= -70 && get_value_gamma <= -40){
                if(start_tilt_right_left === true){
                 if(!left_tilt){
                        right_tilt=false;
                        left_tilt=true;
                        screen.triggerAction(ctx, { eventName: 'left_tilt_action' }, noop);
                        
                    }
                     
                      
                   
                }
            }
            
        });
    }
    // tilt code end
});
// Call 'c' when the action is considered "completed".
c();