import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'studio.principles' });

  return {
    title: `${t('title')} - URBAN SPACE`,
  };
}

export default async function PrinciplesPage() {
  const t = await getTranslations('studio.principles');

  const principles = [
    {
      title: 'Sustainability',
      titleKa: 'მდგრადობა',
      description: 'We design with environmental responsibility in mind, creating spaces that minimize ecological impact.',
      descriptionKa: 'ჩვენ ვქმნით გარემოზე პასუხისმგებლობით, ვაპროექტებთ სივრცეებს მინიმალური ეკოლოგიური ზემოქმედებით.',
    },
    {
      title: 'Innovation',
      titleKa: 'ინოვაცია',
      description: 'Embracing new technologies and methodologies to push the boundaries of architectural design.',
      descriptionKa: 'ახალი ტექნოლოგიებისა და მეთოდოლოგიების გამოყენება არქიტექტურული დიზაინის საზღვრების გასაფართოებლად.',
    },
    {
      title: 'Functionality',
      titleKa: 'ფუნქციონალურობა',
      description: 'Every space is designed with its intended use in mind, balancing aesthetics with practicality.',
      descriptionKa: 'ყოველი სივრცე შექმნილია მისი დანიშნულების გათვალისწინებით, ესთეტიკისა და პრაქტიკულობის ბალანსით.',
    },
    {
      title: 'Context',
      titleKa: 'კონტექსტი',
      description: 'Our designs respect and respond to their surroundings, enhancing the urban fabric.',
      descriptionKa: 'ჩვენი დიზაინი პატივს სცემს გარემოს და პასუხობს მას, აუმჯობესებს ურბანულ ქსოვილს.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4 text-center">
          {t('title')}
        </h1>
        <p className="text-xl text-secondary-600 mb-12 text-center max-w-2xl mx-auto">
          {t('description')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="bg-secondary-50 rounded-lg p-8 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {principle.title}
              </h3>
              <p className="text-secondary-600">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
