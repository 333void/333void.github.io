import { layouts } from "./layouts.data.js";
/* import { chars } from "./r30.js"; */

const supSChars = {
  a: '\u1D43',
  e: '\u1D49',
  i: '\u2071',
  o: '\u1D52',
  u: '\u1D58'
}

function changeKeys(layout, keyCase) {
  const lO = layouts[layout]
  
  for (let r = 0; r < lO.length; r++) { // rows
    for (let k = 0; k < lO[r].length; k++) { // keys
      let key = document.getElementById(`key-${r + 1}-${k + 1}`);
      if (key) {
        // get value to change key to
        let val;
        if (Array.isArray(lO[r][k])) {
          val = lO[r][k][keyCase];
        } else {
          val = lO[r][k];
        }
        // update key
        switch (val) {
          // if key is disabled change attributes
          case "disabled":
            key.disabled = true;
            key.textContent = '';
            break;
          case "blanc":
            key.disabled = false;
            key.textContent = '';
            break;
          // update key to value in table
          default:
            key.disabled = false;
            key.textContent = val;
        }
      } else {
        console.error(`attempting to update keys not existing on keyboard: key-${r + 1}-${k + 1}`)
      }
    }
  }
  if (layout === 'ipe') {
    const rAlt = document.getElementById('key-3-12');
    rAlt.addEventListener('click', () => {
      const text = document.getElementById('text');
      let charIndex = text.selectionStart - 1;
      let char = text.value.charAt(charIndex);
      if (char && supSChars[char]) {
        insertAtCursor(text, supSChars[char].toString(), 1)
      }
    })
  }
}

window.onload = () => {
  // make keys functional
  for (const key of document.querySelectorAll(".key.ipa")) {
    const text = document.getElementById('ipa');
    key.addEventListener('click', () => {
      text.textContent += key.textContent;
    })
  }
  // shift key chagne event listener
  const lShift = document.getElementById('voice');
  lShift.addEventListener('click', () => {
    let keyCase;
    switch (lShift.getAttribute('on')) {
      case 'true':
        keyCase = '1';
        lShift.setAttribute('on', 'false')
        break;
      case 'false':
        keyCase = '0';
        lShift.setAttribute('on', 'true')
        break;
    }
    // update all keys
    changeKeys('consonants', keyCase);
  })
  // reset if page refreshed
  changeKeys('consonants', 1);

  /*
  // html element typer lol
  let text = '';
  for (let i = 1; i < 12; i++) {
    text += `<button id="key-7-${i}" class="key"></button>\n`;
  } 
  console.log(text);
  */
}