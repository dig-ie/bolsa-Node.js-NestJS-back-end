export class CreateOrderDto {
    userId: string;
    assetId: number;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
  }