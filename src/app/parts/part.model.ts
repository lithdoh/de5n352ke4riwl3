export class PartInfo {
    public name: string;
    public model: string;
    public price: any;

    constructor(name: string, price: any, image: string) {
      this.name = name;
      this.model = image;
      this.price = price;
    }
  }
