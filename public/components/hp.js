
// show hp in survive mode
function Hp(){
  const {hp} = React.useContext(GameContext);
  return <h1 id="hp" >{hp}</h1>;
}
