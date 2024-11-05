import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayerGroup, Layer } from 'src/app/entities/layergroup';
import { MapService } from 'src/app/services/map.service';
import { GroupEditorComponent } from './group-editor.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GroupEditorComponent', () => {
  let component: GroupEditorComponent;
  let fixture: ComponentFixture<GroupEditorComponent>;
  let mapServiceMock: any

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('mapService', ['toggleGroup', 'changeSubgroup'])
    await TestBed.configureTestingModule({
    declarations: [GroupEditorComponent],
    imports: [],
    providers: [{ provide: MapService, useValue: mapServiceMock }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupEditorComponent);
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

  describe('test related to toggleSubgroup', () => {

    it('should call mapservice.toggleGroup', () => {
      const group = new LayerGroup('group', [], true)
      const subgroup = new LayerGroup('subgroup', [], true)
      component.toggleSubgroup(group, subgroup)
      expect(mapServiceMock.toggleGroup).toHaveBeenCalledOnceWith(group, subgroup)
    })

  })

  describe('test related to changeSubgroupOpacity', () => {

    it('should call mapservice.changeSubgroupOpacity', () => {
      const subgroup = new LayerGroup('subgroup', [], true)
      const metaType = 'fill'
      const changeOpacityEvent = {
        target: {
          value: 0.6
        }
      }
      component.changeSubGroupOpacity(subgroup, changeOpacityEvent, metaType)
      expect(mapServiceMock.changeSubgroup).toHaveBeenCalledOnceWith(subgroup, 'opacity', 'fill', 0.6)
    })

  })

  describe('test related to changeLayerSubgroup', () => {

    it('should call mapservice.changeSubgroupColor', () => {
      const subgroup = new LayerGroup('subgroup', [], true)
      const metaType = 'symbol'
      const changeColorEvent = {
        target: {
          value: 'test'
        }
      }
      component.changeSubgroupColor(subgroup, changeColorEvent, metaType)
      expect(mapServiceMock.changeSubgroup).toHaveBeenCalledOnceWith(subgroup, 'color', 'symbol', 'test')
    })

  })

  describe('test related to changeSubgroup3D', () => {

    it('should call mapservice.changeSubgroup3D', () => {
      const subgroup = new LayerGroup('subgroup', [], true)
      component.changeSubgroup3D(subgroup)
      expect(mapServiceMock.changeSubgroup).toHaveBeenCalledOnceWith(subgroup, '3d', 'symbol')
    })

  })

  describe('test related to changeSubgroup3D', () => {

    const layer_fill = new Layer('basemap-fill', 1, true, { id: 'layer_fill', source: 'source_fill', type: 'fill', paint: { 'fill-color': 'hsla(324,43%,77%,1)' } })
    const layer_symbol = new Layer('basemap-symbol', 1, true, { id: 'layer_symbol', source: 'source_symbol', type: 'symbol', paint: { 'text-color': 'hsla(324,43%,77%,1)' } })
    const layer_circle = new Layer('basemap-circle', 1, true, { id: 'layer_circle', source: 'source_circle', type: 'circle', paint: { 'circle-color': 'hsla(324,43%,77%,1)' } })
    const layer_line = new Layer('basemap-line', 1, true, { id: 'layer_line', source: 'source_line', type: 'line', paint: { 'line-color': 'hsla(324,43%,77%,1)' } })
    layer_line.metaType = 'line'
    layer_fill.metaType = 'fill'
    layer_symbol.metaType = 'symbol'
    layer_circle.metaType = 'circle'
    const layers = [layer_line, layer_fill, layer_circle, layer_symbol]
    const subgroup = new LayerGroup('subgroup', layers, true)

    it('should return true if layers of type=line are in the subgroup', () => {
      const outlineLayers = component.hasLineLayers(subgroup)
      expect(outlineLayers).toEqual(true)
    })

    it('should return true if layers of type=fill are in the subgroup', () => {
      const fillLayers = component.hasFillLayers(subgroup)
      expect(fillLayers).toEqual(true)
    })

    it('should return true if layers of type=text are in the subgroup', () => {
      const textLayers = component.hasTextLayers(subgroup)
      expect(textLayers).toEqual(true)
    })

    it('should return true if layers of type=cirlce are in the subgroup', () => {
      const circleLayers = component.hasCircleLayers(subgroup)
      expect(circleLayers).toEqual(true)
    })

    it('should return undefined if layers of type=cirlce are not in the subgroup', () => {
      const layers_without_circle = [layer_line, layer_fill, layer_symbol]
      const subgroup_without_circle = new LayerGroup('subgroup', layers_without_circle, true)
      const circleLayers = component.hasCircleLayers(subgroup_without_circle)
      expect(circleLayers).toBeFalse()
    })

  })
});
