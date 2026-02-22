import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const mapping = [
    { slug: 'test', imgName: 'test_post_cover_1771721177850.png' },
    { slug: 'test2', imgName: 'test2_post_cover_1771721192152.png' },
    { slug: 'wetw', imgName: 'writer_post_cover_1771721210306.png' },
    { slug: 'comparison', imgName: 'comparison_post_cover_1771721226980.png' }
];

const sourceDir = 'C:\\Users\\saimd\\.gemini\\antigravity\\brain\\b50fbb44-b5c5-4e65-8f9e-b187a133554c';
const destDir = path.join(process.cwd(), 'public', 'images');

async function main() {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    for (const item of mapping) {
        const src = path.join(sourceDir, item.imgName);
        const dest = path.join(destDir, item.imgName);

        // Copy image
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${item.imgName}`);

            // Update DB
            const dbUrl = `/images/${item.imgName}`;
            await prisma.post.update({
                where: { slug: item.slug },
                data: { coverImage: dbUrl, postCoverImage: dbUrl }
            });
            console.log(`Updated DB for slug: ${item.slug}`);
        } else {
            console.error(`Source image not found: ${src}`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
