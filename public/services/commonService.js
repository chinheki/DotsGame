/** 
 * get size,position of element using id
 * @param id string
 * @return {}
*/
function getElementRect(id) {
  const e = document.getElementById(id)
  return e ? e.getBoundingClientRect()
    : {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
    }
}


// get random int from min to max
function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 