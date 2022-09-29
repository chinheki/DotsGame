
// tool bar with button click to start game/end game and setting button
function ToolBar(){
  const {start,setStart,openSetting,setOpenModal,setHide} = React.useContext(GameContext);
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
      <button  id="setting"className="icon" disabled={openSetting} onClick={onSettingClick}><img alt="" src="https://cdn.glitch.global/cf6960fd-2ec9-4452-818e-c97cdaa05407/setting.png?v=1664290953894"/></button>
      <button id="hide-elements" className="icon" onClick={()=>setHide(h=>!h)}><img alt="" src="https://cdn.glitch.global/cf6960fd-2ec9-4452-818e-c97cdaa05407/photo-capture.png?v=1664290749174"/></button>
    </div>
  );
}

