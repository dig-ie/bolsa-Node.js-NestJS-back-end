import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [WalletService, PrismaService],
  controllers: [WalletController],
})
export class WalletModule {}
