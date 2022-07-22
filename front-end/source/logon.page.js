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
  _pageHeaderNav.AddItem('logon', 'logon.html')
  
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
