let FileSelector = function(parentElement) {
  const container = document.createElement('div')
  container.setAttribute('style','display:none')
  this.fileUpload = document.createElement('input')
  this.fileUpload.setAttribute('type','file')
  container.appendChild(this.fileUpload)
  parentElement.appendChild(container)
}

FileSelector.prototype.SelectFile = function(Callback) {
  this.fileUpload.onchange = () => {
    Callback(this.fileUpload.files[0])
  }
  this.fileUpload.click()
}

module.exports = FileSelector;
