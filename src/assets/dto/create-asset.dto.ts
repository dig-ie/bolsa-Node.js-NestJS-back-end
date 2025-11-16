import { IsString, IsNotEmpty, Length, Matches, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({
    description: 'Asset name',
    example: 'Petróleo Brasileiro S.A.',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @ApiProperty({
    description: 'Asset symbol (ticker)',
    example: 'PETR4',
    pattern: '^[A-Z0-9]{2,10}$',
  })
  @IsString({ message: 'Symbol must be a string' })
  @IsNotEmpty({ message: 'Symbol is required' })
  @Length(2, 10, { message: 'Symbol must be between 2 and 10 characters' })
  @Matches(/^[A-Z0-9]+$/, { 
    message: 'Symbol must contain only uppercase letters and numbers' 
  })
  symbol: string;

  @ApiProperty({
    description: 'Asset price',
    example: 25.50,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be a positive number' })
  price: number;
}