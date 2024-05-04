function updater(element, relation) {
  if (element[relation].value != element.value) {
    element[relation].value = element.value;
  }
}

function sliderUpdate(element) {
  element.value = config[element.name];
  element.previousElementSibling.value = element.value;
  element.addEventListener("change", (event) => {
    updater(element, "previousElementSibling");
  })
  element.previousElementSibling.addEventListener("change", (event) => {
    updater(element.previousElementSibling, "nextElementSibling");
  })
}

window.addEventListener("load", (event) => {
  ez = document.getElementsByClassName("mondraw-input");
  for (const element of ez) {
    sliderUpdate(element);
  }
})