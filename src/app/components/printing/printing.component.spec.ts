import { PrintFormat } from './../../entities/printformat';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from 'src/app/services/map.service';
import { PrintingComponent } from './printing.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PrintingComponent', () => {

  let component: PrintingComponent;
  let fixture: ComponentFixture<PrintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PrintingComponent],
    imports: [],
    providers: [{ provide: MapService, useClass: MapService }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const dummySelector = document.createElement('div')
    dummySelector.classList.add('selector')
    document.body.appendChild(dummySelector);
    component.selector = dummySelector
    component.selector!.getBoundingClientRect = () => {
      return JSON.parse(JSON.stringify(
        {
          'bottom': 745.9375,
          'height': 497.890625,
          'left': 500,
          'right': 883,
          'top': 248.046875,
          'width': 383,
          'x': 500,
          'y': 248.046875
        }))
    }
    const renderMap = document.createElement('div')
    renderMap.innerHTML = `
      <div class="extra-top d-flex justify-content-between align-items-top">
        <div>
          <h2 class="header" style="margin: 0;"></h2>
          <h5 class="description" style="margin: 0;"></h5>
        </div>
        <img style="height: 90%;">
      </div>
      <div class="render-container" style="border: 1px solid black;"></div>
      <div class="extra-bottom d-flex justify-content-between align-items-center w-100">
        <div class="scale"></div>
        <div class="copyright"></div>
      </div>
    `
    renderMap.id = 'render-map'
    document.body.appendChild(renderMap)
    const map = document.createElement('div')
    map.id = 'map'
    document.body.appendChild(map)
    const mapService = TestBed.inject(MapService)
    mapService.prepare()
    mapService.createMap(map)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tests related to printMap()', () => {

    it('should continue if map an selectorRect are defined', () => {
      component.dpi = 300
      const expectedDPI = (300 / 96)
      TestBed.inject(MapService).map!.getStyle = () => {
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
              { id: 'RGB', source: 'basemap', 'source-layer': 'Hintergrund', type: 'background', paint: { 'background-color': 'rgb(222,173,202)' } },
              { id: 'RGB2', source: 'basemap', 'source-layer': 'Siedlungsflaeche', type: 'fill', paint: { 'fill-color': 'rgb(140,255,52)' } }
            ],
            "visibility": "public",
            "draft": false
          }
        ))
      }
      component.printMap()
      expect(window.devicePixelRatio).toEqual(expectedDPI)
    })

  })

  describe('tests related to toogleScaleLocked', () => {

    it('should not toggle isScaleLocked if isZooming is true', () => {
      component.isZooming = true
      expect(component.isScaleLocked).toEqual(false)
      component.toggleScaleLocked()
      expect(component.isScaleLocked).toEqual(false)
    })

    it('should toggle isScaleLocked and disable ScrollZoom if isZooming is false and isScaleLocked false (toggled to true)', () => {
      component.isZooming = false
      expect(component.isScaleLocked).toEqual(false)
      component.toggleScaleLocked()
      expect(component.isScaleLocked).toEqual(true)
    })

    it('should toggle isScaleLocked and enable ScrollZoom if isZooming is false and isScaleLocked true (toggled to false)', () => {
      component.isZooming = false
      component.isScaleLocked = true
      component.toggleScaleLocked()
      expect(component.isScaleLocked).toEqual(false)
    })

  })

  describe('tests related to onScaleInput', () => {

    it('should set ScaleInput with the given event value', () => {
      component.lockedScale = 0
      const event = {
        target: {
          value: 20000
        }
      }
      component.onScaleInput(event)
      expect(component.lockedScale).toEqual(20000)
    })

  })

  describe('tests related to setPrintFormat', () => {

    it('should set print format with the given event value', () => {
      const printFormat = new PrintFormat('DIN A4', 'a4', 210, 297)
      const event = {
        target: {
          options: {
            selectedIndex: 0
          }
        }
      }
      component.setPrintFormat(event)
      expect(component.printFormat).toEqual(printFormat)
    })

  })

  describe('tests related to setDPI', () => {

    it('should set dpi with the given event value', () => {
      component.dpi = 0
      const event = {
        target: {
          value: 300
        }
      }
      component.setDPI(event)
      expect(component.dpi).toEqual(300)
    })

  })

  describe('tests related to setOrientation', () => {

    const event_portrait = {
      target: {
        value: 'Hochformat'
      }
    }
    const event_landscape = {
      target: {
        value: 'test'
      }
    }

    it('should set the orientation to "portrait" with the given event value "Hochformat', () => {
      component.orientation = 'landscape'
      component.setOrientation(event_portrait)
      expect(component.orientation).toEqual('portrait')
    })

    it('should set the orientation to "landscape" if the given event value is not "Hochformat', () => {
      component.orientation = 'portrait'
      component.setOrientation(event_landscape)
      expect(component.orientation).toEqual('landscape')
    })

    it('should add "horizontal" as a class to the selector', () => {
      const spy1 = spyOn(document.querySelector('.selector')!.classList, 'add')
      component.orientation = 'portrait'
      component.setOrientation(event_landscape)
      expect(spy1).toHaveBeenCalledOnceWith('horizontal')
    })

    it('should remove "horizontal" as a class from the selector', () => {
      const spy1 = spyOn(document.querySelector('.selector')!.classList, 'remove')
      component.orientation = 'landscape'
      component.setOrientation(event_portrait)
      expect(spy1).toHaveBeenCalledOnceWith('horizontal')
    })
  
  })

  describe('tests related to setFileFormat', () => {
  
    it('should set the file format to PDF with the given event value "PDF"', () => {
      const event = {
        target: {
          value: 'PDF'
        }
      }
      component.setFileFormat(event)
      expect(component.fileFormat).toEqual('PDF')
    })

    it('should set the file format to PNG with the given event value "PDF"', () => {
      const event = {
        target: {
          value: 'PNG'
        }
      }
      component.setFileFormat(event)
      expect(component.fileFormat).toEqual('PNG')
    })
  
  })
});

