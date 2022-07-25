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
