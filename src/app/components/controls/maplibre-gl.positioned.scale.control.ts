import { Map, ScaleControl, ScaleControlOptions } from 'maplibre-gl';

/**
 * Custom scale control element
 */
export default class PositionedScaleControl extends ScaleControl {

  /**
   * Creates instance of PositionedScaleControl with order
   * @param order Position of control in container
   */
  constructor(options: ScaleControlOptions, private order?: number) {
    super(options)
  }

  /**
   * Creates html element for control
   * @param map Map to which the control is added
   * @returns HTML container element of the control
   */
  override onAdd(map: Map): HTMLElement {
    const container = super.onAdd(map)
    container.style.order = String(this.order)
    return container
  }
}