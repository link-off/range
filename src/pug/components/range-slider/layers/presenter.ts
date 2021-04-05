import View from "./view";
import Model from "./model/model";
import Handle from "./../entities/handle";

class Presenter {
  view: View;
  model: Model;
  data: RangeSliderPluginOptions;

  constructor(model: Model, view: View) {
    this.view = view;
    this.model = model;
    this.view.onHandlePositionUpdate = this.onHandlePositionUpdate.bind(this);

    $.extend(true, this.model.settings, this.view.data);
    this.model.prepare();
    this.data = { ...this.model.settings };
    this.view.drawSlider({ ...Model.defaults }, this.model.settings, true);
  }

  updateSettings({
    isFromHandle,
    isUsingItems,
    index,
    value,
  }: HandleMovingResult): void {
    if (isFromHandle) {
      if (isUsingItems) {
        this.model.settings.item.indexFrom = index;
        this.model.settings.valueFrom = this.model.settings.item.values[index];
      } else this.model.settings.valueFrom = value;
    } else if (isUsingItems) {
      this.model.settings.item.indexTo = index;
      this.model.settings.valueTo = this.model.settings.item.values[index];
    } else this.model.settings.valueTo = value;
  }

  onHandlePositionUpdate(handle: Handle, pxNewPos: number): void {
    const { onHandlePositionChange } = this.model.settings;
    const handleMovingResult = this.view.moveHandle(handle, pxNewPos);

    this.updateSettings(handleMovingResult);
    if (onHandlePositionChange) onHandlePositionChange.call(handleMovingResult);
  }

  update(data = {}): void {
    const oldSettings = { ...this.model.settings };

    $.extend(true, this.model.settings, data);
    this.model.prepare();
    this.data = this.model.settings;

    this.view.drawSlider(oldSettings, this.model.settings);
  }
}

export default Presenter;
