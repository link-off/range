/// <reference path="range-slider.d.ts" />

import Presenter from "./layers/presenter";
import View from "./layers/view";
import Model from "./layers/model/model";

$.fn.rangeSliderPlugin = function (
  this: JQuery<HTMLElement>,
  options?: RangeSliderPluginOptions
): JQuery {

  console.log("this: ", this);
  
  this.each(() => {
    if (!$.data(this, "rangeSliderPlugin")) {
      $.data(
        this,
        "rangeSliderPlugin",
        new Presenter(new Model(options), new View($(this)))
      );
    }
  });

  return this;
};

jQuery(() => {
  jQuery(".j-range-slider").rangeSliderPlugin();
});