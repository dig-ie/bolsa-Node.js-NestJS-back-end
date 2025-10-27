import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  // Retorna ativos detalhados na carteira do usuário
  async getWallet(userId: string) {
  //  const orders = await this.prisma.order.findMany({
  //    where: { userId },
  //    include: { asset: true },
  //  });

  const orders = [
  { assetId: '1', quantity: 10, price: 50, type: 'BUY', asset: { symbol: 'TEC11', name: 'Tesouro', currentPrice: 55 } },
  { assetId: '2', quantity: 5, price: 100, type: 'BUY', asset: { symbol: 'FINV3', name: 'Financeira', currentPrice: 95 } },
];

    const grouped = new Map<string, any>();

    for (const order of orders) {
      const { assetId, asset, quantity, price, type } = order;
      const sign = type === 'BUY' ? 1 : -1;
      const entry = grouped.get(assetId) || {
        assetId,
        symbol: asset.symbol,
        name: asset.name,
        quantity: 0,
        totalSpent: 0,
        avgBuyPrice: 0,
        currentPrice: asset.currentPrice,
      };

      entry.quantity += quantity * sign;
      entry.totalSpent += price * quantity * (type === 'BUY' ? 1 : -1);
      entry.avgBuyPrice = entry.totalSpent / entry.quantity;
      grouped.set(assetId, entry);
    }

    const walletItems = Array.from(grouped.values()).map((item) => {
      const profit = (item.currentPrice - item.avgBuyPrice) * item.quantity;
      return { ...item, profit };
    });

    return walletItems;
  }

  // Resumo da carteira
  async getWalletSummary(userId: string) {
    const wallet = await this.getWallet(userId);
    const totalValue = wallet.reduce(
      (acc, a) => acc + a.currentPrice * a.quantity,
      0,
    );
    const totalProfit = wallet.reduce((acc, a) => acc + a.profit, 0);
    const rentability = totalProfit / (totalValue - totalProfit || 1);

    return {
      totalValue,
      totalProfit,
      rentability,
      assetsCount: wallet.length,
    };
  }
}
