import { Component } from '@angular/core';
import saveAs from 'file-saver';
import { MapService } from 'src/app/services/map.service';

/**
 * Component for download menu tab
 */
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {

  /**
   * @ignore
   */
  constructor(private mapService: MapService) { }

  /**
   * Adds current center, pitch and bearing to active style and starts the download
   */
  downloadStyle() {
    let json = this.mapService.map?.getStyle()
    if (!json) return
    json.center = this.mapService.map?.getCenter().toArray().map(i => parseFloat(i.toFixed(4)))
    json.pitch = this.mapService.map?.getPitch()
    json.bearing = this.mapService.map?.getBearing()
    saveAs(new Blob([JSON.stringify(json)], { type: "application/json" }), "style_" + new Date().toLocaleTimeString() + ".json");
  }
}
