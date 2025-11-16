/*
  Warnings:

  - The primary key for the `RecipeIngredients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `recipeIngredientId` on the `RecipeIngredients` table. All the data in the column will be lost.
  - The required column `id` was added to the `RecipeIngredients` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `recipeId` to the `RecipeIngredients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecipeIngredients" DROP CONSTRAINT "RecipeIngredients_recipeIngredientId_fkey";

-- AlterTable
ALTER TABLE "RecipeIngredients" DROP CONSTRAINT "RecipeIngredients_pkey",
DROP COLUMN "recipeIngredientId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "recipeId" TEXT NOT NULL,
ADD CONSTRAINT "RecipeIngredients_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "RecipeIngredients" ADD CONSTRAINT "RecipeIngredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
