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
      if( logonResponse.user_token?.length > 0 ) {
        const cookie = new Cookie();
        cookie.SetValue("user-token",logonResponse.user_token)
        window.location.href = "index.html";
      }
    })
  }
}
