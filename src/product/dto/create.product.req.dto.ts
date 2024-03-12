export class CreateProductReqDto {
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
  description?: string;
  category?: string;
}
