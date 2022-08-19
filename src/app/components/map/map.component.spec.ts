import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from 'src/app/services/map.service';
import { MapComponent } from './map.component';

describe('MapComponent', () => {

  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mapServiceMock: any

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('mapService', ['map', 'setupPrintMode', 'createMap'])
    mapServiceMock.map = jasmine.createSpyObj('map', ['unproject', 'getStyle', 'scrollZoom', 'on'])

    await TestBed.configureTestingModule({
      declarations: [MapComponent],
      providers: [{ provide: MapService, useValue: mapServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
