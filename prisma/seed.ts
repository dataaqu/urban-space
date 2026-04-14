import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.projectPage.deleteMany();
  await prisma.project.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.service.deleteMany();
  await prisma.siteSettings.deleteMany();

  // Create Admin User
  const adminUser = await prisma.adminUser.create({
    data: {
      email: 'admin@urbanspace.ge',
      hashedPassword: hashSync('admin123', 12),
      name: 'Admin',
      role: 'admin',
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // Create Hero Slides
  const heroSlides = await Promise.all([
    prisma.heroSlide.create({ data: { image: '/poto/2.webp', titleKa: 'ურბანული სივრცე', titleEn: 'Urban Space', order: 0 } }),
  ]);
  console.log(`Created ${heroSlides.length} hero slides`);

  // Create Projects with pages
  const project1 = await prisma.project.create({
    data: {
      slug: 'residential-complex-vake',
      titleKa: 'საცხოვრებელი კომპლექსი ვაკეში',
      titleEn: 'Residential Complex in Vake',
      category: 'ARCHITECTURE',
      pages: {
        create: [
          {
            type: 'SINGLE_IMAGE',
            order: 0,
            image1: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
            textKa: '<p>თანამედროვე საცხოვრებელი კომპლექსი ვაკის რაიონში</p>',
            textEn: '<p>Modern residential complex in Vake district</p>',
          },
          {
            type: 'DOUBLE_IMAGE',
            order: 1,
            image1: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200',
            image2: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200',
          },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      slug: 'urban-renewal-old-tbilisi',
      titleKa: 'ძველი თბილისის განახლების პროექტი',
      titleEn: 'Old Tbilisi Urban Renewal Project',
      category: 'URBAN',
      pages: {
        create: [
          {
            type: 'SINGLE_IMAGE',
            order: 0,
            image1: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=1200',
            textKa: '<p>ისტორიული უბნის რევიტალიზაციის პროექტი</p>',
            textEn: '<p>Historic district revitalization project</p>',
          },
          {
            type: 'DOUBLE_IMAGE',
            order: 1,
            image1: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200',
            image2: 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e5?w=1200',
          },
        ],
      },
    },
  });

  console.log(`Created ${2} projects with pages`);

  // Create Site Settings
  await prisma.siteSettings.create({
    data: {
      address: 'Tbilisi, Georgia',
      email: 'info@urbanspace.ge',
      phone: '+995 XXX XXX XXX',
      facebookUrl: 'https://facebook.com/urbanspace',
      instagramUrl: 'https://instagram.com/urbanspace',
      mapLat: 41.7151,
      mapLng: 44.8271,
    },
  });

  console.log('Created site settings');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
