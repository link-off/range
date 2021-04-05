import { DEFAULTS } from "./../constants";
import RangeSlider from "../entities/range-slider";
import Handle from "../entities/handle";
import Tip from "../entities/tip";
import Range from "../entities/range";

class View {
  settings: RangeSliderPluginOptions;
  el: JQuery<HTMLElement>;
  rangeSlider: RangeSlider;
  data: RangeSliderPluginOptions;
  tipMin: Tip;
  tipMax: Tip;
  tipFrom: Tip;
  tipTo: Tip;
  handleFrom: Handle;
  handleTo: Handle;
  range: Range;
  rangeSelected: Range;
  offsetFrom: number;
  offsetTo: number;
  onHandlePositionUpdate!: (handle: Handle, pxNewPos: number) => void;

  htmlTemplate = `<div class='range-slider range-slider_horizontal'>
            <div class="range-slider__tip range-slider__tip_min"></div>
            <div class="range-slider__tip range-slider__tip_max"></div>
          <div class="range-slider__range"></div>
          <div class="range-slider__range_selected"></div>
          <div class="range-slider__handle range-slider__handle_from">
            <div class="range-slider__tip range-slider__tip_from"></div>
          </div>
          <div class="range-slider__handle range-slider__handle_to">
            <div class="range-slider__tip range-slider__tip_to"></div>
          </div>
        </div>`;

  constructor(el: JQuery<HTMLElement>) {
    this.el = el;
    this.el.html(this.htmlTemplate);

    this.rangeSlider = new RangeSlider(el.find(".range-slider"));

    this.data = el.data("options");

    this.range = new Range(el.find(".range-slider__range"));
    this.rangeSelected = new Range(el.find(".range-slider__range_selected"));

    this.tipMin = new Tip(el.find(".range-slider__tip_min"));
    this.tipMax = new Tip(el.find(".range-slider__tip_max"));

    this.tipFrom = new Tip(el.find(".range-slider__tip_from"));
    this.tipTo = new Tip(el.find(".range-slider__tip_to"));

    this.handleFrom = new Handle(el.find(".range-slider__handle_from"));
    this.handleTo = new Handle(el.find(".range-slider__handle_to"));

    this.offsetFrom = this.handleFrom.getWidth() / 2;
    this.offsetTo = this.handleTo.getWidth() / 2;

    this.rangeSlider.addControls([
      this.tipMin,
      this.tipMax,
      this.tipFrom,
      this.tipTo,
      this.handleFrom,
      this.handleTo,
      this.range,
      this.rangeSelected,
    ]);

    this.settings = DEFAULTS;
    this.bindThis();
    this.addEventListeners();
  }

  bindThis = (): void => {
    this.onMouseDownRange = this.onMouseDownRange.bind(this);
    this.onMouseDownHandle = this.onMouseDownHandle.bind(this);
  };

  addEventListeners = (): void => {
    this.range.$el.on("mousedown.range", this.onMouseDownRange);

    this.handleFrom.$el.on("mousedown.handleFrom", this.onMouseDownHandle);
    this.handleTo.$el.on("mousedown.handleTo", this.onMouseDownHandle);
  };

  onMouseDownRange = (e: JQuery.TriggeredEvent): void => {
    e.preventDefault();
    const eOffset = this.settings.mode === "vertical" ? e.offsetY : e.offsetX;
    let offsetPos: number;
    try {
      if (eOffset) offsetPos = eOffset;
      else throw new Error("Value is undefined!");
    } catch (e) {
      throw e;
    }

    if (offsetPos < this.offsetFrom) offsetPos = this.offsetFrom;
    if (offsetPos > this.range.getSize() - this.offsetTo) {
      offsetPos = this.range.getSize() - this.offsetTo;
    }

    const nearHandle = this.getNearestHandle(offsetPos);

    let newPos = this.getSteppedPos(offsetPos - this.offsetFrom);
    if (newPos == null) {
      const offset = nearHandle.is(this.handleFrom)
        ? this.offsetFrom
        : this.handleTo.getSize() - this.offsetTo;
      newPos = offsetPos - offset;
    }

    this.onHandlePositionUpdate(nearHandle, newPos);

    const newEvent = e;
    newEvent.target = nearHandle.$el;
    nearHandle.$el.trigger(newEvent, "mousedown.handle");
  };

