type RangeSliderMode = "horizontal" | "vertical";
type RangeSliderType = "single" | "multi";

interface HandleMovingResult {
  isFromHandle: boolean;
  value: number | string;
  isUsingItems: boolean;
  index: number;
}

interface RangeSliderPluginOptions {
  mode?: RangeSliderMode;
  type?: RangeSliderType;
  isTip?: boolean;
  valueMin?: number;
  valueMax?: number;
  step?: number;
  valueFrom?: number | string;
  valueTo?: number | string;
  item?: { indexFrom: number; indexTo?: number; values: number[] };
  onHandlePositionChange?(this: HandleMovingResult): void;
}

interface RangeSliderPluginGlobalOptions {
  options?: RangeSliderPluginOptions;
}

interface RangeSliderPluginFunction {
  (options?: RangeSliderPluginOptions): JQuery;
}

interface RangeSliderPlugin
  extends RangeSliderPluginGlobalOptions,
    RangeSliderPluginFunction {}

interface HandleMovingResult {
  isFromHandle: boolean;
  value: number | string;
  isUsingItems: boolean;
  index: number;
}

interface RangeSlider
  extends RangeSliderPluginGlobalOptions,
    RangeSliderPluginFunction {}

/**
 * Extend the jQuery result declaration with the rangeslider plugin.
 */
interface JQuery {
  /**
   * Extension of the rangeslider plugin.
   */
  toxinRangeSlider: RangeSlider;
}