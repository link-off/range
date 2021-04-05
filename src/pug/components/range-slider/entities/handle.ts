import Entity from './entity';

class Handle extends Entity {
  setMoving(value: boolean): void {
    if (value) this.$el.addClass("range-slider__handle_isMoving");
    else this.$el.removeClass("range-slider__handle_isMoving");
  }

  is(h: Handle): boolean {
    return this.$el.is(h.$el);
  }
}

export default Handle;
