import View from "./view";
import Model from "./model/model";

const path = require("path");
const sass = require("node-sass");
const fs = require("fs");

let cssFromSass: string;
let view: View;

function ConfigureJSDOM(): void {
  const textHTML =
    '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><div class="test-in-jest"></div></body></html>';
  const fixWidth =
    ".test-in-jest {width: 390px;}.range-slider{width: 390px;}.range-slider__range{width: 390px;}";
  const urlSass = path.normalize(`./src/assets/scss/main.scss`);

  const SassFromFile = sass.render({ file: urlSass });


  console.group('==SassFromFile=======')
  console.log('SassFromFile: ', SassFromFile);
  console.groupEnd();

  sass.render(SassFromFile, { file: urlSass }, (e: any, output: any) => {
    console.log("urlSass: ", urlSass);
    console.log('output: ', output);

    cssFromSass = output ? output.css.toString() : "";
  });
  document.documentElement.innerHTML = textHTML;
  const head = document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = cssFromSass + fixWidth;
  head.appendChild(style);
}

function setCurrentSettings(viewTest: View, data = {}): void {
  viewTest.settings = $.extend(view.settings, data);
}

beforeAll(async () => {
  ConfigureJSDOM();
  view = new View($(".test-in-jest"));
  $.extend(true, view.settings, Model.defaults);
  // setCurrentSettings(view, {
  //   mode: 'horizontal',
  //   type: 'multi',
  //   isTip: true,
  //   valueMin: 0,
  //   valueMax: 1060,
  //   step: 0,
  //   valueFrom: 322,
  //   valueTo: 720,
  // });
});

describe('Check result of isEqualArrays() function, return value true or false', () => {
  const ar1String = ['a', 'bb', '123'];
  const ar2String = ['a', 'bb', '123'];
  const ar3String = ['a', 'bb', '124'];
  const ar4String = ['a', 'bb', '123', 'x'];
  const ar1Number = [1, 2, 3, 4, 5];
  const ar2Number = [1, 2, 3, 4, 5];
  const ar3Number = [1, 2, 3, 4, 6];
  const ar4Number = [1, 2, 3, 4, 5, 6];
  test('isEqualArrays() function return true if two array is equal, both arrays have string type', () => {
    expect(view.isEqualArrays(ar1String, ar2String)).toBe(true);
  });
  test('isEqualArrays() function return true if two array is equal, both arrays have number type', () => {
    expect(view.isEqualArrays(ar1Number, ar2Number)).toBe(true);
  });
  describe('Check if isEqualArrays() function return false, different situations', () => {
    test('If string arrays have different length', () => {
      expect(view.isEqualArrays(ar3String, ar4String)).toBe(false);
    });
    test('If number arrays have different length', () => {
      expect(view.isEqualArrays(ar3Number, ar4Number)).toBe(false);
    });
    test('If different values in string arrays, but same length', () => {
      expect(view.isEqualArrays(ar2String, ar3String)).toBe(false);
    });
    test('If different values in number arrays, but same length', () => {
      expect(view.isEqualArrays(ar2Number, ar3Number)).toBe(false);
    });
    test('Arrays have different types', () => {
      expect(view.isEqualArrays(ar2Number, ar3String)).toBe(false);
    });
    test('First array is null', () => {
      expect(view.isEqualArrays(null, ar3String)).toBe(false);
    });
    test('Second array is null', () => {
      expect(view.isEqualArrays(ar2Number, null)).toBe(false);
    });
  });
});

describe("Check result of getNearestHandle() function. Six different tests.", () => {
  describe("If there are two handles.", () => {
    // test("LMB clicked on the left of first handle", () => {
    //   const recieved = view.getNearestHandle(32);
    //   expect(recieved.is(view.handleFrom)).toBe(true);
    // });
    // test('LMB clicked between two handles, closer to left handle', () => {
    //   const recieved = view.getNearestHandle(95);
    //   expect(recieved.is(view.handleFrom)).toBe(true);
    // });
    test('LMB clicked between two handles, closer to rigth handle', () => {
      const recieved = view.getNearestHandle(208);
      expect(recieved.is(view.handleTo)).toBe(true);
    });
    test('LMB clicked on the right of second handle', () => {
      const recieved = view.getNearestHandle(300);
      expect(recieved.is(view.handleTo)).toBe(true);
    });
  });
  describe('If there are one handle.', () => {
    beforeAll(() => {
      setCurrentSettings(view, {
        mode: 'single',
        valueTo: 491,
      });
    });
    test('LMB clicked on the left of handle', () => {
      expect(view.getNearestHandle(10)).toBe(view.handleTo);
    });
    test('LMB clicked on the right of handle', () => {
      expect(view.getNearestHandle(203)).toBe(view.handleTo);
    });
  });
});

