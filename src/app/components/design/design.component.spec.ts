import { Basemap } from 'src/app/entities/basemap';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from 'src/app/services/map.service';
import { DesignComponent } from './design.component';

describe('DesignComponent', () => {

  let component: DesignComponent;
  let fixture: ComponentFixture<DesignComponent>;
  let mapServiceMock: any;

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('mapService', ['map', 'setActiveBasemap', 'prepare'])
    mapServiceMock.map = jasmine.createSpyObj('map', ['setStyle'])
    await TestBed.configureTestingModule({
      declarations: [DesignComponent],
      providers: [
        { provide: MapService, useValue: mapServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test related to setBasemap()', () => {

    it('should set the active basemap', () => {
      const basemap = new Basemap('Farbe', 'assets/basemap_color.png', 'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_col.json', false, 'test', true, false)
      component.setBasemap(basemap, 1)
      expect(mapServiceMock.setActiveBasemap).toHaveBeenCalledOnceWith(basemap, 1)
    })

  })
});
