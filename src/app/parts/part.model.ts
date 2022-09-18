export class Part {
  public image: string;
  public name: string;
  public brand: string;
  public model: string;
  public bar_clamp: number;
  public length: number;
  public rise: number;
  public steerer_tube_diameter: string;
  public color: string;
  public material: string;
  public price: number;
  public weight: string;
  public where: string;

  constructor(
    image: string,
    name: string,
    brand: string,
    model: string,
    bar_clamp: number,
    length: number,
    rise: number,
    steerer_tube_diameter: string,
    color: string,
    material: string,
    price: number,
    weight: string,
    where: string,

    ) {

    this.image = image;
    this.name = name;
    this.brand = brand;
    this.model = model;
    this.bar_clamp = bar_clamp;
    this.length = length;
    this.rise = rise;
    this.steerer_tube_diameter = steerer_tube_diameter
    this.color = color;
    this.material = material;
    this.price = price;
    this.weight = weight;
    this.where = where;
  }
}
