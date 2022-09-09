export class Recipe {
    public name: string;
    public price: any;
    public image: string;
  
    constructor(name: string, price: any, image: string) {
      this.name = name;
      this.price = price;
      this.image = image;
    }
  }