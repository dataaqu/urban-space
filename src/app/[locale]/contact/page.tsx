export const revalidate = 3600;

import { getLocale, getTranslations } from 'next-intl/server';
import GoogleMap from '@/components/contact/GoogleMap';
import { getContentMap } from '@/lib/content';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: `${t('title')} - URBAN SPACE`,
  };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations('contact');
  const content = await getContentMap('contact');

  const text = (key: string, fallback: string) => {
    const dbVal = content[key]?.[locale as 'ka' | 'en'];
    if (dbVal) return dbVal;
    return fallback;
  };

  const email = text('info.email', 'info@urbanspace.ge');
  const phone = text('info.phone', '+995 32 2 22 22 22');
  const address = text('info.address', 'Niko Nikoladze St. 5, Tbilisi');
  const infoLabel = text('info.label', 'Info');
  const followLabel = text('follow.label', 'Follow Us');
  const facebookUrl = text('follow.facebook', '#');
  const instagramUrl = text('follow.instagram', '#');
  const linkedinUrl = text('follow.linkedin', '#');
  const officeLabel = text('office.label', 'Office Location');
  const officeAddress = text('office.address', address);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=41.7151,44.8271`;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-8 md:px-[60px] lg:px-[80px] xl:px-[100px] 2xl:px-[140px] py-16 lg:py-20 xl:py-24 2xl:py-28">
        <div className="flex flex-col-reverse lg:flex-row">

          {/* Left Column — Contact Info */}
          <div className="w-full lg:w-[50%] flex-shrink-0 mt-12 lg:mt-0">
            <p className="text-[17px] xl:text-[19px] 2xl:text-[21px] text-[#555] leading-relaxed mb-12 xl:mb-14 2xl:mb-16">
              {text('subtitle', t('subtitle'))}
            </p>

            {/* Info Section */}
            <div className="mb-10 xl:mb-12 2xl:mb-14">
              <h3 className="text-[13px] xl:text-[14px] 2xl:text-[15px] font-medium tracking-[0.2em] uppercase text-[#444] mb-2">
                {infoLabel}
              </h3>
              <div className="w-8 xl:w-10 2xl:w-12 h-[2px] bg-[#999] mb-8 xl:mb-10" />
              <div className="space-y-7 xl:space-y-8 2xl:space-y-9">
                <div className="flex items-center gap-4 xl:gap-5">
                  <svg className="w-[22px] h-[22px] xl:w-[24px] xl:h-[24px] 2xl:w-[26px] 2xl:h-[26px] text-[#777] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="text-[17px] xl:text-[19px] 2xl:text-[21px] text-[#333]">{address}</span>
                </div>

                <div className="flex items-center gap-4 xl:gap-5">
                  <svg className="w-[22px] h-[22px] xl:w-[24px] xl:h-[24px] 2xl:w-[26px] 2xl:h-[26px] text-[#777] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <a href={`mailto:${email}`} className="text-[17px] xl:text-[19px] 2xl:text-[21px] text-[#333] hover:text-black transition-colors">
                    {email}
                  </a>
                </div>

                <div className="flex items-center gap-4 xl:gap-5">
                  <svg className="w-[22px] h-[22px] xl:w-[24px] xl:h-[24px] 2xl:w-[26px] 2xl:h-[26px] text-[#777] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <a href={`tel:${phone}`} className="text-[17px] xl:text-[19px] 2xl:text-[21px] text-[#333] hover:text-black transition-colors">
                    {phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Follow Us */}
            <div className="pt-8 xl:pt-10 mb-10 xl:mb-12 2xl:mb-14">
              <h3 className="text-[13px] xl:text-[14px] 2xl:text-[15px] font-medium tracking-[0.2em] uppercase text-[#444] mb-2">
                {followLabel}
              </h3>
              <div className="w-8 xl:w-10 2xl:w-12 h-[2px] bg-[#999] mb-8 xl:mb-10" />
              <div className="flex items-center gap-8 xl:gap-10 2xl:gap-12">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 xl:gap-3 text-[#555] hover:text-black transition-colors">
                  <svg className="w-[18px] h-[18px] xl:w-[20px] xl:h-[20px] 2xl:w-[22px] 2xl:h-[22px]" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                  <span className="text-[15px] xl:text-[17px] 2xl:text-[19px]">Facebook</span>
                </a>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 xl:gap-3 text-[#555] hover:text-black transition-colors">
                  <svg className="w-[18px] h-[18px] xl:w-[20px] xl:h-[20px] 2xl:w-[22px] 2xl:h-[22px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
                  <span className="text-[15px] xl:text-[17px] 2xl:text-[19px]">Instagram</span>
                </a>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 xl:gap-3 text-[#555] hover:text-black transition-colors">
                  <svg className="w-[18px] h-[18px] xl:w-[20px] xl:h-[20px] 2xl:w-[22px] 2xl:h-[22px]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  <span className="text-[15px] xl:text-[17px] 2xl:text-[19px]">LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Office Location */}
            <div className="pt-8 xl:pt-10">
              <h3 className="text-[13px] xl:text-[14px] 2xl:text-[15px] font-medium tracking-[0.2em] uppercase text-[#444] mb-2">
                {officeLabel}
              </h3>
              <div className="w-8 xl:w-10 2xl:w-12 h-[2px] bg-[#999] mb-6 xl:mb-8" />
              <p className="text-[17px] xl:text-[19px] 2xl:text-[21px] text-[#333]">{officeAddress}</p>
            </div>
          </div>

          {/* Gap */}
          <div className="hidden lg:block lg:w-[10%]" />

          {/* Right Column — Map */}
          <div className="w-full lg:w-[40%] flex flex-col">
            <div className="mb-4 xl:mb-5">
              <p className="text-[15px] xl:text-[17px] 2xl:text-[19px] font-semibold text-[#0A0A0A]">URBAN SPACE</p>
              <p className="text-[13px] xl:text-[14px] 2xl:text-[15px] text-[#666] mt-0.5">{officeAddress}</p>
            </div>

            <div className="h-[300px] lg:flex-1 lg:min-h-[350px] xl:min-h-[420px] 2xl:min-h-[480px]">
              <GoogleMap />
            </div>

            <div className="flex items-center justify-between mt-3 xl:mt-4">
              <span className="text-[12px] xl:text-[13px] 2xl:text-[14px] text-[#666]">
                {email} | {phone}
              </span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] xl:text-[13px] 2xl:text-[14px] text-[#666] underline hover:text-black transition-colors"
              >
                View on Google Maps
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
