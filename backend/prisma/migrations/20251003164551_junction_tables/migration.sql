/*
  Warnings:

  - You are about to drop the column `created_at` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followed_by_id` on the `Follows` table. All the data in the column will be lost.
  - You are about to drop the column `following_id` on the `Follows` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PantryItem` table. All the data in the column will be lost.
  - You are about to drop the column `cook_time` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `Ingredients` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `followedById` to the `Follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingId` to the `Follows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `PantryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cookTime` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_followed_by_id_fkey";

-- DropForeignKey
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_following_id_fkey";

-- DropForeignKey
ALTER TABLE "Ingredients" DROP CONSTRAINT "Ingredients_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "PantryItem" DROP CONSTRAINT "PantryItem_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Follows" DROP CONSTRAINT "Follows_pkey",
DROP COLUMN "followed_by_id",
DROP COLUMN "following_id",
ADD COLUMN     "followedById" TEXT NOT NULL,
ADD COLUMN     "followingId" TEXT NOT NULL,
ADD CONSTRAINT "Follows_pkey" PRIMARY KEY ("followingId", "followedById");

-- AlterTable
ALTER TABLE "PantryItem" DROP COLUMN "userId",
ADD COLUMN     "ingredientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "cook_time",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "cookTime" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Ingredients";

-- CreateTable
CREATE TABLE "IngredientMasterList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IngredientMasterList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PantryUsers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pantryItemId" TEXT NOT NULL,

    CONSTRAINT "PantryUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredients" (
    "recipeIngredientId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "measurement" TEXT NOT NULL,
    "preparationNotes" TEXT NOT NULL,

    CONSTRAINT "RecipeIngredients_pkey" PRIMARY KEY ("recipeIngredientId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PantryUsers_userId_pantryItemId_key" ON "PantryUsers"("userId", "pantryItemId");

-- AddForeignKey
ALTER TABLE "PantryItem" ADD CONSTRAINT "PantryItem_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "IngredientMasterList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryUsers" ADD CONSTRAINT "PantryUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantryUsers" ADD CONSTRAINT "PantryUsers_pantryItemId_fkey" FOREIGN KEY ("pantryItemId") REFERENCES "PantryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredients" ADD CONSTRAINT "RecipeIngredients_recipeIngredientId_fkey" FOREIGN KEY ("recipeIngredientId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredients" ADD CONSTRAINT "RecipeIngredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "IngredientMasterList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
