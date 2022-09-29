
function Dot({ index,size,left }) {
  const { start,sound, addScore,duration } =React.useContext(GameContext);
  const [disabled, setDisabled] =React.useState(false);
  const [style, setStyle] =React.useState(style);
  const [point, setPoint] =React.useState(0);
  const [audio, setAudio] =React.useState(null);
  const isMounted =React.useRef(false);
  const clickAndTakeScore = () => {
    if (start) {
      sound && audio?.play &&audio.play();
      // When touched or clicked, the dot disappear and the score be increased
      addScore(point)
      setDisabled(true)
    }
  }
  
  React.useEffect(() => {
     if (size && left) {
       setAudio(document.getElementsByTagName("audio")[Math.floor(10-size/10)]);
       setPoint(calcScoreByDotSize(size));
       setStyle(s=>({...s,...createDotStyle(size, left)}));
     }
  }, [size,left])

 React.useEffect(() => {
    if (isMounted.current && !disabled) {
      if (duration > 0 && start) {
        // set style to start to translate
        setStyle((s) => ({
          ...s, ...createDotTransition(size, duration)
        }))
      } else {
        // set style to stop to translate
        setStyle((s) => ({
          ...s, ...createDotWithoutTransition(index)
        }))
        
      }
        
      }
  }, [isMounted,duration]);

   React.useEffect(() => {
    if (isMounted.current && disabled && start) {
        // add animation when dot is touched
      setStyle((s) => ({
        ...s, ...createDotWithoutTransition(index)
      }));
      }
  }, [disabled]);

  return (
    <button
      className={"dot"}
      ref={isMounted}
      id={index}
      disabled={disabled} 
      style={style} 
      onClick={clickAndTakeScore}
    />
  );
}


/**
 * 
 * @param int index 
 * @param int duration 
 * @param int boardWidth 
 * @param int boardHeight 
 * @return element 
 */
function createRandomDot(index,  boardWidth) {
  // Dots vary randomly in size from 10px in diameter to 100px in diameter.
  const size=randomNumber(10,100)
  // A new dot appears at a random horizontal position. 
  // A dot should not "hang" off the left or right edge of the screen.
  const left=randomNumber(0,boardWidth-size)
  // new dot element
  return (
    <Dot
      index={`${index}`}
      size={size}
      left={left}
    />
  );
}


/** 
 * A dot's value is inversely proportional to its size
 * the smallest dots worth 10 points
 * the largest dots worth 1 point
 * @param size int
 * @return int [1,10]
*/
function calcScoreByDotSize(size){
  return Math.floor(10-((size-10)/10))
}

/** 
 * return style of dot including size and position
 * @param size int
 * @param left int
 * @return style object
*/
function createDotStyle(size,left){
  return {
    "width":`${size}px`,
    "height":`${size}px`,
    "borderRadius":`${size}px`,
    "left":`${left}px`,
    "top": `-${size}px`,
  }
}

/** 
 * return style of dot for falling down action
 * @param size int
 * @param duration int
 * @return style object
*/
function createDotTransition(size, duration) {
  return {
      "transform": `translateY(${getElementRect("board").height+size}px)`,
      "transition": `transform ${duration}ms`,
      "transitionTimingFunction": "linear",
  }
}

/** 
 * return style of dot for for pausing and touch event
 * @param id string
 * @return style object
*/
function createDotWithoutTransition(id) {
  // get relative postition with dot and board to make sure dot stops at right position in transition
  const top = getElementRect(id).top-getElementRect("header").height;
  return {
      "top": `${top}px`,
      "transform": "none",
      "transition":"none",
      "transitionTimingFunction": "none",
  }
}
