import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    sku: '1',
    name: 'Chronograph Master',
    brand: 'Horology Co.',
    description: 'A beautiful timepiece featuring automatic movement and a premium leather strap.',
    price: 1250,
    category: 'Men',
    dialColor: 'Black',
    strapMaterial: 'Leather',
    movementType: 'Automatic',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
    ]),
    stockQuantity: 15,
    isFeatured: true,
    isBestseller: false,
  },
  {
    sku: '2',
    name: 'Elegance Rose',
    brand: 'LuxeTime',
    description: 'Elegant rose gold watch with a minimalist quartz movement.',
    price: 850,
    category: 'Women',
    dialColor: 'Rose Gold',
    strapMaterial: 'Metal',
    movementType: 'Quartz',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508656986401-88973576434a?auto=format&fit=crop&q=80&w=800'
    ]),
    stockQuantity: 8,
    isFeatured: false,
    isBestseller: true,
  },
  {
    sku: '3',
    name: 'Deep Sea Diver',
    brand: 'Oceanic',
    description: 'Professional diving watch water-resistant up to 300m.',
    price: 2100,
    category: 'Luxury',
    dialColor: 'Blue',
    strapMaterial: 'Steel',
    movementType: 'Automatic',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1548171915-e76a3a4111ce?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800'
    ]),
    stockQuantity: 5,
    isFeatured: false,
    isBestseller: false,
  },
  {
    sku: '4',
    name: 'Minimalist One',
    brand: 'Nordic',
    description: 'Clean, minimalist design for everyday wear.',
    price: 195,
    category: 'Men',
    dialColor: 'White',
    strapMaterial: 'Leather',
    movementType: 'Quartz',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=800'
    ]),
    stockQuantity: 42,
    isFeatured: false,
    isBestseller: true,
  },
  {
    sku: '5',
    name: 'Tech Pro Series 5',
    brand: 'FutureWrist',
    description: 'Advanced smartwatch with health tracking and notifications.',
    price: 399,
    category: 'Smartwatch',
    dialColor: 'Digital',
    strapMaterial: 'Silicone',
    movementType: 'Smart',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'
    ]),
    stockQuantity: 120,
    isFeatured: true,
    isBestseller: false,
  },
  {
    sku: '6',
    name: 'Vintage Gold',
    brand: 'Heritage',
    description: 'A restored vintage classic from the 1960s.',
    price: 3400,
    category: 'Luxury',
    dialColor: 'Gold',
    strapMaterial: 'Leather',
    movementType: 'Mechanical',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
    ]),
    stockQuantity: 0,
    isFeatured: false,
    isBestseller: false,
  },
  {
    sku: '7',
    name: 'Citizen Eco-Drive Chronograph',
    brand: 'Citizen',
    description: 'Classic stainless steel chronograph with a black dial and Eco-Drive technology. Features multiple sub-dials, a date window, and a robust steel bracelet.',
    price: 395,
    category: 'Men',
    dialColor: 'Black',
    strapMaterial: 'Steel',
    movementType: 'Eco-Drive',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800'
    ]),
    stockQuantity: 15,
    isFeatured: true,
    isBestseller: true,
  },
  {
    sku: '8',
    name: 'Transparent Skull Skeleton',
    brand: 'Luxury Custom',
    description: 'Striking transparent case with a detailed rhinestone skull dial. Comes with interchangeable black and clear rubber straps for a bold, unique look.',
    price: 1250,
    category: 'Women',
    dialColor: 'Skeleton',
    strapMaterial: 'Rubber',
    movementType: 'Automatic',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548171915-e76a3a4111ce?auto=format&fit=crop&q=80&w=800'
    ]),
    stockQuantity: 5,
    isFeatured: true,
    isBestseller: false,
  }
];

async function main() {
  console.log('Start seeding...');
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: p,
      create: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
