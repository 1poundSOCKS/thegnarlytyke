let IconBar = function(element) {
  this.element = element;
  this.fontAwsomeBaseClass = "far"
}

IconBar.prototype.AddIcon = function(fontAwesomeClass, title, OnClickHandler) {
  const icon = document.createElement("i");
  icon.classList.add(this.fontAwsomeBaseClass);
  icon.classList.add(fontAwesomeClass);
  icon.setAttribute("title",title)
  icon.onclick = OnClickHandler
  return this.element.appendChild(icon);
}

module.exports = IconBar;
