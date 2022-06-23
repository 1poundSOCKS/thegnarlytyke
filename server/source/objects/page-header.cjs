let PageHeader = function(element) {
  this.element = element;
}

PageHeader.prototype.AddIcon = function(fontAwesomeClass, title) {
  const icon = document.createElement("i");
  icon.classList.add("tgt-header-icon");
  icon.classList.add("fa-solid");
  icon.classList.add("fa-border");
  icon.classList.add(fontAwesomeClass);
  icon.setAttribute("title",title)
  return this.element.appendChild(icon);
}

module.exports = PageHeader;
