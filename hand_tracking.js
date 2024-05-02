loadJS('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js', function () {
loadJS('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js', function () {
loadJS('https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js', function () {
loadJS('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js', function () {
loadJS('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js', function () {

    $(function(){
        var tapscreen=document.getElementById("tap-screen");
        tapscreen.addEventListener('click',()=>{
        tapscreen.style.display='none';
        screen.triggerAction(ctx, { eventName: 'tap-to-start' }, noop);
        const videoElement = document.getElementById('videoElement'); 
        const canvasElement = document.getElementsByClassName('output_canvas')[0];
        const canvasCtx = canvasElement.getContext('2d');
        let gesturename=unit.find('gesture-name');
        var h2=document.getElementById("myheading");
// --------------------------------- logic------------------------------
            
        // find fingers
        function fingersUp(lmlist, label){
            
              
            let fingers=[];
                
                 // front 
            if(lmlist[0][1] <= lmlist[1][1]){
               
                if(lmlist[4][1] > lmlist[2][1]){
                    //  console.log("x diff"+Math.abs(lmlist[5][1]-lmlist[9][1]));
                // console.log("y diff"+Math.abs(lmlist[5][2]-lmlist[9][2]));
                    fingers.push(1);
                    }else{
                    
                    fingers.push(0);
                }
            }else{    // back
                if(lmlist[4][1] <= lmlist[2][1]){
                    fingers.push(1);
                    }else{
                    
                    fingers.push(0);
                }
            }
            
            if(label==='Left'){          // for right hand
                 let x=Math.abs(lmlist[0][1]-lmlist[12][1]);
               let y=Math.abs(lmlist[0][2]-lmlist[12][2]);
               if(x<y){
                console.log("vartical");
                let tipids=[8,12,16];
                tipids.forEach(id=>{
                  if(lmlist[id][2] <= lmlist[id -2][2] ){
                    fingers.push(1);
                  }else{
                    fingers.push(0);
                  }
                });
                
                if(lmlist[18][2]-lmlist[20][2]<=10){
                    fingers.push(0);
                }else{
                    fingers.push(1);
                }


               }else{
                console.log('horizontal');
                [8,12,16,20].forEach(id=>{
                  if(lmlist[id][1] <= lmlist[id -2][1] ){
                    fingers.push(0);
                  }else{
                    fingers.push(1);
                  }
                });
               }

                
                
            }else{                          // for left hand
                                        // for left hand
                
                
                //     console.log("right");

                let x=Math.abs(lmlist[0][1]-lmlist[12][1]);
               let y=Math.abs(lmlist[0][2]-lmlist[12][2]);
               if(x<y){
                console.log("vertical");
                  let tipids=[8,12,16,20];
                tipids.forEach(id=>{
                      if(lmlist[id][2] <= lmlist[id -2][2]){
                        fingers.push(1);
                      }else{
                        fingers.push(0);
                      }
                    });
               }else{
                console.log("horizontal");
                [8,12,16,20].forEach(id=>{
                      if(lmlist[id][1] <= lmlist[id -2][1]){
                        fingers.push(1);
                      }else{
                        fingers.push(0);
                      }
                    }

                );
               }
            }
            // console.log(fingers);
            return fingers;
        }
    
    
        // distance between to landmarks using ecludien distance
         function findDistance(lmlist, p1,p2){
             let x1,x2,y1,y2;
             x1=lmlist[p1][1];
             y1=lmlist[p1][2];
             x2=lmlist[p2][1];
             y2=lmlist[p2][2];
             return Math.hypot(x1-x2, y1-y2);
         }           
            
        // showing and hiding required emojis 
        function show_close(c1,c2,c3,c4,c5,c6,c7,c8,s1){
            emojis[c1]=false;
            emojis[c2]=false;
            emojis[c3]=false;
            emojis[c4]=false;
            emojis[c5]=false;
            emojis[c6]=false;
            emojis[c7]=false;
            emojis[c8]=false;
            emojis[s1]=true;
        }
            
            
        // required variables

        var palm_x=null;
        var emojis={
            "wave":false,
            "twofingers":false,
            "yoy":false,
            'thumbs':false,
            'handclose':false,
            'compli':false,
            'pinch':false,
            'thumbsdown':false
        }
        let cmin=0,cmax=0;    
            
        function onResults(results) {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(
          results.image, 0, 0, canvasElement.width, canvasElement.height);
         
          // code to detect
               let xlist=[];
               let ylist=[];
               var lmlist=[];    
    
              // finding position of landmark:-
               if(results.multiHandLandmarks && results.multiHandLandmarks[0]){
                  let myHand=results.multiHandLandmarks[0];
                    // console.log();
                //   console.log("hands are detected");
                  for(let i=0;i<21;i++){
                        let lm=myHand[i];
                        let h=results.image.height;
                        let w=results.image.width;
                        let cx=lm["x"]*w;
                        let cy=lm["y"]*h;
                        xlist.push(cx);
                        ylist.push(cy);
                        lmlist.push([i,cx,cy]);
                  }
                   let gesture="";
                 
                   let fingers=fingersUp(lmlist,results.multiHandedness[0].label);
                 
                      gesture=fingers.toString();
                      console.log(gesture); 
                
                    //  console.log(findDistance(lmlist,4,12));
              if((gesture==='1,1,0,0,0' || gesture==='1,1,1,0,0') && Math.hypot(myHand[4].x-myHand[8].x,myHand[4].y-myHand[8].y)<=0.05){
                 
                         if(!emojis['pinch']){
                                palm_x=null;
                                show_close('yoy','thumbsdown','call','wave','thumbs','handclose','twofingers','compli','pinch');
                                h2.textContent="small";
                                screen.triggerAction(ctx, { eventName: 'small' }, noop);
                                console.log("pinch");
                            }
                    }
                
                
               
                if(gesture==="1,1,0,0,1"){
                     if(!emojis['yoy']){
                            palm_x=null;
                            show_close('twofingers','thumbsdown','pinch','call','wave','thumbs','handclose','compli','yoy');
                            screen.triggerAction(ctx, { eventName: 'love' }, noop);
                            h2.textContent="I love you";
                            console.log("yoy");
                      }
                }
                if(gesture==="0,1,1,0,0"){
                    // rendering
                    if(!emojis['twofingers']){
                                palm_x=null;
                                show_close('yoy','thumbsdown','pinch','call','wave','thumbs','handclose','compli','twofingers');
                                h2.textContent="Win";
                                screen.triggerAction(ctx, { eventName: 'win' }, noop);
                                console.log("twofingers");
                    }
                    
                    
                }
                 if(gesture==="1,0,1,1,1"){
                    // rendering
                    if(!emojis['compli']){
                                palm_x=null;
                                show_close('yoy','thumbsdown','pinch','call','wave','thumbs','handclose','twofingers','compli');
                                h2.textContent="Nice";
                                screen.triggerAction(ctx, { eventName: 'nice' }, noop);
                                console.log("compliment");
                    }
                    
                    
                }
                if(gesture==="1,1,1,1,1"){
                   
                        if(palm_x===null){
                            palm_x=lmlist[12][1];
                        }else{
                            if(lmlist[12][1]<=palm_x-50 || lmlist[12][1]>=palm_x+50){
                                // rendering
                                if(!emojis['wave']){
                                    show_close('yoy','thumbsdown','pinch','call','twofingers','thumbs','handclose','compli','wave');
                                    h2.textContent="Hello!";
                                    screen.triggerAction(ctx, { eventName: 'hello' }, noop);
    
                                    console.log("wave");
                                }
                            }
                        } 
                    
                
                }
                if(gesture==="1,0,0,0,0"){
                  let x=Math.abs(lmlist[4][1]-lmlist[17][1]);
                  let y=Math.abs(lmlist[4][2]-lmlist[17][2]);
                  if(x<y){
                    // console.log("horizontal thumbs");
                    if(lmlist[4][2]<=lmlist[0][2]){
                    //   console.log("thumbs up");
                      if(!emojis['thumbs']){
                            palm_x=null;
                            show_close('yoy','thumbsdown','pinch','call','twofingers','wave','handclose','compli','thumbs');
                            h2.textContent="Ok";
                            screen.triggerAction(ctx,{eventName:'ok'},noop);
                            console.log("thumbs up");
                      }
                    
                    }else{
                      console.log("thumbs down");
                       if(!emojis['thumbsdown']){
                            palm_x=null;
                            show_close('yoy','pinch','call','twofingers','wave','handclose','compli','thumbs','thumbsdown');
                            h2.textContent="Not Ok";
                            screen.triggerAction(ctx,{eventName:'not-ok'},noop);
                            
                      }
                    }
                  }else{
                    console.log("vertical thumbs");
                    if(lmlist[4][1]>=lmlist[0][1]){
                      console.log("thumbs left");
                    }else{
                      console.log("thumbs right");
                    }
             
                
               
            }
                }
            if(gesture==='1,0,0,0,1'){
                // rendering
                if(!emojis['call']){
                            palm_x=null;
                            show_close('yoy','thumbsdown','pinch','twofingers','wave','handclose','compli','thumbs','call');
                            h2.textContent="Call";
                            screen.triggerAction(ctx,{eventName:'call'},noop);
                            console.log("call");
                }
            }
              if(gesture==="0,0,0,0,0"){
                   if(!emojis['handclose']){
                            palm_x=null;
                            show_close('yoy','thumbsdown','pinch','call','twofingers','wave','thumbs','compli','handclose');
                            h2.textContent="Help";
                            screen.triggerAction(ctx,{eventName:'help'},noop);
                       

                        }
                    
              }
            
            
            
                }else{
                    // console.log(cmin+" ...... "+cmax);
                    
                    palm_x=null;
                    emojis['yoy']=false;
                            emojis['twofingers']=false;
                            emojis['wave']=false;
                            emojis['thumbs']=false;
                            emojis['yoy']=false;
                            emojis['handclose']=false;
                            emojis['compli']=false;
                            emojis['call']=false;
                            emojis['pinch']=false;
                            emojis['thumbsdown']=false;
                    //   console.log("hand are not detected");
                    // gesturename.setTextAction(ctx, { text: 'no gesture' }, noop);
                    h2.textContent="No Gesture detected";
                    screen.triggerAction(ctx,{eventName:'hide_all'},noop);
                }    
          
 
          // code end here
          
          canvasCtx.restore();
        }
        
        
        
        
//------------------------------- logic ends here ------------------------
        
        const hands = new Hands({locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }});
        
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        hands.onResults(onResults);
        
        const camera = new Camera(videoElement, {
          onFrame: async () => {
            await hands.send({image: videoElement});
          },
          width: 1280,
          height: 720
        });
        camera.start();
        h2.textContent="Model is loaded!";
        h2.style.color="green";
        setTimeout(()=>{
            h2.style.color="white";
            h2.textContent="Camera Starting";
        
        }, 1000);
        });
          
    });
});
});
});
});
});
c();