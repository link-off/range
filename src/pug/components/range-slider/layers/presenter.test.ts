import View from "./view";
import Model from "./model/model";
import Presenter from './presenter';
import { Result, SassError } from "node-sass";

const path = require('path');
const sass = require("node-sass");
const fs = require('fs');

let cssFromSass: string;
let presenter: Presenter;

function ConfigureJSDOM(): void {
  const textHTML =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><div class="test-in-jest"></div></body></html>';
  const fixWidth =
    ".test-in-jest {width: 390px;}.rangeslider{width: 390px;}.rangeslider__range{width: 390px;}";
  const urlSass = path.normalize(`./src/assets/scss/main.scss`);

  const SassFromFile = sass.renderSync({ file: urlSass});

  sass.render(SassFromFile, (e: SassError, output: Result | undefined) => {
    cssFromSass = output ? output.css.toString() : "";
  });
  document.documentElement.innerHTML = textHTML;
  const head = document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = cssFromSass + fixWidth;
  head.appendChild(style);
}

beforeAll(async () => {
  ConfigureJSDOM();
  const DEFAULTS: RangeSliderPluginOptions = {
    mode: "horizontal",
    type: "multi",
    isTip: true,
    valueMin: 0,
    valueMax: 1060,
    step: 0,
    valueFrom: 322,
    valueTo: 720,
    item: { values: [], indexFrom: 0, indexTo: 0 },
  };
  presenter = new Presenter(new Model(DEFAULTS), new View($(".test-in-jest")));
});

// describe('Check if model is updated after handles position change', () => {
//   test('Left handle', () => {
//     presenter.onHandlePositionUpdate(presenter.view.handleFrom, 150);
//     expect(presenter.model.settings.valueFrom).toBe(425);
//   });
//   test('Right handle', () => {
//     presenter.onHandlePositionUpdate(presenter.view.handleFrom, 200);
//     expect(presenter.model.settings.valueFrom).toBe(567);
//   });
// });