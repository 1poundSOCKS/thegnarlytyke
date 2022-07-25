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
