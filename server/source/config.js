let _environment = "prod";

module.exports = SetEnvironment = () => new Promise( resolve => {
  resolve(_environment);
});

module.exports = GetEnvironment = () => _environment;
