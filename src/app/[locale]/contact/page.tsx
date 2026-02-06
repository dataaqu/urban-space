import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/ui/Breadcrumbs';
import ContactForm from '@/components/contact/ContactForm';
import GoogleMap from '@/components/contact/GoogleMap';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: `${t('title')} - URBAN SPACE`,
  };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: t('info.address'),
      value: 'Tbilisi, Georgia',
      href: null,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: t('info.email'),
      value: 'info@urbanspace.ge',
      href: 'mailto:info@urbanspace.ge',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: t('info.phone'),
      value: '+995 XXX XXX XXX',
      href: 'tel:+995XXXXXXXXX',
    },
  ];

  const officeHours = [
    { day: t('hours.weekdays') || 'Monday - Friday', hours: '10:00 - 19:00' },
    { day: t('hours.saturday') || 'Saturday', hours: '11:00 - 16:00' },
    { day: t('hours.sunday') || 'Sunday', hours: t('hours.closed') || 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-accent-50">
      {/* Page Header */}
      <PageHeader
        title={t('title')}
        description={t('subtitle') || 'We\'d love to hear from you. Let\'s discuss your project.'}
        breadcrumbs={[{ label: t('title') }]}
        variant="dark"
      />

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
                <h2 className="font-display text-2xl font-bold text-secondary-900 mb-2">
                  {t('form.title') || 'Send us a message'}
                </h2>
                <p className="text-secondary-500 mb-8">
                  {t('form.description') || 'Fill out the form below and we\'ll get back to you within 24 hours.'}
                </p>
                <ContactForm />
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Details Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="font-display text-xl font-semibold text-secondary-900 mb-6">
                  {t('info.title') || 'Contact Information'}
                </h3>

                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-50 text-primary-500 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm text-secondary-400 mb-1">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-secondary-900 hover:text-primary-600 transition-colors link-underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-secondary-900">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="divider-gold my-8" />

                {/* Office Hours */}
                <h4 className="font-semibold text-secondary-900 mb-4">
                  {t('hours.title') || 'Office Hours'}
                </h4>
                <div className="space-y-3">
                  {officeHours.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-secondary-500">{item.day}</span>
                      <span className="text-secondary-900 font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-secondary-100">
                  <p className="text-sm text-secondary-400 mb-4">{t('social') || 'Follow Us'}</p>
                  <div className="flex gap-3">
                    {['Facebook', 'Instagram', 'LinkedIn'].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary-100 text-secondary-500 hover:bg-primary-500 hover:text-white transition-all duration-300"
                        aria-label={social}
                      >
                        {social === 'Facebook' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        )}
                        {social === 'Instagram' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                          </svg>
                        )}
                        {social === 'LinkedIn' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden shadow-lg">
                <GoogleMap />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
