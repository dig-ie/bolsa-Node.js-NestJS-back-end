import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AssetResponseDto {
  @ApiProperty({
    description: 'Unique asset ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Asset name',
    example: 'Petróleo Brasileiro S.A.',
  })
  name: string;

  @ApiProperty({
    description: 'Asset symbol (ticker)',
    example: 'PETR4',
  })
  symbol: string;

  @ApiProperty({
    description: 'Asset price',
    example: 25.50,
  })
  @Transform(({ value }) => parseFloat(value.toString()))
  price: number;

  @ApiProperty({
    description: 'Whether the asset is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Asset creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Asset last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}