/*
  Warnings:

  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tags" DROP CONSTRAINT "Tags_recipeId_fkey";

-- DropTable
DROP TABLE "Tags";

-- CreateTable
CREATE TABLE "TagMasterList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TagMasterList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeTags" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "RecipeTags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TagMasterList_name_key" ON "TagMasterList"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeTags_recipeId_tagId_key" ON "RecipeTags"("recipeId", "tagId");

-- AddForeignKey
ALTER TABLE "RecipeTags" ADD CONSTRAINT "RecipeTags_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTags" ADD CONSTRAINT "RecipeTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "TagMasterList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
