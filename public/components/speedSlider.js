
// slider to change spped of dots falling
function SpeedSlider(){
  const {start,setSpeed} =React.useContext(GameContext);
  const blockEl =React.useRef(null);
  const [left, setLeft] =React.useState(0);

  // start to get mouse position for slider
  const handleMouseDown=(e)=>{
    e.stopPropagation();
    if(e.cancelable){
        e.preventDefault();
    }
    ['mouseup', 'touchend'].forEach(e => window.addEventListener(e, handleMouseUp));
    ['mousemove', 'touchmove'].forEach(e => window.addEventListener(e, handleWindowMouseMove));
  }
  
  // finish to get mouse position for slider
  const handleMouseUp=(e)=>{
    e.stopPropagation();
    if(e.cancelable){
        e.preventDefault();
    }
    ['mousemove', 'touchmove'].forEach(e => window.removeEventListener(e, handleWindowMouseMove));
    ['mouseup', 'touchend'].forEach(e => window.removeEventListener(e, handleMouseUp));
  }

  // use mouse position to update slider block and line's position
  const handleWindowMouseMove=(e)=>{
    const barRect = getElementRect("slider-bar");
    if(barRect.width>0){
      const left = barRect.left;
      const right = left + barRect.width;
      const mouseLeft = e.type === 'touchmove'?e.changedTouches[0].pageX:e.clientX;
      if(mouseLeft<=left){
        setLeft(0);
        setSpeed(10);
      }else if(mouseLeft>=right){
        setLeft( barRect.width);
        setSpeed(100);
      }else{
        setLeft(mouseLeft - left);
        setSpeed(calcSpeedByMousePosition(mouseLeft - left, barRect.width));
      }
    }
  }
  
 React.useEffect(() => {
    if(blockEl?.current && !start){
      ['mousedown', 'touchstart'].forEach(e => blockEl.current.addEventListener(e, handleMouseDown));
      return () => {
        ['mousedown', 'touchstart'].forEach(e => blockEl.current.removeEventListener(e, handleMouseDown));
        ['mouseup', 'touchend'].forEach(e => window.removeEventListener(e, handleMouseUp));
        ['mousemove', 'touchmove'].forEach(e => window.removeEventListener(e, handleWindowMouseMove));
      }
    }

  }, [blockEl,start]);
  
  return (
    <div className={start?"locked":""}>
      <div　
        id="slider-block" 
        
        ref={blockEl}
        style={{"left":left}}
      >
        <div />
        <div />
      </div>
      <div　id="slider-line" style={{"width":left}}/>
      <div　id="slider-bar"/>
      <div id="speed">speed</div>
    </div>
  );
}


/** 
 * calc speed by slider's left position
 * return int from 0 to 100
 * at the slider's left-most position, dots should fall at a speed of 10px per second
 * at the slider's right-most position, should fall at a speed of 100px per second
 * @param left int
 * @param max int
 * @return int [10,100]
*/
function calcSpeedByMousePosition(left, max) {
  return Math.floor((left/max)*(90)+10)
}