describe('Check result of moveHandle() function', () => {
  test('If rangeslider has range of values from one(min.) to another(max.)  ', () => {
    const result: HandleMovingResult = view.moveHandle(view.handleFrom, 10);
    const relValue = view.convertPixelValueToRelativeValue(10);
    expect(result.isFromHandle).toBe(true);
    expect(result.value).toBe(relValue);
    expect(result.isUsingItems).toBe(view.settings.item.values.length > 1);
  });
  test('If rangeslider has collection of item', () => {
    setCurrentSettings(view, {
      valueMin: 1,
      valueMax: 5,
      valueFrom: 1,
      valueTo: 5,
      item: { values: [1, 2, 3, 4, 5], indexFrom: 0, indexTo: 4 },
    });
    const result: HandleMovingResult = view.moveHandle(view.handleFrom, 20);
    const relValue = view.convertPixelValueToRelativeValue(20);
    expect(result.isFromHandle).toBe(true);
    // expect(result.value).toBe(relValue);
    expect(result.isUsingItems).toBe(view.settings.item.values.length > 1);
  });
});

describe('Check result of convertRelativeValueToPixelValue() function', () => {
  test('If passed value is index for values array', () => {
      console.log("document.head: ", $(document.head).html());
      console.log("document.body: ", $(document.body).html());
      console.log("document.scripts: ", $(document.scripts).html());
      console.log("html: ", view.el.html());
      console.log("find0: ", view.el.width());
      console.log("find1: ", view.el.find(".range-slider__handle_from").width());
    setCurrentSettings(view, { item: { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } });
    expect(view.convertRelativeValueToPixelValue(3)).toBe(102);
  });
  test('If passed value is relative value', () => {
    setCurrentSettings(view, { valueMin: 100, valueMax: 1100, item: { values: [] } });
    expect(view.convertRelativeValueToPixelValue(600)).toBe(187);
  });
});

// describe('Check result of convertPixelValueToRelativeValue() function ', () => {
//   test('If passed value is relative value', () => {
//     expect(view.convertPixelValueToRelativeValue(187)).toBe(600);
//   });
// });

describe('Check result of validate() function', () => {
  describe('If there are two handles', () => {
    beforeEach(() => {
      view.drawSlider(Model.defaults, {
        type: 'multi',
        valueMin: 0,
        valueMax: 1060,
        valueFrom: 322,
        valueTo: 491,
        item: { values: [] },
      });
    });
    test('If from handle position is less than zero', () => {
      expect(view.validate(-5, view.handleFrom)).toBe(0);
    });
    test('If from handle position is bigger than to handle position', () => {
      expect(view.validate(444, view.handleFrom)).toBe(view.handleTo.getPos());
    });
    test('if to handle position is bigger than rangeslider length', () => {
      expect(view.validate(444, view.handleTo)).toBe(view.range.getSize() - view.handleTo.getSize());
    });
    test('if to handle position is less than from handle position', () => {
      expect(view.validate(10, view.handleTo)).toBe(view.handleFrom.getPos());
    });
  });
  describe('If only one handle', () => {
    beforeEach(() => {
      view.drawSlider(Model.defaults, {
        mode: 'single',
        valueMin: 0,
        valueMax: 1060,
        valueFrom: 322,
        valueTo: 491,
        item: { values: [] },
      });
    });
    test('If to handle position is less than zero', () => {
      expect(view.validate(-15, view.handleTo)).toBe(0);
    });
    test('if to handle position is bigger than rangeslider length', () => {
      expect(view.validate(500, view.handleTo)).toBe(view.range.getSize() - view.handleTo.getSize());
    });
  });
});

// describe('Check result of getSteppedPos() function', () => {
//   beforeEach(() => {
//     view.drawSlider(Model.defaults, {
//       type: 'multi',
//       valueMin: 0,
//       valueMax: 2000,
//       valueFrom: 322,
//       valueTo: 491,
//       step: 1,
//       item: { values: [] },
//     });
//   });
  // test('If there is no step', () => {
  //   expect(view.getSteppedPos(15)).toBe(null);
  // });
  // test('If there is step. Step is defined, rounding down ', () => {
  //   view.drawSlider(Model.defaults, {
  //     valueMin: 0,
  //     valueMax: 374,
  //     step: 100,
  //   });
  //   expect(view.getSteppedPos(40)).toBe(0);
  // });
  // test('If there is step. Step is defined, rounding up ', () => {
  //   view.drawSlider(Model.defaults, {
  //     valueMin: 0,
  //     valueMax: 374,
  //     step: 100,
  //   });
  //   expect(view.getSteppedPos(60)).toBe(100);
  // });
  // test('If there is step. Step not defined but pixel length of rangeslider is bigger than relative length, rounding down', () => {
  //   view.drawSlider(Model.defaults, { valueMin: 0, valueMax: 93.5, step: 0 });
  //   expect(view.getSteppedPos(1)).toBe(0);
  // });
  // test('If there is step. Step not defined but pixel length of rangeslider is bigger than relative length, rounding up', () => {
  //   view.drawSlider(Model.defaults, { valueMin: 0, valueMax: 93.5, step: 1 });
  //   expect(view.getSteppedPos(2)).toBe(4);
  // });
//   test('If there is step. Defined set of values, rounding down', () => {
//     view.drawSlider(Model.defaults, {
//       item: { values: [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], indexFrom: 0, indexTo: 9 },
//     });
//     expect(view.getSteppedPos(10)).toBe(0);
//   });
//   test('If there is step. Defined set of values, rounding up', () => {
//     view.drawSlider(Model.defaults, {
//       item: { values: [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], indexFrom: 0, indexTo: 9 },
//     });
//     expect(view.getSteppedPos(20)).toBe(37.4);
  // });
// });
