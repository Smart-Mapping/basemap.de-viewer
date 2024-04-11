import { Map, NavigationControl, NavigationControlOptions } from "maplibre-gl";

/**
 * Custom navigation control element
 */
export default class PositionedNavigationControl extends NavigationControl {

  /**
   * Creates instance of PositionedNavigationControl with order
   * @param options Options for default NavigationControl
   * @param order Position of control in container
   */
  constructor(options: NavigationControlOptions, private order?: number) {
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