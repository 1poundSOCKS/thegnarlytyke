(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Config = require('./objects/config.cjs');
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const LogonRequest = require('./objects/logon-request.cjs');
const Cookie = require('./objects/cookie.cjs');

let _pageHeaderNav = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _pageHeaderNav = new PageHeaderNav(document.getElementById("page-header-nav"),'logon')
  // _pageHeaderNav.AddItem('logon', 'logon.html')
  
  document.getElementById("submit-logon").onclick = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const logonRequest = new LogonRequest(Config.logon_url, email, password);
    logonRequest.Send()
    .then( logonResponse => {
      if( logonResponse.user_id?.length > 0 && logonResponse.user_token?.length > 0 ) {
        const cookie = new Cookie();
        cookie.SetValue("user-id",logonResponse.user_id)
        cookie.SetValue("user-token",logonResponse.user_token)
        window.location.href = "index.html";
      }
    })
  }
}

},{"./objects/config.cjs":2,"./objects/cookie.cjs":3,"./objects/logon-request.cjs":4,"./objects/page-header-nav.cjs":5}],2:[function(require,module,exports){
let Config = function() {
}

Config.prototype.Load = async function() {
  const response = await fetch('config.json', {cache: "reload"});
  const configData = await response.json();
  Object.assign(this, configData);
}

module.exports = new Config;

},{}],3:[function(require,module,exports){
let Cookie = function() {
  this.RefreshCache();
}

Cookie.prototype.RefreshCache = function() {
  this.value = document.cookie;
  this.values = this.value.split('; ');
  this.valuesMap = new Map(
    this.values.map(value => {
      const keyAndValue = value.split('=')
      return [keyAndValue[0], keyAndValue[1]];
    }),
  );
}

Cookie.prototype.SetValue = function(name, value) {
  document.cookie = `${name}=${value}`;
  this.RefreshCache();
}

Cookie.prototype.GetValue = function(name) {
  return this.valuesMap.get(name);
}

Cookie.prototype.IsUserLoggedOn = function() {
  const userID = this.GetValue("user-id")
  const userToken = this.GetValue("user-token")
  return userID?.length > 0 && userToken?.length > 0 ? true : false;
}

Cookie.prototype.Logoff = function() {
  this.SetValue("user-id","")
  this.SetValue("user-token","")
}

module.exports = Cookie;

},{}],4:[function(require,module,exports){
let LogonRequest = function(url, email, password) {
  this.url = url;
  this.email = email;
  this.password = password;
}

LogonRequest.prototype.Send = async function() {
  const requestBody = JSON.stringify({email:this.email,password:this.password}, null, 2);
  const response = await fetch(this.url, {
    method: 'POST',
    mode: 'cors',
    body: requestBody
  });
  return response.json();
}

module.exports = LogonRequest;

},{}],5:[function(require,module,exports){
let PageHeaderNav = function(element, activeItem, cookie, allowEdit) {
  this.element = element
  this.activeItem = activeItem
  this.cookie = cookie
  this.AddItem('home','index.html')

  if( this.cookie?.IsUserLoggedOn() ) {
    if( allowEdit ) this.AddItem('edit', 'crag-index-edit.html')
    this.AddItem('logoff', null, () => {
      this.cookie.Logoff()
      window.location.href = 'index.html'
    })
  }
  else {
    this.AddItem('logon', 'logon.html')
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

},{}]},{},[1]);
