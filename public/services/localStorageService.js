/**
 * services to set and get localstorage
 */

// get player record
function getRecord(mode) {
  const record = localStorage.getItem(`dot-game-history-${mode}`);
  if (!record) {
    return 0;
  }
  return record;
};

// update player record and return if recode is updated
function updateRecord(score,mode) {
  const record = getRecord(mode);
  let getHighest = false;
  if (record < score) {
    localStorage.setItem(`dot-game-history-${mode}`, score);
    getHighest = true;
  }
  return getHighest;
};

// skip guidance for the next time
function hideGuige() {
    localStorage.setItem("dot-game-guidance-finish", "true")
};

// get player record
function getIfHideGuide() {
  return localStorage.getItem("dot-game-guidance-finish");
};
