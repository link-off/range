export {};

declare global {
  interface JQuery {
    rangeSliderPlugin: RangeSliderPlugin;
  }
  interface Window {
    $: JQueryStatic;
    jQuery: JQueryStatic;
  }
}
