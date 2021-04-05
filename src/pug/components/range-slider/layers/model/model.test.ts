import { DEFAULTS } from './../../constants';
import Model from './model';

let model: Model;

beforeAll(async () => {
  model = new Model();
});

describe("model", () => {
  it("Загрузка дефолтных значений", () => {
    expect(model.settings).toEqual(DEFAULTS);
  });
});
