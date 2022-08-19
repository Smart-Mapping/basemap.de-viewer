import { Control } from './../entities/control';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Basemap } from '../entities/basemap';
import { MapService } from './map.service';
import { Layer, LayerGroup } from '../entities/layergroup';
import { NavigationControl, BackgroundLayerSpecification } from 'maplibre-gl'


describe('MapService', () => {

  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService],
      imports: [HttpClientTestingModule],
      teardown: { destroyAfterEach: false }
    });
    service = TestBed.inject(MapService)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('tests related to prepare', () => {

    it('should load the config if path has config', () => {
      window.history.pushState({}, '', '?config=eyJzdHlsZUlEIjowLCJleHRlcm5hbFN0eWxlVVJMIjoiIiwiem9vbSI6Ny40NSwibG9uIjo5LjM2MTUsImxhdCI6NTIuMjM2OCwicGl0Y2giOjQ2LCJiZWFyaW5nIjotMjQsInNhdHVyYXRpb24iOjAsImJyaWdodG5lc3MiOjAsImNoYW5nZWRMYXllcnMiOltdLCJjaGFuZ2VkU3ViR3JvdXBzIjpbXSwiaGlkZGVuU3ViR3JvdXBzIjpbXSwiaGlkZGVuTGF5ZXJzIjpbXSwiaGlkZGVuQ29udHJvbHMiOlsiem9vbWxldmVsIl19')
      const expected_config = JSON.parse(JSON.stringify({ styleID: 0, externalStyleURL: '', zoom: 6, lon: 10.45, lat: 51.16, pitch: 46, bearing: 0, saturation: 0, brightness: 0, changedLayers: [], changedSubGroups: [], hiddenSubGroups: [], hiddenLayers: [], hiddenControls: ['zoomlevel'] }))
      service.prepare()
      expect(service.pitch).toEqual(expected_config.pitch)
    })

    it('should catch error, if config failes to load', () => {
      window.history.pushState({}, '', '?config=test')
      service.prepare()
      expect(service.pitch).toEqual(0)
    })

    it('should throw a default Error, if the control type is not scale, navigation, search, zoomlevel, pitch or geolocate', () => {
      window.history.pushState({}, '', '')
      environment.controls[0].type = 'navigation-test'
      expect(function () { service.prepare(); }).toThrowError("No class for this type of control: " + environment.controls[0].type);
      environment.controls[0].type = 'navigation'
    })

    it('should push a new basemap, if the config has an externalStyleURL', () => {
      window.history.pushState({}, '', '?config=eyJzdHlsZUlEIjo3LCJleHRlcm5hbFN0eWxlVVJMIjoiaHR0cHM6Ly9zZ3guZ2VvZGF0ZW56ZW50cnVtLmRlL2dkel9iYXNlbWFwZGVfdmVrdG9yL3N0eWxlcy9ibV93ZWJfY29sLmpzb24iLCJ6b29tIjo3LjQ1LCJsb24iOjkuMzYxNSwibGF0Ijo1Mi4yMzY4LCJwaXRjaCI6NDYsImJlYXJpbmciOi0yNCwic2F0dXJhdGlvbiI6MCwiYnJpZ2h0bmVzcyI6MCwiY2hhbmdlZExheWVycyI6W10sImNoYW5nZWRTdWJHcm91cHMiOltdLCJoaWRkZW5TdWJHcm91cHMiOltdLCJoaWRkZW5MYXllcnMiOltdLCJoaWRkZW5Db250cm9scyI6WyJ6b29tbGV2ZWwiXX0=')
      const expected_config = JSON.parse(JSON.stringify({ styleID: 7, externalStyleURL: 'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_col.json', zoom: 7.45, lon: 9.3615, lat: 52.2368, pitch: 46, bearing: -24, saturation: 0, brightness: 0, changedLayers: [], changedSubGroups: [], hiddenSubGroups: [], hiddenLayers: [], hiddenControls: ['zoomlevel'] }))
      service.prepare()
      expect(service.basemaps).toContain(new Basemap('external', '', expected_config.externalStyleURL, false, '', false, false))
    })

  })

  describe('tests relted to updateLayerGroups', () => {

    it('should update layer groups based on the source-layer without meta', () => {
      const container = document.createElement('div')
      service.prepare()
      service.createMap(container)
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = false
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            'layers': [
              { 'id': '1', 'type': 'fill', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'fill-color': 'hsl(324,43%,77%)' } },
              { 'id': '2', 'type': 'symbol', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'text-color': 'hsl(324,43%,77%)' } },
              { 'id': '3', 'type': 'symbol', 'source': 'basiskarte', 'source-layer': 'test2', 'paint': { 'text-color': 'hsl(324,43%,77%)' } }

            ],
          }
        ))
      }
      service.updateLayerGroups()
      expect(service.layerGroups[0].name).toEqual('test')
      expect(service.layerGroups[1].name).toEqual('test2')
    })

    it('should update layer groups based on the source-layer, if no source-layer is given, then the group name is set to Nicht_zugeordnet', () => {
      const container = document.createElement('div')
      service.prepare()
      service.createMap(container)
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = false
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            'layers': [
              { 'id': '1', 'type': 'fill', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'fill-color': 'hsl(324,43%,77%)' } },
              { 'id': '2', 'type': 'symbol', 'source': 'basiskarte', 'paint': { 'text-color': 'hsl(324,43%,77%)', 'text-opacity': 0.6 } },
              { 'id': '3', 'type': 'symbol', 'source': 'basiskarte', 'paint': { 'text-color': 'hsl(324,43%,77%)' } }

            ],
          }
        ))
      }
      service.updateLayerGroups()
      expect(service.layerGroups[0].name).toEqual('Nicht_zugeordnet')
      expect(service.layerGroups[1].name).toEqual('test')
    })

    it('should update layer groups and set the paintcolor to white, if no color is set ', () => {
      const container = document.createElement('div')
      service.prepare()
      service.createMap(container)
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = false
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            'layers': [
              { 'id': '1', 'type': 'fill', 'source': 'basiskarte', 'source-layer': 'test' },

            ],
          }
        ))
      }
      service.updateLayerGroups()
      expect(service.layerGroups[0].layers[0].color).toEqual('#000000')
    })

    it('should update layer groups with meta, expect subgroup to have type fill and fillcolor from the layer ', () => {
      const meta = {
        "groups": [
          {
            "name": "Besondere Siedlungsflächen",
            "subgroups": [
              {
                "name": "Friedhof",
                "fill": [
                  "ALKIS - Friedhof",
                  "Friedhof",
                  "openmaptiles - Friedhof",
                  "basiskarte - Friedhof"
                ]
              },
            ]
          },
          {
            "name": "Energie und Versorgung",
            "subgroups": [
              {
                "name": "Leitung",
                "line": [
                  "basiskarte - Leitung",
                  "Leitung"
                ]
              },
              {
                "name": "Vorratsbehälter, Speicherbauwerk",
                "fill": [
                  "ALKIS - Vorratsbehälter, Speicherbauwerk",
                  "Vorratsbehälter, Speicherbauwerk",
                  "fill-extrusion"
                ],
                "line": [
                  "ALKIS - Vorratsbehälter, Speicherbauwerk - Kontur",
                  "Vorratsbehälter, Speicherbauwerk - Kontur"
                ],
                "symbol": [
                  "symbol_layer"
                ],
                "circle": [
                  "circle_layer"

                ]
              }
            ]
          }
        ]
      }
      const container = document.createElement('div')
      service.prepare()
      service.createMap(container)
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = true
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            'layers': [
              { 'id': 'Friedhof', 'type': 'fill', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'fill-color': '#666666' } },
              { 'id': 'Leitung', 'type': 'line', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'line-opacity': 0.6 } },
              { 'id': 'symbol_layer', 'type': 'symbol', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'text-opacity': 0.6 } },
              { 'id': 'circle_layer', 'type': 'circle', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'circle-opacity': 0.6 } },
              { 'id': 'fill_layer', 'type': 'fill-extrusion', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'fill-extrusion-height': 0 } }


            ],
          }
        ))
      }
      service.updateLayerGroups(meta)
      expect(service.layerGroups[0].subgroups[0].fillColor).toEqual('#666666')
      expect(service.layerGroups[0].subgroups[0].layers[0].metaType).toEqual('fill')
    })

    it('should update layer groups with meta, expect subgroup to have type symbol and textcolor from the layer ', () => {
      const meta = {
        "groups": [
          {
            "name": "Besondere Siedlungsflächen",
            "subgroups": [
              {
                "name": "Friedhof",
                "fill": [
                  "ALKIS - Friedhof",
                  "Friedhof",
                  "openmaptiles - Friedhof",
                  "basiskarte - Friedhof"
                ]
              },
            ]
          },
          {
            "name": "Energie und Versorgung",
            "subgroups": [
              {
                "name": "Leitung",
                "line": [
                  "basiskarte - Leitung",
                  "Leitung"
                ]
              },
              {
                "name": "Vorratsbehälter, Speicherbauwerk",
                "fill": [
                  "ALKIS - Vorratsbehälter, Speicherbauwerk",
                  "Vorratsbehälter, Speicherbauwerk",
                  "fill-extrusion"
                ],
                "line": [
                  "ALKIS - Vorratsbehälter, Speicherbauwerk - Kontur",
                  "Vorratsbehälter, Speicherbauwerk - Kontur"
                ],
                "symbol": [
                  "symbol_layer"
                ],
                "circle": [
                  "circle_layer"

                ]
              }
            ]
          }
        ]
      }
      const container = document.createElement('div')
      service.prepare()
      service.createMap(container)
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = true
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            'layers': [
              { 'id': 'symbol_layer', 'type': 'symbol', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'text-opacity': 0.6 } }
            ],
          }
        ))
      }
      service.updateLayerGroups(meta)
      expect(service.layerGroups[0].subgroups[0].symbolColor).toEqual('#000000')
      expect(service.layerGroups[0].subgroups[0].layers[0].metaType).toEqual('symbol')
    })

    it('should update layer groups with meta, expect subgroup to have type line and linecolor from the layer ', () => {
      const meta = {
        "groups": [
          {
            "name": "Besondere Siedlungsflächen",
            "subgroups": [
              {
                "name": "Friedhof",
                "fill": [
                  "ALKIS - Friedhof",
                  "Friedhof",
                  "openmaptiles - Friedhof",
                  "basiskarte - Friedhof"
                ]
              },
            ]
          },
          {
            "name": "Energie und Versorgung",
            "subgroups": [
              {
                "name": "Leitung",
                "line": [
                  "basiskarte - Leitung",
                  "Leitung"
                ]
              },
              {
                "name": "Vorratsbehälter, Speicherbauwerk",
                "fill": [
                  "ALKIS - Vorratsbehälter, Speicherbauwerk",
                  "Vorratsbehälter, Speicherbauwerk",
                  "fill-extrusion"
                ],
                "line": [
                  "ALKIS - Vorratsbehälter, Speicherbauwerk - Kontur",
                  "Vorratsbehälter, Speicherbauwerk - Kontur"
                ],
                "symbol": [
                  "symbol_layer"
                ],
                "circle": [
                  "circle_layer"

                ]
              }
            ]
          }
        ]
      }
      const container = document.createElement('div')
      service.prepare()
      service.createMap(container)
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = true
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            'layers': [
              { 'id': 'Leitung', 'type': 'line', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'line-opacity': 0.6 } }
            ],
          }
        ))
      }
      service.updateLayerGroups(meta)
      expect(service.layerGroups[0].subgroups[0].lineColor).toEqual('#000000')
      expect(service.layerGroups[0].subgroups[0].layers[0].metaType).toEqual('line')
    })

    it('should update layer groups with meta, expect subgroup to have type circle and circlecolor from the layer ', () => {
      const meta = {
        "groups": [
          {
            "name": "Besondere Siedlungsflächen",
            "subgroups": [
              {
                "name": "Friedhof",
                "fill": [
                  "ALKIS - Friedhof",
                  "Friedhof",
                  "openmaptiles - Friedhof",
                  "basiskarte - Friedhof"
                ]
              },
            ]
          },
          {
            "name": "Energie und Versorgung",
            "subgroups": [
              {
                "name": "Leitung",
                "line": [
                  "basiskarte - Leitung",
                  "Leitung"
                ]
              },
              {
                "name": "Vorratsbehälter, Speicherbauwerk",
                "fill": [
                  "ALKIS - Vorratsbehälter, Speicherbauwerk",
                  "Vorratsbehälter, Speicherbauwerk",
                  "fill-extrusion"
                ],
                "line": [
                  "ALKIS - Vorratsbehälter, Speicherbauwerk - Kontur",
                  "Vorratsbehälter, Speicherbauwerk - Kontur"
                ],
                "symbol": [
                  "symbol_layer"
                ],
                "circle": [
                  "circle_layer"

                ]
              }
            ]
          }
        ]
      }
      const container = document.createElement('div')
      service.prepare()
      service.createMap(container)
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = true
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            'layers': [
              { 'id': 'circle_layer', 'type': 'circle', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'circle-opacity': 0.6 } }
            ],
          }
        ))
      }
      service.updateLayerGroups(meta)
      expect(service.layerGroups[0].subgroups[0].lineColor).toEqual('#000000')
      expect(service.layerGroups[0].subgroups[0].layers[0].metaType).toEqual('circle')
    })

    it('should update layer groups to threeDimmOff = true if the fill-extrusion-height is 0 ', () => {
      const container = document.createElement('div')
      service.prepare()
      service.createMap(container)
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = false
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            'layers': [
              { 'id': '1', 'type': 'fill-extrusion', 'source': 'basiskarte', 'source-layer': 'test', 'paint': { 'fill-extrusion-height': 0 } },
            ],
          }
        ))
      }
      service.updateLayerGroups()
      expect(service.layerGroups[0].layers[0].threeDimOff).toBe(true)
    })

  })

  describe('tests related to get ConfigurationBase64()', () => {

    it('should return the configuration as a base64 string', () => {
      const expected_return_string = 'eyJzdHlsZUlEIjowLCJleHRlcm5hbFN0eWxlVVJMIjoiIiwiem9vbSI6MCwibG9uIjowLCJsYXQiOjAsInBpdGNoIjowLCJiZWFyaW5nIjowLCJzYXR1cmF0aW9uIjowLCJicmlnaHRuZXNzIjowLCJjaGFuZ2VkTGF5ZXJzIjpbeyJjb2xvciI6IiMwMDAwMDAiLCJvcGFjaXR5IjoxLCJ0aHJlZURpbU9mZiI6ZmFsc2UsImlkIjozfV0sImNoYW5nZWRTdWJHcm91cHMiOltdLCJoaWRkZW5TdWJHcm91cHMiOltdLCJoaWRkZW5MYXllcnMiOlsxXSwiaGlkZGVuQ29udHJvbHMiOltdfQ=='
      const maplibrelayer: BackgroundLayerSpecification = {
        id: 'RGB',
        type: 'background',
        paint: {
          'background-color': 'hsla(324,43%,77%,1)'
        }
      }
      const group = new LayerGroup('group', [], true)
      const layer_not_visible = new Layer('layer_not_visible', 1, true, maplibrelayer)
      const layer = new Layer('layer', 2, true, maplibrelayer)
      const layer_changed = new Layer('layer_changed', 3, true, maplibrelayer)
      layer_not_visible.visible = false
      layer_changed.changed = true
      group.layers = [layer, layer_not_visible, layer_changed]
      service.layerGroups = [group]
      const return_string = service.getConfigurationBase64()
      expect(return_string).toEqual(expected_return_string)

    })

    it('should return the configuration as a base64 string with metaData', () => {
      const expected_return_string = 'eyJzdHlsZUlEIjowLCJleHRlcm5hbFN0eWxlVVJMIjoiIiwiem9vbSI6MCwibG9uIjowLCJsYXQiOjAsInBpdGNoIjowLCJiZWFyaW5nIjowLCJzYXR1cmF0aW9uIjowLCJicmlnaHRuZXNzIjowLCJjaGFuZ2VkTGF5ZXJzIjpbXSwiY2hhbmdlZFN1Ykdyb3VwcyI6W3siaWQiOjAsInBhcmVudCI6MCwiY2lyY2xlQ29sb3IiOiIjMDAwMDAwIiwiY2lyY2xlT3BhY2l0eSI6MSwiZmlsbENvbG9yIjoiIzAwMDAwMCIsImZpbGxPcGFjaXR5IjoxLCJsaW5lQ29sb3IiOiIjMDAwMDAwIiwibGluZU9wYWNpdHkiOjEsInN5bWJvbENvbG9yIjoiIzAwMDAwMCIsInN5bWJvbE9wYWNpdHkiOjEsInRocmVlRGltT2ZmIjpmYWxzZX1dLCJoaWRkZW5TdWJHcm91cHMiOlt7ImlkIjowLCJwYXJlbnQiOjB9XSwiaGlkZGVuTGF5ZXJzIjpbXSwiaGlkZGVuQ29udHJvbHMiOltdfQ=='
      const group = new LayerGroup('group', [], true)
      const subgroup_not_visible = new LayerGroup('subgroup_not_visible', [], true)
      const subgroup = new LayerGroup('subgroup', [], true)
      const subgroup_changed = new LayerGroup('subgroup_changed', [], true)
      subgroup_not_visible.visible = false
      subgroup_changed.changed = true
      group.subgroups = [subgroup, subgroup_not_visible, subgroup_changed]
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.layerGroups = [group]
      const return_string = service.getConfigurationBase64()
      expect(return_string).toEqual(expected_return_string)
    })

  })

  describe('tests related to toggleControl()', () => {

    beforeEach(() => {
      service.prepare()
    })

    it('should addControl , if control is not visible', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'addControl')
      const navigation_control = new Control('Navigation', 'navigation', false, new NavigationControl({}), 'top-left')
      service.toggleControl(navigation_control)
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(navigation_control.visible).toBe(true)
    })

    it('should removeControl, if control is visible', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'removeControl')
      const navigation_control = new Control('Navigation', 'navigation', false, new NavigationControl({}), 'top-left')
      service.toggleControl(navigation_control)
      service.toggleControl(navigation_control)
      expect(spy1).toHaveBeenCalledTimes(1)
      expect(navigation_control.visible).toBe(false)
    })

  })

  describe('tests related to toggleGroup()', () => {

    beforeEach(() => {
      service.prepare()
    })

    it('should toggle the group to visible and make all subgroups of the group visible, if metadata is used', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setLayoutProperty')
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = true
      const group = new LayerGroup('group', [], true)
      const subgroup = new LayerGroup('subgroup', [], true)
      const layer = new Layer('layer', 1, true, {
        id: 'layer_name',
        type: 'background',
        paint: {
          "background-color": 'hsla(324,43%,77%,1)'
        }
      })
      subgroup.layers = [layer]
      subgroup.visible = false
      group.subgroups = [subgroup]
      group.visible = false
      service.toggleGroup(group)
      expect(group.visible).toBe(true)
      expect(subgroup.visible).toBe(true)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'visibility', 'visible')
    })

    it('should toggle the group to visible and make all subgroups of the group not visible, if metadata is used', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setLayoutProperty')
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = true
      const group = new LayerGroup('group', [], true)
      const subgroup = new LayerGroup('subgroup', [], true)
      const layer = new Layer('layer', 1, true, {
        id: 'layer_name',
        type: 'background',
        paint: {
          "background-color": 'hsla(324,43%,77%,1)'
        }
      })
      subgroup.layers = [layer]
      subgroup.visible = true
      group.subgroups = [subgroup]
      group.visible = true
      service.toggleGroup(group)
      expect(group.visible).toBe(false)
      expect(subgroup.visible).toBe(false)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'visibility', 'none')
    })

    it('should toggle the group to visible and make all subgroups of the group visible, if metadata is used', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setLayoutProperty')
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = true
      const group = new LayerGroup('group', [], true)
      const subgroup = new LayerGroup('subgroup', [], true)
      const layer = new Layer('layer', 1, true, {
        id: 'layer_name',
        type: 'background',
        paint: {
          "background-color": 'hsla(324,43%,77%,1)'
        }
      })
      subgroup.layers = [layer]
      subgroup.visible = false
      group.subgroups = [subgroup]
      group.visible = false
      service.toggleGroup(group, subgroup)
      expect(group.visible).toBe(true)
      expect(subgroup.visible).toBe(true)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'visibility', 'visible')
    })

    it('should toggle the group to visible and make all subgroups of the group not visible, if metadata is used', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setLayoutProperty')
      service.activeBasemap = new Basemap('name', 'image.png', 'styling', false, 'string', true, false)
      service.activeBasemap!.useMetaData = true
      const group = new LayerGroup('group', [], true)
      const subgroup = new LayerGroup('subgroup', [], true)
      const layer = new Layer('layer', 1, true, {
        id: 'layer_name',
        type: 'background',
        paint: {
          "background-color": 'hsla(324,43%,77%,1)'
        }
      })
      subgroup.layers = [layer]
      subgroup.visible = true
      group.subgroups = [subgroup]
      group.visible = true
      service.toggleGroup(group, subgroup)
      expect(group.visible).toBe(false)
      expect(subgroup.visible).toBe(false)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'visibility', 'none')
    })

    it('should toggle the group to visible and make all layers of the group visible, if no metadata is used', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setLayoutProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer_name',
        type: 'background',
        paint: {
          "background-color": 'hsla(324,43%,77%,1)'
        }
      })
      const group = new LayerGroup('group', [], true)
      group.layers = [layer]
      group.visible = false
      service.toggleGroup(group)
      expect(group.visible).toBe(true)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'visibility', 'visible')
    })

    it('should toggle the group to not visible and make all layers of the group not visible,, if no metadata is used', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setLayoutProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer_name',
        type: 'background',
        paint: {
          "background-color": 'hsla(324,43%,77%,1)'
        }
      })
      const group = new LayerGroup('group', [], true)
      group.layers = [layer]
      group.visible = true
      service.toggleGroup(group)
      expect(group.visible).toBe(false)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'visibility', 'none')
    })

  })

  describe('tests related to toggleLayer()', () => {

    const maplibrelayer: BackgroundLayerSpecification = {
      id: 'layer_name',
      type: 'background',
      paint: {
        "background-color": 'hsla(324,43%,77%,1)'
      }
    }
    const group = new LayerGroup('group', [], true)
    const layer_not_visible = new Layer('layer_not_visible', 1, true, maplibrelayer)

    beforeEach(() => {
      service.prepare()
    })

    it('should set the group to visible, if the layer is set to visible', () => {
      layer_not_visible.visible = false
      group.layers = [layer_not_visible]
      group.visible = false
      service.toggleLayer(group, layer_not_visible)
      expect(group.visible).toBe(true)
      expect(layer_not_visible.visible).toBe(true)
    })

    it('should set the group to not visible, if the layer is set to not visible and there are no other visible layers in the group', () => {
      layer_not_visible.visible = true
      group.layers = [layer_not_visible]
      group.visible = true
      service.toggleLayer(group, layer_not_visible)
      expect(group.visible).toBe(false)
      expect(layer_not_visible.visible).toBe(false)
    })

    it('should set the group to visible, if the layer is set to not visible and there are other visible layers in the group', () => {
      const layer_visible = new Layer('layer_not_visible', 1, true, maplibrelayer)
      layer_not_visible.visible = true
      layer_visible.visible = true
      group.layers = [layer_not_visible, layer_visible]
      group.visible = true
      service.toggleLayer(group, layer_not_visible)
      expect(group.visible).toBe(true)
      expect(layer_not_visible.visible).toBe(false)
      expect(layer_visible.visible).toBe(true)
    })

    it('should set the layout property to visible, if the layer is now visible', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setLayoutProperty')
      layer_not_visible.visible = false
      group.layers = [layer_not_visible]
      group.visible = true
      service.toggleLayer(group, layer_not_visible)
      expect(spy1).toHaveBeenCalledOnceWith('layer_not_visible', 'visibility', 'visible')
    })

    it('should set the layout property to none, if the layer is now not visible', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setLayoutProperty')
      layer_not_visible.visible = true
      group.layers = [layer_not_visible]
      group.visible = true
      service.toggleLayer(group, layer_not_visible)
      expect(spy1).toHaveBeenCalledOnceWith('layer_not_visible', 'visibility', 'none')
    })

  })

  describe('tests related to changeSubgroup()', () => {

    const group = new LayerGroup('group', [], true)

    beforeEach(() => {
      service.prepare()
    })

    it('should change the color-property of a fill layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'fill',
        paint: {
          "fill-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      service.changeSubgroup(group, 'color', 'fill', '#000000')
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'fill-color', '#000000')
    })

    it('should change the opacity-property of a fill layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'fill',
        paint: {
          "fill-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      service.changeSubgroup(group, 'opacity', 'fill', 0.6)
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'fill-opacity', 0.6)
    })

    it('should change the color-property of a symbol layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'symbol',
        paint: {
          "text-color": 'hsla(324,43%,77%,1)'
        }
      })
      layer.metaType = 'symbol'
      group.layers = [layer]
      service.changeSubgroup(group, 'color', 'symbol', '#000000')
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'text-color', '#000000')
    })

    it('should change the opacity-property of a symbol layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'symbol',
        paint: {
          "text-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      layer.metaType = 'symbol'
      service.changeSubgroup(group, 'opacity', 'symbol', 0.6)
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'text-opacity', 0.6)
    })

    it('should change the fill-property of a line layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'line',
        paint: {
          "line-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      layer.metaType = 'line'
      service.changeSubgroup(group, 'color', 'line', '#000000')
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'line-color', '#000000')
    })

    it('should change the opacity-property of a line layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'line',
        paint: {
          "line-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      layer.metaType = 'line'
      service.changeSubgroup(group, 'opacity', 'line', 0.6)
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'line-opacity', 0.6)
    })

    it('should change the fill-property of a circle layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'circle',
        paint: {
          "circle-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      layer.metaType = 'circle'
      service.changeSubgroup(group, 'color', 'circle', '#000000')
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'circle-color', '#000000')
    })

    it('should change the opacity-property of a circle layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'circle',
        paint: {
          "circle-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      layer.metaType = 'circle'
      service.changeSubgroup(group, 'opacity', 'circle', 0.6)
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'circle-opacity', 0.6)
    })

    it('should change the fill-extrusion-property to 0, if threeDimOff is changed to true', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'fill-extrusion',
        paint: {
          "fill-extrusion-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      group.threeDimOff = false
      service.changeSubgroup(group, '3d', 'fill')
      expect(layer.threeDimOff).toBe(true)
      expect(group.threeDimOff).toBe(true)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'fill-extrusion-height', 0)
    })

    it('should change the fill-extrusion-property to 0', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'fill-extrusion',
        paint: {
          "fill-extrusion-color": 'hsla(324,43%,77%,1)'
        }
      })
      group.layers = [layer]
      group.threeDimOff = true
      service.changeSubgroup(group, '3d', 'fill')
      expect(layer.threeDimOff).toBe(false)
      expect(group.threeDimOff).toBe(false)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'fill-extrusion-height', ["case", ["has", "hoehe"], ["get", "hoehe"], ["has", "height"], ["get", "height"], 6])
    })

  })

  describe('tests related to changeLayer()', () => {

    beforeEach(() => {
      service.prepare()
    })

    it('should change the color-property of a background layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        type: 'background',
        paint: {
          "background-color": 'hsla(324,43%,77%,1)'
        }
      })
      service.changeLayer(layer, 'color', '#000000')
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'background-color', '#000000')
    })

    it('should change the color-property of a symbol layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'symbol',
        paint: {
          "text-color": 'hsla(324,43%,77%,1)'
        }
      })
      service.changeLayer(layer, 'color', '#000000')
      expect(layer.color).toEqual('#000000')
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'text-color', '#000000')
    })

    it('should change the opacity-property of a background layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        type: 'background',
        paint: {
          "background-color": 'hsla(324,43%,77%,1)'
        }
      })
      service.changeLayer(layer, 'opacity', 0.6)
      expect(layer.opacity).toEqual(0.6)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'background-opacity', 0.6)
    })

    it('should change the opacity-property of a symbol layer to the given value', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'symbol',
        paint: {
          "text-color": 'hsla(324,43%,77%,1)'
        }
      })
      service.changeLayer(layer, 'opacity', 0.6)
      expect(layer.opacity).toEqual(0.6)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'text-opacity', 0.6)
    })

    it('should change the fill-extrusion-property to 0, if threeDimOff is changed to true', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'fill-extrusion',
        paint: {
          "fill-extrusion-color": 'hsla(324,43%,77%,1)'
        }
      })
      layer.threeDimOff = false
      service.changeLayer(layer, '3d')
      expect(layer.threeDimOff).toBe(true)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'fill-extrusion-height', 0)
    })

    it('should change the fill-extrusion-property to 0', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setPaintProperty')
      const layer = new Layer('layer', 1, true, {
        id: 'layer',
        source: 'source',
        type: 'fill-extrusion',
        paint: {
          "fill-extrusion-color": 'hsla(324,43%,77%,1)'
        }
      })
      layer.threeDimOff = true
      service.changeLayer(layer, '3d')
      expect(layer.threeDimOff).toBe(false)
      expect(spy1).toHaveBeenCalledOnceWith('layer', 'fill-extrusion-height', ["case", ["has", "hoehe"], ["get", "hoehe"], ["has", "height"], ["get", "height"], 6])
    })

  })

  describe('tests related to setActiveBasemap()', () => {

    beforeEach(() => {
      service.prepare()
    })

    it('should set the Basemap', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setStyle')
      const basemap = new Basemap('Klassisch', 'assets/basemap_classic.png', 'services/basiskarte/styles/vt-style-classic.json', false, 'test', true, false)
      service.setActiveBasemap(basemap, 1)
      expect(spy1).toHaveBeenCalledOnceWith('services/basiskarte/styles/vt-style-classic.json', { diff: true })
    })

  })

  describe('tests related to changeHSL', () => {

    beforeEach(() => {
      service.prepare()
    })

    it('should change rgb color to hsla', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setStyle')
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            "version": 8,
            "name": "bm_web_col",
            "sources": {
              "basemap": {
                "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
                "type": "vector"
              }
            },
            "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
            "metadata": {
              "description": "basemap.de web colour"
            },
            'layers': [
              { id: 'RGB', type: 'symbol', paint: { 'text-color': 'rgb(222,173,202)' } }
            ],
            "visibility": "public",
            "draft": false
          }
        ))
      }
      const expectedStyle = JSON.parse(JSON.stringify(
        {
          "version": 8,
          "name": "bm_web_col",
          "sources": {
            "basemap": {
              "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
              "type": "vector"
            }
          },
          "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
          "metadata": {
            "description": "basemap.de web colour"
          },
          'layers': [
            { id: 'RGB', type: 'symbol', paint: { 'text-color': 'hsla(324,43%,77%,1)' } }
          ],
          "visibility": "public",
          "draft": false
        }
      ))
      service.changeHSL(0, 0)
      expect(service.map!.setStyle).toHaveBeenCalledOnceWith(expectedStyle)
    });

    it('should change rgba color to hsla', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setStyle')
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            "version": 8,
            "name": "bm_web_col",
            "sources": {
              "basemap": {
                "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
                "type": "vector"
              }
            },
            "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
            "metadata": {
              "description": "basemap.de web colour"
            },
            'layers': [
              { id: 'RGBA', type: 'background', paint: { 'background-color': 'rgba(222,173,202,0.5)' } }
            ],
            "visibility": "public",
            "draft": false
          }
        ))
      }
      const expectedStyle = JSON.parse(JSON.stringify(
        {
          "version": 8,
          "name": "bm_web_col",
          "sources": {
            "basemap": {
              "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
              "type": "vector"
            }
          },
          "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
          "metadata": {
            "description": "basemap.de web colour"
          },
          'layers': [
            { id: 'RGBA', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,0.5)' } }
          ],
          "visibility": "public",
          "draft": false
        }
      ))
      service.changeHSL(0, 0)
      expect(service.map!.setStyle).toHaveBeenCalledOnceWith(expectedStyle)
    });

    it('should change hsl color to hsla', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setStyle')
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            "version": 8,
            "name": "bm_web_col",
            "sources": {
              "basemap": {
                "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
                "type": "vector"
              }
            },
            "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
            "metadata": {
              "description": "basemap.de web colour"
            },
            'layers': [
              { id: 'HSL', type: 'background', paint: { 'background-color': 'hsl(324,43%,77%)' } }
            ],
            "visibility": "public",
            "draft": false
          }
        ))
      }
      const expectedStyle = JSON.parse(JSON.stringify(
        {
          "version": 8,
          "name": "bm_web_col",
          "sources": {
            "basemap": {
              "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
              "type": "vector"
            }
          },
          "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
          "metadata": {
            "description": "basemap.de web colour"
          },
          'layers': [
            { id: 'HSL', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,1)' } }
          ],
          "visibility": "public",
          "draft": false
        }
      ))
      service.changeHSL(0, 0)
      expect(spy1).toHaveBeenCalledOnceWith(expectedStyle)
    });

    it('should convert hex to hsl', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setStyle')
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            "version": 8,
            "name": "bm_web_col",
            "sources": {
              "basemap": {
                "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
                "type": "vector"
              }
            },
            "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
            "metadata": {
              "description": "basemap.de web colour"
            },
            'layers': [
              { id: 'HEX', type: 'background', paint: { 'background-color': '#DEADCA' } }
            ],
            "visibility": "public",
            "draft": false
          }
        ))
      }
      const expectedStyle = JSON.parse(JSON.stringify(
        {
          "version": 8,
          "name": "bm_web_col",
          "sources": {
            "basemap": {
              "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
              "type": "vector"
            }
          },
          "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
          "metadata": {
            "description": "basemap.de web colour"
          },
          'layers': [
            { id: 'HEX', type: 'background', paint: { 'background-color': 'hsl(324,43%,77%)' } }
          ],
          "visibility": "public",
          "draft": false
        }
      ))
      service.changeHSL(0, 0)
      expect(spy1).toHaveBeenCalledOnceWith(expectedStyle)
    });

    it('should convert no color type to hsl(0,0%,0%)', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setStyle')
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            "version": 8,
            "name": "bm_web_col",
            "sources": {
              "basemap": {
                "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
                "type": "vector"
              }
            },
            "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
            "metadata": {
              "description": "basemap.de web colour"
            },
            'layers': [
              { id: 'no-type', type: 'background' }

            ],
            "visibility": "public",
            "draft": false
          }
        ))
      }
      const expectedStyle = JSON.parse(JSON.stringify(
        {
          "version": 8,
          "name": "bm_web_col",
          "sources": {
            "basemap": {
              "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
              "type": "vector"
            }
          },
          "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
          "metadata": {
            "description": "basemap.de web colour"
          },
          'layers': [
            { id: 'no-type', type: 'background', paint: { 'background-color': 'hsl(0,0%,0%)' } }
          ],
          "visibility": "public",
          "draft": false
        }
      ))
      service.changeHSL(0, 0)
      expect(spy1).toHaveBeenCalledOnceWith(expectedStyle)
    });

    it('should pass hsla through', () => {
      const container = document.createElement('div')
      service.createMap(container)
      const spy1 = spyOn(service.map!, 'setStyle')
      service.map!.getStyle = () => {
        return JSON.parse(JSON.stringify(
          {
            "version": 8,
            "name": "bm_web_col",
            "sources": {
              "basemap": {
                "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
                "type": "vector"
              }
            },
            "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
            "metadata": {
              "description": "basemap.de web colour"
            },
            'layers': [
              { id: 'HSLA', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,1)' } }

            ],
            "visibility": "public",
            "draft": false
          }
        ))
      }
      const expectedStyle = JSON.parse(JSON.stringify(
        {
          "version": 8,
          "name": "bm_web_col",
          "sources": {
            "basemap": {
              "url": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/bm_web_de_3857.json",
              "type": "vector"
            }
          },
          "glyphs": "https://sg.geodatenzentrum.de/gdz_basemapde_vektor/fonts/{fontstack}/{range}.pbf",
          "metadata": {
            "description": "basemap.de web colour"
          },
          'layers': [
            { id: 'HSLA', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,1)' } }

          ],
          "visibility": "public",
          "draft": false
        }
      ))
      service.changeHSL(0, 0)
      expect(spy1).toHaveBeenCalledOnceWith(expectedStyle)
    });

  })

  describe('tests related to getHexColor', () => {

    it('should return the hex color for rgb-color', () => {
      const expected_color = '#DEADCA'
      const return_hex_color = service.getHexColor('rgb(222,173,202)')
      expect(return_hex_color).toEqual(expected_color)
    })

    it('should return the hex color for hsla-color', () => {
      const expected_color = '#DEABC9'
      const return_hex_color = service.getHexColor('hsla(324,43%,77%,1)')
      expect(return_hex_color).toEqual(expected_color)
    })

    it('should return the hex color for hsl-color', () => {
      const expected_color = '#DEABC9'
      const return_hex_color = service.getHexColor('hsl(324,43%,77%)')
      expect(return_hex_color).toEqual(expected_color)
    })

    it('should return the hex color for hex-color', () => {
      const expected_color = '#DEADCA'
      const return_hex_color = service.getHexColor('#DEADCA')
      expect(return_hex_color).toEqual(expected_color)
    })

    it('should return the hex color #000000, if the color format is unknown', () => {
      const expected_color = '#000000'
      const return_hex_color = service.getHexColor('(222,173,202,1)')
      expect(return_hex_color).toEqual(expected_color)
    })

  })
});
