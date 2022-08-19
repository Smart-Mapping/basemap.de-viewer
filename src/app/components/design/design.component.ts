import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Basemap } from 'src/app/entities/basemap';
import { MapService } from 'src/app/services/map.service';

/**
 * Component for design menu tab
 */
@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit, AfterViewInit {

  /** HTML parent element of all basemap elements */
  @ViewChild('styleWrapper')
  styles?: ElementRef<HTMLDivElement>
  /** HTML element for adding an external style */
  externalStyleInput?: HTMLInputElement

  /**
   * @ignore
   */
  constructor(public mapService: MapService) { }

  /**
   * Sets click listener for external style functionality
   */
  ngOnInit(): void {
    this.externalStyleInput = (document.querySelector('#externalStyleURL') as HTMLInputElement)
    document.querySelector('#addExternalStyleBtn')?.addEventListener('click', () => {
      this.mapService.basemaps = this.mapService.basemaps.filter(bm => bm.name !== 'external')
      const external = new Basemap('external', '', this.externalStyleInput?.value ?? '', false, '', false, false)
      this.mapService.basemaps.push(external)
      this.setBasemap(external, this.mapService.basemaps.length-1)
    })
  }

  /**
   * Sets css class for active basemap after initialization
   */
  ngAfterViewInit(): void {
    this.styles?.nativeElement.children.item(this.mapService.activeBasemapIndex)?.classList.add('is-active')
  }

  /**
   * Changes the map style and updates the css
   * @param basemap Active basemap
   * @param index Index of selected html element
   */
  setBasemap(basemap: Basemap, index: number) {
    this.mapService.setActiveBasemap(basemap, index)
    for (let i = 0; i < this.styles!.nativeElement.children.length; i++) {
      this.styles?.nativeElement.children.item(i)?.classList.remove('is-active')
    }
    this.styles?.nativeElement.children.item(index)?.classList.add('is-active')
  }
}
