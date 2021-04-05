import { DEFAULTS } from "./../constants";

class Entity {
  $el: JQuery<HTMLElement>;
  $parentElement: JQuery<HTMLElement>;
  settings = DEFAULTS;
  mode = "horizontal";

  constructor(el: JQuery<HTMLElement>) {
    this.$el = el;
    this.$parentElement = this.$el.parent();
  }

  appendToDomTree(childElement: Entity): void {
    this.$el.append(childElement.$el);
  }

  removeFromDomTree(): void {
    this.$el.off();
    this.$el.remove();
  }

  isVertical(): boolean {
    return this.mode == "vertical";
  }

  setMode(value: RangeSliderMode): void {
    this.mode = value;
    this.$el.removeAttr("style");
  }

  getWidth(): number {
    return parseFloat(this.$el.css("width"));
  }

  getHeight(): number {
    return parseFloat(this.$el.css("height"));
  }

  getSize(): number {
    return this.isVertical() ? this.getHeight() : this.getWidth();
  }
  //////////////////////
  getParentElementWidth(): number {
    return parseFloat(this.$parentElement.css("width"));
  }

  getParentElementHeight(): number {
    return parseFloat(this.$parentElement.css("height"));
  }

  getX(): number {
    return parseFloat(this.$el.css("left"));
  }

  getY(): number {
    return parseFloat(this.$el.css("top"));
  }

  getOffsetTop(): number {
    let result: number;
    try {
      const offset = this.$el.offset();
      if (!offset)
        throw new Error(
          "Offset method return undefined value. Can not get top property value from offset method!"
        );
      result = offset.top;
    } catch (e) {
      throw e;
    }
    return result;
  }

  getOffsetLeft(): number {
    let result: number;
    try {
      const offset = this.$el.offset();
      if (!offset)
        throw new Error(
          "Offset method return undefined value. Can not get left property value from offset method!"
        );
      result = offset.left;
    } catch (e) {
      throw e;
    }
    return result;
  }

  getOffset(): number {
    return this.isVertical() ? this.getOffsetTop() : this.getOffsetLeft();
  }

  setX(value: number): void {
    const valueInPercent = (value / this.getParentElementWidth()) * 100;
    this.$el.css("left", `${valueInPercent}%`);
  }

  setY(value: number): void {
    this.$el.css("top", `${(value / this.getParentElementHeight()) * 100}%`);
  }

  setHeight(value: number): void {
    this.$el.css("height", `${(value / this.getParentElementHeight()) * 100}%`);
  }

  setWidth(value: number): void {
    const valueInPercent = (value / this.getParentElementWidth()) * 100;
    this.$el.css("width", `${valueInPercent}%`);
  }

  getPos(): number {
    return this.isVertical() ? this.getY() : this.getX();
  }

  setPos(value: number): void {
    if (this.isVertical()) this.setY(value);
    else this.setX(value);
  }

  setSize(value: number): void {
    if (this.isVertical()) this.setHeight(value);
    else this.setWidth(value);
  }
}




export default Entity;
