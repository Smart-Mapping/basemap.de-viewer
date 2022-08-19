import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from '../../services/map.service';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {

  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mapServiceMock: any

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('mapService', ['map', 'setupPrintMode'])
    mapServiceMock.map = jasmine.createSpyObj('map', ['easeTo'])
    await TestBed.configureTestingModule({
      declarations: [MenuComponent],
      providers: [{ provide: MapService, useValue: mapServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [CommonModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
      };
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tests related to ngOnInit()', () => {

    it('should updateControlPositions if window.innerWidth <= 768px', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(768)
      const spy1 = spyOn(component, 'updateControlPositions')
      component.ngOnInit()
      expect(component.isSmallScreen).toBe(true);
      expect(spy1).toHaveBeenCalled();
    });

    xit('should updateControlPositions if max-width of window changes', () => {
      const spy1 = spyOn(component, 'updateControlPositions')
      window.resizeTo(80, 80)
      spyOnProperty(window.matchMedia('(max-width: 768px)'), 'matches').and.returnValue(false)
      expect(spy1).toHaveBeenCalledTimes(1)
    });

    it('should updateControlPositions if window is resized', () => {
      const spy1 = spyOn(component, 'updateControlPositions')
      window.dispatchEvent(new Event('resize'))
      expect(spy1).toHaveBeenCalledTimes(1)
    });

  })

  describe('tests related to updateControlPositions()', () => {

    it('should update control positions topLeft, topRight and bottomLeft to 0px padding', () => {
      var dummyElement = document.createElement('div')
      dummyElement.classList.add('maplibregl-ctrl-top-left')
      dummyElement.setAttribute('style', 'padding: 10px;')
      component.topLeft = dummyElement
      component.topRight = dummyElement
      component.bottomLeft = dummyElement
      component.updateControlPositions()
      expect(component.topLeft.style.padding).toBe('0px')
      expect(component.topRight.style.padding).toBe('0px')
      expect(component.bottomLeft.style.padding).toBe('0px')
    });

    it('should update control positions topLeft paddingLeft to 500px if isHidden is false and isSmallScreen is false', () => {
      var dummyElement = document.createElement('div');
      dummyElement.classList.add('maplibregl-ctrl-top-left')
      dummyElement.setAttribute('style', 'padding: 10px;')
      component.topLeft = dummyElement
      component.isHidden = !component.isHidden;
      component.isSmallScreen = false
      component.updateControlPositions()
      expect(component.topLeft.style.paddingLeft).toBe('500px')
    });

    it('should update control positions topLeft paddingLeft to 0px if isHidden is false and isSmallScreen is true', () => {
      var dummyElement = document.createElement('div');
      dummyElement.classList.add('maplibregl-ctrl-top-left')
      dummyElement.setAttribute('style', 'padding: 10px;')
      component.topLeft = dummyElement
      component.isHidden = !component.isHidden;
      component.isSmallScreen = true
      component.updateControlPositions()
      expect(component.topLeft.style.paddingLeft).toBe('0px')
    });

    it('should update control positions topRight paddingTop to 0px if isHidden is false and isSmallScreen is false', () => {
      var dummyElement = document.createElement('div');
      dummyElement.classList.add('maplibregl-ctrl-top-left')
      dummyElement.setAttribute('style', 'padding: 10px;')
      component.topRight = dummyElement
      component.isHidden = !component.isHidden;
      component.isSmallScreen = false
      component.updateControlPositions()
      expect(component.topRight.style.paddingTop).toBe('0px')
    });

    it('should update control positions topRight paddingTop to expected padding if isHidden is false and isSmallScreen is true', () => {
      var dummyElement = document.createElement('div');
      dummyElement.classList.add('maplibregl-ctrl-top-left')
      dummyElement.setAttribute('style', 'padding: 10px;')
      component.topRight = dummyElement
      component.isHidden = !component.isHidden;
      component.isSmallScreen = true
      window.resizeTo(1000, 1000)
      component.updateControlPositions()
      expect(parseInt(component.topRight.style.paddingTop)).toBeCloseTo((window.innerHeight * 0.4 - 60), -1)
    });

    it('should update control positions bottomLeft  paddingLeft to 500px if isHidden is false and isSmallScreen is false', () => {
      var dummyElement = document.createElement('div');
      dummyElement.classList.add('maplibregl-ctrl-top-left')
      dummyElement.setAttribute('style', 'padding: 10px;')
      component.bottomLeft = dummyElement
      component.isHidden = !component.isHidden;
      component.isSmallScreen = false
      component.updateControlPositions()
      expect(component.bottomLeft.style.paddingLeft).toBe('500px')
    });

    it('should update control positions bottomLeft  paddingLeft to 0px if isHidden is false and isSmallScreen is true', () => {
      var dummyElement = document.createElement('div');
      dummyElement.classList.add('maplibregl-ctrl-top-left')
      dummyElement.setAttribute('style', 'padding: 10px;')
      component.bottomLeft = dummyElement
      component.isHidden = !component.isHidden;
      component.isSmallScreen = true
      component.updateControlPositions()
      expect(component.bottomLeft.style.paddingLeft).toBe('0px')
    });
  
  })

  describe('tests related to toggle()', () => {

    it('should call setupPrintMode() with false, if isHidden is false', () => {
      component.isHidden = false;
      component.mapService.isInPrintMode = true;
      component.toggle();
      expect(mapServiceMock.setupPrintMode).toHaveBeenCalledOnceWith(false);
      expect(component.mapService.isInPrintMode).toBe(true);
    });

    it('should call setupPrintMode() with true, is isHidden is true', () => {
      component.isHidden = true;
      component.mapService.isInPrintMode = true;
      component.toggle();
      expect(mapServiceMock.setupPrintMode).toHaveBeenCalledOnceWith(true);
    });

    it('should ease to pitch:0 and bearing:0 if isSmallScreen is true and PrintMode is true', () => {
      component.mapService.map = mapServiceMock.map
      component.isSmallScreen = true;
      component.mapService.isInPrintMode = true;
      component.toggle();
      const easeToValue = { pitch: 0, bearing: 0, padding: { top: component.isHidden ? 0 : window.innerHeight * 0.4 - 60 }, duration: 500 }
      expect(component.mapService.map!.easeTo).toHaveBeenCalledOnceWith(easeToValue);
    });

    it('should ease padding if isSmallScreen is true and PrintMode is false', () => {
      component.mapService.map = mapServiceMock.map
      component.isSmallScreen = true;
      component.mapService.isInPrintMode = false;
      component.toggle();
      const easeToValue = { padding: { top: component.isHidden ? 0 : window.innerHeight * 0.4 - 60 }, duration: 500 }
      expect(component.mapService.map!.easeTo).toHaveBeenCalledOnceWith(easeToValue);
    });

    it('should ease to pitch:0 and bearing:0 if isSmallScreen is false and PrintMode is true', () => {
      component.mapService.map = mapServiceMock.map
      component.isSmallScreen = false;
      component.mapService.isInPrintMode = true;
      component.toggle();
      const easeToValue = { pitch: 0, bearing: 0, padding: { left: component.isHidden ? 0 : 500 }, duration: 500 }
      expect(component.mapService.map!.easeTo).toHaveBeenCalledOnceWith(easeToValue);
    });

    it('should ease padding if isSmallScreen is false and PrintMode is false', () => {
      component.mapService.map = mapServiceMock.map
      component.isSmallScreen = false;
      component.mapService.isInPrintMode = false;
      component.toggle();
      const easeToValue = { padding: { left: component.isHidden ? 0 : 500 }, duration: 500 }
      expect(component.mapService.map!.easeTo).toHaveBeenCalledOnceWith(easeToValue);
    });

  })
});
