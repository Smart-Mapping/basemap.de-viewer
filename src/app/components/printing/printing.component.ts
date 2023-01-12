import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrintFormat } from 'src/app/entities/printformat';
import { MapService } from 'src/app/services/map.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { Map } from 'maplibre-gl'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import distance from '@turf/distance'

/**
 * Component for printing menu tab
 */
@Component({
  selector: 'app-printing',
  templateUrl: './printing.component.html',
  styleUrls: ['./printing.component.scss']
})
export class PrintingComponent implements OnInit, AfterViewInit {

  /** Button to start the printing */
  @ViewChild('printBtn')
  printBtn!: ElementRef<HTMLButtonElement>
  /** Input element for the header text */
  @ViewChild('headerInput')
  headerInput!: ElementRef<HTMLInputElement>
  /** Input element for the description text */
  @ViewChild('descriptionInput')
  descriptionInput!: ElementRef<HTMLInputElement>
  /** All available dpis */
  dpis: number[] = []
  /** Selected dpi */
  dpi!: number
  /** All available print formats */
  printFormats: PrintFormat[] = []
  /** Selected print format */
  printFormat!: PrintFormat
  /** Selected file format */
  fileFormat: 'PDF' | 'PNG' = 'PDF'
  /** Selected orientation */
  orientation: 'portrait' | 'landscape' = "portrait"
  /** Indicates if scale is locked or updated */
  isScaleLocked: boolean = false
  /** Current scale */
  scale: number = 0
  /** Scale if user chooses to lock the scale */
  lockedScale: number = 0
  /** Indicates if map is zooming to maintain scale */
  isZooming = false
  /** Element to select area */
  selector?: HTMLElement

  /**
   * @ignore
   */
  constructor(private mapService: MapService) { }

  /**
   * Gets reference to selector and sets heading text depending on environment
   */
  ngAfterViewInit(): void {
    this.selector = document.querySelector('.selector')!
    this.headerInput.nativeElement.placeholder = environment.name
  }

  /**
   * Sets available print formats and dpis depending on environment
   * Sets event listener to update the map on showing or hiding component
   */
  ngOnInit(): void {
    environment.printFormats.forEach((pf: any) => this.printFormats.push(new PrintFormat(pf.name, pf.value, pf.width, pf.height)))
    this.printFormat = this.printFormats[0]
    environment.dpis.forEach(d => this.dpis.push(d))
    this.dpi = this.dpis[0]

    const printArea = document.querySelector('#collapsePrint')
    printArea!.addEventListener("show.bs.collapse", (e) => {
      this.mapService.setupPrintMode(true)
      this.mapService.map?.easeTo({ pitch: 0, bearing: 0 })
      this.mapService.map?.on('move', this.calcScale);
    })
    printArea!.addEventListener("hide.bs.collapse", () => {
      this.mapService.setupPrintMode(false)
      this.mapService.map?.off('move', this.calcScale);
      if (this.isScaleLocked) {
        this.toggleScaleLocked()
      }
    })

    // In some browsers the scale number is not set in input field.
    // Therefore calculate scale here.
    this.calcScale();
  }

