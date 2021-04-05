import Presenter from '../range-slider/layers/presenter';

class Panel {
  CLASSES = {
    modeVertical: "panel_vertical",
  };

  $panel: JQuery<HTMLElement>;
  $textField: JQuery<HTMLElement>;
  $step: JQuery<HTMLElement>;
  $valueMin: JQuery<HTMLElement>;
  $valueMax: JQuery<HTMLElement>;
  $valueFrom: JQuery<HTMLElement>;
  $valueTo: JQuery<HTMLElement>;
  $indexFrom: JQuery<HTMLElement>;
  $indexTo: JQuery<HTMLElement>;
  $buttonAdd: JQuery<HTMLElement>;
  $buttonRemove: JQuery<HTMLElement>;
  $select: JQuery<HTMLElement>;
  $rangeSliderRootElement: JQuery<HTMLElement>;
  $modeVertical: JQuery<HTMLElement>;
  $typeMulti: JQuery<HTMLElement>;
  $isShowTips: JQuery<HTMLElement>;

  select: HTMLSelectElement | null;
  rangeSlider: Presenter;

  constructor(element: HTMLElement) {
    this.$panel = $(element);
    this.$textField = this.$panel.find("text-field");
    this.$valueMin = this.$panel
      .find(".js-panel__text-field__value_min")
      .find(".js-text-field__input");
    this.$valueMax = this.$panel
      .find(".js-panel__text-field__value_max")
      .find(".js-text-field__input");
    this.$step = this.$panel
      .find(".js-panel__input__step")
      .find(".js-text-field__input");
    this.$valueFrom = this.$panel
      .find(".js-panel__input__value_from")
      .find(".js-text-field__input");
    this.$valueTo = this.$panel
      .find(".js-panel__input__value_to")
      .find(".js-text-field__input");
    this.$indexFrom = this.$panel
      .find(".js-panel__input__index_from")
      .find(".js-text-field__input");
    this.$indexTo = this.$panel
      .find(".js-panel__input__index_to")
      .find(".js-text-field__input");
    this.$buttonAdd = this.$panel
      .find(".js-select-items")
      .find(".js-select-items__button_add");
    this.$buttonRemove = this.$panel
      .find(".js-select-items")
      .find(".js-select-items__button_remove");
    this.$select = this.$panel
      .find(".js-select-items")
      .find(".js-select-items__options");
    this.select = this.$select[0] as HTMLSelectElement;
    this.$rangeSliderRootElement = this.$panel.find(".range-slider");
    this.rangeSlider = this.$rangeSliderRootElement.data("range-slider");
    this.$modeVertical = this.$panel
      .find(".js-panel__checkbox_vertical")
      .find(".checkbox__input");
    this.$typeMulti = this.$panel
      .find(".js-panel__checkbox_multi")
      .find(".checkbox__input");
    this.$isShowTips = this.$panel
      .find(".js-panel__checkbox_tip")
      .find(".checkbox__input");

    this.bindThis();
    this.addEventListeners();
    this.updateValues();
  }

  bindThis(): void {
    this.modeVertical = this.modeVertical.bind(this);
    this.typeMulti = this.typeMulti.bind(this);
    this.handleIsShowTips = this.handleIsShowTips.bind(this);
    this.inputValueMin = this.inputValueMin.bind(this);
    this.inputValueMax = this.inputValueMax.bind(this);
    this.inputValueFrom = this.inputValueFrom.bind(this);
    this.inputValueTo = this.inputValueTo.bind(this);
    this.inputIndexFrom = this.inputIndexFrom.bind(this);
    this.inputIndexTo = this.inputIndexTo.bind(this);
    this.step = this.step.bind(this);
    this.inputFocusOut = this.inputFocusOut.bind(this);
    this.buttonAddClick = this.buttonAddClick.bind(this);
    this.buttonRemoveClick = this.buttonRemoveClick.bind(this);
  }

