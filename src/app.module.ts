import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssetsModule } from "./assets/assets.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [
    AssetsModule,
    UsersModule,
    AuthModule,
    WalletModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
