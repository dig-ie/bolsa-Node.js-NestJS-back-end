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
  
  @Controller('orders')
  export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
  
    @Post()
    create(@Body() createOrderDto: CreateOrderDto) {
      return this.ordersService.create(createOrderDto);
    }
  
    @Get()
    findAll(@Query('userId') userId?: string, @Query('assetId') assetId?: string) {
      if (userId) {
        return this.ordersService.findByUser(userId);
      }
      if (assetId) {
        return this.ordersService.findByAsset(Number(assetId));
      }
      return this.ordersService.findAll();
    }
  
  
  
    @Get('mock/assets')
    getMockAssets() {
      return this.ordersService.getMockAssets();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.ordersService.findOne(id);
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
      return this.ordersService.update(id, updateOrderDto);
    }
  
      @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return { message: 'Ordem removida com sucesso' };
  }
  }