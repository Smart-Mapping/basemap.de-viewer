import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlsComponent } from './controls.component';
import { MapService } from 'src/app/services/map.service';

describe('ControlsComponent', () => {

  let component: ControlsComponent;
  let fixture: ComponentFixture<ControlsComponent>;
  let mapServiceMock: any;

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('mapService', ['map'])
    await TestBed.configureTestingModule({
      declarations: [ControlsComponent],
      providers: [
        { provide: MapService, useValue: mapServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
