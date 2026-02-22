import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.post.findMany();
    fs.writeFileSync('posts.json', JSON.stringify(posts, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
