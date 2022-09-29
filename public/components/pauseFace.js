
// mask show when game is paused
function PauseFace() {
    const {start,setStart} = React.useContext(GameContext);

  return start?null:<div id="pause-face" onClick={()=>{setStart(true)}}><div>||</div></div>
}
