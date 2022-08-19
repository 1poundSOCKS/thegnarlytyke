const Config = require('./objects/config.cjs');
const PageHeader = require('./objects/page-header.cjs');
const LogonRequest = require('./objects/logon-request.cjs');
const Cookie = require('./objects/cookie.cjs');

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  new PageHeader(document.getElementById('page-header-container'),'logon')

  const page = document.getElementById('page')
  page.appendChild(CreateLogonForm())

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

let CreateLogonForm = () => {
  const form = document.createElement('form')
  form.classList.add('centered')
  form.appendChild( CreateLogonDetail('email') )
  form.appendChild( CreateLogonDetail('password') )
  form.appendChild( CreateFormInput() )
  return form
}

let CreateLogonDetail = (name) => {
  const div = document.createElement('div')
  div.classList.add('logon-detail')
  div.appendChild( CreateLabel(name) )
  div.appendChild( CreateInput(name) )
  return div
}

let CreateLabel = (name) => {
  const div = document.createElement('div')
  const label = document.createElement('label')
  label.for = name
  label.innerText = `${name}:`
  div.appendChild(label)
  return div
}

let CreateInput = (name) => {
  const div = document.createElement('div')
  const input = document.createElement('input')
  input.id = name
  input.type = 'text'
  div.appendChild(input)
  return div
}

let CreateFormInput = () => {
  const input = document.createElement('input')
  input.id = 'submit-logon'
  input.type = 'button'
  input.value = 'submit'
  return input
}
