import { Component } from '@angular/core';
import { LayerGroup } from 'src/app/entities/layergroup';
import { MapService } from 'src/app/services/map.service';

/**
 * Component for layer menu tab,
 * used if selected basemap has metadata for editor functionality
 */
@Component({
    selector: 'app-group-editor',
    templateUrl: './group-editor.component.html',
    styleUrls: ['./group-editor.component.scss'],
    standalone: false
})
export class GroupEditorComponent {

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
   * Shows or hides a subgroup
   * @param group Group of which subgroup is child
   * @param subgroup Subgroup to show or hide
   */
  toggleSubgroup(group: LayerGroup, subgroup: LayerGroup) {
    this.mapService.toggleGroup(group, subgroup)
  }

  /**
   * Changes the opacity of a subgroup
   * @param subgroup Subgroup of which the opacity is changed
   * @param event HTML input event with new opacity
   * @param metaType Type of subgroup
   */
  changeSubGroupOpacity(subgroup: LayerGroup, event: any, metaType: 'fill' | 'symbol' | 'line' | 'circle') {
    this.mapService.changeSubgroup(subgroup, 'opacity', metaType, parseFloat(event.target.value))
  }

  /**
   * Changes the color of a subgroup
   * @param subgroup Subgroup of which the color is changed
   * @param event HTML input event with new color
   * @param metaType Type of subgroup
   */
  changeSubgroupColor(subgroup: LayerGroup, event: any, metaType: 'fill' | 'symbol' | 'line' | 'circle') {
    this.mapService.changeSubgroup(subgroup, 'color', metaType, event.target.value)
  }

  /**
   * Activates or deactivates extrusion for a subgroup
   * @param subgroup Subgroup of which the extrusion is changed
   */
  changeSubgroup3D(subgroup: LayerGroup) {
    this.mapService.changeSubgroup(subgroup, '3d', 'symbol')
  }

  /**
   * Checks if subgroup has layers of type line
   * @param subgroup Subgroup with layers
   * @returns True if subgroup has layers of type line, false otherwise
   */
  hasLineLayers(subgroup: LayerGroup): boolean {
    return subgroup.layers.find(f => f.metaType === 'line') !== undefined
  }

  /**
   * Checks if subgroup has layers of type fill
   * @param subgroup Subgroup with layers
   * @returns True if subgroup has layers of type fill, false otherwise
   */
  hasFillLayers(subgroup: LayerGroup): boolean {
    return subgroup.layers.find(f => f.metaType === 'fill') !== undefined
  }

  /**
   * Checks if subgroup has layers of type symbol
   * @param subgroup Subgroup with layers
   * @returns True if subgroup has layers of type symbol, false otherwise
   */
  hasTextLayers(subgroup: LayerGroup): boolean {
    return subgroup.layers.find(f => f.metaType === 'symbol') !== undefined
  }

  /**
   * Checks if subgroup has layers of type circle
   * @param subgroup Subgroup with layers
   * @returns True if subgroup has layers of type circle, false otherwise
   */
  hasCircleLayers(subgroup: LayerGroup): boolean {
    return subgroup.layers.find(f => f.metaType === 'circle') !== undefined
  }
}
