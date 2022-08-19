/**
 * Class for configuration of the map and the application
 */
export class Configuration {
  /** Index of the basemap */
  styleID: number = 0
  /** URL to an external style */
  externalStyleURL: string = ""
  /** Zoom level of the map */
  zoom: number = 0
  /** Longitude of the map */
  lon: number = 0
  /** Latitude of the map */
  lat: number = 0
  /** Pitch level of the map */
  pitch: number = 0
  /** Bearing level of the map */
  bearing: number = 0
  /** Saturation of the map */
  saturation: number = 0
  /** Brightness of the map */
  brightness: number = 0
  /** List of all changed layers */
  changedLayers: { id: number, color: string, opacity: number, threeDimOff: boolean }[] = []
  /** List of all changed subgroups */
  changedSubGroups: { id: number, parent: number, fillColor: string, fillOpacity: number, lineColor: string, lineOpacity: number, symbolColor: string, symbolOpacity: number, circleColor: string, circleOpacity: number, threeDimOff: boolean }[] = []
  /** List of all hidden subgroups */
  hiddenSubGroups: { id: number, parent: number }[] = []
  /** List of all hidden layers */
  hiddenLayers: number[] = []
  /** List of all hidden controls */
  hiddenControls: string[] = []
}
