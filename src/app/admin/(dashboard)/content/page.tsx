'use client';

import { useState, useEffect } from 'react';

interface ContentItem {
  section: string;
  key: string;
  valueKa: string;
  valueEn: string;
}

const SECTIONS = [
  {
    id: 'home',
    label: 'მთავარი გვერდი',
    fields: [
      { key: 'featured.title', label: 'Selected Work - სათაური', defaultKa: 'არჩეული ნამუშევრები', defaultEn: 'Selected work' },
      { key: 'featured.subtitle', label: 'Selected Work - ქვესათაური', defaultKa: 'პროექტები, რომლებიც განსაზღვრავს ჩვენს პრაქტიკას', defaultEn: 'Projects defining our practice' },
    ],
  },
  {
    id: 'studio',
    label: 'სტუდია',
    fields: [
      { key: 'about.title', label: 'სათაური', defaultKa: 'ჩვენს შესახებ', defaultEn: 'About Us' },
      { key: 'about.description', label: 'აღწერა', defaultKa: 'Urban Space არის არქიტექტურული და ურბანული დაგეგმარების სტუდია, დაფუძნებული თბილისში, 2012 წელს.', defaultEn: 'Urban Space is an architecture and urban planning studio based in Tbilisi, founded in 2012.' },
      { key: 'about.paragraph1', label: 'პარაგრაფი 1', defaultKa: 'სტუდია მუშაობს საცხოვრებელ, საზოგადოებრივ და მსხვილმასშტაბიან ურბანულ პროექტებზე თბილისსა და საქართველოს მასშტაბით.', defaultEn: 'The studio works on residential, public, and large-scale urban projects in Tbilisi and across Georgia.' },
      { key: 'about.paragraph2', label: 'პარაგრაფი 2', defaultKa: '2012 წლიდან სტუდიამ 100-ზე მეტი ურბანული და არქიტექტურული პროექტი შეიმუშავა.', defaultEn: 'Since 2012, the studio has developed over 100 urban and architectural projects.' },
      { key: 'about.paragraph3', label: 'პარაგრაფი 3', defaultKa: 'ჩვენი პრაქტიკა ორიენტირებულია კონტექსტის გაგებაზე, სივრცის მკაფიო ორგანიზაციაზე და გრძელვადიანი ურბანული და არქიტექტურული ღირებულების შექმნაზე.', defaultEn: 'Our practice is centered on understanding the context, clear spatial organization, and creating long-term urban and architectural value.' },
      { key: 'expertise.title', label: 'ექსპერტიზა - სათაური', defaultKa: 'ექსპერტიზა', defaultEn: 'Expertise' },
      { key: 'expertise.urban.title', label: 'ურბანული - სათაური', defaultKa: 'ურბანული დაგეგმარება', defaultEn: 'Urban Planning' },
      { key: 'expertise.urban.items', label: 'ურბანული - ჩამონათვალი (ახალი ხაზით)', defaultKa: 'გენერალური გეგმები – თბილისი\nდეტალური განაშენიანების გეგმები – რეგიონები', defaultEn: 'Master Plans – Tbilisi\nDetailed Development Plans – Regions' },
      { key: 'expertise.arch.title', label: 'არქიტექტურა - სათაური', defaultKa: 'არქიტექტურა', defaultEn: 'Architecture' },
      { key: 'expertise.arch.items', label: 'არქიტექტურა - ჩამონათვალი (ახალი ხაზით)', defaultKa: 'საცხოვრებელი და შერეული დანიშნულების კომპლექსები\nკომერციული და სასტუმრო შენობები\nსაზოგადოებრივი და საგანმანათლებლო ობიექტები', defaultEn: 'Residential and mixed-use complexes\nCommercial and hospitality buildings\nPublic and educational facilities' },
      { key: 'principles.title', label: 'პრინციპები - სათაური', defaultKa: 'პრინციპები', defaultEn: 'Principles' },
      { key: 'principles.items', label: 'პრინციპები - ჩამონათვალი (ახალი ხაზით)', defaultKa: 'კონტექსტზე დაფუძნებული დიზაინი\nგრძელვადიანი ურბანული და არქიტექტურული ღირებულება\nადამიანური მასშტაბი და სივრცის ხარისხი\nმდგრადი და გააზრებული დაპროექტების პროცესები', defaultEn: 'Context-based design\nLong-term urban and architectural value\nHuman scale and spatial quality\nSustainable and thoughtful design processes' },
      { key: 'principles.quote', label: 'პრინციპები - ციტატა', defaultKa: 'გააზრებული არქიტექტურა დროთა განმავლობაში ზრდის შენობის ღირებულებას.', defaultEn: 'Well-thought-out architecture increases the value of a building over time.' },
      { key: 'team.title', label: 'გუნდი - სათაური', defaultKa: 'გუნდი', defaultEn: 'Team' },
      { key: 'team.description', label: 'გუნდი - აღწერა', defaultKa: 'სტუდიას ხელმძღვანელობენ გამოცდილი არქიტექტორები მარიამ ეფრემიძე და ლუკა კიკიანი. ჩვენი გუნდი მოიცავს სხვადასხვა დისციპლინის სპეციალისტებს, რომლებიც ინტეგრალურად მუშაობენ პროექტის ყველა ეტაპზე.', defaultEn: 'The studio is led by experienced architects Mariam Ephremidze and Luka Kikiani. Our team includes specialists from various disciplines, working integrally through all stages of the project.' },
      { key: 'team.leads', label: 'ლიდერები', defaultKa: 'მარიამ ეფრემიძე    ლუკა კიკიანი', defaultEn: 'Mariam Ephremidze    Luka Kikiani' },
      { key: 'team.leadsRole', label: 'ლიდერების პოზიცია', defaultKa: 'მთავარი არქიტექტორები', defaultEn: 'Principal Architects' },
    ],
  },
  {
    id: 'contact',
    label: 'კონტაქტი',
    fields: [
      { key: 'title', label: 'სათაური', defaultKa: 'კონტაქტი', defaultEn: 'Contact' },
      { key: 'subtitle', label: 'ქვესათაური', defaultKa: 'ჩვენ ღია ვართ თანამშრომლობისა და ახალი პროექტებისთვის.', defaultEn: 'We are open for collaboration and new projects.' },
      { key: 'info.address', label: 'მისამართი', defaultKa: 'ნიკო ნიკოლაძის ქ. 5, თბილისი', defaultEn: 'Niko Nikoladze St. 5, Tbilisi' },
      { key: 'info.email', label: 'ელ. ფოსტა', defaultKa: 'info@urbanspace.ge', defaultEn: 'info@urbanspace.ge' },
      { key: 'info.phone', label: 'ტელეფონი', defaultKa: '+995 32 2 22 22 22', defaultEn: '+995 32 2 22 22 22' },
      { key: 'info.label', label: 'ინფო სექციის სათაური', defaultKa: 'ინფო', defaultEn: 'Info' },
      { key: 'follow.label', label: 'Follow Us სათაური', defaultKa: 'გამოგვყევით', defaultEn: 'Follow Us' },
      { key: 'follow.facebook', label: 'Facebook URL', defaultKa: 'https://facebook.com/urbanspace', defaultEn: 'https://facebook.com/urbanspace' },
      { key: 'follow.instagram', label: 'Instagram URL', defaultKa: 'https://instagram.com/urbanspace', defaultEn: 'https://instagram.com/urbanspace' },
      { key: 'follow.linkedin', label: 'LinkedIn URL', defaultKa: 'https://linkedin.com/company/urbanspace', defaultEn: 'https://linkedin.com/company/urbanspace' },
      { key: 'office.label', label: 'Office Location სათაური', defaultKa: 'ოფისის მდებარეობა', defaultEn: 'Office Location' },
      { key: 'office.address', label: 'ოფისის მისამართი', defaultKa: 'ნიკო ნიკოლაძის ქ. 5, თბილისი', defaultEn: 'Niko Nikoladze St. 5, Tbilisi' },
    ],
  },
];