  private addEventListeners(): void {
    const valueFrom = this.$valueFrom;
    const valueTo = this.$valueTo;
    const indexFrom = this.$indexFrom;
    const indexTo = this.$indexTo;

    this.rangeSlider.update({
      onHandlePositionChange(this: HandleMovingResult) {
        const { isFromHandle, isUsingItems, index, value } = this;
        if (isFromHandle) {
          valueFrom.val(value);
          if (isUsingItems) indexFrom.val(index);
        } else {
          valueTo.val(value);
          if (isUsingItems) indexTo.val(index);
        }
      },
    });

    this.$modeVertical.on("change.modeVertical", this.modeVertical);
    this.$typeMulti.on("change.typeMulti", this.typeMulti);
    this.$isShowTips.on("change.isShowTips", this.handleIsShowTips);
    this.$valueMin.on("input.valueMin", this.inputValueMin);
    this.$valueMax.on("input.valueMax", this.inputValueMax);
    this.$valueFrom.on("input.valueFrom", this.inputValueFrom);
    this.$valueTo.on("input.valueTo", this.inputValueTo);
    this.$indexFrom.on("input.indexFrom", this.inputIndexFrom);
    this.$indexTo.on("input.indexTo", this.inputValueTo);
    this.$step.on("input.step", this.step);
    this.$step.keypress(this.preventMinusTyping);
    this.$indexFrom.keypress(this.preventMinusTyping);
    this.$indexTo.keypress(this.preventMinusTyping);
    this.$textField.on("focusout.inputs", this.inputFocusOut);
    this.$buttonAdd.on("click.buttonAdd", this.buttonAddClick);
    this.$buttonRemove.on("click.buttonRemove", this.buttonRemoveClick);
  }

  inputFocusOut(event: JQuery.TriggeredEvent): void {
    const {
      item,
      item: { values },
      valueMin,
      valueMax,
      valueFrom,
      valueTo,
      step,
    } = this.rangeSlider.data;
    const isUsingItems = values.length > 1;
    const $element = $(event.target);
    if ($element.parent().parent().hasClass("js-panel__input__value_min")) {
      $element.val(isUsingItems ? values[0] : valueMin);
    }
    if ($element.parent().parent().hasClass("js-panel__input__value_max")) {
      $element.val(isUsingItems ? values[item.values?.length - 1] : valueMax);
    }
    if ($element.parent().parent().hasClass("js-panel__input__step")) {
      $element.val(step);
    }
    if ($element.parent().parent().hasClass("js-panel__input__value_from")) {
      $element.val(valueFrom);
    }
    if ($element.parent().parent().hasClass("js-panel__input__value_to")) {
      $element.val(valueTo);
    }
    if ($element.parent().parent().hasClass("js-panel__input__index_from")) {
      $element.val(item.indexFrom);
    }
    if ($element.parent().parent().hasClass("js-panel__input__index_to")) {
      $element.val(item.indexTo);
    }
  }

