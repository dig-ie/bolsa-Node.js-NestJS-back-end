import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order (mocked userId: u1)',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Missing or invalid fields' })
  create(@Body() dto: CreateOrderDto) {
    const mockedUserId = 'u1'; // usuário mockado real
    return this.ordersService.create(mockedUserId, dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Find all orders by userId' })
  @ApiParam({
    name: 'userId',
    description: 'User ID to filter orders',
    example: 'u1',
  })
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all orders or filter by userId/assetId' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'assetId', required: false })
  findAll(
    @Query('userId') userId?: string,
    @Query('assetId') assetId?: string,
  ) {
    if (userId) return this.ordersService.findByUser(userId);
    if (assetId) return this.ordersService.findByAsset(Number(assetId));
    return this.ordersService.findAll();
  }

  @Get('mock/assets')
  @ApiOperation({ summary: 'Returns mocked assets for testing' })
  getMockAssets() {
    return this.ordersService.getMockAssets();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find an order by ID' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order by ID' })
  @ApiBody({ type: UpdateOrderDto })
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove an order by ID' })
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return { message: 'Order removed successfully' };
  }
}
