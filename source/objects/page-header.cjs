const PageHeaderNav = require('./page-header-nav.cjs')

let PageHeader = function(element,activeNavItem,cookie,config) {
  this.element = element;
  this.title = this.element.appendChild(document.createElement('div'))
  this.title.classList.add('page-header-text')
  this.title.innerText = 'the gnarly tyke'
  this.navContainer = this.element.appendChild(document.createElement('div'))
  this.navContainer.classList.add('page-header')
  this.nav = this.navContainer.appendChild(document.createElement('ul'))
  this.nav.classList.add('page-header-nav')
  this.nav = new PageHeaderNav(this.nav,activeNavItem,cookie,config?.mode == "edit")
}

let CreatePageHeader = function(activeNavItem,cookie,config) {
  const div = document.createElement('div')
  div.id = 'page-header-container'
  div.appendChild(CreatePageHeaderText())
  div.appendChild(CreatePageHeaderNav(activeNavItem,cookie,config))
  return div
}

let CreatePageHeaderText = function() {
  const div = document.createElement('div')
  div.classList.add('page-header-text')
  div.innerText = 'the gnarly tyke'
  return div
}

let CreatePageHeaderNav = function(activeNavItem,cookie,config) {
  const div = document.createElement('div')
  div.classList.add('page-header')
  const ul = document.createElement('ul')
  ul.classList.add('page-header-nav')
  new PageHeaderNav(ul,activeNavItem,cookie,config?.mode == "edit")
  div.appendChild(ul)
  return div
}

module.exports = PageHeader;
module.exports = CreatePageHeader
