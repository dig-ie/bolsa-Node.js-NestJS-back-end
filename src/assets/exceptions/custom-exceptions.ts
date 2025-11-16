import { HttpException, HttpStatus } from '@nestjs/common';

export class AssetNotFoundException extends HttpException {
  constructor(id: number) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Asset with ID ${id} not found`,
        error: 'Asset Not Found',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class AssetAlreadyExistsException extends HttpException {
  constructor(symbol: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Asset with symbol ${symbol} already exists`,
        error: 'Asset Already Exists',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidAssetDataException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: 'Invalid Asset Data',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class AssetServiceException extends HttpException {
  constructor(message: string, cause?: any) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Internal asset service error: ${message}`,
        error: 'Asset Service Error',
        timestamp: new Date().toISOString(),
        cause: cause?.message || cause,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}