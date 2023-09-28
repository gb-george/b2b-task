export class DataElement {
    id!: string;
    int!: number;
    float!: number;
    color!: string;
    child!: ChildElement;
  }
  
  export class ChildElement {
    id!: number;
    color!: string;
  }