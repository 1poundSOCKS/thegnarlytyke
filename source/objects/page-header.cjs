const PageHeaderNav = require('./page-header-nav.cjs')

let CreatePageHeader = function(activeNavItem,cookie,config) {
  const div = document.createElement('div')
  div.id = 'page-header-container'
  div.appendChild(CreatePageHeaderText(cookie))
  div.appendChild(CreatePageHeaderNav(activeNavItem,cookie,config))
  return {root:div}
}

let CreatePageHeaderText = function(cookie) {
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

module.exports = CreatePageHeader
