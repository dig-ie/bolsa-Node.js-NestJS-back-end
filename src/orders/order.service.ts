import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Assets mockados (até criar o model Asset no Prisma)
  private mockAssets = [
    { id: 1, name: 'Tecnologia 11', symbol: 'TEC11' },
    { id: 2, name: 'Finanças V3', symbol: 'FINV3' },
    { id: 3, name: 'Energia Solar', symbol: 'ENER3' },
    { id: 4, name: 'Agronegócio', symbol: 'AGRO4' },
    { id: 5, name: 'Construção', symbol: 'CONS5' },
  ];

  async create(createOrderDto: CreateOrderDto) {
    // Validar se o usuário existe no banco (via Prisma)
    const user = await this.prisma.user.findUnique({
      where: { id: createOrderDto.userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Validar se o ativo existe (via mock até criar model Asset)
    const asset = this.mockAssets.find(a => a.id === createOrderDto.assetId);
    if (!asset) {
      throw new NotFoundException('Ativo não encontrado');
    }

    // Validações básicas
    if (createOrderDto.quantity <= 0) {
      throw new BadRequestException('Quantidade deve ser maior que zero');
    }

    if (createOrderDto.price <= 0) {
      throw new BadRequestException('Preço deve ser maior que zero');
    }

    if (createOrderDto.type !== 'BUY' && createOrderDto.type !== 'SELL') {
      throw new BadRequestException('Tipo deve ser BUY ou SELL');
    }

    // Criar order no banco usando Prisma (persistência real)
    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        assetId: createOrderDto.assetId,
        type: createOrderDto.type,
        quantity: createOrderDto.quantity,
        price: createOrderDto.price,
        // status tem default 'PENDING' no schema
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {

    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Ordem não encontrada');
    }
    return order;
  }

  async findByUser(userId: string) {
    // Validar se o usuário existe no banco
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

   
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByAsset(assetId: number) {
    // Validar se o ativo existe (mock)
    const asset = this.mockAssets.find(a => a.id === assetId);
    if (!asset) {
      throw new NotFoundException('Ativo não encontrado');
    }


    return this.prisma.order.findMany({
      where: { assetId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (order.status === 'EXECUTED' || order.status === 'CANCELED') {
      throw new BadRequestException(
        'Não é possível atualizar uma ordem já executada ou cancelada',
      );
    }

   
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.prisma.order.delete({
      where: { id },
    });
    return order;
  }

  // Método auxiliar para listar assets mockados
  getMockAssets() {
    return this.mockAssets;
  }

  // Método auxiliar para listar usuários (via Prisma)
  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }
}