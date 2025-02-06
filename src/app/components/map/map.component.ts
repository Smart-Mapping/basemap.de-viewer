import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Popup } from 'maplibre-gl'
import { MapService } from 'src/app/services/map.service';

/**
 * Component for displaying the map
 */
@Component({
    selector: 'app-map',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    standalone: false
})
export class MapComponent implements OnInit {

  /** HTML parent element of the map view */
  @ViewChild('map', { static: true })
  container!: ElementRef<HTMLDivElement>

  /**
   * @ignore
   */
  constructor(private mapService: MapService) { }

  /**
   * Creates the map and sets a click listener for displaying popups
   */
  ngOnInit(): void {
    this.mapService.createMap(this.container.nativeElement)
    this.mapService.map?.on('click', event => {
      if (!this.mapService.isInPrintMode) {
        const features = this.mapService.map?.queryRenderedFeatures(event.point)
        if (!features?.length) return
        let popup = document.createElement('div') as HTMLDivElement
        let container = document.createElement('ul') as HTMLUListElement
        container.className = 'list-group list-group-flush'
        popup.appendChild(container)

        const createPopup = (metaData?: any) => {
          features.forEach(feature => {
            let row = document.createElement('li') as HTMLLIElement
            row.className = 'list-group-item'
            let layer = document.createElement('div') as HTMLDivElement
            if (metaData) {
              metaData.groups.forEach((g: any) => {
                if (g.subgroups && g.subgroups.length > 0) {
                  g.subgroups.forEach((sub: any) => {
                    if ((sub.fill && sub.fill.find((f: string) => f === feature.layer.id)) ||
                      (sub.symbol && sub.symbol.find((f: string) => f === feature.layer.id)) ||
                      (sub.circle && sub.circle.find((f: string) => f === feature.layer.id)) ||
                      (sub.line && sub.line.find((f: string) => f === feature.layer.id))) {
                      layer.textContent = g.name + " - " + sub.name
                    }
                  })
                }
              })
            } else {
              layer.textContent = (feature.layer as any)['source-layer'] + " - " + feature.layer.id
            }
            layer.className = 'fw-bold text-break'
            row.appendChild(layer)
            let value = document.createElement('div') as HTMLDivElement
            let property = document.createElement('div') as HTMLDivElement
            property.className = 'd-flex justify-content-between'
            let name = document.createElement('div') as HTMLDivElement
            name.className = 'text-start pe-2'
            name.textContent = 'Layername:'
            property.appendChild(name)
            value.className = 'text-end ps-2 text-break'
            value.textContent = feature.layer.id
            property.appendChild(value)
            row.appendChild(property)
            for (const key in feature.properties) {
              if (feature.properties.hasOwnProperty(key)) {
                let property = document.createElement('div') as HTMLDivElement
                property.className = 'd-flex justify-content-between'
                let name = document.createElement('div') as HTMLDivElement
                name.className = 'text-start pe-2'
                name.textContent = key[0].toUpperCase() + key.slice(1) + ':'
                property.appendChild(name)
                let value = document.createElement('div') as HTMLDivElement
                value.className = 'text-end ps-2 text-break'
                value.textContent = feature.properties[key]
                property.appendChild(value)
                row.appendChild(property)
              }
            }
            container.appendChild(row)
          })
          if (container.innerHTML !== "" && this.mapService.map) {
            new Popup()
              .setLngLat(event.lngLat)
              .setHTML(popup.innerHTML)
              .addTo(this.mapService.map);
          }
          container.parentElement?.classList.add('p-3')
        }

        if (this.mapService.activeBasemap?.useMetaData) {
          this.mapService.getMetaData().then(meta => {
            createPopup(meta)
          })
        } else {
          createPopup()
        }
      }
    })
  }
}
