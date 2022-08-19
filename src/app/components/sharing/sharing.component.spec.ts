import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapService } from 'src/app/services/map.service';
import { SharingComponent } from './sharing.component';

describe('SharingComponent', () => {

  let component: SharingComponent;
  let fixture: ComponentFixture<SharingComponent>;
  let mapServiceMock: any

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj('configService', ['getConfigurationBase64'])
    mapServiceMock.getConfigurationBase64.and.returnValue('test')
    await TestBed.configureTestingModule({
      declarations: [SharingComponent],
      providers: [{ provide: MapService, useValue: mapServiceMock }],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tests related to getShareURL()', () => {

    it('should return the right shareURL', () => {
      const expectedUrl = window.location.origin + window.location.pathname + '?config=' + mapServiceMock.getConfigurationBase64()
      const shareURL = component.getShareURL()
      expect(shareURL).toBe(expectedUrl)
    })

  })

  describe('tests related to copyShareURL()', () => {

    it('should copy the url to the clipboard, if there is a clipboard', () => {
      const spy1 = spyOn(navigator.clipboard, 'writeText')
      const expectedUrl = window.location.origin + window.location.pathname + '?config=test'
      component.copyShareURL()
      expect(spy1).toHaveBeenCalledOnceWith(expectedUrl)
    })

    xit('should copy the url to the clipboard, if there is a clipboard', () => {
      const spy1 = spyOn(document.body, 'appendChild')
      const expectedUrl = window.location.origin + window.location.pathname + '?config=test'
      const input = document.createElement('input')
      input.setAttribute('value', expectedUrl)
      component.copyShareURL()
      expect(spy1).toHaveBeenCalledOnceWith(input)
    })

  })
});
