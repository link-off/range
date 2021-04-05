import Entity from "./entity";
import Handle from "./handle";
import Tip from "./tip";
import Range from "./range";

class RangeSlider extends Entity {
  controls: (Tip | Handle | Range)[] = [];

  CLASSES = {
    modSingle: "range-slider_single",
    modMulti: "range-slider_multi",
    modVertical: "range-slider_vertical",
    modHorizontal: "range-slider_horizontal",
  };

  mode = "horizontal";
  type = "single";

  constructor(el: JQuery<HTMLElement>) {
    super(el);
    el.on("dragstart", (e) => e.preventDefault());
  }

  isMulti = (): boolean => {
    return this.type == "multi";
  };

  setType = (value: RangeSliderType): void => {
    this.type = value;

    switch (value) {
      case "single":
        this.$el.removeClass(this.CLASSES.modMulti);
        this.$el.addClass(this.CLASSES.modSingle);
        break;
      case "multi":
        this.$el.removeClass(this.CLASSES.modSingle);
        this.$el.addClass(this.CLASSES.modMulti);
        break;
    }
  };

  isVertical(): boolean {
    return this.mode == "vertical";
  }

  setMode = (value: RangeSliderMode): void => {
    this.mode = value;

    switch (value) {
      case "vertical":
        this.$el.removeClass(this.CLASSES.modHorizontal);
        this.$el.addClass(this.CLASSES.modVertical);
        break;
      case "horizontal":
        this.$el.removeClass(this.CLASSES.modVertical);
        this.$el.addClass(this.CLASSES.modHorizontal);
        break;
    }

    this.controls.forEach((val) => {
      val.setMode(value);
    });
  };

  addControls(controls: (Tip | Handle | Range)[]): void {
    this.controls = controls;
  }
}

export default RangeSlider;
