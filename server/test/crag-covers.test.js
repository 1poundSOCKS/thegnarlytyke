require('../source/crag-covers.js');


test("LoadCragCovers", () => {
  let input =
  '{ \
    "covers": [ \
      { \
        "id": "6b1dac41-3782-422d-91a9-5513ba4423f1", \
        "name": "Baildon Bank" \
      }, \
      { \
        "id": "f7568739-15bc-45ae-b67d-6aa43600521f", \
        "name": "Ilkley Cow & Calf" \
      } \
    ] \
   }';
  console.log(input);
  let cragCovers = LoadCragCovers(input);
  expect(cragCovers).toBeDefined();
  let cragCoverIDs = GetCragCoverIDs(cragCovers);
  expect(cragCoverIDs).toEqual(['6b1dac41-3782-422d-91a9-5513ba4423f1','f7568739-15bc-45ae-b67d-6aa43600521f']);
});

test("CreateCragCovers", () => {
  let cragCovers = CreateCragCovers();
  expect(cragCovers).toBeDefined();
});

test("AddCragCover", () => {
  let cragCovers = CreateCragCovers();
  let cragCover = AppendCragCover(cragCovers, "Baildon Bank");
  expect(cragCover.id).toBeDefined();
  expect(cragCover.name).toEqual("Baildon Bank");
});
