import { Component } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

/**
 * Component for sharing menu tab
 */
@Component({
  selector: 'app-sharing',
  templateUrl: './sharing.component.html',
  styleUrls: ['./sharing.component.scss']
})
export class SharingComponent {

  /**
   * @ignore
   */
  constructor(public mapService: MapService) { }

  /**
   * Create sharing url depending on current config and host
   * @returns An URL with config
   */
  getShareURL() {
    return window.location.origin + window.location.pathname + '?config=' + this.mapService.getConfigurationBase64()
  }

  /**
   * Copy the sharable URL to clipboard
   */
  copyShareURL() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.getShareURL())
    } else {
      let input = document.createElement('input')
      input.setAttribute('value', this.getShareURL())
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy');
      document.body.removeChild(input)
    }
  }
}
