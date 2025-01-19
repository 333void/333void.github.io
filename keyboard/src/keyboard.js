import { layouts } from "./layouts.data.js";

const supSChars = {
  a: '\u1D43',
  e: '\u1D49',
  i: '\u2071',
  o: '\u1D52',
  u: '\u1D58'
}

function insertAtCursor(myField, myValue, erase = 0) {
  //IE support
  if (document.selection) {
      myField.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
  }
  //MOZILLA and others
  else if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos - erase)
          + myValue
          + myField.value.substring(endPos, myField.value.length);
      myField.selectionStart = startPos + myValue.length;
      myField.selectionEnd = startPos + myValue.length;
  } else {
      myField.value += myValue;
  }
}

function changeKeys(layout) {
  const lO = layouts[layout]
  // rows
  for (let r = 0; r < lO.length; r++) {
    // keys
    for (let k = 0; k < lO[r].length; k++) {
      let key = document.getElementById(`key-${r + 1}-${k + 1}`);
      if (key) {
        if (lO[r][k] === 'disabled') {
          key.disabled = true;
          key.textContent = '';
          continue
        } else {
          key.disabled = false;
        }
        // set textcontent if text is specified
        if (lO[r][k][0]) {
          key.textContent = lO[r][k][0];
        }
        key.setAttribute('lowerCase', lO[r][k][0]);
        if (lO[r][k][1]) {
          key.setAttribute('upperCase', lO[r][k][1]);
        } else {
          key.setAttribute('upperCase', lO[r][k][0]);          
        }
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
  for (const key of document.querySelectorAll(".key.text")) {
    const text = document.getElementById('text');
    if (key.id == 'clear') {
      key.addEventListener('click', () => {
        text.value = '';
      })
      continue
    }
    key.addEventListener('click', () => {
      insertAtCursor(text, key.textContent);
    })
  }
  // shift key chagne event listener
  const lShift = document.getElementById('key-3-1');
  lShift.addEventListener('click', () => {
    let keyCase;
    switch (lShift.getAttribute('on')) {
      case 'true':
        keyCase = 'lowerCase';
        lShift.setAttribute('on', 'false')
        break;
      case 'false':
        keyCase = 'upperCase';
        lShift.setAttribute('on', 'true')
        break;
    }
    for (const key of document.querySelectorAll(".key.text")) {
      key.textContent = key.getAttribute(keyCase);
    }
  })
  // keyboard select
  document.getElementById('querty').selected = true;
  document.getElementById('kb-select').addEventListener('change', (e) => {changeKeys(e.target.value)})  
  // clear button
  document.getElementById('clear').addEventListener('click', () => {document.getElementById('text').value = '';})
  // for mobile
  document.getElementById('text').addEventListener('focus', (e) => {e.preventDefault();})
  // reset if page refreshed
  changeKeys('querty');
}