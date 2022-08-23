let PageHeaderNav = function(element, activeItem, cookie, allowEdit) {
  this.element = element
  this.activeItem = activeItem
  this.cookie = cookie
  this.AddItem('home','index.html')

  if( this.cookie?.IsUserLoggedOn() ) {
    if( allowEdit ) this.AddItem('edit', 'crag-edit.html')
  }
}

PageHeaderNav.prototype.AddItem = function(text, link, callback) {
  const newListItem = document.createElement('li')
  newListItem.classList.add('page-header-nav-item')
  if( text == this.activeItem ) newListItem.classList.add('page-header-nav-item-active')
  const itemAddress = document.createElement('a')
  itemAddress.innerText = text
  if( link ) itemAddress.setAttribute('href', link)
  else itemAddress.onclick = callback
  newListItem.appendChild(itemAddress)
  this.element.appendChild(newListItem)
}

module.exports = PageHeaderNav;