  getNearestHandle = (pos: number): Handle => {
    if (this.settings.type === "multi") {
      if (pos < this.handleFrom.getPos()) {
        return this.handleFrom;
      }

      if (pos > this.handleTo.getPos()) {
        return this.handleTo;
      }

      const distanceBetweenHandles =
        this.handleTo.getPos() -
        this.handleFrom.getPos() -
        this.handleFrom.getSize();
      const half =
        this.handleFrom.getPos() +
        this.handleFrom.getSize() +
        distanceBetweenHandles / 2;

      if (pos < half) {
        return this.handleFrom;
      }

      return this.handleTo;
    }
    return this.handleTo;
  };

  getSteppedPos = (pxValue: number): number | null => {
    const { step, item, valueMin, valueMax } = this.settings;
    const values = item?.values;
    const pxLength = this.range.getSize() - this.offsetFrom - this.offsetTo;
    const isDefinedStep = step > 1;
    const isDefinedSetOfValues = item && values && values.length > 1;
    const isTooLongLine = pxLength > Number(valueMax) - Number(valueMin);
    const isHaveStep = isDefinedStep || isTooLongLine || isDefinedSetOfValues;

    if (isHaveStep) {
      let pxStep = 0;

      if (isDefinedStep) {
        pxStep = this.convertRelativeValueToPixelValue(
          Number(valueMin) + Number(step)
        );
      }

      if (isTooLongLine) {
        const relativeLength = Number(valueMax) - Number(valueMin);
        pxStep = pxLength / relativeLength;
        if (isDefinedStep) pxStep *= step;
      }

      if (isDefinedSetOfValues) {
        pxStep = pxLength / (values.length - 1);
      }

      const nStep = Math.round(pxValue / pxStep);
      let newPos = nStep * pxStep;

      if (pxValue / pxStep > Math.trunc(pxLength / pxStep)) {
        const remainder = pxLength - newPos;
        if (pxValue > newPos + remainder / 2) newPos += remainder;
      }
      if (newPos > pxLength) newPos = pxLength;
      return newPos;
    }
    return null;
  };

  convertRelativeValueToPixelValue = (val: number): number => {
    const { item, valueMin, valueMax } = this.settings;
    const values = item?.values;
    const lw = this.range.getSize() - this.offsetFrom - this.offsetTo;
    const isHasValues = item && values && values.length > 1;
    let result;
    if (isHasValues) {
      const pxStep = lw / (values.length - 1);
      result = val * pxStep;
    } else {
      const relLength = Number(valueMax) - Number(valueMin);
      const relPercent = (val - Number(valueMin)) / relLength;
      result = lw * relPercent;
    }
    return result;
  };

  convertPixelValueToRelativeValue = (val: number): number => {
    const { valueMax, valueMin } = this.settings;
    const lw = this.range.getSize() - this.offsetFrom - this.offsetTo;
    const percent = val / lw;
    const result = Math.round(
      Number(valueMin) + percent * (Number(valueMax) - Number(valueMin))
    );
    return result;
  };

  drawRangeSelected = (currentHandle: Handle): void => {
    if (this.settings.type === "multi") {
      if (currentHandle.is(this.handleFrom)) {
        this.rangeSelected.setPos(this.handleFrom.getPos() + this.offsetFrom);
      }
      this.rangeSelected.setSize(
        this.handleTo.getPos() -
          this.handleFrom.getPos() +
          this.handleTo.getSize() -
          this.offsetFrom -
          this.offsetTo +
          1
      );
    } else {
      this.rangeSelected.setSize(
        currentHandle.getPos() + currentHandle.getSize() - this.offsetTo + 1
      );
    }
  };

  moveHandle = (currentHandle: Handle, pxX: number): HandleMovingResult => {
    let { valueFrom, valueTo } = this.settings;

    const values = this.settings.item?.values;
    const isUsingItemsCurrent = values?.length > 1;

    currentHandle.setPos(pxX);
    let restoreIndex = -1;
    if (isUsingItemsCurrent) {
      const lw = this.range.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = lw / (values.length - 1);
      restoreIndex = Math.round(pxX / pxStep);
      if (currentHandle.is(this.handleFrom)) {
        this.settings.item.indexFrom = restoreIndex;
        this.settings.valueFrom = values[restoreIndex];
      } else {
        this.settings.item.indexTo = restoreIndex;
        this.settings.valueTo = values[restoreIndex];
      }
    } else {
      if (currentHandle.is(this.handleFrom)) {
        this.settings.valueFrom = this.convertPixelValueToRelativeValue(pxX);
      } else this.settings.valueTo = this.convertPixelValueToRelativeValue(pxX);
      valueFrom = this.settings.valueFrom;
      valueTo = this.settings.valueTo;
    }

    this.drawRangeSelected(currentHandle);

    this.tipFrom.setText(valueFrom);
    this.tipTo.setText(valueTo);

    const isHandleFrom = currentHandle.is(this.handleFrom);
    return {
      isFromHandle: isHandleFrom,
      value: isHandleFrom ? valueFrom : valueTo,
      isUsingItems: isUsingItemsCurrent,
      index: restoreIndex,
    };
  };

