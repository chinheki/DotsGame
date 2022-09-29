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

