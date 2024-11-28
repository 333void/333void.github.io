function insertAtCursor(myField, myValue) {
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
      myField.value = myField.value.substring(0, startPos)
          + myValue
          + myField.value.substring(endPos, myField.value.length);
      myField.selectionStart = startPos + myValue.length;
      myField.selectionEnd = startPos + myValue.length;
  } else {
      myField.value += myValue;
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
  // shift alternator
  const lShift = document.getElementById('left-shift');
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
  // clear button
  document.getElementById('clear').addEventListener('click', () => {document.getElementById('text').value = '';})
  // for mobile
  document.getElementById('text').addEventListener('focus', (e) => {e.preventDefault();})
}