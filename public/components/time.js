// show time pass in endless/survive mode, show time last in time-limit mode
function Time(){
  const {time} = React.useContext(GameContext);
  return <h1 id="time" >{covertSecondToTime(time)}</h1>;
} 


// get MM:SS format of seconds
function covertSecondToTime(time) {
    const m = `${(time % 3600 - time % 60) / 60}`;
    const s = `${time % 60}`;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}