'use strict';

/** import */
const useState = React.useState;
const useContext = React.useContext;
const useEffect = React.useEffect;
const useRef = React.useRef;

/** context */
const GameContext = React.createContext({});
/** enum */
const GAME_MODE = {
  ENDLESS:0, // default
  SURVIVE:1,
  TIMELIMIT:2,
}
const MODAL_TYPE = {
  NONE:0,
  SETTING:1,
  GAMEOVER:2,
  TIMEOUT:3,
}

/** function components */

function App() {
  const [start,setStart]=useState(false)
  const [createDotIntervalID ,setCreateDotIntervalID]=useState(null)
  const [score,setScore]=useState(0)
  const [duration,setDuration]=useState(0)
  const [speed,setSpeed]=useState(0)
  const [dots,setDots]=useState({})
  const [index, setIndex] = useState(0)
  const [showGuide, setShowGuide] = useState(localStorage.getItem("dot-game-guidance-finish"))
  const [mode, setMode] = useState(0)
  const [openModal, setOpenModal] = useState(MODAL_TYPE.NONE)
  const [hp, setHp] = useState(100)
  const [sound, setSound] = useState(true)
  const [time, setTime] = useState(0)
  const [getHighest, setGetHighest] = useState(false)

  const updateDuring = () => {
    const boardRect = getElementRect("board");
    if (boardRect.height>0) {
      // the largest distance of dots falling down is sum of the height of game board and the height of the biggest dot
      const distance = boardRect.height + 100;
      setDuration(distance * 1000 / speed);
    } 
  }

  const initGame = () => {
    setStart(false);
    setScore(0);
    setDots([]);
    setIndex(0);
    setTime(mode===GAME_MODE.TIMELIMIT?10:0);
    setCreateDotIntervalID(null);
  }

  const changeMode = (m) => {
    initGame()
    setMode(m)
  }
    
  const addScore = (add) => {
    setScore(score=>score+add<=0?0:score+add)
  }
    
  useEffect(() => {
    // init game when change mode
    initGame();
  }, [mode])

  useEffect(() => {
    // game finish when time=0 in time limit mode
      if (start && mode===GAME_MODE.TIMELIMIT && time <= 0) {
        setStart(false);
        setGetHighest(updateRecord(score, GAME_MODE.TIMELIMIT));
        setOpenModal(MODAL_TYPE.TIMEOUT);
      }
  }, [time])

  useEffect(() => {
    // game finish when hp=0 in survive mode
      if (start && mode===GAME_MODE.SURVIVE && score === 0 && time>0) {
        setStart(false);
        setGetHighest(updateRecord(score, GAME_MODE.TIMELIMIT));
        setOpenModal(MODAL_TYPE.GAMEOVER);
      }
  }, [score])
    
  useEffect(()=>{
    if (start) {
      if (!createDotIntervalID) {
        // A new dot appear every 1000ms
        const intervalID = setInterval(()=>{
          setIndex(index=>index+1)
        }, 1000);
        setCreateDotIntervalID(intervalID)
      }
      updateDuring();
    } else {
      clearInterval(createDotIntervalID);
      setCreateDotIntervalID(null)
      setDuration(0);
    }
  }, [start,speed])

  
  return (
    <GameContext.Provider
      value={{
        start,
        setCreateDotIntervalID,
        setStart,
        score,
        duration,
        setSpeed,
        addScore,
        dots,
        setDots,
        index,
        setIndex,
        setShowGuide,
        initGame,
        mode,
        setMode:changeMode,
        openSetting: openModal,
        setOpenModal,
        hp,
        setHp,
        time,
        setTime,
        sound,
        setSound
        }}
    >
      {openModal===MODAL_TYPE.SETTING && <SettingModal />}
      {openModal === MODAL_TYPE.GAMEOVER && <GameOverDialog getHighest={getHighest}/>}
      {openModal === MODAL_TYPE.TIMEOUT && <GameFinishDialog getHighest={getHighest}/>}
      {!showGuide && <GuideDialog />}
        <Header />
      <Board/>
    </GameContext.Provider>
  )
}

