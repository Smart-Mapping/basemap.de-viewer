import { Component } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

/**
 * Component for controls menu tab
 */
@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {
  /**
   * @ignore
   */
  constructor(public mapService: MapService) { }
}
