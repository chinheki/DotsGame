// game board
function Board() {
  const {setSpeed,dots,setDots,index,mode,setHp,setTime,hideElements} =React.useContext(GameContext);

  const isMounted =React.useRef(null);

  // init speed when board is mounted
 React.useEffect(() => {
    if (isMounted?.current) {
      setSpeed(10)
      
    }
    }, [isMounted]);
  
    // dots list will be update every minute to create a new dot and delete some useless dots
 React.useEffect(()=>{
    if (index > 0 && setDots) {
      // time controller
      mode === GAME_MODE.TIMELIMIT ? setTime(t => t - 1) : setTime(t => t + 1);
      const boardRect = getElementRect("board");
      if (boardRect.width > 0) {
        const dot = createRandomDot(index, boardRect.width);
        setDots((dots) => {
          const useLessDots = []
          Object.entries(dots).forEach(([id,dot]) => {
          if(getElementRect(id).top >= boardRect.bottom){
              if (mode === 1) {
                setHp(hp => {
                  const last = hp - Math.floor(dot.props.size / 10);
                  if (last < 0) {
                    return 0;
                  }
                  return last;
                });
              }
          // delete dots out of screen
              useLessDots.push(id);
            }
          })
          useLessDots.forEach(id => {
            delete dots[id];
          })
          // add new dot
          dots[`${index}`]=dot;
          return dots
        });
      }
    }
  },[index])
  
  return (
    <div id="board" ref={isMounted}>
      {!hideElements && <PauseFace />}
      {mode === GAME_MODE.SURVIVE && !hideElements && <Hp />}
      {!hideElements && <Time />}
      <div>
        {Object.entries(dots).map(([id, dot]) => <div key={id}>{dot}</div>)}
      </div>
    </div>
  );
}
