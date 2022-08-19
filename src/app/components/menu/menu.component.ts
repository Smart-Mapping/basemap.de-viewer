import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { environment } from 'src/environments/environment';

/**
 * Component for the menu
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  /** Menu element */
  @ViewChild('menuWrapper')
  menu?: ElementRef<HTMLDivElement>
  /** Indicates if menu is visible or hidden */
  isHidden = true
  /** Indicates if window is smaller than 768px */
  isSmallScreen = false
  /** HTML parent element of the top left map controls */
  topLeft?: HTMLElement
  /** HTML parent element of the top right map controls */
  topRight?: HTMLElement
  /** HTML parent element of the bottom left map controls */
  bottomLeft?: HTMLElement

  logo_1 = environment.footerLogo1
  logo_2 = environment.footerLogo2

  /**
   * @ignore
   */
  constructor(public mapService: MapService) { }

  /**
   * Positions the map control elements and sets event listener for window size
   */
  ngOnInit(): void {
    this.topLeft = (document.querySelector(".maplibregl-ctrl-top-left") as HTMLElement)
    this.topRight = (document.querySelector(".maplibregl-ctrl-top-right") as HTMLElement)
    this.bottomLeft = (document.querySelector(".maplibregl-ctrl-bottom-left") as HTMLElement)
    if (window.innerWidth <= 768) {
      this.isSmallScreen = true
      this.updateControlPositions()
    }
    window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
      this.isSmallScreen = e.matches
      this.updateControlPositions()
    })
    this.updateControlPositions()
    window.addEventListener('resize', () => this.updateControlPositions())

  }

  /**
   * Shows or hides the menu, moves the map
   */
  toggle() {
    this.isHidden = !this.isHidden
    this.menu?.nativeElement.classList.toggle('expanded');
    this.updateControlPositions()
    if (this.isHidden && this.mapService.isInPrintMode) {
      this.mapService.setupPrintMode(false)
      this.mapService.isInPrintMode = true
    } else if (!this.isHidden && this.mapService.isInPrintMode) {
      this.mapService.setupPrintMode(true)
    }
    if (this.isSmallScreen) {
      if (this.mapService.isInPrintMode) {
        this.mapService.map?.easeTo({ pitch: 0, bearing: 0, padding: { top: this.isHidden ? 0 : window.innerHeight * 0.4 - 60 }, duration: 500 })
      } else {
        this.mapService.map?.easeTo({ padding: { top: this.isHidden ? 0 : window.innerHeight * 0.4 - 60 }, duration: 500 })
      }
    } else {
      if (this.mapService.isInPrintMode) {
        this.mapService.map?.easeTo({ pitch: 0, bearing: 0, padding: { left: this.isHidden ? 0 : 500 }, duration: 500 });
      } else {
        this.mapService.map?.easeTo({ padding: { left: this.isHidden ? 0 : 500 }, duration: 500 });
      }
    }
  }

  /**
   * Positions the map control elements depending on visibility of the menu und window size
   */
  updateControlPositions() {
    this.topLeft && (this.topLeft.style.padding = "0px")
    this.topRight && (this.topRight.style.padding = "0px")
    this.bottomLeft && (this.bottomLeft.style.padding = "0px")
    this.topLeft && (this.topLeft.style.paddingLeft = this.isHidden ? "0px" : this.isSmallScreen ? "0px" : "500px")
    this.topLeft && (this.topLeft.style.paddingTop = this.isHidden ? "0px" : this.isSmallScreen ? (window.innerHeight * 0.4 - 60) + "px" : "0")
    this.topRight && (this.topRight.style.paddingTop = this.isHidden ? "0px" : this.isSmallScreen ? (window.innerHeight * 0.4 - 60) + "px" : "0")
    this.bottomLeft && (this.bottomLeft.style.paddingLeft = this.isHidden ? "0px" : this.isSmallScreen ? "0px" : "500px")
  }
}