  /**
   * Prints selected area with dpi, format, text and scale
   */
  printMap() {
    const actualPixelRatio: number = window.devicePixelRatio;
    const desiredDPI = this.dpi

    Object.defineProperty(window, 'devicePixelRatio', {
      get() {
        return desiredDPI / 96;
      },
    });

    const loading = document.createElement("span")
    loading.className = "spinner-border spinner-border-sm"
    this.printBtn.nativeElement.classList.remove("btn-primary")
    this.printBtn.nativeElement.classList.add("btn-secondary")
    this.printBtn.nativeElement.classList.add("disabled")
    this.printBtn.nativeElement.textContent = ""
    this.printBtn.nativeElement.appendChild(loading)

    const selectorRect = this.selector?.getBoundingClientRect()
    const southWest = this.mapService.map?.unproject([selectorRect!.left, selectorRect!.bottom - 60])
    const northEast = this.mapService.map?.unproject([selectorRect!.right, selectorRect!.top - 60])
    const name = "map_" + new Date().toLocaleTimeString() + "_" + this.printFormat.value
    const height = (this.orientation === 'portrait' ? this.printFormat.height : this.printFormat.width)
    const width = (this.orientation === 'portrait' ? this.printFormat.width : this.printFormat.height)
    const padding = (this.printFormat.width / 20)
    const enableBtn = () => {
      this.printBtn.nativeElement.classList.remove("btn-secondary")
      this.printBtn.nativeElement.classList.remove("disabled")
      this.printBtn.nativeElement.removeChild(loading)
      this.printBtn.nativeElement.textContent = "Karte erzeugen"
      this.printBtn.nativeElement.classList.add("btn-primary")
    }
    const renderMap = document.querySelector("#render-map") as HTMLDivElement;
    renderMap.style.height = height + "mm"
    renderMap.style.width = width + "mm"
    renderMap.style.padding = padding + "mm"
    renderMap.style.display = "block"
    const extraTop = renderMap.querySelector(".extra-top") as HTMLDivElement;
    const header = extraTop.querySelector("h2") as HTMLHeadingElement
    header.style.fontSize = Math.floor(padding) + "mm"
    header.textContent = this.headerInput.nativeElement.value !== "" ? this.headerInput.nativeElement.value : this.headerInput.nativeElement.placeholder
    const description = extraTop.querySelector("h5") as HTMLHeadingElement
    description.style.fontSize = Math.floor(padding / 2) + "mm"
    description.textContent = this.descriptionInput.nativeElement.value !== "" ? this.descriptionInput.nativeElement.value : this.descriptionInput.nativeElement.placeholder
    extraTop.style.height = (padding * 2) + "mm"
    const logo = extraTop.querySelector('img') as HTMLImageElement
    logo.src = environment.printLogo
    const renderContainer = renderMap.querySelector(".render-container") as HTMLDivElement;
    renderContainer.style.height = (height - (padding * 5)) + "mm"
    renderContainer.style.width = (width - (padding * 2)) + "mm"
    const extraBottom = renderMap.querySelector(".extra-bottom") as HTMLDivElement
    extraBottom.style.height = padding + "mm"
    extraBottom.style.fontSize = Math.floor(padding / 2.3) + "mm"
    extraBottom.children.item(0)!.textContent = "Maßstab 1:" + (this.isScaleLocked ? this.lockedScale : this.scale)
    extraBottom.children.item(1)!.textContent = (this.mapService.activeBasemap?.topPlusBg ? "Hintergrund: TopPlusOpen | " : "") + "© " + new Date().getFullYear() + " " + environment.name + " | Datenquelle: © GeoBasis-DE"
    const printMap = new Map({
      container: renderContainer,
      style: this.mapService.map!.getStyle(),
      bounds: [southWest!, northEast!],
      bearing: 0,
      pitch: 0,
      interactive: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      attributionControl: false
    })
    const resetPrintMap = () => {
      renderMap.style.display = "none"
      renderContainer.textContent = ""
      Object.defineProperty(window, 'devicePixelRatio', {
        get() { return actualPixelRatio },
      });
    }
    printMap.once("idle", () => {
      if (this.fileFormat === "PNG") {
        html2canvas(renderMap).then(canvas => {
          try {
            canvas.toBlob(blob => {
              saveAs(blob!, name + ".png")
            })
          } catch (e) {
            console.log(e)
          } finally {
            resetPrintMap()
            enableBtn()
          }

        })
      } else {
        const doc = new jsPDF({
          orientation: this.orientation,
          format: this.printFormat.value
        })
        html2canvas(renderMap).then(canvas => {
          try {
            doc.addImage(canvas.toDataURL(), 0, 0, width, height, undefined, 'FAST')
            doc.save(name + ".pdf")
          } catch (e) {
            console.log(e)
          } finally {
            resetPrintMap()
            enableBtn()
          }
        })
      }
    })
  }

