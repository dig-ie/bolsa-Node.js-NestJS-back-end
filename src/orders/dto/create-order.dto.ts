import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the asset involved in the order.',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  assetId: number;

  @ApiProperty({
    description: 'Type of the order: BUY or SELL.',
    enum: ['BUY', 'SELL'],
    example: 'BUY',
  })
  @IsEnum(['BUY', 'SELL'], {
    message: 'type must be BUY or SELL',
  })
  type: 'BUY' | 'SELL';

  @ApiProperty({
    description: 'Amount of the asset to be traded. Must be greater than zero.',
    example: 10,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'Price per unit of the asset at the moment the order is placed.',
    example: 150.75,
  })
  @IsNumber()
  @IsPositive()
  price: number;
}
