export class UpdateOrderDto {
    status?: 'PENDING' | 'EXECUTED' | 'CANCELED';
    quantity?: number;
    price?: number;
  }