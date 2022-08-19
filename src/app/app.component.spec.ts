import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

@Component({ selector: 'app-navigation', template: '' })
class MockNavigationComponent { }
@Component({ selector: 'app-map', template: '' })
class MockMapComponent { }

describe('AppComponent', () => {
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockNavigationComponent,
        MockMapComponent
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
