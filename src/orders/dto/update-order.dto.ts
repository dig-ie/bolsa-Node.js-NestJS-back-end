import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  EXECUTED = 'EXECUTED',
  CANCELED = 'CANCELED',
}

export class UpdateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  assetId?: number;

  @ApiPropertyOptional({
    enum: ['BUY', 'SELL'],
  })
  @IsOptional()
  @IsEnum(['BUY', 'SELL'])
  type?: 'BUY' | 'SELL';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    enum: OrderStatusEnum,
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;
}
