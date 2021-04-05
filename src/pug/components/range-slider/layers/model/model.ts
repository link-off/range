import { DEFAULTS } from './../../constants';
class Model {
  settings: RangeSliderPluginOptions;

  static readonly defaults: RangeSliderPluginOptions = DEFAULTS;

  constructor(options?: RangeSliderPluginOptions) {
    this.settings = { ...Model.defaults, ...options };
  }

  isHasItem = () => this.settings.item.values.length > 1;

  prepareWithItem = () => {
    const {
      item: { values, indexFrom, indexTo },
    } = this.settings;

    if (!indexTo || indexTo > values.length - 1) {
      this.settings.item.indexTo = values.length - 1;
    }

    if (this.settings.type === "multi") {
      if (indexFrom < 0) {
        this.settings.item.indexFrom = 0;
      } else if (indexFrom > indexTo) {
        this.settings.item.indexFrom = indexTo;
      }
    }

    this.settings.valueMin = values[0];
    this.settings.valueMax = values[values.length - 1];
    this.settings.valueFrom = indexFrom ? values[indexFrom] : 0;
    this.settings.valueTo = indexTo ? values[indexTo] : values.length - 1;
  };

  prepareWithOutItem = () => {};

  prepare = () => {
    if (this.isHasItem()) {
      this.prepareWithItem();
    } else {
      this.prepareWithOutItem();
    }
  };
}

export default Model;
