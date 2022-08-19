import { LayerSpecification } from 'maplibre-gl';
import { v4 as uuid } from 'uuid';

/**
 * Class to represent a group of layers
 */
export class LayerGroup {

  /** Indicates if there are changes made to the group */
  changed = false
  /** Unique identifier */
  uuid: string = uuid()
  /** List of subgroups */
  subgroups: LayerGroup[] = []
  /** Color for all layers in the group of type fill */
  fillColor: string = '#000000'
  /** Opacity for all layers in the group of type fill */
  fillOpacity: number = 1
  /** Color for all layers in the group of type line */
  lineColor: string = '#000000'
  /** Opacity for all layers in the group of type line */
  lineOpacity: number = 1
  /** Color for all layers in the group of type symbol */
  symbolColor: string = '#000000'
  /** Opacity for all layers in the group of type symbol */
  symbolOpacity: number = 1
  /** Color for all layers in the group of type circle */
  circleColor: string = '#000000'
  /** Opacity for all layers in the group of type circle */
  circleOpacity: number = 1
  /** Indicates if group has layers with extrusion */
  has3D: boolean = false
  /** Indicates if extrusion is off */
  threeDimOff: boolean = false
  /** Index of group */
  id: number = 0
  /** Index of parent group */
  parent: number = 0

  /**
   * Creates a new Layergroup
   * @param name Name of the group
   * @param layers List of layers in the group
   * @param visible Indicates if group is visible
   */
  constructor(
    public name: string,
    public layers: Layer[],
    public visible: boolean
  ) { }
}

/**
 * Wrapper class for maplibre layers
 */
export class Layer {

  /** Unique identifier */
  uuid: string = uuid()
  /** Indicates if there are changes made to the layer */
  changed = false
  /** Meta type of the layer */
  metaType: 'fill' | 'symbol' | 'line' | 'circle' = "fill"
  /** Color of the layer */
  color: string = '#000000'
  /** Opacity of the layer */
  opacity: number = 1
  /** Indicates if layer has extrusion */
  has3D: boolean = false
  /** Indicates if extrusion is off */
  threeDimOff: boolean = false

  /**
   * Creates a new Layer
   * @param name Name of the layer
   * @param id Index of the layer
   * @param visible Indicates if layer is visible
   * @param maplibreLayer The maplibre layer object
   */
  constructor(
    public name: string,
    public id: number,
    public visible: boolean,
    public maplibreLayer: LayerSpecification
  ) { }
}
