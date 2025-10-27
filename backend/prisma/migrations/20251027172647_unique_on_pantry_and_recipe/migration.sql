/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `IngredientMasterList` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PantryItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "IngredientMasterList_name_key" ON "IngredientMasterList"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PantryItem_name_key" ON "PantryItem"("name");
