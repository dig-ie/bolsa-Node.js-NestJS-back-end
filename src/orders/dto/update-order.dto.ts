import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Updated status of the order',
    enum: ['PENDING', 'EXECUTED', 'CANCELED'],
    example: 'EXECUTED',
  })
  status?: 'PENDING' | 'EXECUTED' | 'CANCELED';

  @ApiPropertyOptional({
    description: 'Updated quantity of the order. Must be greater than zero.',
    example: 15,
  })
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Updated price of the order. Must be greater than zero.',
    example: 120.50,
  })
  price?: number;
}
