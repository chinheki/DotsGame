// setting modal
function SettingModal() {

  const {mode,sound,setMode,setOpenModal,setSound} = React.useContext(GameContext);
  const styleForMask = {
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
          
        {mode === GAME_MODE.ENDLESS ?
          <div>
            <p>Game will never finish</p>
            <p>and dots will fall down forever.</p>
            <p>[RECORD: {getRecord(GAME_MODE.ENDLESS) }]</p>
          </div>
          :
          mode === GAME_MODE.SURVIVE ?
            <div>
              <p>If you miss dots,</p>
              <p>your HP will be cut.</p>
              <p>The bigger the dot is,</p>
              <p>When HP become 0,</p>
              <p>GAME OVER.</p>
              <p>[RECORD: {getRecord(GAME_MODE.SURVIVE) }]</p>
            </div>
            :
            <div>
              <p>Try to get highest score</p>
              <p>in only 1 MINUTE.</p>
              <p>[RECORD: {getRecord(GAME_MODE.TIMELIMIT) }]</p>
            </div>
        }
        <div className="button-list">
        <h2>Sound</h2>
          <button className={"checkbox" } onClick={() => { setSound(s => !s) }}>
            {sound ? "✔" : ""}
          </button>
        </div>
        <div className="button-list">
      <button onClick={() => {setOpenModal(MODAL_TYPE.NONE) }}>Close</button>
      </div>
      </div>
      <div className="dialog-mask" style={styleForMask}/>
    </div>
  )
}
