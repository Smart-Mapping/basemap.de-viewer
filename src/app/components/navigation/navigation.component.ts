import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuComponent } from '../menu/menu.component';

/**
 * Component for navigation bar
 */
@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    standalone: false
})
export class NavigationComponent implements AfterViewInit {

  /** Button to show or hide the menu */
  @ViewChild('hamburger')
  hamburger!: ElementRef<HTMLDivElement>;
  /** Button to show or hide the information menu */
  @ViewChild('info')
  info!: ElementRef<HTMLDivElement>;
  /** The menu element */
  @ViewChild(MenuComponent)
  menu!: MenuComponent
  /** The logo of the app */
  @ViewChild('logo')
  logo!: ElementRef<HTMLImageElement>

  /**
   * Sets logo, name and imprint depending on the environment
   */
  ngAfterViewInit(): void {
    this.logo.nativeElement.src = environment.logo
    this.logo.nativeElement.height = environment.logoHeight
    this.logo.nativeElement.alt = environment.name + " logo"
    this.info.nativeElement.innerHTML = environment.imprint
  }

  /**
   * Shows or hides the menu and updates the menu button
   */
  toggleMenu() {
    this.hamburger.nativeElement.classList.toggle('is-active')
    this.menu.toggle()
  }
}
