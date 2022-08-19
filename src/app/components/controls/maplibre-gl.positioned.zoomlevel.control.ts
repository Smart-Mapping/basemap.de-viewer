import { Map, IControl } from 'maplibre-gl';

/**
 * Control element to show current zoomlevel
 */
export default class PositionedZoomLevelControl implements IControl {

  /** HTML parent element of the control */
  container?: HTMLElement

  /**
   * Creates instance of PositionedZoomLevelControl with order
   * @param order Position of control in container
   */
  constructor(private order?: number) { }

  /**
   * Creates html element for control
   * @param map Map to which the control is added
   * @returns HTML container element of the control
   */
  onAdd(map: Map): HTMLElement {
    this.container = document.createElement("div")
    this.container.style.order = String(this.order)
    const inner = document.createElement("div")
    inner.className = "maplibregl-ctrl maplibregl-ctrl-group d-flex justify-content-center align-items-center"
    inner.style.height = "40px"
    inner.style.width = "40px"
    this.container.appendChild(inner)
    const item = document.createElement("div")
    inner.appendChild(item)
    item.textContent = map.getZoom().toFixed(1)
    item.style.fontSize = "1rem"
    item.style.color = "#333333"
    map.on('move', _ => item.textContent = map.getZoom().toFixed(1));
    return this.container!
  }

  /**
   * Removes control and container from map
   * @param map Map from which the control is removed
   */
  onRemove(map: Map): void {
    this.container?.parentElement?.removeChild(this.container)
  }

}