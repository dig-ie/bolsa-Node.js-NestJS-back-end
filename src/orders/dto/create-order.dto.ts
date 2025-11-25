import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the user placing the order.',
    example: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
  })
  userId: string;

  @ApiProperty({
    description: 'ID of the asset involved in the order.',
    example: 1,
  })
  assetId: number;

  @ApiProperty({
    description: 'Type of the order: BUY or SELL.',
    enum: ['BUY', 'SELL'],
    example: 'BUY',
  })
  type: 'BUY' | 'SELL';

  @ApiProperty({
    description: 'Amount of the asset to be traded. Must be greater than zero.',
    example: 10,
  })
  quantity: number;

  @ApiProperty({
    description: 'Price per unit of the asset at the moment the order is placed.',
    example: 150.75,
  })
  price: number;
}
