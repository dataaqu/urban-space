export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'navigation' });
  return {
    title: `${t('studio')} - URBAN SPACE`,
  };
}

export default async function StudioPage() {
  return (
    <div className="bg-white">
      {/* About Section */}
      <section className="px-8 md:px-[80px] pt-12 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left - Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-medium text-[#0A0A0A] mb-8">
              About Us
            </h2>
            <div className="space-y-5 text-[15px] text-[#333] leading-relaxed">
              <p>
                Urban Space is an architecture and urban planning studio based in Tbilisi, founded in 2012.
              </p>
              <p>
                The studio works on residential, public, and large-scale urban projects in Tbilisi and across Georgia.
              </p>
              <p>
                Since 2012, the studio has developed over 100 urban and architectural projects.
              </p>
              <p>
                Our practice is centered on understanding the context, clear spatial organization, and creating long-term urban and architectural value.
              </p>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src="/poto/about.jpeg"
              alt="Urban Space Team"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Expertise / Principles / Team */}
      <section className="px-8 md:px-[80px] pt-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Expertise */}
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-6">Expertise</h3>

            <h4 className="text-base font-semibold text-[#0A0A0A] mb-3">Urban Planning</h4>
            <ul className="space-y-1.5 text-[15px] text-[#333] mb-6">
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Master Plans – Tbilisi
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Detailed Development Plans – Regions
              </li>
            </ul>

            <h4 className="text-base font-semibold text-[#0A0A0A] mb-3">Architecture</h4>
            <ul className="space-y-1.5 text-[15px] text-[#333]">
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Residential and mixed-use complexes
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Commercial and hospitality buildings
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Public and educational facilities
              </li>
            </ul>
          </div>

          {/* Principles */}
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-6">Principles</h3>
            <ul className="space-y-2 text-[15px] text-[#333] mb-8">
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Context-based design
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Long-term urban and architectural value
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Human scale and spatial quality
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-[#333] shrink-0" />
                Sustainable and thoughtful design processes
              </li>
            </ul>

            <p className="text-[15px] text-[#666] italic leading-relaxed">
              Well-thought-out architecture increases the value of a building over time.
            </p>
          </div>

          {/* Team */}
          <div>
            <h3 className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-6">Team</h3>
            <p className="text-[15px] text-[#333] leading-relaxed mb-8">
              The studio is led by experienced architects Mariam Ephremidze and Luka Kikiani. Our team includes specialists from various disciplines, working integrally through all stages of the project.
            </p>

            <div>
              <p className="text-base font-semibold text-[#0A0A0A]">
                Mariam Ephremidze &nbsp;&nbsp;&nbsp; Luka Kikiani
              </p>
              <p className="text-sm text-[#666] mt-1">Principal Architects</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
