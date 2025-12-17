const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateTags() {
    try {
        // Get all exisiting recipes with tags from the old Tags table
        const oldTags = await prisma.tags.findMany({
            include: {
                recipe: true,
            }
        });

        console.log(`Found ${oldTags.length} tags to migrate`);

        for (const oldTag of oldTags) {
            // Create or find tag in TagMasterList
            const tag = await prisma.tagMasterList.upsert({
                where: { name: oldTag.name.toLowerCase() },
                update: {},
                create: { name: oldTag.name.toLowerCase() }
            });

            // Create RecipeTags relationship
            await prisma.recipeTags.create({
                data: {
                    recipeId: oldTag.recipeId,
                    tagId: tag.id
                }
            });

            console.log(`Migrated tag: ${oldTag.name} for recipe ${oldTag.recipeId}`);
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateTags();