// show score of game
function Score(){
  const {score} = React.useContext(GameContext);
  return <h1 id="score" >{score}</h1>;
}
