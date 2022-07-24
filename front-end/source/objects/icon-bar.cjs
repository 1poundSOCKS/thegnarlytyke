let IconBar = function(element) {
  this.element = element;
}

IconBar.prototype.AddIcon = function(fontAwesomeClass, title, OnClickHandler) {
  const icon = document.createElement("i");
  icon.classList.add("fa-solid");
  icon.classList.add(fontAwesomeClass);
  icon.setAttribute("title",title)
  icon.onclick = OnClickHandler
  return this.element.appendChild(icon);
}

module.exports = IconBar;
