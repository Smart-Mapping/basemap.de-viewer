import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from 'src/app/services/map.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DownloadComponent } from './download.component';
import { LngLat } from 'maplibre-gl'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DownloadComponent', () => {

  let component: DownloadComponent;
  let fixture: ComponentFixture<DownloadComponent>;
  let mapServiceMock: any

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('mapService', ['map'])
    mapServiceMock.map = jasmine.createSpyObj('map', ['getStyle', 'getCenter', 'getPitch', 'getBearing'])
    mapServiceMock.map.getCenter = jasmine.createSpyObj('getCenter', ['toArray'])
    mapServiceMock.map.getCenter = () => {
      return new LngLat(10, 10)
    }
    mapServiceMock.map.getStyle = () => {
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
            {
              "id": "Hintergrund",
              "type": "fill",
              "source": "basemap",
              "source-layer": "Hintergrund",
              "maxzoom": 15
            },
            {
              "id": "Meer",
              "type": "fill",
              "source": "basemap",
              "source-layer": "Gewaesserflaeche",
              "filter": [
                "all",
                [
                  "==",
                  "klasse",
                  "Meer"
                ]
              ],
              "layout": {},
              "paint": {
                "fill-color": "#c3cfd5"
              },
              "maxzoom": 15
            },
          ],
          "visibility": "public",
          "draft": false
        }
      ))
    }
    await TestBed.configureTestingModule({
    declarations: [DownloadComponent],
    imports: [],
    providers: [{ provide: MapService, useValue: mapServiceMock }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tests related to downloadStyle', () => {

    it('should return without download, if the map Style is undefined', () => {
      mapServiceMock.map.getStyle = () => {
        return undefined
      }
      component.downloadStyle()
      expect(mapServiceMock.map.getPitch).toHaveBeenCalledTimes(0)
    })

    it('should return with download, if the map Style is defined', () => {
      component.downloadStyle()
      expect(mapServiceMock.map.getPitch).toHaveBeenCalledTimes(1)
    })

  })
});
