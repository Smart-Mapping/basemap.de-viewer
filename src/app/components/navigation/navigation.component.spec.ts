import { environment } from 'src/environments/environment';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

describe('NavigationComponent', () => {

  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavigationComponent, MenuComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be truthy after view init', () => {
    environment.logoHeight = 30
    environment.name = 'test'
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
    expect(component.logo.nativeElement.height).toEqual(30)
    expect(component.logo.nativeElement.alt).toEqual('test logo')
  });

  it('should toggle menu', () => {
    const spy1 = spyOn(component.menu, 'toggle');
    const spy2 = spyOn(component.hamburger.nativeElement.classList, 'toggle')
    component.toggleMenu();
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
  })

});
