
// dialog shows when you lose game in survive mode
function GameFinishDialog({getHighest}) {
  const { score, setStart, setOpenModal, initGame } =React.useContext(GameContext);
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


