import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';


const mockUsers = [
  { id: 'u1', name: 'João Silva', email: 'joao@example.com' },
  { id: 'u2', name: 'Maria Oliveira', email: 'maria@example.com' },
  { id: 'u3', name: 'Carlos Pereira', email: 'carlos@example.com' },
];


const mockAssets = [
  { id: 1, name: 'Tecnologia 11', symbol: 'TEC11' },
  { id: 2, name: 'Finanças V3', symbol: 'FINV3' },
  { id: 3, name: 'Energia Solar', symbol: 'ENER3' },
  { id: 4, name: 'Agronegócio', symbol: 'AGRO4' },
  { id: 5, name: 'Construção', symbol: 'CONS5' },
];


const DEFAULT_USER_ID = 'u1';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const { assetId, quantity, price, type } = dto;

    
    const resolvedUserId = userId || DEFAULT_USER_ID;

    
    const user = mockUsers.find(u => u.id === resolvedUserId);
    if (!user) throw new NotFoundException('User not found (mock).');

   
    const asset = mockAssets.find(a => a.id === assetId);
    if (!asset) throw new NotFoundException('Asset not found (mock).');

    
    if (quantity <= 0) throw new BadRequestException('Quantity must be greater than zero.');
    if (price <= 0) throw new BadRequestException('Price must be greater than zero.');
    if (!['BUY', 'SELL'].includes(type))
      throw new BadRequestException('Type must be BUY or SELL.');

   
    return this.prisma.order.create({
      data: {
        userId: resolvedUserId, 
        assetId,
        quantity,
        price,
        type,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found.');
    return order;
  }

  async findByUser(userId: string) {
    const resolvedUserId = userId || DEFAULT_USER_ID;

    const user = mockUsers.find(u => u.id === resolvedUserId);
    if (!user) throw new NotFoundException('User not found (mock).');

    return this.prisma.order.findMany({
      where: { userId: resolvedUserId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAsset(assetId: number) {
    const asset = mockAssets.find(a => a.id === assetId);
    if (!asset) throw new NotFoundException('Asset not found (mock).');

    return this.prisma.order.findMany({
      where: { assetId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    const existing = await this.findOne(id);

    if (existing.status === 'EXECUTED' || existing.status === 'CANCELED') {
      throw new BadRequestException('Cannot update executed or canceled order.');
    }

    return this.prisma.order.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }

  getMockAssets() {
    return mockAssets;
  }

  getMockUsers() {
    return mockUsers;
  }
}