export default function ContentManagerPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        const dbItems: ContentItem[] = Array.isArray(data) ? data : [];

        // Merge defaults with DB values
        const merged: ContentItem[] = [];
        for (const section of SECTIONS) {
          for (const field of section.fields) {
            const existing = dbItems.find((i) => i.section === section.id && i.key === field.key);
            merged.push({
              section: section.id,
              key: field.key,
              valueKa: existing?.valueKa || field.defaultKa,
              valueEn: existing?.valueEn || field.defaultEn,
            });
          }
        }
        setItems(merged);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getValue = (section: string, key: string, lang: 'ka' | 'en') => {
    const item = items.find((i) => i.section === section && i.key === key);
    return lang === 'ka' ? item?.valueKa || '' : item?.valueEn || '';
  };

  const setValue = (section: string, key: string, lang: 'ka' | 'en', value: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.section === section && i.key === key
          ? { ...i, [lang === 'ka' ? 'valueKa' : 'valueEn']: value }
          : i
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const section = SECTIONS.find((s) => s.id === activeSection);
      if (!section) return;

      const sectionItems = section.fields.map((field) => ({
        section: section.id,
        key: field.key,
        valueKa: getValue(section.id, field.key, 'ka'),
        valueEn: getValue(section.id, field.key, 'en'),
      }));

      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: sectionItems }),
      });

      if (res.ok) {
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 2000);
      }
    } catch {
      alert('შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-secondary-500">იტვირთება...</div>;

  const currentSection = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">კონტენტის მართვა</h1>
        <div className="flex items-center gap-3">
          {savedMessage && (
            <span className="text-sm text-green-600">შენახულია!</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'შენახვა...' : 'შენახვა'}
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      {currentSection && (
        <div className="space-y-6">
          {currentSection.fields.map((field) => (
            <div key={field.key} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-secondary-900 mb-4">
                {field.label}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-secondary-400 mb-1">ქართული</label>
                  <textarea
                    value={getValue(currentSection.id, field.key, 'ka')}
                    onChange={(e) => setValue(currentSection.id, field.key, 'ka', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-secondary-400 mb-1">English</label>
                  <textarea
                    value={getValue(currentSection.id, field.key, 'en')}
                    onChange={(e) => setValue(currentSection.id, field.key, 'en', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
