const config = require('source/objects/config.cjs');

test("Config: intial state", () => {
  expect(config.environment).toEqual("prod");
  expect(config.mode).toEqual("view");
});

test("Config: Load", () => {
  const inputData = { environment: "test" };
  config.Load(inputData);
  expect(config.environment).toEqual("test");
});

test("Config: state retained", () => {
  expect(config.environment).toEqual("test");
});
