export class FindAllProductResDto {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  status: string;

  constructor(
    id: string,
    name: string,
    price: number,
    imageUrl: string,
    category: string,
    status: string,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.status = status;
  }
}
