const Config = require('./objects/config.cjs');
const PageHeader = require('./objects/page-header.cjs')

let _pageHeader = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _pageHeader = new PageHeader(document.getElementById("page-header"));
  
  document.getElementById("submit-logon").onclick = () => {
    history.back()
  }
}
