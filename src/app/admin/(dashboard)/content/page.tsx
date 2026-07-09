'use client';

import { useState, useEffect } from 'react';
import { Save, Home, Building2 } from 'lucide-react';
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
      { key: 'hero.cta', label: 'Hero - ღილაკის ტექსტი', defaultKa: 'იხილე პროექტები', defaultEn: 'EXPLORE PROJECTS' },
      { key: 'featured.badge', label: 'Selected Work - ეპიგრაფი (badge)', defaultKa: 'შერჩეული ნამუშევრები', defaultEn: 'Featured Work' },
      { key: 'featured.title', label: 'Selected Work - სათაური', defaultKa: 'არჩეული ნამუშევრები', defaultEn: 'Selected work' },
    ],
  },
  {
    id: 'studio',
    label: 'ჩვენ შესახებ',
    icon: Building2,
    fields: [
      { key: 'about.title', label: 'ჩვენ შესახებ — სათაური', defaultKa: 'ჩვენს შესახებ', defaultEn: 'About Us' },
      { key: 'about.description', label: 'ჩვენ შესახებ — ტექსტი (აბზაცი = ცარიელი ხაზი)', rows: 10, defaultKa: 'Urban Space არის არქიტექტურული და ურბანული დაგეგმარების სტუდია, დაფუძნებული თბილისში, 2012 წელს.\n\nსტუდია მუშაობს საცხოვრებელ, საზოგადოებრივ და მსხვილმასშტაბიან ურბანულ პროექტებზე თბილისსა და საქართველოს მასშტაბით.\n\n2012 წლიდან სტუდიამ 100-ზე მეტი ურბანული და არქიტექტურული პროექტი შეიმუშავა.\n\nჩვენი პრაქტიკა ორიენტირებულია კონტექსტის გაგებაზე, სივრცის მკაფიო ორგანიზაციაზე და გრძელვადიანი ურბანული და არქიტექტურული ღირებულების შექმნაზე.', defaultEn: 'Urban Space is an architecture and urban planning studio based in Tbilisi, founded in 2012.\n\nThe studio works on residential, public, and large-scale urban projects in Tbilisi and across Georgia.\n\nSince 2012, the studio has developed about 100 urban and architectural projects.\n\nOur practice is centered on understanding the context, clear spatial organization, and creating long-term urban and architectural value.' },
      { key: 'expertise.title', label: 'სვეტი 1 — სათაური', defaultKa: 'ექსპერტიზა', defaultEn: 'Expertise' },
      { key: 'expertise.body', label: 'სვეტი 1 — ტექსტი (ჩააკოპირე მთლიანად)', rows: 12, defaultKa: 'ურბანული დაგეგმარება\nგენერალური გეგმები – თბილისი\nდეტალური განაშენიანების გეგმები – რეგიონები\n\nარქიტექტურა\nსაცხოვრებელი და შერეული დანიშნულების კომპლექსები\nკომერციული და სასტუმრო შენობები\nსაზოგადოებრივი და საგანმანათლებლო ობიექტები', defaultEn: 'Urban Planning\nMaster Plans – Tbilisi\nDetailed Development Plans – Regions\n\nArchitecture\nResidential and mixed-use complexes\nCommercial and hospitality buildings\nPublic and educational facilities' },
      { key: 'principles.title', label: 'სვეტი 2 — სათაური', defaultKa: 'პრინციპები', defaultEn: 'Principles' },
      { key: 'principles.body', label: 'სვეტი 2 — ტექსტი (ჩააკოპირე მთლიანად)', rows: 12, defaultKa: 'კონტექსტზე დაფუძნებული დიზაინი\nგრძელვადიანი ურბანული და არქიტექტურული ღირებულება\nადამიანური მასშტაბი და სივრცის ხარისხი\nმდგრადი და გააზრებული დაპროექტების პროცესები\n\nგააზრებული არქიტექტურა დროთა განმავლობაში ზრდის შენობის ღირებულებას.', defaultEn: 'Context-based design\nLong-term urban and architectural value\nHuman scale and spatial quality\nSustainable and thoughtful design processes\n\nWell-thought-out architecture increases the value of a building over time.' },
      { key: 'team.title', label: 'სვეტი 3 — სათაური', defaultKa: 'გუნდი', defaultEn: 'Team' },
      { key: 'team.body', label: 'სვეტი 3 — ტექსტი (ჩააკოპირე მთლიანად)', rows: 12, defaultKa: 'სტუდიას ხელმძღვანელობენ გამოცდილი არქიტექტორები მარიამ ეფრემიძე და ლუკა კიკიანი. ჩვენი გუნდი მოიცავს სხვადასხვა დისციპლინის სპეციალისტებს, რომლებიც ინტეგრალურად მუშაობენ პროექტის ყველა ეტაპზე.\n\nმარიამ ეფრემიძე    ლუკა კიკიანი\nმთავარი არქიტექტორები', defaultEn: 'The studio is led by experienced architects Mariam Ephremidze and Luka Kikiani. Our team includes specialists from various disciplines, working integrally through all stages of the project.\n\nMariam Ephremidze    Luka Kikiani\nPrincipal Architects' },
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
            // Studio fields may be intentionally left empty (hidden on the site),
            // so keep the raw DB value — never backfill the default, which the
            // shown placeholder communicates instead. Other sections still
            // prefill defaults as before.
            const keepEmpty = section.id === 'studio';
            merged.push({
              section: section.id,
              key: field.key,
              valueKa: keepEmpty ? existing?.valueKa ?? '' : existing?.valueKa || field.defaultKa,
              valueEn: keepEmpty ? existing?.valueEn ?? '' : existing?.valueEn || field.defaultEn,
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
            {currentSection.fields.map((field) => {
              const single = (field as { singleValue?: boolean }).singleValue;
              const fieldRows = (field as { rows?: number }).rows ?? 3;
              // Studio fields can be left blank (hidden on the site); show the
              // default only as a placeholder hint, not as a saved value.
              const showDefaultAsPlaceholder = currentSection.id === 'studio';
              return (
                <Card key={field.key} padded>
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <label className="text-sm font-semibold text-dark-900">
                      {field.label}
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-neutral-100">
                      {field.key}
                    </span>
                  </div>
                  {single ? (
                    <Textarea
                      value={getValue(currentSection.id, field.key, 'ka')}
                      onChange={(e) => {
                        setValue(currentSection.id, field.key, 'ka', e.target.value);
                        setValue(currentSection.id, field.key, 'en', e.target.value);
                      }}
                      rows={1}
                    />
                  ) : (
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
                          placeholder={showDefaultAsPlaceholder ? field.defaultKa : undefined}
                          onChange={(e) =>
                            setValue(
                              currentSection.id,
                              field.key,
                              'ka',
                              e.target.value,
                            )
                          }
                          rows={fieldRows}
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
                          placeholder={showDefaultAsPlaceholder ? field.defaultEn : undefined}
                          onChange={(e) =>
                            setValue(
                              currentSection.id,
                              field.key,
                              'en',
                              e.target.value,
                            )
                          }
                          rows={fieldRows}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
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