  validate = (pos: number, currentHandle: Handle): number => {
    let result = pos;
    const lw = this.range.getSize();
    const ch = currentHandle;

    if (this.settings.isTip) {
      if (ch.is(this.handleFrom) && pos > this.handleTo.getPos())
        result = this.handleTo.getPos();
      if (ch.is(this.handleTo) && pos > lw - ch.getSize())
        result = lw - ch.getSize();
      if (ch.is(this.handleTo) && pos < this.handleFrom.getPos()) {
        result = this.handleFrom.getPos();
      }
    } else {
      if (pos > lw - ch.getSize()) result = lw - ch.getSize();
    }

    if (pos < 0) result = 0;

    return result;
  };

  onMouseMoveRangeSlider = (
    e: JQuery.TriggeredEvent,
    currentHandle: Handle,
    shiftPos: number
  ): boolean => {
    const $target = $(e.target);
    const { mode } = this.settings;

    const eOffset = mode === "vertical" ? e.offsetY : e.offsetX;
    const offsetPos = eOffset || 0;

    const targetOffsetCoord = $target.offset();
    let targetOffset: number;
    try {
      if (targetOffsetCoord)
        targetOffset =
          mode === "vertical" ? targetOffsetCoord.top : targetOffsetCoord.left;
      else throw new Error("undefined value");
    } catch (e) {
      throw e;
    }

    let newPos = this.getSteppedPos(
      offsetPos + targetOffset - this.range.getOffset() - this.offsetFrom
    );

    const eClient = mode === "vertical" ? e.clientY : e.clientX;
    const clientPos = eClient || 0;

    if (newPos == null) newPos = clientPos - this.range.getOffset() - shiftPos;
    newPos = this.validate(newPos, currentHandle);
    this.onHandlePositionUpdate(currentHandle, newPos);
    return false;
  };

  onMouseUp = (e: JQuery.TriggeredEvent, currentHandle: Handle): void => {
    currentHandle.setMoving(false);
    this.rangeSlider.$el.off("mousemove.range-slider");
    currentHandle.$el.off("mouseup.handle");
    $(document).off("mousemove.document");
    $(document).off("mouseup.document");
  };

  onMouseDownHandle = (e: JQuery.TriggeredEvent): void => {
    const $el = $(e.target);
    let currentHandle: Handle = this.handleFrom;
    if ($el.is(this.handleTo.$el) || $el.is(this.tipTo.$el))
      currentHandle = this.handleTo;

    currentHandle.setMoving(true);
    const clientPos = this.settings.mode === "vertical" ? e.clientY : e.clientX;
    let shiftPos: number;
    try {
      if (clientPos) shiftPos = clientPos - currentHandle.getOffset();
      else throw new Error("undefined value");
    } catch (e) {
      throw e;
    }
    this.rangeSlider.$el.on("mousemove.range-slider", (e) =>
      this.onMouseMoveRangeSlider(e, currentHandle, shiftPos)
    );
    const $document = $(document);
    $document.on("mousemove.document", (e) =>
      this.onMouseMoveRangeSlider(e, currentHandle, shiftPos)
    );
    currentHandle.$el.on("mouseup.handle", (e) =>
      this.onMouseUp(e, currentHandle)
    );

    $document.on("mouseup.document", (e) => this.onMouseUp(e, currentHandle));
  };

  ////////

  isEqualArrays(
    ar1: (string | number)[] | null,
    ar2: (string | number)[] | null
  ): boolean {
    if (!ar1 || !ar2) return false;
    if (ar1.length !== ar2.length) return false;
    return ar1.every((value, index) => value === ar2[index]);
  }

