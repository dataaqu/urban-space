import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const content = [
  // HOME
  { section: 'home', key: 'featured.title', valueEn: 'Selected work', valueKa: 'არჩეული ნამუშევრები' },
  { section: 'home', key: 'featured.subtitle', valueEn: 'Projects defining our practice', valueKa: 'პროექტები, რომლებიც განსაზღვრავს ჩვენს პრაქტიკას' },

  // STUDIO
  { section: 'studio', key: 'about.title', valueEn: 'About Us', valueKa: 'ჩვენს შესახებ' },
  { section: 'studio', key: 'about.description', valueEn: 'Urban Space is an architecture and urban planning studio based in Tbilisi, founded in 2012.', valueKa: 'Urban Space არის არქიტექტურული და ურბანული დაგეგმარების სტუდია, დაფუძნებული თბილისში, 2012 წელს.' },
  { section: 'studio', key: 'about.paragraph1', valueEn: 'The studio works on residential, public, and large-scale urban projects in Tbilisi and across Georgia.', valueKa: 'სტუდია მუშაობს საცხოვრებელ, საზოგადოებრივ და მსხვილმასშტაბიან ურბანულ პროექტებზე თბილისსა და საქართველოს მასშტაბით.' },
  { section: 'studio', key: 'about.paragraph2', valueEn: 'Since 2012, the studio has developed over 100 urban and architectural projects.', valueKa: '2012 წლიდან სტუდიამ 100-ზე მეტი ურბანული და არქიტექტურული პროექტი შეიმუშავა.' },
  { section: 'studio', key: 'about.paragraph3', valueEn: 'Our practice is centered on understanding the context, clear spatial organization, and creating long-term urban and architectural value.', valueKa: 'ჩვენი პრაქტიკა ორიენტირებულია კონტექსტის გაგებაზე, სივრცის მკაფიო ორგანიზაციაზე და გრძელვადიანი ურბანული და არქიტექტურული ღირებულების შექმნაზე.' },
  { section: 'studio', key: 'about.paragraph4', valueEn: 'The studio is led by experienced architects Mariam Ephremidze and Luka Kikiani. Our team includes specialists from various disciplines, working integrally through all stages of the project.', valueKa: 'სტუდიას ხელმძღვანელობენ გამოცდილი არქიტექტორები მარიამ ეფრემიძე და ლუკა კიკიანი. ჩვენი გუნდი მოიცავს სხვადასხვა დისციპლინის სპეციალისტებს, რომლებიც ინტეგრალურად მუშაობენ პროექტის ყველა ეტაპზე.' },

  // CONTACT
  { section: 'contact', key: 'title', valueEn: 'Contact', valueKa: 'კონტაქტი' },
  { section: 'contact', key: 'subtitle', valueEn: 'We are open for collaboration and new projects.', valueKa: 'ჩვენ ღია ვართ თანამშრომლობისა და ახალი პროექტებისთვის.' },
  { section: 'contact', key: 'info.address', valueEn: 'Niko Nikoladze St. 5, Tbilisi', valueKa: 'ნიკო ნიკოლაძის ქ. 5, თბილისი' },
  { section: 'contact', key: 'info.email', valueEn: 'info@urbanspace.ge', valueKa: 'info@urbanspace.ge' },
  { section: 'contact', key: 'info.phone', valueEn: '32 2 22 22 22', valueKa: '32 2 22 22 22' },

  // FOOTER
  { section: 'footer', key: 'ctaTitle', valueEn: 'Ready to Transform Your Vision?', valueKa: 'მზად ხართ თქვენი ხედვის გარდასაქმნელად?' },
  { section: 'footer', key: 'ctaDescription', valueEn: "Let's discuss your next project and create something extraordinary together.", valueKa: 'განვიხილოთ თქვენი შემდეგი პროექტი და ერთად შევქმნათ რაღაც განსაკუთრებული.' },
  { section: 'footer', key: 'description', valueEn: 'Architectural studio specializing in modern architectural and urban solutions.', valueKa: 'არქიტექტურული სტუდია, რომელიც სპეციალიზირებულია თანამედროვე არქიტექტურულ და ურბანულ გადაწყვეტილებებში.' },
];

async function main() {
  console.log('Seeding site content...');

  for (const item of content) {
    await prisma.siteContent.upsert({
      where: { section_key: { section: item.section, key: item.key } },
      update: { valueKa: item.valueKa, valueEn: item.valueEn },
      create: {
        section: item.section,
        key: item.key,
        valueKa: item.valueKa,
        valueEn: item.valueEn,
      },
    });
    console.log(`  ✓ ${item.section}.${item.key}`);
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
