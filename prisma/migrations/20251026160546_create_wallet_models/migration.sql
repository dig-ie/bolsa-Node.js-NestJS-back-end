-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rentability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WalletItem" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "avgBuyPrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WalletItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "public"."Wallet"("userId");

-- AddForeignKey
ALTER TABLE "public"."Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WalletItem" ADD CONSTRAINT "WalletItem_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
