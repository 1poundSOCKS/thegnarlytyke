(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Config = require('./objects/config.cjs');
const PageHeader = require('./objects/page-header.cjs')
const LogonRequest = require('./objects/logon-request.cjs');
const Cookie = require('./objects/cookie.cjs');

let _pageHeader = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _pageHeader = new PageHeader(document.getElementById("page-header"));
  
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

},{"./objects/config.cjs":2,"./objects/cookie.cjs":3,"./objects/logon-request.cjs":4,"./objects/page-header.cjs":5}],2:[function(require,module,exports){
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
let PageHeader = function(element) {
  this.element = element;
}

PageHeader.prototype.AddIcon = function(fontAwesomeClass, title) {
  const icon = document.createElement("i");
  icon.classList.add("header-icon");
  icon.classList.add("fa-solid");
  icon.classList.add(fontAwesomeClass);
  icon.setAttribute("title",title)
  return this.element.appendChild(icon);
}

PageHeader.prototype.AddLogonIcon = function() {
  return this.AddIcon("fa-sign-in","Logon").onclick = () => window.location.href = "logon.html";
}

module.exports = PageHeader;

},{}]},{},[1]);
