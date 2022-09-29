
// guidence of game
function GuideDialog() {
  const [step, setStep] =React.useState(1);
  const {setShowGuide,setStart,initGame,setSpeed} =React.useContext(GameContext);
  const maxSize = 2*(window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight);
  
    const styleDefault = {
    "width": `100%`,
    "height": `100%`,
    "backgroundColor": "#000000",
    "left": `0px`,
    "top": `0px`,
  };
  const styleForStartButton = getGuideStyleByElementId("start", maxSize);
  const styleForBoard = {
    "borderWidth": `${maxSize}px`,
    "borderRadius": `${2*maxSize}px`,
    "transform": `translate(-${maxSize}px, -${maxSize}px)`,
    "width": `${getElementRect("board").width}px`,
    "height": `${getElementRect("board").height}px`,
    "left": `calc(50% - ${getElementRect("board").width/2})px`,
    "top": `calc(50% - ${getElementRect("board").height/2})px`,
  };
  const styleForHp = {
    "borderWidth": `${maxSize}px`,
    "borderRadius": `${2 * maxSize}px`,
    "transform": `translate(-${maxSize}px, -${maxSize}px)`,
    "width": "150px",
    "height": "60px",
    "left": "-50px",
    "top": "calc(100% - 40px)",
  };

  const Step1 = (
    <>
      <div className="dialog">
        <p>Hello! Here is HIT DOTS game!</p>
        <p>Is it the first time for you to play this game?</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Yes</button>
          <button onClick={() => setStep(13)}>No</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleDefault} />
    </>
  );

  const Step2 = (
    <>
      <div className="dialog">
        <p>Just start Game by click [Start] button.</p>
        <div className="button-list">
          <button onClick={() => {
            setStart(true);
            setSpeed(100);
            setStep(step => step + 1);
          }}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleForStartButton} />
    </>
  );

  const Step3 = (
    <>
      <div className="dialog" style={{ "transform": "translateY(200px)" }}>
        <p>Dots fall down from top to board.</p>
        <p>Touch them to get score!</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleForBoard} />
    </>
  );

  const Step4 = (
    <>
      <div className="dialog" style={{ "transform": "translateY(200px)" }}>
        <p>Here is time increasesing from 0s when game starts.</p>
        <p>In Time-Limit Mode, time will decrease from 60s.</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={getGuideStyleByElementId("time", maxSize)} />
    </>
  );
  
  const Step5 = (
    <>
      <div id="step5" className="dialog" style={{ "transform": "translateY(200px)" }}>
        <p>when you are playing Survive Mode,</p>
        <p>Your HP will show up here.</p>
        <p>Try to keep it over 0!</p>
        <div className="button-list">
          <button onClick={() => {
            setStep(step => step + 1);
            const dots = document.getElementsByClassName("dot");
            if (dots.length > 0) {
              for (let i = 0; i < dots.length;i++){
                if (dots[i].getBoundingClientRect().top > getElementRect("header").bottom
                  && dots[i].getBoundingClientRect().bottom < getElementRect("step5").top) {
                  dots[i].click();
                  break;
                };
              }
            }
          }}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleForHp} />
    </>
  );

  const Step6 = (
    <>
      <div className="dialog" style={{ "transform": "translateY(200px)" }}>
        <p>By the way, when a dot is touched,</p>
        <p>It will leave on your board as an ink dot.</p>
        <p>Try hit more dots to get your uniq picture!</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Cool</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleForBoard} />
    </>
  );

  const Step7 = (
    <>
      <div className="dialog">
        <p>Pause Game by click [Pause] button.</p>
        <div className="button-list">
          <button onClick={() => {
            setStart(false)
            setSpeed(10);
            setStep(step => step + 1);
          }}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleForStartButton} />
    </>
  );

  const Step8 = (
    <>
      <div className="dialog">
        <p>You can change the speed of dots by drag this slider.</p>
        <p>But only when the game is Paused!</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={getGuideStyleByElementId("slider-block", maxSize)} />
    </>
  );

  const Step9 = (
    <>
      <div className="dialog">
        <p>Click [Start] button to restart...</p>
        <p>Or click anywhere in the board!</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleForStartButton} />
    </>
  );

  const Step10 = (
    <>
      <div className="dialog">
        <p>You can get score each time you hit a dot.</p>
        <p>The smaller the dot is, the larger score you will get!</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={getGuideStyleByElementId("score", maxSize)} />
    </>
  );

  const Step11 = (
    <>
      <div className="dialog">
        <p>Click here to open setting modal.</p>
        <p>You can change game mode, turn on/off sound.</p>
        <p>Check other game mode to get more fun!</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={getGuideStyleByElementId("setting", maxSize)} />
    </>
  );

  const Step12 = (
    <>
      <div className="dialog">
        <p>Click here to hide time, HP,</p>
        <p>and pause icon on board,</p>
        <p>Than you can take screenshot of your board.</p>
        <div className="button-list">
          <button onClick={() => setStep(step => step + 1)}>Ok</button>
        </div>
      </div>
      <div className="dialog-mask" style={getGuideStyleByElementId("hide-elements", maxSize)} />
    </>
  );

  const Step13 = (
    <>
      <div className="dialog">
        <p>OK! Just enjoy HIT DOTS game!</p>
        <p>Do you want to skip guidance from next time?</p>
        <div className="button-list">
          <button onClick={() => {
            hideGuige();
            setStep(step => step + 1);
          }}>Yes</button>
          <button onClick={() => setStep(step => step + 1)}>No</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleDefault} />
    </>
  );

  const Step14 = (
    <>
      <div className="dialog">
        <div className="button-list">
          <button onClick={() => {
            initGame();
            setShowGuide(true);
          }}>Let's Start!</button>
        </div>
      </div>
      <div className="dialog-mask" style={styleDefault} />
    </>
  );

  return (
    <div  className="dialog-area">
    {step===1 && Step1}
    {step===2 && Step2}
    {step===3 && Step3}
    {step===4 && Step4}
    {step===5 && Step5}
    {step===6 && Step6}
    {step===7 && Step7}
    {step===8 && Step8}
    {step===9 && Step9}
    {step===10 && Step10}
    {step===11 && Step11}
    {step===12 && Step12}
    {step===13 && Step13}
    {step===14 && Step14}
    </div>
  )
}


/**
 * create style of mask using in guidance
 * show highlight for the element what guidance is talking about
 * @param string id 
 * @param int maxSize: max size of screen
 * @returns 
 */
function getGuideStyleByElementId(id,maxSize) {
  return  {
    "borderWidth": `${maxSize}px`,
    "borderRadius": `${2*maxSize}px`,
    "transform": `translate(-${maxSize}px, -${maxSize}px)`,
    "width": `${getElementRect(id).width*2}px`,
    "height": `${getElementRect(id).height*2}px`,
    "left": `${getElementRect(id).left-getElementRect(id).width/2}px`,
    "top": `${getElementRect(id).top-getElementRect(id).height/2}px`,
  }
}
