import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from '../wallet.service';
import { PrismaService } from '../../common/prisma.service';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService, PrismaService],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return wallet summary', async () => {
    const summary = await service.getWalletSummary('test-user');
    expect(summary).toHaveProperty('totalValue');
    expect(summary).toHaveProperty('totalProfit');
  });
});
