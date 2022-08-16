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

module.exports = PageHeader;
