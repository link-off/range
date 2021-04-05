import Entity from "./entity";

class Tip extends Entity {
  setText = (value: string | number): void => {
    this.$el.text(value);
  }

  getText(): string | number {
    return this.$el.text();
  }
}

export default Tip;