  step(event: JQuery.TriggeredEvent): void {
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const value = parseInt(el.value, 10);
      if (value < 1) el.value = "1";
      if (!this.isStepValid()) el.value = this.getRangeLength().toString();
      this.rangeSlider.update({ step: parseInt(el.value, 10) });
    }
  }

  isStepValid(): boolean {
    return Number(this.$step.val()) < this.getRangeLength();
  }

  getRangeLength(): number {
    return Number(this.$valueMax.val()) - Number(this.$valueMin.val());
  }

  buttonAddClick(): void {
    const $selectOptions = this.$select.find("option");
    const isUsingItems = this.select ? this.select.length > 1 : false;
    this.$valueMin.prop("disabled", isUsingItems);
    this.$valueMax.prop("disabled", isUsingItems);
    this.$step.prop("disabled", isUsingItems);
    const options: HTMLOptionElement[] = [];
    $selectOptions.each((_, el) => {
      options.push(el);
    });
    const newValues = $.map(
      options,
      (option: HTMLOptionElement) => option.value
    );
    this.rangeSlider.update({ items: { values: newValues } });
    this.updateValues();
  }

  buttonRemoveClick(): void {
    const $selectOptions = this.$select.find("option");
    const isUsingItems = this.select ? this.select.length > 1 : false;
    this.$valueMin.prop("disabled", isUsingItems);
    this.$valueMax.prop("disabled", isUsingItems);
    this.$step.prop("disabled", isUsingItems);
    const options: HTMLOptionElement[] = [];
    $selectOptions.each((_, el) => {
      options.push(el);
    });
    const newValues = $.map(
      options,
      (option: HTMLOptionElement) => option.value
    );
    this.rangeSlider.update({ item: { values: newValues } });
    this.updateValues();
  }

  updateValues(): void {
    const {
      item,
      item: { values, indexFrom, indexTo },
      mode,
      type,
      isTip,
      valueMin,
      valueMax,
      valueFrom,
      valueTo,
      step,
    } = this.rangeSlider.data;
    const isUsingItems = values.length > 1;
    this.$modeVertical.prop("checked", mode === "vertical");
    this.$typeMulti.prop("checked", type === "multi");
    this.$isShowTips.prop("checked", isTip);
    this.$valueMin.val(isUsingItems ? item.values[0] : valueMin);
    this.$valueMax.val(isUsingItems ? values[values.length - 1] : valueMax);
    if (type === "multi") this.$valueFrom.val(valueFrom);
    this.$valueTo.val(valueTo);
    if (this.select && this.select.length > 1) {
      if (type === "multi") {
        this.$indexFrom.prop("disabled", false);
        this.$indexFrom.val(indexFrom);
      }
      this.$indexTo.prop("disabled", false);
      this.$indexTo.val(indexTo);
    } else {
      this.$indexFrom.prop("disabled", true);
      this.$indexTo.prop("disabled", true);
    }
    this.$step.val(step);
  }

  inputIndexFrom(event: JQuery.TriggeredEvent): void {
    const { valueFrom } = this.rangeSlider.data;
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const indexFrom = parseInt(el.value, 10);
      const indexTo = parseInt(String(this.$indexTo.val()), 10);
      if (indexFrom > indexTo) el.value = indexTo.toString();
      this.rangeSlider.update({ items: { indexFrom: parseInt(el.value, 10) } });
      this.$valueFrom.val(valueFrom);
    }
  }

  inputIndexTo(event: JQuery.TriggeredEvent): void {
    const {
      item: { values },
      valueTo,
    } = this.rangeSlider.data;
    const el = event.target as HTMLInputElement;
    if (el.value.length) {
      const maxIndex = values.length - 1;
      const indexFrom = parseInt(String(this.$indexFrom.val()), 10);
      const indexTo = parseInt(el.value, 10);
      if (indexTo < indexFrom) el.value = indexFrom.toString();
      if (indexTo > maxIndex) el.value = maxIndex.toString();
      this.rangeSlider.update({ items: { indexTo: parseInt(el.value, 10) } });
      this.$valueTo.val(valueTo);
    }
  }

  inputValueFrom(event: JQuery.TriggeredEvent): void {
    const {
      item: { values },
    } = this.rangeSlider.data;
    const el = event.target as HTMLInputElement;

    if (values.length > 1) {
      const indexFrom = this.findIndexByItem(values, el.value);

      if (indexFrom === -1) return;

      this.rangeSlider.update({ item: { indexFrom } });
      this.$indexFrom.val(indexFrom);
    } else {
      if (Number.isNaN(Number(el.value))) return;
      this.rangeSlider.update({ valueFrom: Number(el.value) });
    }
    this.updateValues();
  }

  inputValueTo(event: JQuery.TriggeredEvent): void {
    const {
      type,
      item: { values },
    } = this.rangeSlider.data;
    const el = event.target as HTMLInputElement;

    if (values.length > 1) {
      const indexTo = this.findIndexByItem(values, el.value);

      if (indexTo === -1) return;

      this.rangeSlider.update({ item: { indexTo } });
      this.$indexTo.val(indexTo);
    } else {
      if (Number.isNaN(Number(el.value))) return;
      let newValueTo = Number(el.value);
      if (type === "multi") {
        const valueFrom = Number(this.$valueFrom.val());
        if (newValueTo < valueFrom) newValueTo = valueFrom;
      }
      this.rangeSlider.update({ valueTo: newValueTo });
    }
    this.updateValues();
  }

  findIndexByItem(values: (number | string)[], item: number | string): number {
    return values.findIndex((value) => value.toString() === item.toString());
  }

  inputValueMin(event: JQuery.TriggeredEvent): void {
    const { type } = this.rangeSlider.data;
    const el = event.target as HTMLInputElement;
    let valueMin = parseInt(el.value, 10);

    if (!Number.isNaN(valueMin)) {
      el.value = valueMin.toString();
      const valueMax = parseInt(String(this.$valueMax.val()), 10);
      if (valueMin >= valueMax) {
        el.value = (valueMax - 1).toString();
        valueMin = parseInt(el.value, 10);
      }
      const toValue = parseInt(String(this.$valueTo.val()), 10);
      const fromValue = parseInt(String(this.$valueFrom.val()), 10);
      if (toValue < valueMin) this.$valueTo.val(valueMin);
      if (type === "multi" && fromValue < valueMin) {
        this.$valueFrom.val(el.value);
      }
      if (!this.isStepValid()) this.$step.val(this.getRangeLength().toString());
      this.rangeSlider.update({
        valueMin: el.value,
        valueFrom: Number(this.$valueFrom.val()),
        valueTo: Number(this.$valueTo.val()),
      });
    }
  }

  inputValueMax(event: JQuery.TriggeredEvent): void {
    const { type } = this.rangeSlider.data;
    const el = event.target as HTMLInputElement;
    let valueMax = parseInt(el.value, 10);

    if (!Number.isNaN(valueMax)) {
      el.value = valueMax.toString();
      const valueMin = parseInt(String(this.$valueMin.val()), 10);
      if (valueMax <= valueMin) {
        el.value = (valueMin + 1).toString();
        valueMax = parseInt(el.value, 10);
      }
      const toValue = parseInt(String(this.$valueTo.val()), 10);
      const fromValue = parseInt(String(this.$valueFrom.val()), 10);
      if (toValue > valueMax) this.$valueTo.val(valueMax);
      if (type === "multi" && fromValue > valueMax) {
        this.$valueFrom.val(valueMin);
      }

      if (!this.isStepValid()) {
        this.$step.val(this.getRangeLength().toString());
      }
      this.rangeSlider.update({
        valueMax: el.value,
        valueFrom: Number(this.$valueFrom.val()),
        valueTo: Number(this.$valueTo.val()),
      });
    }
  }

  handleIsShowTips(event: JQuery.TriggeredEvent): void {
    const el = event.target as HTMLInputElement;
    this.rangeSlider.update({ isTip: el.checked });
  }

  modeVertical(event: JQuery.TriggeredEvent): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) this.$panel.addClass(this.CLASSES.modeVertical);
    else this.$panel.removeClass(this.CLASSES.modeVertical);
    this.rangeSlider.update({ mode: checkbox.checked });
  }

  typeMulti(event: JQuery.TriggeredEvent): void {
    const {
      item: { values },
    } = this.rangeSlider.data;
    const checkbox = event.target as HTMLInputElement;
    this.rangeSlider.update({ type: checkbox.checked });
    const isUsingItems = values.length > 1;
    if (!checkbox.checked) {
      this.$valueFrom.prop("disabled", true);
      if (isUsingItems) this.$indexFrom.prop("disabled", true);
    } else {
      this.$valueFrom.prop("disabled", false);
      if (isUsingItems) this.$indexFrom.prop("disabled", false);
      if (!isUsingItems) {
        const valueMin: number = parseInt(String(this.$valueMin.val()), 10);
        const valueMax: number = parseInt(String(this.$valueMax.val()), 10);
        let valueFrom: number = parseInt(String(this.$valueFrom.val()), 10);
        if (Number.isNaN(Number(valueFrom))) valueFrom = valueMin;
        const valueTo: number = parseInt(String(this.$valueTo.val()), 10);
        if (valueFrom < valueMin || valueFrom > valueTo || valueFrom > valueMax)
          valueFrom = valueMin;
        this.rangeSlider.update({ valueFrom });
      }
    }
    this.updateValues();
  }



  preventMinusTyping(event: JQuery.TriggeredEvent): void {
    if (event.key === "-") event.preventDefault();
  }
}

const $panels = $(".panel");
$panels.each((_, element) => {
  new Panel(element);
});