  drawSlider = (
    oldSettings: RangeSliderPluginOptions,
    newSettings = {},
    forceRedraw = false
  ): void => {
    const {
      valueMin: oldValueMin,
      valueMax: oldValueMax,
      valueFrom: oldValueFrom,
      valueTo: oldValueTo,
      mode: oldMode,
      isTip: oldIsTip,
      type: oldType,
    } = oldSettings;

    const oldIndexFrom = oldSettings.item?.indexFrom;
    const oldIndexTo = oldSettings.item?.indexTo;
    const oldValues = oldSettings.item?.values;

    $.extend(true, this.settings, newSettings);

    const {
      valueMin: currentValueMin,
      valueMax: currentValueMax,
      valueFrom: currentValueFrom,
      valueTo: currentValueTo,
      mode: currentMode,
      isTip: currentIsTip,
      type: currentType,
    } = this.settings;

    const currentIndexFrom = this.settings.item?.indexFrom;
    const currentIndexTo = this.settings.item?.indexTo;
    const currentValues = this.settings.item?.values;

    const { setMode, setType } = this.rangeSlider;
    const isUsingItemsCurrent = currentValues?.length > 1;
    const isModeChanged = currentMode !== oldMode;
    const isTypeChanged = currentType !== oldType;
    const isTipChanged = currentIsTip !== oldIsTip;
    const isValueMinChanged = oldValueMin !== currentValueMin;
    const isValueMaxChanged = oldValueMax !== currentValueMax;
    const isValueFromChanged = oldValueFrom !== currentValueFrom;
    const isValueToChanged = oldValueTo !== currentValueTo;
    const indexFromChanged = currentIndexFrom !== oldIndexFrom;
    const indexToChanged = currentIndexTo !== oldIndexTo;
    let isNeedRedraw = forceRedraw;

    if (isModeChanged) {
      setMode(currentMode);
      isNeedRedraw = true;
    }

    if (isNeedRedraw || isTypeChanged) {
      setType(currentType);

      if (currentType == "multi") {
        if (!this.rangeSlider.$el.find(".range-slider__handle-from").length) {
          this.rangeSlider.appendToDomTree(this.handleFrom);
          this.handleFrom.$el.on(
            "mousedown.handleFrom",
            this.onMouseDownHandle
          );
          this.tipFrom.setText(currentValueFrom);
        }
      } else this.handleFrom.removeFromDomTree();
      isNeedRedraw = true;
    }

    if (isNeedRedraw || isTipChanged) {
      if (currentIsTip) {
        if (currentType == "multi")
          this.handleFrom.appendToDomTree(this.tipFrom);
        this.handleTo.appendToDomTree(this.tipTo);
        this.rangeSlider.appendToDomTree(this.tipMin);
        this.rangeSlider.appendToDomTree(this.tipMax);
      } else {
        if (currentType == "multi") this.tipFrom.removeFromDomTree();
        this.tipTo.removeFromDomTree();
        this.tipMin.removeFromDomTree();
        this.tipMax.removeFromDomTree();
      }
    }

    if (isNeedRedraw || isValueMinChanged) {
      this.tipMin.setText(currentValueMin);
    }

    if (isNeedRedraw || isValueMaxChanged) {
      this.tipMax.setText(currentValueMax);
    }

    const isItemValuesChanged = !this.isEqualArrays(oldValues, currentValues);
    if (isNeedRedraw || isItemValuesChanged) {
      if (currentValues) {
        const count = currentValues.length;
        if (count > 1) {
          this.tipMin.setText(currentValues[0]);
          this.tipMax.setText(currentValues[count - 1]);
        }
      }
    }

    if (currentType == "multi") {
      if (
        isNeedRedraw ||
        isValueFromChanged ||
        isValueMinChanged ||
        isValueMaxChanged ||
        isItemValuesChanged
      ) {
        const val = isUsingItemsCurrent
          ? currentIndexFrom
          : Number(currentValueFrom);
        const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
        const posXWithStep = this.getSteppedPos(posXWithOutStep);
        this.moveHandle(
          this.handleFrom,
          posXWithStep == null ? posXWithOutStep : posXWithStep
        );
      }
    }

    if (
      isNeedRedraw ||
      isValueToChanged ||
      isValueMinChanged ||
      isValueMaxChanged ||
      isItemValuesChanged
    ) {
      const val = isUsingItemsCurrent ? currentIndexTo : Number(currentValueTo);
      const posXWithOutStep = this.convertRelativeValueToPixelValue(val);
      const posXWithStep = this.getSteppedPos(posXWithOutStep);
      this.moveHandle(
        this.handleTo,
        posXWithStep == null ? posXWithOutStep : posXWithStep
      );
    }

    if (isUsingItemsCurrent) {
      const pxLength = this.range.getSize() - this.offsetFrom - this.offsetTo;
      const pxStep = pxLength / (currentValues.length - 1);

      if (currentType == "multi" && (isNeedRedraw || indexFromChanged)) {
        const newPos = currentIndexFrom * pxStep;
        this.moveHandle(this.handleFrom, newPos);
      }

      if (isNeedRedraw || indexToChanged) {
        const newPos = currentIndexTo * pxStep;
        this.moveHandle(this.handleTo, newPos);
      }
    }
  };
  ////
}

export default View;
