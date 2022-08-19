import { Layer, LayerGroup } from 'src/app/entities/layergroup';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from 'src/app/services/map.service';
import { LayerEditorComponent } from './layer-editor.component';

describe('LayerEditorComponent', () => {

  let component: LayerEditorComponent;
  let fixture: ComponentFixture<LayerEditorComponent>;
  let mapServiceMock: any

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('mapService', ['toggleGroup', 'toggleLayer', 'changeLayer'])
    await TestBed.configureTestingModule({
      declarations: [LayerEditorComponent],
      providers: [{ provide: MapService, useValue: mapServiceMock }],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test related to toggleGroup', () => {

    it('should call mapservice.toggleGroup', () => {
      const group = new LayerGroup('test', [], true)
      component.toggleGroup(group)
      expect(mapServiceMock.toggleGroup).toHaveBeenCalledOnceWith(group)
    })

  })

  describe('test related to toggleLayer', () => {

    it('should call mapservice.toggleLayer', () => {
      const group = new LayerGroup('test', [], true)
      const layer = new Layer('test', 1, true, { id: 'RGB', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,1)' } })
      component.toggleLayer(group, layer)
      expect(mapServiceMock.toggleLayer).toHaveBeenCalledOnceWith(group, layer)
    })

  })

  describe('test related to changeLayerColor', () => {

    it('should call mapservice.changeLayer', () => {
      const changeColorEvent = {
        target: {
          value: 'test'
        }
      }
      const layer = new Layer('test', 1, true, { id: 'RGB', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,1)' } })
      component.changeLayerColor(layer, changeColorEvent)
      expect(mapServiceMock.changeLayer).toHaveBeenCalledOnceWith(layer, 'color', 'test')
    })

  })

  describe('test related to changeLayerOpacity', () => {

    it('should call mapservice.changeLayer', () => {
      const changeColorOpacity = {
        target: {
          value: 0.6
        }
      }
      const layer = new Layer('test', 1, true, { id: 'RGB', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,1)' } })
      component.changeLayerOpacity(layer, changeColorOpacity)
      expect(mapServiceMock.changeLayer).toHaveBeenCalledOnceWith(layer, 'opacity', 0.6)
    })

  })

  describe('test related to changeLayer3D', () => {

    it('should call mapservice.changeLayer', () => {
      const layer = new Layer('test', 1, true, { id: 'RGB', type: 'background', paint: { 'background-color': 'hsla(324,43%,77%,1)' } })
      component.changeLayer3D(layer)
      expect(mapServiceMock.changeLayer).toHaveBeenCalledOnceWith(layer, '3d')
    })

  })
});
