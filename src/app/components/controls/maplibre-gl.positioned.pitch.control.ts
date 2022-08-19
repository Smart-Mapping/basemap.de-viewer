import { Map, IControl } from 'maplibre-gl';

/**
 * Control element to showcase the pitch functionality,
 * clicks on this element toggles the map's pitch between 0 and 60
 */
export default class PositionedPitchControl implements IControl {

  /** HTML parent element of the control */
  container?: HTMLElement

  /**
   * Creates instance of PositionedPitchControl with order
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
    this.container.className = "pitch-control-wrapper"
    this.container.style.order = String(this.order)
    const inner = document.createElement("div")
    inner.className = "maplibregl-ctrl maplibregl-ctrl-group"
    this.container.appendChild(inner)
    const button = document.createElement("button")
    button.classList.add("border-0")
    button.setAttribute("type", "button")
    button.setAttribute("title", "pitch control")
    inner.appendChild(button)
    const item = document.createElement('img')
    item.src = './assets/swap-vertical.svg'
    item.alt = 'pitch control'
    button.appendChild(item)
    button.addEventListener("click", () => {
      map.easeTo({ pitch: (map.getPitch() > 0) ? 0 : 60 });
    })
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