  /**
   * Locks or unlocks scale
   */
  toggleScaleLocked() {
    if (!this.isZooming) {
      this.isScaleLocked = !this.isScaleLocked
      if (this.isScaleLocked) {
        this.lockedScale = this.scale
        this.mapService.map?.scrollZoom.disable()
        this.mapService.map?.on('dragend', this.updateZoom)
      } else {
        this.scale = this.lockedScale
        this.mapService.map?.scrollZoom.enable()
        this.mapService.map?.off('dragend', this.updateZoom)
      }
    }
  }

  /**
   * Updates scale depending on provided input
   * @param event HTML input element with new scale
   */
  onScaleInput(event: any) {
    this.isZooming = true
    this.lockedScale = event.target.value
    this.mapService.map?.easeTo({ zoom: this.calcZoom(event.target.value) })
    this.mapService.map?.once('idle', () => {
      this.isZooming = false
      this.scale = this.lockedScale
    })
  }

  /**
   * Updates current print format and recalculates scale
   * @param event HTML input event with new print format
   */
  setPrintFormat(event: any) {
    this.printFormat = this.printFormats[event.target.options.selectedIndex]
    this.calcScale()
    if (this.isScaleLocked) {
      this.mapService.map?.easeTo({ zoom: this.calcZoom(this.lockedScale) })
    }
  }

  /**
   * Updates current dpi
   * @param event HTML input event with new dpi
   */
  setDPI(event: any) {
    this.dpi = event.target.value
  }

  /**
   * Updates current orientation and updates orientation of selector
   * @param event HTML input event with new orientation
   */
  setOrientation(event: any) {
    this.orientation = event.target.value === "Hochformat" ? 'portrait' : 'landscape'
    if (this.orientation === 'landscape') {
      (document.querySelector('.selector'))?.classList.add('horizontal')
    } else {
      (document.querySelector('.selector'))?.classList.remove('horizontal')
    }
    this.calcScale()
    if (this.isScaleLocked) {
      this.mapService.map?.easeTo({ zoom: this.calcZoom(this.lockedScale) })
    }
  }

  /**
   * Updates current file format
   * @param event HTML input event with new file format
   */
  setFileFormat(event: any) {
    this.fileFormat = event.target.value
  }

  /**
   * Sets zoom of map to maintain scale
   */
  updateZoom = () => {
    this.calcScale()
    this.mapService.map?.easeTo({ zoom: this.calcZoom(this.lockedScale)! })
  }

  /**
   * Calculates zoom for given scale
   * @param scale Scale for which zoom is calculated
   * @returns Newly calculated zoom
   */
  calcZoom = (scale: number) => {
    if (!this.mapService.map) return
    const oldZoom = this.mapService.map.getZoom()
    if (this.scale < scale) {
      while (this.scale < scale) {
        this.mapService.map.setZoom(this.mapService.map.getZoom() - 0.01)
        this.calcScale()
      }
    } else {
      while (scale < this.scale) {
        this.mapService.map.setZoom(this.mapService.map.getZoom() + 0.01)
        this.calcScale()
      }
    }
    const newZoom = this.mapService.map.getZoom()
    this.mapService.map.setZoom(oldZoom)
    return newZoom
  }

  /**
   * Calculate scale depending on currently selected area and print format
   */
  calcScale = () => {
    const selectorRect = this.selector?.getBoundingClientRect()
    const southWest = this.mapService.map?.unproject([selectorRect!.left, selectorRect!.bottom])
    const northWest = this.mapService.map?.unproject([selectorRect!.left, selectorRect!.top])
    const northEast = this.mapService.map?.unproject([selectorRect!.right, selectorRect!.top])
    const isPortrait = this.orientation === 'portrait'
    const geoDistance = distance(
      [northWest!.lng, northWest!.lat],
      isPortrait ? [southWest!.lng, southWest!.lat] : [northEast!.lng, northEast!.lat],
      { units: "kilometers" }
    )
    const printDistance = (this.printFormat.height - ((this.printFormat.width / 20) * (isPortrait ? 5 : 2))) / 1000000

    this.scale = parseInt((geoDistance / printDistance).toFixed(0))
  }

}
