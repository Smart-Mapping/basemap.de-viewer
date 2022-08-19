import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from 'src/app/services/map.service';
import { ColorsComponent } from './colors.component';

describe('ColorsComponent', () => {
  
  let component: ColorsComponent;
  let fixture: ComponentFixture<ColorsComponent>;
  let mapServiceMock: any;

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('mapService', ['map'])
    await TestBed.configureTestingModule({
      declarations: [ColorsComponent],
      providers: [
        { provide: MapService, useValue: mapServiceMock }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
