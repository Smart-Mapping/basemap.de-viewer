import { Injectable } from '@angular/core';
import { Map, IControl } from 'maplibre-gl'
import { HttpClient } from '@angular/common/http';
import { share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Layer, LayerGroup } from '../entities/layergroup';
import { Control } from '../entities/control';
import { Basemap } from '../entities/basemap';
import { Configuration } from '../entities/configuration';
import PositionedPitchControl from '../components/controls/maplibre-gl.positioned.pitch.control';
import PositionedGeolocateControl from '../components/controls/maplibre-gl.positioned.geolocate.control';
import PositionedNavigationControl from '../components/controls/maplibre-gl.positioned.navigation.control';
import PositionedScaleControl from '../components/controls/maplibre-gl.positioned.scale.control';
import PositionedSearchControl from '../components/controls/maplibre-gl.positioned.search.control';
import PositionedZoomLevelControl from '../components/controls/maplibre-gl.positioned.zoomlevel.control';
import convert from 'color-convert';

/**
 * Service to interact with the map
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {

  /** Initial configuration to create the map */
  config: Configuration = new Configuration()
  /** Metadata for creating layergroups for supported basemaps */
  metaData?: Promise<any>
  /** Map object */
  map?: Map
  /** Indicates if map is in print mode */
  isInPrintMode: boolean = false
  /** Current brightness level of the map */
  brightness: number = 0
  /** Current saturation level of the map */
  saturation: number = 0
  /** All available map control elements */
  controls: Control[] = []
  /** All available basemaps */
  basemaps: Basemap[] = []
  /** Currently active basemap */
  activeBasemap?: Basemap
  /** Index of currently active basemap */
  activeBasemapIndex: number = 0
  /** All layergroups of active basemap */
  layerGroups: LayerGroup[] = []
  /** Current pitch level of the map */
  pitch: number = 0
  /** Current bearing of the map */
  bearing: number = 0
  /** Current zoom level of the map */
  zoom: number = 0
  /** Current longitude of the map */
  lon: number = 0
  /** Current latitude of the map */
  lat: number = 0

  /**
   * @ignore
   */
  constructor(private http: HttpClient) { }

  /**
   * Prepares the service. Creates config, available basemaps and controls
   */
  prepare() {
    const path = new URLSearchParams(window.location.search)
    if (path.has('config')) {
      try {
        this.config = JSON.parse(atob(path.get('config') ?? "")) as Configuration

      } catch (error) {
        this.config = (environment.config as Configuration)
        console.log("Failed to load configuration")
      }
    } else {
      this.config = (environment.config as Configuration)
    }
    this.pitch = this.config.pitch
    this.bearing = this.config.bearing
    this.zoom = this.config.zoom
    this.lon = this.config.lon
    this.lat = this.config.lat

    this.brightness = this.config.brightness
    this.saturation = this.config.saturation
    this.activeBasemapIndex = this.config.styleID
    environment.basemaps.forEach((basemap: any) => this.basemaps.push(
      new Basemap(
        basemap.name,
        basemap.imgUrl,
        basemap.styling,
        basemap.topPlusBg,
        basemap.topPlusBgBehind ? basemap.topPlusBgBehind : '',
        basemap.useMetaData,
        basemap.isBeta
      ))
    )
    if (this.config.externalStyleURL !== '') {
      this.basemaps.push(
        new Basemap('external', '', this.config.externalStyleURL, false, '', false, false)
      )
      this.setActiveBasemap(this.basemaps[this.basemaps.length - 1],this.basemaps.length - 1)
    } else { 
      this.activeBasemap = this.basemaps[this.activeBasemapIndex]
    }

    environment.controls.forEach((control: any) => {
      let mapControl: IControl
      switch (control.type) {
        case "scale":
          mapControl = new PositionedScaleControl({}, control.oder)
          break;
        case "navigation":
          mapControl = new PositionedNavigationControl({}, control.order)
          break;
        case "search":
          mapControl = new PositionedSearchControl(control.order)
          break;
        case "zoomlevel":
          mapControl = new PositionedZoomLevelControl(control.order)
          break;
        case "pitch":
          mapControl = new PositionedPitchControl(control.order)
          break;
        case "geolocate":
          mapControl = new PositionedGeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          }, control.order)
          break;
        default:
          throw new Error("No class for this type of control: " + control.type)
      }
      const isHidden = this.config.hiddenControls.includes(control.type)
      const newControl = new Control(control.name, control.type, isHidden, mapControl, control.position as "bottom-left" | "top-left" | "top-right" | "bottom-right")
      this.controls.push(newControl)
    })
  }

  /**
   * Updates all layergroups for the selected basemap
   * @param meta Metadata to use for updating layergroups
   */
  updateLayerGroups(meta?: any) {
    if (this.activeBasemap?.useMetaData) {
      this.layerGroups = []
      let layers = this.map?.getStyle().layers ?? []
      meta.groups.forEach((g: any, i: number) => {
        const group = new LayerGroup(g.name, [], true)
        group.id = i
        if (g.subgroups && g.subgroups.length > 0) {
          g.subgroups.forEach((sub: any, j: number) => {
            const subgroup = new LayerGroup(sub.name, [], true)
            subgroup.id = j
            subgroup.parent = i
            layers.forEach((layer, id) => {
              let addLayer = new Layer(layer.id, id, true, layer)
              const layerPaint = (layer as any)['paint']
              const isSymbolLayer = addLayer.maplibreLayer.type === 'symbol'
              const colorProperty = (isSymbolLayer ? 'text' : addLayer.maplibreLayer.type) + "-color"
              const opacityProperty = (isSymbolLayer ? 'text' : addLayer.maplibreLayer.type) + "-opacity"
              addLayer.color = this.getHexColor(layerPaint && layerPaint[colorProperty] ? layerPaint[colorProperty] : '#000000')
              addLayer.opacity = layerPaint && parseFloat(layerPaint[opacityProperty]) ? parseFloat(layerPaint[opacityProperty]) : 1
              addLayer.has3D = addLayer.maplibreLayer.type === 'fill-extrusion'
              addLayer.threeDimOff = (addLayer.has3D && layerPaint['fill-extrusion-height'] === 0)

              if (sub.fill && sub.fill.find((f: string) => f === layer.id)) {
                addLayer.metaType = 'fill'
                subgroup.fillColor = addLayer.color
                subgroup.fillOpacity = addLayer.opacity
                subgroup.layers.push(addLayer)
              }
              if (sub.symbol && sub.symbol.find((f: string) => f === layer.id)) {
                addLayer.metaType = 'symbol'
                subgroup.symbolColor = addLayer.color
                subgroup.symbolOpacity = addLayer.opacity
                subgroup.layers.push(addLayer)
              }
              if (sub.circle && sub.circle.find((f: string) => f === layer.id)) {
                addLayer.metaType = 'circle'
                subgroup.circleColor = addLayer.color
                subgroup.circleOpacity = addLayer.opacity
                subgroup.layers.push(addLayer)
              }
              if (sub.line && sub.line.find((f: string) => f === layer.id)) {
                addLayer.metaType = 'line'
                subgroup.lineColor = addLayer.color
                subgroup.lineOpacity = addLayer.opacity
                subgroup.layers.push(addLayer)
              }
            })
            if (subgroup.layers.length > 0) {
              subgroup.has3D = subgroup.layers[0].has3D
              subgroup.threeDimOff = subgroup.layers[0].threeDimOff
              group.subgroups.push(subgroup)
            }
          })
        }
        if (group.subgroups.length > 0) {
          this.layerGroups.push(group)
        }
      })

    } else {
      this.layerGroups = []
      let layers = this.map?.getStyle().layers ?? []
      layers.forEach((layer, id) => {
        const sourceLayer = layer.hasOwnProperty('source-layer') ? (layer as any)["source-layer"] : "Nicht_zugeordnet"
        let entry = this.layerGroups.find(e => e.name === sourceLayer)
        let newLayer = new Layer(layer.id, id, true, layer)
        if (!entry) {
          this.layerGroups.push(new LayerGroup(sourceLayer, [newLayer], false))
        } else {
          entry.layers.push(newLayer)
        }
        const layerPaint = (layer as any)['paint']
        const isSymbolLayer = newLayer.maplibreLayer.type === 'symbol'
        const colorProperty = (isSymbolLayer ? 'text' : newLayer.maplibreLayer.type) + "-color"
        const opacityProperty = (isSymbolLayer ? 'text' : newLayer.maplibreLayer.type) + "-opacity"
        newLayer.color = this.getHexColor(layerPaint && layerPaint[colorProperty] ? layerPaint[colorProperty] : '#000000')
        newLayer.opacity = layerPaint && parseFloat(layerPaint[opacityProperty]) ? parseFloat(layerPaint[opacityProperty]) : 1
        newLayer.has3D = newLayer.maplibreLayer.type === 'fill-extrusion'
        newLayer.threeDimOff = (newLayer.has3D && layerPaint['fill-extrusion-height'] === 0)

        // Read layer visibility from style and set visibility for layers and groups
        if (layer.hasOwnProperty('layout') && layer.layout?.visibility === 'none') {
          newLayer.visible = false
        } else {
          newLayer.visible = true
          let entry = this.layerGroups.find(e => e.name === sourceLayer)
          if (entry) {
            entry.visible = true
          }
        }
        newLayer.visible = (layer.hasOwnProperty('layout') && layer.layout?.visibility === 'none') ? false : true
      })
      this.layerGroups.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  /**
   * Reads current map configuration and creates a new configuration as base64 string
   * @returns Map configuration as base64 string
   */
  getConfigurationBase64() {
    const config = new Configuration()
    config.styleID = this.activeBasemapIndex
    config.externalStyleURL = this.basemaps.find(bm => bm.name === 'external')?.styling ?? ''
    config.zoom = this.zoom
    config.lon = this.lon
    config.lat = this.lat
    config.pitch = this.pitch
    config.bearing = this.bearing
    config.saturation = this.saturation
    config.brightness = this.brightness
    config.hiddenControls = this.controls.filter(c => !c.visible).map(c => c.type)
    if (this.activeBasemap?.useMetaData) {
      this.layerGroups.forEach(group => {
        group.subgroups.forEach(sub => {
          if (!sub.visible) {
            config.hiddenSubGroups.push({ id: sub.id, parent: sub.parent })
          }
          if (sub.changed) {
            config.changedSubGroups.push({
              id: sub.id,
              parent: sub.parent,
              circleColor: sub.circleColor,
              circleOpacity: sub.circleOpacity,
              fillColor: sub.fillColor,
              fillOpacity: sub.fillOpacity,
              lineColor: sub.lineColor,
              lineOpacity: sub.lineOpacity,
              symbolColor: sub.symbolColor,
              symbolOpacity: sub.symbolOpacity,
              threeDimOff: sub.threeDimOff
            })
          }
        })
      })
    } else {
      this.layerGroups.forEach(group => {
        group.layers.forEach(layer => {
          if (!layer.visible) {
            config.hiddenLayers.push(layer.id)
          }
          if (layer.changed) {
            config.changedLayers.push({
              color: layer.color,
              opacity: layer.opacity,
              threeDimOff: layer.threeDimOff,
              id: layer.id
            })
          }
        })
      })
    }
    return btoa(JSON.stringify(config))
  }

  /**
   * Creates a map in the provided container element. Sets listener for map values and uses config to hide or change layers.
   * @param container
   */
  createMap(container: HTMLElement) {
    this.map = new Map({
      container: container,
      style: this.basemaps[this.activeBasemapIndex].styling,
      pitch: this.pitch,
      bearing: this.bearing,
      zoom: this.zoom,
      canvasContextAttributes: {
        preserveDrawingBuffer: true,
      },
      center: [this.lon, this.lat],
      maxZoom: 19
    })
    this.map.on('move', () => {
      this.pitch = parseFloat(this.map?.getPitch().toFixed(0) ?? "0")
      this.bearing = parseFloat(this.map?.getBearing().toFixed(0) ?? "0")
      this.zoom = parseFloat(this.map?.getZoom().toFixed(2) ?? "0")
      this.lon = parseFloat(this.map?.getCenter().lng.toFixed(4) ?? "0")
      this.lat = parseFloat(this.map?.getCenter().lat.toFixed(4) ?? "0")
    })
    const setInitialHSL = () => {
      const initalBrightness = this.brightness
      const initialSaturation = this.saturation
      this.brightness = 0
      this.saturation = 0
      this.changeHSL(initialSaturation, initalBrightness)
    }
    this.map.once('styledata', () => {
      this.addBackground()
      this.controls.forEach(control => this.toggleControl(control))
      if (this.activeBasemap?.useMetaData) {
        this.getMetaData().then(meta => {
          this.updateLayerGroups(meta)
          this.config.changedSubGroups.forEach(csg => {
            let group = this.layerGroups.find(lg => lg.id === csg.parent)
            let subgroup = group?.subgroups.find(sg => sg.id === csg.id)
            if (subgroup) {
              subgroup.fillColor = csg.fillColor
              subgroup.fillOpacity = csg.fillOpacity
              subgroup.lineColor = csg.lineColor
              subgroup.lineOpacity = csg.lineOpacity
              subgroup.symbolColor = csg.symbolColor
              subgroup.symbolOpacity = csg.symbolOpacity
              subgroup.circleColor = csg.circleColor
              subgroup.circleOpacity = csg.circleOpacity
              subgroup.threeDimOff = csg.threeDimOff
              subgroup.changed = true
              subgroup.layers.forEach(layer => {
                layer.changed = true
                switch (layer.metaType) {
                  case 'fill':
                    this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-opacity', subgroup?.fillOpacity)
                    this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-color', subgroup?.fillColor)
                    break
                  case 'circle':
                    this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-opacity', subgroup?.circleOpacity)
                    this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-color', subgroup?.circleColor)
                    break
                  case 'line':
                    this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-opacity', subgroup?.lineOpacity)
                    this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-color', subgroup?.lineColor)
                    break
                  case 'symbol':
                    this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-opacity', subgroup?.symbolOpacity)
                    this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-color', subgroup?.symbolColor)
                    break
                }
                if (subgroup!.threeDimOff) {
                  this.map?.setPaintProperty(layer.name, 'fill-extrusion-height', 0)
                }
              })
            }
          })
          this.config.hiddenSubGroups.forEach(hsg => {
            let group = this.layerGroups.find(lg => (lg.id === hsg.parent))
            let subgroup = group?.subgroups.find(sg => (sg.id === hsg.id))
            if (subgroup) {
              subgroup.visible = false
              subgroup.layers.forEach(layer => {
                layer.visible = false
                this.map?.setLayoutProperty(layer.name, "visibility", "none")
              })
            }
            if (group) {
              group.visible = (group.subgroups.find(s => s.visible) !== undefined)
            }
          })
          //setInitialHSL()
        })
      } else {
        this.updateLayerGroups()
        this.layerGroups.forEach(group => {
          this.config.hiddenLayers.forEach(hl => {
            let layer = group.layers.find(f => f.id === hl)
            if (layer) {
              layer.visible = false
              group.visible = (group.layers.find(l => l.visible) !== undefined)
              this.map?.setLayoutProperty(layer.name, "visibility", layer.visible ? "visible" : "none")
            }
          })
          this.config.changedLayers.forEach(cl => {
            let layer = group.layers.find(f => f.id === cl.id)
            if (layer) {
              layer.changed = true
              layer.color = cl.color
              layer.opacity = cl.opacity
              layer.threeDimOff = cl.threeDimOff
              this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-color', layer.color)
              this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-opacity', layer.opacity)
              if (layer.threeDimOff) {
                this.map?.setPaintProperty(layer.name, 'fill-extrusion-height', 0)
              }
            }
          })
        })
        //setInitialHSL()
      }
    })
    document.querySelector('.maplibregl-ctrl-attrib-inner')?.setAttribute("role", "")
  }

  /**
   * Shows or hides a provided control element
   * @param control Element to show or hide
   */
  toggleControl(control: Control) {
    control.visible = !control.visible
    if (control.visible) {
      this.map?.addControl(control.control, control.position)
    } else {
      this.map?.hasControl(control.control) && this.map?.removeControl(control.control)
    }
  }

  /**
   * Shows or hides a layergroup
   * @param group Group to show or hide
   * @param subgroup If provided, shows or hides subgroup instead of group
   */
  toggleGroup(group: LayerGroup, subgroup?: LayerGroup) {
    if (this.activeBasemap?.useMetaData) {
      if (subgroup) {
        subgroup.visible = !subgroup.visible
        if (subgroup.visible) {
          group.visible = true
        } else {
          group.visible = (group.subgroups.find(s => s.visible) !== undefined)
        }
        subgroup.layers.forEach(layer => {
          layer.visible = subgroup.visible
          this.map?.setLayoutProperty(layer.name, "visibility", layer.visible ? "visible" : "none")
        })
      } else {
        group.visible = !group.visible
        group.subgroups.forEach(sub => {
          sub.visible = group.visible
          sub.layers.forEach(layer => {
            layer.visible = sub.visible
            this.map?.setLayoutProperty(layer.name, "visibility", layer.visible ? "visible" : "none")

          })
        })
      }
    } else {
      group.visible = !group.visible
      group.layers.forEach(layer => {
        layer.visible = group.visible
        this.map?.setLayoutProperty(layer.name, "visibility", layer.visible ? "visible" : "none")
      })
    }
  }

  /**
   * Shows or hides a layer
   * @param group Group of which the layer is a child
   * @param layer Layer to show or hide
   */
  toggleLayer(group: LayerGroup, layer: Layer) {
    layer.visible = !layer.visible
    if (layer.visible) {
      group.visible = true
    } else {
      group.visible = (group.layers.find(l => l.visible) !== undefined)
    }
    this.map?.setLayoutProperty(layer.name, "visibility", layer.visible ? "visible" : "none")

  }

  /**
   * Changes properties for a group
   * @param group Group for which a property is changed
   * @param property Specifies what to change for the group
   * @param metaType Type of the group
   * @param value New value for property
   */
  changeSubgroup(group: LayerGroup, property: 'color' | 'opacity' | '3d', metaType: 'fill' | 'symbol' | 'line' | 'circle', value?: any) {
    group.changed = true
    if (property === '3d') {
      group.threeDimOff = !group.threeDimOff
      group.layers.forEach(layer => {
        layer.threeDimOff = group.threeDimOff
        if (layer.threeDimOff) {
          this.map?.setPaintProperty(layer.name, 'fill-extrusion-height', 0)
        } else {
          this.map?.setPaintProperty(layer.name, 'fill-extrusion-height', ["case", ["has", "hoehe"], ["get", "hoehe"], ["has", "height"], ["get", "height"], 6])
        }
      })
    } else {
      let isColor = property === 'color'
      switch (metaType) {
        case 'fill':
          isColor ? group.fillColor = value : group.fillOpacity = value
          break
        case 'circle':
          isColor ? group.circleColor = value : group.circleOpacity = value
          break
        case 'line':
          isColor ? group.lineColor = value : group.lineOpacity = value
          break
        case 'symbol':
          isColor ? group.symbolColor = value : group.symbolOpacity = value
          break
      }
      group.layers.filter(s => s.metaType === metaType).forEach(layer => {
        isColor ? layer.color = value : layer.opacity = value
        this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-' + property, value)
      })
    }
  }

  /**
   * Changes properties for a layer
   * @param layer Layer for which a property is changed
   * @param property Specifies what to change for the layer
   * @param value New value for property
   */
  changeLayer(layer: Layer, property: 'color' | 'opacity' | '3d', value?: any) {
    layer.changed = true
    switch (property) {
      case 'color':
        layer.color = value
        this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-color', layer.color)
        break
      case 'opacity':
        layer.opacity = value
        this.map?.setPaintProperty(layer.name, (layer.maplibreLayer.type === 'symbol' ? 'text' : layer.maplibreLayer.type) + '-opacity', layer.opacity)
        break
      case '3d':
        layer.threeDimOff = !layer.threeDimOff
        if (layer.threeDimOff) {
          this.map?.setPaintProperty(layer.name, 'fill-extrusion-height', 0)
        } else {
          this.map?.setPaintProperty(layer.name, 'fill-extrusion-height', ["case", ["has", "hoehe"], ["get", "hoehe"], ["has", "height"], ["get", "height"], 6])
        }
    }
  }

  /**
   * Sets the active basemap for the map
   * @param basemap New basemap
   * @param index Index of the basemap
   */
  setActiveBasemap(basemap: Basemap, index: number) {
    this.activeBasemap = basemap
    this.activeBasemapIndex = index
    this.saturation = 0
    this.brightness = 0
    this.map?.setStyle(basemap.styling, { diff: true })
    this.map?.once('styledata', () => {
      this.addBackground()
      if (this.activeBasemap?.useMetaData) {
        this.getMetaData().then(meta => this.updateLayerGroups(meta))
      } else {
        this.updateLayerGroups()
      }
    })
  }

  /**
   * Gets the metadata file
   * @returns The metadata
   */
  getMetaData() {
    if (!this.metaData) {
      this.metaData = this.metaData = this.http.get(environment.metaDataURL).pipe(share()).toPromise()
    }
    return this.metaData
  }

  /**
   * Changes the saturation and brightness of the map
   * @param saturationDelta Change for the saturation
   * @param brightnessDelta Change for the brightness
   */
  changeHSL(saturationDelta: number, brightnessDelta: number) {
    this.saturation += saturationDelta
    this.brightness += brightnessDelta
    const style = this.map!.getStyle()
    for (const layerA of style.layers!) {
      const layer = (layerA as any)
      if (layer.type !== 'raster') {
        const colorType = (layer.type === 'symbol') ? 'text-color' : layer.type + '-color';
        if (layer.paint === undefined) {
          layer.paint = {};
        }
        if (layer.paint[colorType] === undefined) {
          layer.paint[colorType] = 'hsl(0,0%,0%)';
        } else if (!Array.isArray(layer.paint[colorType])) {
          const color = layer.paint[colorType];
          let convertColor = [300, 0, 60];
          if (color.search !== undefined) {
            if (color.search(/^rgb/) === 0) {
              let colorArray = color.substring(color.search(/\(/) + 1, color.length - 1)
                .replace(/ /g, '')
                .split(',');
              let alpha = 1;
              if (color.search(/^rgba/) === 0) {
                alpha = colorArray.pop();
              }
              colorArray = [
                parseInt(colorArray[0], 10),
                parseInt(colorArray[1], 10),
                parseInt(colorArray[2], 10)
              ];
              convertColor = convert.rgb.hsl(colorArray);
              convertColor[1] += saturationDelta;
              convertColor[2] += brightnessDelta;
              layer.paint[colorType] = 'hsla(' + convertColor[0] + ',' + convertColor[1] + '%,' + convertColor[2] + '%,' + alpha + ')';
            } else if (color.search(/^#/) === 0) {
              convertColor = convert.hex.hsl(color.substring(1));
              convertColor[1] += saturationDelta;
              convertColor[2] += brightnessDelta;
              layer.paint[colorType] = 'hsl(' + convertColor[0] + ',' + convertColor[1] + '%,' + convertColor[2] + '%)';
            } else if (color.search(/^hsl/) === 0) {
              let colorArray = color.substring(color.search(/\(/) + 1, color.length - 1)
                .replace(/ /g, '')
                .split(',');
              let alpha = 1;
              if (color.search(/^hsla/) === 0) {
                alpha = colorArray.pop();
              }
              colorArray = [
                parseInt(colorArray[0], 10),
                parseInt(colorArray[1].substring(0, colorArray[1].length - 1), 10) + saturationDelta,
                parseInt(colorArray[2].substring(0, colorArray[2].length - 1), 10) + brightnessDelta
              ];
              layer.paint[colorType] = 'hsla(' + colorArray[0] + ',' + colorArray[1] + '%,' + colorArray[2] + '%,' + alpha + ')';
            }
          }
        }
      }
    }
    this.map!.setStyle(style)
  }

  /**
   * Sets the map in print mode. Activates/Deactivates interaction, popups and controls
   * @param enable True to activate print mode, false to deactive
   */
  setupPrintMode(enable: boolean) {
    this.isInPrintMode = enable
    if (enable) {
      this.map?.dragRotate.disable();
      this.map?.touchZoomRotate.disableRotation();
      this.map?.touchPitch.disable()
    } else {
      this.map?.dragRotate.enable();
      this.map?.touchZoomRotate.enableRotation();
      this.map?.touchPitch.enable()
    }
    let popup = document.querySelector(".maplibregl-popup") as HTMLElement
    if (popup) {
      popup.style.visibility = enable ? 'hidden' : 'visible';
    }
    (document.querySelector(".maplibregl-ctrl-top-left") as HTMLElement).style.visibility = enable ? 'hidden' : 'visible';
    (document.querySelector(".maplibregl-ctrl-top-right") as HTMLElement).style.visibility = enable ? 'hidden' : 'visible';
    (document.querySelector(".maplibregl-ctrl-bottom-left") as HTMLElement).style.visibility = enable ? 'hidden' : 'visible';
    (document.querySelector(".maplibregl-ctrl-bottom-right") as HTMLElement).style.visibility = enable ? 'hidden' : 'visible';
    (document.querySelector('.print-overlay') as HTMLElement).style.visibility = enable ? 'visible' : 'hidden';
  }

  /**
   * Converts the provided color to hex code
   * @param color Color to convert
   * @returns Hex code for @param color
   */
  getHexColor(color: string) {
    let values: number[] = []
    if (color.toString().startsWith('rgb')) {
      values = color.substring(4, color.length - 1).split(',').map(a => parseFloat(a))
      return '#' + convert.rgb.hex(values[0], values[1], values[2])
    } else if (color.toString().startsWith('hsla')) {
      values = color.substring(5, color.length - 1).split(',').map(a => parseFloat(a))
      return '#' + convert.hsl.hex([values[0], values[1], values[2]])
    } else if (color.toString().startsWith('hsl')) {
      values = color.substring(4, color.length - 1).split(',').map(a => parseFloat(a))
      return '#' + convert.hsl.hex([values[0], values[1], values[2]])
    } else if (color.toString().startsWith('#')) {
      return color.toString()
    }
    return '#000000'
  }

  /**
   * Adds TopPlusOpen raster source as background if basemap supports it
   */
  private addBackground() {
    if (this.activeBasemap?.topPlusBg && !this.map?.getLayer('TopPlusOpen')) {
      this.map?.addSource('wms-topplusopen', {
        type: 'raster',
        tiles: [environment.topPlusURL],
        tileSize: 256,
        attribution: "Außerhalb Deutschlands: ©  <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap  contributors</a>, <a href=\"https://sg.geodatenzentrum.de/web_public/gdz/datenquellen/Datenquellen_TopPlusOpen.pdf\" target=\"_blank\">TopPlusOpen</a>"
      })
      this.map?.addLayer({
        id: 'TopPlusOpen',
        type: 'raster',
        source: 'wms-topplusopen',
        paint: {
          "raster-opacity": 0.5
        }
      }, this.activeBasemap?.topPlusBgBehind)
    }
  }
}
