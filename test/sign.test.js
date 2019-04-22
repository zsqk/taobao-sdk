const { genSign } = require('../build/sign');

test('genSign 函数正常.', () => {
  expect(genSign('secret', {})).toBe('D98221BB33CB9193E00FC7AC1E0E02A9');
  expect(genSign('secret', {}, 'body')).toBe(
    '8774B1C7DF081C53AA0B4D9515190E99'
  );
  expect(genSign('secret', { a: 1, c: 2, b: 3 })).toBe(
    '37920C671B95D3755163099B33C5A509'
  );
  expect(genSign('secret', { a: 1, c: 2, b: 3 }, 'body')).toBe(
    '9DDC469EFF6377D4666E7F51356A68DA'
  );
});
