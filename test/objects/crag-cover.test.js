const CragCover = require('../../source/objects/crag-cover.cjs');

test("Crag covers with new IDs", () => {
  let baildonBank = new CragCover(null, "Baildon Bank");
  expect(baildonBank.id).toBeDefined();
  expect(baildonBank.name).toEqual("Baildon Bank");
  let ilkleyCowAndCalf = new CragCover(null, "Ilkley Cow & Calf");
  expect(ilkleyCowAndCalf.id).toBeDefined();
  expect(ilkleyCowAndCalf.name).toEqual("Ilkley Cow & Calf");
  expect(ilkleyCowAndCalf.id).not.toEqual(baildonBank.id);
});

test("Crag cover with existing ID", () => {
  let cover = new CragCover("c35b61c3-320b-428a-833c-4058afc3443e", "Baildon Bank");
  expect(cover.id).toEqual("c35b61c3-320b-428a-833c-4058afc3443e");
  expect(cover.name).toEqual("Baildon Bank");
});
