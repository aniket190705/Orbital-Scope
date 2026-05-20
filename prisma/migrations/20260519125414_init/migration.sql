-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "googleId" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteSatellite" (
    "id" TEXT NOT NULL,
    "satelliteId" TEXT NOT NULL,
    "satelliteName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FavoriteSatellite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "FavoriteSatellite_satelliteId_idx" ON "FavoriteSatellite"("satelliteId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteSatellite_userId_satelliteId_key" ON "FavoriteSatellite"("userId", "satelliteId");

-- AddForeignKey
ALTER TABLE "FavoriteSatellite" ADD CONSTRAINT "FavoriteSatellite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