// header with score,start button,speed slider
function Header(){

  return (
    <div id="header" >
      <div className="header-line" >
       <Score />
        <ToolBar />
      </div>
       <SpeedSlider />
    </div>
  );
}

// tool bar with button click to start game/end game and setting button
function ToolBar(){
  const {start,setStart,openSetting,setOpenModal} = useContext(GameContext);
  const onStartClick=()=>{
    setStart(start=>!start)
  }
  const onSettingClick=()=>{
    setStart(false)
    setOpenModal(MODAL_TYPE.SETTING)
  }
  return (
    <div>
      <button id="start" onClick={onStartClick}>{start ? "Pause" : "Start"}</button>
      <button id="setting" disabled={openSetting} onClick={onSettingClick}><img alt="" src="assert/setting.png"/></button>
    </div>
  );
}

// show score
function Score(){
  const {score} = useContext(GameContext);
  return <h1 id="score" >{score}</h1>;
}


// slider to change spped of dots falling
function SpeedSlider(){
  const {start,setSpeed} = useContext(GameContext);
  const blockEl = useRef(null);
  const [left, setLeft] = useState(0);

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
  
  useEffect(() => {
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

function Board(){
  const {
    setSpeed,
        dots,
        setDots,
        index,mode,setHp,setTime
        } = useContext(GameContext);

  const isMounted = useRef(null);
  useEffect(() => {
    if (isMounted?.current) {
      // init speed
      setSpeed(10)
      
    }
    }, [isMounted]);
  
  useEffect(()=>{
    if (index > 0 && setDots) {
      mode === GAME_MODE.TIMELIMIT ? setTime(t => t - 1) : setTime(t => t + 1);
      const boardRect = getElementRect("board");
      if (boardRect.width > 0) {
        const dot = createRandomDot(index, boardRect.width);
        setDots((dots) => {
          // delete useless dots
          const useLessDots = []
          Object.entries(dots).forEach(([id,dot]) => {
            if (document.getElementById(id)?.disabled === true) {
              useLessDots.push(id);
            } else if(getElementRect(id).top >= boardRect.bottom){
              if (mode === 1) {
                setHp(hp=>hp- Math.floor(dot.props.size/10));
              }
              useLessDots.push(id);
            }
          })
          useLessDots.forEach(id => {
            delete dots[id];
          })
          dots[`${index}`]=dot;
          return dots
        });
      }
    }
  },[index])
  
  return (
    <div id="board" ref={isMounted}>
      <PauseFace />
      {mode === 1 && <Hp />}
      <Time />
      <div>
        {Object.entries(dots).map(([id, dot]) => <div key={id}>{dot}</div>)}
      </div>
    </div>
  );
}

// show hp in survive mode
function Hp(){
  const {hp} = useContext(GameContext);
  return <h1 id="hp" >{hp}</h1>;
}

// show time pass in endless/survive mode, show time last in time-limit mode
function Time(){
  const {time} = useContext(GameContext);
  return <h1 id="time" >{covertSecondToTime(time)}</h1>;
} 
// mask show when game is paused
function PauseFace() {
    const {start,setStart} = useContext(GameContext);

  return start?null:<div id="pause-face" onClick={()=>{setStart(true)}}><div>||</div></div>
}

function Dot({ index,size,left }) {
  const { start,sound, addScore,duration } = useContext(GameContext);
  const [disabled, setDisabled] = useState(false);
  const [style, setStyle] = useState(style);
  const [point, setPoint] = useState(0);
  const [audio, setAudio] = useState(null);
  const isMounted = useRef(false);
  const clickAndTakeScore = () => {
    if (start) {
      sound && audio?.play &&audio.play();
      // When touched or clicked, the dot disappear and the score be increased
      addScore(point)
      setDisabled(true)
    }
  }
  
   useEffect(() => {
     if (size && left) {
       setAudio(document.getElementsByTagName("audio")[Math.floor(10-size/10)]);
       setPoint(calcScoreByDotSize(size));
       setStyle(s=>({...s,...createDotStyle(size, left)}));
     }
  }, [size,left])

  useEffect(() => {
    if (isMounted.current) {
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

// setting modal
function SettingModal() {

  const {mode,sound,setMode,setOpenModal,setSound} = useContext(GameContext);
  const style1 = {
    "width": `100%`,
    "height": `100%`,
    "backgroundColor": "#000000",
    "left": `0px`,
    "top": `0px`,
  }

  return (
    <div  className="dialog-area">
      <div className="dialog">
      <h1>Setting</h1>
      <div className="button-list">
        <h2>Game Mode</h2>
          <button onClick={() => { setMode(mode => mode < 2 ? mode + 1 : 0) }}>
            {mode === GAME_MODE.ENDLESS ? "Endless Mode" : mode === GAME_MODE.SURVIVE ? "Survive Mode" : "Time Limit Mode"}
          </button>
        </div>
          
        {mode === GAME_MODE.ENDLESS ? <div><p>Game will never finish</p><p>and dots will fall down forever.</p></div>
          :
          mode === GAME_MODE.SURVIVE ?
            <div>
              <p>If you miss dots,</p>
              <p>your HP will be cut.</p>
              <p>The bigger the dot is,</p>
              <p>When HP become 0,</p>
              <p>GAME OVER.</p>
            </div>
            :
            <div>
              <p>Try to get highest score</p>
              <p>in only 1 MINUTE.</p>
            </div>
        }
        <div className="button-list">
        <h2>Sound</h2>
          <button className={"checkbox" } onClick={() => { setSound(s => !s) }}>
            {sound ? "✔" : ""}
          </button>
        </div>
      <button onClick={() => {setOpenModal(MODAL_TYPE.NONE) }}>Close</button>
      </div>
      <div className="dialog-mask" style={style1}/>
    </div>
  )
}

// dialog shows when you lose game in survive mode
function GameOverDialog({getHighest}) {
  const {score,setStart,setOpenModal,initGame} = useContext(GameContext);
  const style1 = {
    "width": `100%`,
    "height": `100%`,
    "backgroundColor": "#000000",
    "left": `0px`,
    "top": `0px`,
  }

  return (
    <div  className="dialog-area">
      <div className="dialog">
      <div>Oops! Game Over...</div>
      <p>You get { score} points! Good try!</p>
        {getHighest && <p>New Record!!</p>}
      <p>Try again?</p>
      <div className="button-list">
          <button onClick={() => {
            setOpenModal(MODAL_TYPE.NONE);
            initGame();
            setStart(true);
          }}>Yes</button>
          <button onClick={() => {
            setOpenModal(MODAL_TYPE.NONE)
            initGame()
          }}>No</button>
      </div>
      </div>
      <div className="dialog-mask" style={style1}/>
    </div>
  )
}


// dialog shows when you lose game in survive mode
function GameFinishDialog({getHighest}) {
  const { score, setStart, setOpenModal, initGame } = useContext(GameContext);
  const style1 = {
    "width": `100%`,
    "height": `100%`,
    "backgroundColor": "#000000",
    "left": `0px`,
    "top": `0px`,
  }

  return (
    <div  className="dialog-area">
      <div className="dialog">
      <h1>Time is over!</h1>
      <p>You get { score} points! Good try!</p>
        {getHighest && <p>New Record!!</p>}
      <p>Try again?</p>
      <div className="button-list">
          <button onClick={() => {
            setOpenModal(MODAL_TYPE.NONE);
            initGame();
            setStart(true);
          }}>Yes</button>
          <button onClick={() => {
            setOpenModal(MODAL_TYPE.NONE)
            initGame()
          }}>No</button>
      </div>
      </div>
      <div className="dialog-mask" style={style1}/>
    </div>
  )
}

// guidence of game
function GuideDialog() {
  const [step, setStep] = useState(1);
  const {setShowGuide,setStart,initGame,setSpeed} = useContext(GameContext);
  const maxSize = 2*(window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight);
  const style1 = {
    "width": `100%`,
    "height": `100%`,
    "backgroundColor": "#000000",
    "left": `0px`,
    "top": `0px`,
  }
  const Step1 = (
    <>
    <div className="dialog">
      <p>Hello! Here is HIT DOTS game!</p>
      <p>Is it the first time for you to play this game?</p>
      <div className="button-list">
        <button onClick={()=>setStep(step=>step+1)}>Yes</button>
        <button onClick={()=>setStep(8)}>No</button>
        </div>
      </div>
      <div className="dialog-mask" style={style1}/>
      </>
  )

  
  const style2 = {
    "borderWidth": `${maxSize}px`,
    "borderRadius": `${2*maxSize}px`,
    "transform": `translate(-${maxSize}px, -${maxSize}px)`,
    "width": `${getElementRect("start").width*2}px`,
    "height": `${getElementRect("start").height*2}px`,
    "left": `${getElementRect("start").left-getElementRect("start").width/2}px`,
    "top": `${getElementRect("start").top-getElementRect("start").height/2}px`,
  }

  const Step2 = (
    <>
    <div className="dialog">
      <p>Just start Game by click [Start] button.</p>
      <div className="button-list">
          <button onClick={() => {
            setStart(true);
            setSpeed(100);
            setStep(step => step + 1);
          }}>Ok</button>
        </div>
    </div>
      <div className="dialog-mask" style={style2}/>
      </>
  )

  const style3 = {
    "borderWidth": `${maxSize}px`,
    "borderRadius": `${2*maxSize}px`,
    "transform": `translate(-${maxSize}px, -${maxSize}px)`,
    "width": `${getElementRect("board").width}px`,
    "height": `${getElementRect("board").height}px`,
    "left": `calc(50% - ${getElementRect("board").width/2})px`,
    "top": `calc(50% - ${getElementRect("board").height/2})px`,
  }
  
  const Step3 = (
    <>
    <div className="dialog" style={{"transform":"translateY(200px)"}}>
      <p>Dots fall down from top to board.</p>
      <p>Touch them to get score!</p>
      <div className="button-list">
        <button onClick={()=>setStep(step=>step+1)}>Ok</button>
        </div>
    </div>
    <div className="dialog-mask" style={style3}/>
      </>
  )

    const Step4 = (
    <>
    <div className="dialog">
      <p>Pause Game by click [Pause] button.</p>
      <div className="button-list">
         <button onClick={() => {
            setStart(false)
            setSpeed(10);
            setStep(step => step + 1);
          }}>Ok</button>
        </div>
    </div>
    <div className="dialog-mask" style={style2}/>
      </>
  )
  const style5 = {
    "borderWidth": `${maxSize}px`,
    "borderRadius": `${2*maxSize}px`,
    "transform": `translate(-${maxSize}px, -${maxSize}px)`,
    "width": `${getElementRect("slider-block").width*2}px`,
    "height": `${getElementRect("slider-block").height*2}px`,
    "left": `${getElementRect("slider-block").left-getElementRect("slider-block").width/2}px`,
    "top": `${getElementRect("slider-block").top-getElementRect("slider-block").height/2}px`,
  }

  const Step5 = (
    <>
    <div className="dialog">
      <p>You can change the speed of dots by drag this slider.</p>
      <p>But only when the game is Paused!</p>
      <div className="button-list">
        <button onClick={() => setStep(step => step + 1)}>Ok</button>
      </div>
    </div>
    <div className="dialog-mask" style={style5}/>
      </>
  );

    const Step6 = (
    <>
    <div className="dialog">
      <p>Click [Start] button to restart...</p>
      <p>Or click anywhere in the board!</p>
      <div className="button-list">
        <button onClick={()=>setStep(step=>step+1)}>Ok</button>
        </div>
    </div>
    <div className="dialog-mask" style={style2}/>
      </>
  )
  const style7 = {
    "borderWidth": `${maxSize}px`,
    "borderRadius": `${2*maxSize}px`,
    "transform": `translate(-${maxSize}px, -${maxSize}px)`,
    "width": `${getElementRect("score").width*2}px`,
    "height": `${getElementRect("score").height*2}px`,
    "left": `${getElementRect("score").left-getElementRect("score").width/2}px`,
    "top": `${getElementRect("score").top-getElementRect("score").height/2}px`,
  }
  const Step7 = (
    <>
    <div className="dialog">
      <p>You can get score each time you hit a dot.</p>
      <p>The smaller the dot is, the larger score you will get!</p>
      <div className="button-list">
        <button onClick={() => setStep(step => step + 1)}>Ok</button>
      </div>
    </div>
    <div className="dialog-mask" style={style7}/>
      </>
  );

  const hideGuige = () => {
    localStorage.setItem("dot-game-guidance-finish","true")
  }
  const Step8 = (
    <>
    <div className="dialog">
      <p>OK! Just enjoy HIT DOTS game!</p>
      <p>Do you want to skip guidance from next time?</p>
      <div className="button-list">
          <button onClick={() => {
            hideGuige();
            setStep(step => step + 1);
          }}>Yes</button>
        <button onClick={()=>setStep(step => step + 1)}>No</button>
        </div>
    </div>
    <div className="dialog-mask" style={style1}/>
      </>
  )

  const Step9 = (
    <>
    <div className="dialog">
      <div className="button-list">
          <button onClick={() => {
            initGame();
            setShowGuide(true);
          }}>Let's Start!</button>
        </div>
    </div>
    <div className="dialog-mask" style={style1}/>
      </>
  )

  return (
    <div  className="dialog-area">
    {step===1 && Step1}
    {step===2 && Step2}
    {step===3 && Step3}
    {step===4 && Step4}
    {step===5 && Step5}
    {step===6 && Step6}
    {step===7 && Step7}
    {step===8 && Step8}
    {step===9 && Step9}
    </div>
  )
}

/** functions */

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

function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 

function createDotStyle(size,left){
  return {
    "width":`${size}px`,
    "height":`${size}px`,
    "borderRadius":`${size}px`,
    "left":`${left}px`,
    "top": `-${size}px`,
  }
}

function createDotTransition(size, duration) {
  return {
      "transform": `translateY(${getElementRect("board").height+size}px)`,
      "transition": `transform ${duration}ms`,
      "transitionTimingFunction": "linear",
  }
}

function createDotWithoutTransition(id) {
  // get relative postition with dot and board
  const top = getElementRect(id).top-getElementRect("header").height;
  return {
      "top": `${top}px`,
      "transform": "none",
      "transition":"none",
      "transitionTimingFunction": "none",
  }
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

/** 
 * get size,position of element using id
 * @param id string
 * @return {}
*/
function getElementRect(id) {
  const e = document.getElementById(id)
  return e ? e.getBoundingClientRect()
    : {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
    }
}

function covertSecondToTime(time) {
  const m=`${(time%3600-time%60)/60}`
  const s=`${time%60}`
  return `${m<10?'0':''}${m}:${s<10?'0':''}${s}`
}

// update player record (only for survive mode and time-limit mode)
function updateRecord(score,mode) {
  const record = localStorage.getItem(`dot-game-history-${mode}`);
  let getHighest = false;
  if (!record || record < score) {
    localStorage.setItem(`dot-game-history-${mode}`, score);
    getHighest = true;
  }
  return getHighest;
}

























/** render */

const domContainer = document.querySelector('#app');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App));