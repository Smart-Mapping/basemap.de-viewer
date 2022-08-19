import { Map, IControl } from 'maplibre-gl';
import { environment } from 'src/environments/environment';

/**
 * Control element for searching addresses
 */
export default class PositionedSearchControl implements IControl {

  /** HTML parent element of the control */
  container?: HTMLElement
  /** List of all search requests */
  requests: number[] = []

  /**
   * Creates instance of PositionedSearchControl with order
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
    this.container.className = "search-control-wrapper"
    this.container.style.order = String(this.order)
    const topArea = document.createElement("div");
    topArea.className = "maplibregl-ctrl maplibregl-ctrl-group search-control d-flex align-items-center float-none"
    this.container.appendChild(topArea)
    const button = document.createElement("button");
    button.classList.add("border-0")
    button.setAttribute("type", "button")
    button.setAttribute("title", "search control")
    const icon = document.createElement('img')
    icon.src = './assets/magnify.svg'
    icon.alt = "search"
    button.appendChild(icon)
    topArea.appendChild(button)
    const input = document.createElement("input");
    input.placeholder = "Suchen..."
    input.type = 'search control'
    input.className = "border-0 search-input"
    topArea.appendChild(input)
    const resultsArea = document.createElement("div");
    resultsArea.classList.add("results-area")
    this.container.appendChild(resultsArea)

    button.addEventListener('click', () => {
      const expand = topArea.classList.toggle("expanded")
      resultsArea.innerHTML = ''
      resultsArea.classList.remove('expanded')
      if (expand) {
        input.focus()
      } else {
        input.blur()
      }
      input.value = ''
    })
    input.addEventListener('input', (event: any) => {
      const term = event.target.value as string
      resultsArea.innerHTML = ''
      resultsArea.classList.remove("expanded")
      if (term.length > 2) {
        let start = Date.now()
        this.requests.push(start)
        fetch(environment.searchURL + 'suggest?term=' + term)
          .then(res => res.json())
          .then(out => {
            if (this.requests[this.requests.length - 1] === start && topArea.classList.contains("expanded")) {
              this.requests = []
              resultsArea.innerHTML = ''
              resultsArea.classList.add("expanded")
              out.suggestions.forEach((element: any) => {
                const suggestion = document.createElement('div')
                suggestion.className = 'result p-2'
                const main = document.createElement('div')
                main.className = 'fw-bold'
                const sub = document.createElement('div')
                suggestion.appendChild(main)
                if (element.suggestion.search(/,/) > -1) {
                  suggestion.appendChild(sub)
                  main.textContent = element.suggestion.split(",")[0].trim();
                  sub.textContent = element.suggestion.split(",")[1].trim();
                } else {
                  main.textContent = element.suggestion;
                }
                suggestion.addEventListener('click', () => {
                  fetch(environment.searchURL + 'search?term=' + element.suggestion)
                    .then(res => res.json())
                    .then(result => {
                      resultsArea.innerHTML = ''
                      resultsArea.classList.remove("expanded")
                      topArea.classList.remove('expanded')
                      input.value = ''
                      map.fitBounds([
                        [result.features[0].bbox[0], result.features[0].bbox[1]],
                        [result.features[0].bbox[2], result.features[0].bbox[3]]]
                      );
                    })
                })
                resultsArea.appendChild(suggestion)
              })
            }
          })
      }
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
