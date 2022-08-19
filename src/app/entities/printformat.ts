/**
 * Class to describe a print format
 */
export class PrintFormat {
  constructor(
    /** Name of the format */
    public name: string,
    /** Value of the format */
    public value: string,
    /** Width of the format in mm */
    public width: number,
    /** Height of the format in mm */
    public height: number
  ) { }
}