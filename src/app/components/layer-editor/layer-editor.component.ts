import { Component } from '@angular/core';
import { Layer, LayerGroup } from 'src/app/entities/layergroup';
import { MapService } from 'src/app/services/map.service';

/**
 * Component for layer menu tab,
 * used if selected basemap has no metadata for editor functionality
 */
@Component({
  selector: 'app-layer-editor',
  templateUrl: './layer-editor.component.html',
  styleUrls: ['./layer-editor.component.scss']
})
export class LayerEditorComponent {

  /**
   * @ignore
   */
  constructor(public mapService: MapService) { }

  /**
   * Shows or hides a group
   * @param group Group to show or hide
   */
  toggleGroup(group: LayerGroup) {
    this.mapService.toggleGroup(group)
  }
  /**
   * Shows or hides a layer
   * @param group Group of which layer is a child 
   * @param layer Layer to show or hide
   */
  toggleLayer(group: LayerGroup, layer: Layer) {
    this.mapService.toggleLayer(group, layer)
  }

  /**
   * Changes the color of a layer
   * @param layer Layer for which the color is changed
   * @param event HTML input event with new color
   */
  changeLayerColor(layer: Layer, event: any) {
    this.mapService.changeLayer(layer, 'color', event.target.value)
  }

  /**
   * Changes the opacity of a layer
   * @param layer Layer for which the opacity is changed
   * @param event HTML input event with new opacity
   */
  changeLayerOpacity(layer: Layer, event: any) {
    this.mapService.changeLayer(layer, 'opacity', parseFloat(event.target.value))
  }

  /**
   * Activates or deactivates extrusion for a layer
   * @param layer Layer of which the extrusion is changed
   */
  changeLayer3D(layer: Layer) {
    this.mapService.changeLayer(layer, '3d')
  }
}
