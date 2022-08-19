/**
 * Wrapper class for map styles
 */
export class Basemap {
  constructor(
    /** Name of the basemap */
    public name: string,
    /** URL to image for the menu */
    public image: string,
    /** URL to the styling file */
    public styling: string,
    /** Indicates if basemap has TopPlusOpen background */
    public topPlusBg: boolean,
    /** Location in layer hierachy for the background */
    public topPlusBgBehind: string,
    /** Indicates if meta data file has infos for basemap */
    public useMetaData: boolean,
    /** Indicates if style is in beta */
    public isBeta: boolean
  ) { }
}