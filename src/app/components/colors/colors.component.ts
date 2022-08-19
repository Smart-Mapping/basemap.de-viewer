import { Component } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

/**
 * Component for colors menu tab
 */
@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss']
})
export class ColorsComponent {
  /**
   * @ignore
   */
  constructor(public mapService: MapService) { }
}
