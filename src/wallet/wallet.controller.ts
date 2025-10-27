import { Controller, Get, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallet(@Query('userId') userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Get('summary')
  async getWalletSummary(@Query('userId') userId: string) {
    return this.walletService.getWalletSummary(userId);
  }
}
