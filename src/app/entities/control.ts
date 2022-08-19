import * as maplibregl from "maplibre-gl";

/**
 * Wrapper class for map controls
 */
export class Control {
  constructor(
    /** Name of the control to display on the frontend */
    public name: string,
    /** Type of the control */
    public type: string,
    /** Indicates if control should be visible */
    public visible: boolean,
    /** The maplibregl.Control element */
    public control: maplibregl.IControl,
    /** Position of the control on the map */
    public position: "bottom-left" | "top-left" | "top-right" | "bottom-right"
  ) { }
}