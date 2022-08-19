import { Map, GeolocateControl, GeolocateOptions } from 'maplibre-gl';

/**
 * Custom geolocate control element
 */
export default class PositionedGeolocateControl extends GeolocateControl {

  /**
   * Creates instance of PositionedGeolocateControl with options and order
   * @param options Options for default GeolocateControl
   * @param order Position of control in container
   */
  constructor(options: GeolocateOptions, private order?: number) {
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