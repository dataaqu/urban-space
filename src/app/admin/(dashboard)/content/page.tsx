'use client';

import { useState, useEffect } from 'react';
import { Save, FileText, Home, Building2, Phone } from 'lucide-react';
import {
  Button,
  Card,
  PageHeader,
  Skeleton,
  Textarea,
  useToast,
} from '@/components/admin/ui';

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
    icon: Home,
    fields: [
      { key: 'featured.badge', label: 'Selected Work - ეპიგრაფი (badge)', defaultKa: 'შერჩეული ნამუშევრები', defaultEn: 'Featured Work' },
      { key: 'featured.title', label: 'Selected Work - სათაური', defaultKa: 'არჩეული ნამუშევრები', defaultEn: 'Selected work' },
    ],
  },
  {
    id: 'studio',
    label: 'სტუდია',
    icon: Building2,
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
    icon: Phone,
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
  const toast = useToast();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((res) => res.json())
      .then((data) => {
        const dbItems: ContentItem[] = Array.isArray(data) ? data : [];
        const merged: ContentItem[] = [];
        for (const section of SECTIONS) {
          for (const field of section.fields) {
            const existing = dbItems.find(
              (i) => i.section === section.id && i.key === field.key,
            );
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

  const setValue = (
    section: string,
    key: string,
    lang: 'ka' | 'en',
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((i) =>
        i.section === section && i.key === key
          ? { ...i, [lang === 'ka' ? 'valueKa' : 'valueEn']: value }
          : i,
      ),
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
        toast.success('ცვლილებები შენახულია');
      } else {
        toast.error('შენახვა ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const currentSection = SECTIONS.find((s) => s.id === activeSection);

  return (
    <div>
      <PageHeader
        title="კონტენტის მართვა"
        description="ტექსტური ბლოკების რედაქტირება ქართულ და ინგლისურ ენაზე."
        breadcrumbs={[{ label: 'კონტენტი' }]}
        actions={
          !loading ? (
            <Button
              leftIcon={<Save className="h-4 w-4" />}
              onClick={handleSave}
              loading={saving}
            >
              შენახვა
            </Button>
          ) : null
        }
      />

      {/* Tabs */}
      <div className="mb-6 border-b border-neutral-200">
        <nav className="flex gap-1 -mb-px overflow-x-auto" role="tablist">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const active = activeSection === section.id;
            return (
              <button
                key={section.id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveSection(section.id)}
                className={`group inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-primary-600 text-dark-900'
                    : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-dark-800'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active
                      ? 'text-primary-600'
                      : 'text-neutral-400 group-hover:text-neutral-600'
                  }`}
                />
                {section.label}
              </button>
            );
          })}
        </nav>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <Card key={i} padded>
              <Skeleton className="h-4 w-1/4 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        currentSection && (
          <div className="space-y-4">
            {currentSection.fields.map((field) => (
              <Card key={field.key} padded>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <label className="text-sm font-semibold text-dark-900">
                    {field.label}
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-100">
                    {field.key}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                        ქართული
                      </span>
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] bg-primary-100 text-[9px] font-bold text-primary-800">
                        KA
                      </span>
                    </div>
                    <Textarea
                      value={getValue(currentSection.id, field.key, 'ka')}
                      onChange={(e) =>
                        setValue(
                          currentSection.id,
                          field.key,
                          'ka',
                          e.target.value,
                        )
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                        English
                      </span>
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] bg-neutral-200 text-[9px] font-bold text-dark-800">
                        EN
                      </span>
                    </div>
                    <Textarea
                      value={getValue(currentSection.id, field.key, 'en')}
                      onChange={(e) =>
                        setValue(
                          currentSection.id,
                          field.key,
                          'en',
                          e.target.value,
                        )
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </Card>
            ))}
            <div className="flex justify-end pt-2">
              <Button
                leftIcon={<Save className="h-4 w-4" />}
                onClick={handleSave}
                loading={saving}
              >
                შენახვა
              </Button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
