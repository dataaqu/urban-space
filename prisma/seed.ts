import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.contactSubmission.deleteMany();
  await prisma.project.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.service.deleteMany();
  await prisma.siteSettings.deleteMany();

  // Create Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        slug: 'residential-complex-vake',
        titleKa: 'საცხოვრებელი კომპლექსი ვაკეში',
        titleEn: 'Residential Complex in Vake',
        descriptionKa: 'თანამედროვე საცხოვრებელი კომპლექსი ვაკის რაიონში, რომელიც მოიცავს 120 ბინას და მიწისქვეშა პარკინგს.',
        descriptionEn: 'Modern residential complex in Vake district, featuring 120 apartments and underground parking.',
        category: 'ARCHITECTURE',
        type: 'RESIDENTIAL_MULTI',
        images: [],
        featured: true,
        status: 'COMPLETED',
        year: 2023,
        location: 'Tbilisi, Vake',
        area: 15000,
      },
    }),
    prisma.project.create({
      data: {
        slug: 'office-building-saburtalo',
        titleKa: 'საოფისე შენობა საბურთალოზე',
        titleEn: 'Office Building in Saburtalo',
        descriptionKa: 'თანამედროვე საოფისე სივრცე მრავალფუნქციური დარბაზით და კონფერენც ოთახებით.',
        descriptionEn: 'Modern office space with multifunctional hall and conference rooms.',
        category: 'ARCHITECTURE',
        type: 'PUBLIC_MULTIFUNCTIONAL',
        images: [],
        featured: true,
        status: 'ONGOING',
        year: 2024,
        location: 'Tbilisi, Saburtalo',
        area: 8500,
      },
    }),
    prisma.project.create({
      data: {
        slug: 'private-villa-mtskheta',
        titleKa: 'კერძო ვილა მცხეთაში',
        titleEn: 'Private Villa in Mtskheta',
        descriptionKa: 'ლუქს კლასის კერძო ვილა პანორამული ხედებით მთებზე.',
        descriptionEn: 'Luxury private villa with panoramic mountain views.',
        category: 'ARCHITECTURE',
        type: 'INDIVIDUAL_HOUSE',
        images: [],
        featured: true,
        status: 'COMPLETED',
        year: 2022,
        location: 'Mtskheta',
        area: 650,
      },
    }),
    prisma.project.create({
      data: {
        slug: 'urban-renewal-old-tbilisi',
        titleKa: 'ძველი თბილისის განახლების პროექტი',
        titleEn: 'Old Tbilisi Urban Renewal Project',
        descriptionKa: 'ისტორიული უბნის რევიტალიზაციის და განახლების ქალაქგეგმარებითი პროექტი.',
        descriptionEn: 'Urban planning project for the revitalization and renewal of the historic district.',
        category: 'URBAN',
        type: 'URBAN_PLANNING',
        images: [],
        featured: true,
        status: 'ONGOING',
        year: 2024,
        location: 'Tbilisi, Old Town',
        area: 50000,
      },
    }),
    prisma.project.create({
      data: {
        slug: 'public-park-competition',
        titleKa: 'საჯარო პარკის კონკურსი',
        titleEn: 'Public Park Competition',
        descriptionKa: 'საერთაშორისო არქიტექტურული კონკურსი ახალი საჯარო პარკის დიზაინისთვის.',
        descriptionEn: 'International architectural competition for a new public park design.',
        category: 'URBAN',
        type: 'COMPETITION',
        images: [],
        featured: false,
        status: 'COMPLETED',
        year: 2023,
        location: 'Batumi',
        area: 25000,
      },
    }),
    prisma.project.create({
      data: {
        slug: 'residential-tower-batumi',
        titleKa: 'საცხოვრებელი კოშკი ბათუმში',
        titleEn: 'Residential Tower in Batumi',
        descriptionKa: '25 სართულიანი საცხოვრებელი კოშკი ზღვის ხედით.',
        descriptionEn: '25-story residential tower with sea views.',
        category: 'ARCHITECTURE',
        type: 'RESIDENTIAL_MULTI',
        images: [],
        featured: false,
        status: 'ONGOING',
        year: 2025,
        location: 'Batumi',
        area: 32000,
      },
    }),
  ]);

  console.log(`Created ${projects.length} projects`);

  // Create Team Members
  const teamMembers = await Promise.all([
    prisma.teamMember.create({
      data: {
        nameKa: 'გიორგი მამალაძე',
        nameEn: 'Giorgi Mamaladze',
        positionKa: 'მთავარი არქიტექტორი',
        positionEn: 'Chief Architect',
        order: 1,
      },
    }),
    prisma.teamMember.create({
      data: {
        nameKa: 'ნინო წერეთელი',
        nameEn: 'Nino Tsereteli',
        positionKa: 'პროექტის მენეჯერი',
        positionEn: 'Project Manager',
        order: 2,
      },
    }),
    prisma.teamMember.create({
      data: {
        nameKa: 'დავით კვარაცხელია',
        nameEn: 'Davit Kvaratskhelia',
        positionKa: 'ურბანისტი',
        positionEn: 'Urban Planner',
        order: 3,
      },
    }),
    prisma.teamMember.create({
      data: {
        nameKa: 'მარიამ ბერიძე',
        nameEn: 'Mariam Beridze',
        positionKa: 'ინტერიერის დიზაინერი',
        positionEn: 'Interior Designer',
        order: 4,
      },
    }),
  ]);

  console.log(`Created ${teamMembers.length} team members`);

  // Create Partners
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: 'Tbilisi City Hall',
        website: 'https://tbilisi.gov.ge',
        order: 1,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Georgian Architects Association',
        website: 'https://architects.ge',
        order: 2,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Construction Group Ltd',
        order: 3,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Green Building Council Georgia',
        order: 4,
      },
    }),
  ]);

  console.log(`Created ${partners.length} partners`);

  // Create Services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        titleKa: 'არქიტექტურული პროექტირება',
        titleEn: 'Architectural Design',
        descriptionKa: 'სრული არქიტექტურული პროექტირება კონცეფციიდან რეალიზაციამდე, მათ შორის ესკიზური პროექტი, სამუშაო ნახაზები და ავტორის ზედამხედველობა.',
        descriptionEn: 'Complete architectural design from concept to realization, including schematic design, working drawings, and author supervision.',
        icon: '🏛️',
        order: 1,
      },
    }),
    prisma.service.create({
      data: {
        titleKa: 'ურბანული დაგეგმარება',
        titleEn: 'Urban Planning',
        descriptionKa: 'ქალაქგეგმარებითი პროექტები, ტერიტორიების განვითარების კონცეფციები და მასტერპლანები.',
        descriptionEn: 'Urban planning projects, territorial development concepts, and master plans.',
        icon: '🌆',
        order: 2,
      },
    }),
    prisma.service.create({
      data: {
        titleKa: 'ინტერიერის დიზაინი',
        titleEn: 'Interior Design',
        descriptionKa: 'ინტერიერის კონცეპტუალური და დეტალური დიზაინი, ავეჯისა და განათების სქემების შერჩევა.',
        descriptionEn: 'Conceptual and detailed interior design, furniture and lighting scheme selection.',
        icon: '🪑',
        order: 3,
      },
    }),
    prisma.service.create({
      data: {
        titleKa: '3D ვიზუალიზაცია',
        titleEn: '3D Visualization',
        descriptionKa: 'მაღალი ხარისხის 3D რენდერები და ანიმაციები პროექტების პრეზენტაციისთვის.',
        descriptionEn: 'High-quality 3D renders and animations for project presentations.',
        icon: '🎨',
        order: 4,
      },
    }),
    prisma.service.create({
      data: {
        titleKa: 'კონსულტაცია',
        titleEn: 'Consulting',
        descriptionKa: 'არქიტექტურული და ურბანული კონსულტაციები, ექსპერტიზა და ტექნიკური დასკვნები.',
        descriptionEn: 'Architectural and urban consulting, expertise, and technical conclusions.',
        icon: '💬',
        order: 5,
      },
    }),
  ]);

  console.log(`Created ${services.length} services`);

  // Create Site Settings
  const siteSettings = await prisma.siteSettings.create({
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
