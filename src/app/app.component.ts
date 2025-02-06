import { AfterViewInit, Component } from '@angular/core';
import { MapService } from './services/map.service';
declare var bootstrap: any

/**
 * Root component of the app
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements AfterViewInit {

  /**
   * Uses mapService to prepare the map view
   * @param mapService Service to interact with the map
   */
  constructor(mapService: MapService) {
    mapService.prepare()
  }

  /**
   * Enables bootstrap tooltips for html elements
   */
  ngAfterViewInit(): void {
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el))
  }
}
