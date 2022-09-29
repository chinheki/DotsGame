const useState = React.useState;
const useContext = React.useContext;
const useEffect = React.useEffect;
const useRef = React.useRef;
/** context */
const GameContext = React.createContext({});

function App() {
  const [start,setStart]=useState(false)
  const [createDotIntervalID ,setCreateDotIntervalID]=useState(null)
  const [score,setScore]=useState(0)
  const [duration,setDuration]=useState(0)
  const [speed,setSpeed]=useState(0)
  const [dots,setDots]=useState({})
  const [index, setIndex] =React.useState(0)
  const [showGuide, setShowGuide] =React.useState(getIfHideGuide());
  const [mode, setMode] =React.useState(0)
  const [openModal, setOpenModal] =React.useState(MODAL_TYPE.NONE)
  const [hp, setHp] =React.useState(100)
  const [sound, setSound] =React.useState(true)
  const [time, setTime] =React.useState(0)
  const [getHighest, setGetHighest] =React.useState(false)
  const [hideElements, setHide] =React.useState(false)

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
    setHp(100);
    setTime(mode===GAME_MODE.TIMELIMIT?60:0);
    setCreateDotIntervalID(null);
  }

  const changeMode = (m) => {
    initGame()
    setMode(m)
  }
    
  const addScore = (add) => {
    setScore(score => {
      const newScore = score + add;
      if (mode === GAME_MODE.ENDLESS) {
        updateRecord(newScore, GAME_MODE.ENDLESS);
      }
      return newScore;
    })
  }

  // init game when change mode
 React.useEffect(() => {
    initGame();
  }, [mode])

  // game finish when time=0 in time limit mode
 React.useEffect(() => {
      if (start && mode===GAME_MODE.TIMELIMIT && time <= 0) {
        setStart(false);
        setGetHighest(updateRecord(score, GAME_MODE.TIMELIMIT));
        setOpenModal(MODAL_TYPE.TIMEOUT);
      }
  }, [time])

  // game finish when hp=0 in survive mode
 React.useEffect(() => {
      if (start && mode===GAME_MODE.SURVIVE && hp === 0 && time>0) {
        setStart(false);
        setGetHighest(updateRecord(score, GAME_MODE.SURVIVE));
        setOpenModal(MODAL_TYPE.GAMEOVER);
      }
  }, [hp])
    
  // when game starts, a new dot appear every 1000ms
 React.useEffect(()=>{
    if (start) {
      if (!createDotIntervalID) {
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
        setSound,
        hideElements,
        setHide
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

const domContainer = document.querySelector('#app');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App));