import type { Metadata } from 'next';
import { LegalPageLayout } from '../../components/legal/LegalPageLayout';
import { LegalSection } from '../../components/legal/LegalSection';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../../data/hamperQueenCatalog';

export const metadata: Metadata = {
  title: 'End-User Licence Agreement (EULA) | Hamper Queen',
  description:
    'The end-user licence terms for the interactive Hamper Queen atelier tools, online builder and related digital features on hamper-queen.vercel.app.',
  alternates: { canonical: '/eula' },
  openGraph: {
    title: 'End-User Licence Agreement (EULA) | Hamper Queen',
    description: 'Licence terms for the interactive Hamper Queen atelier tools and digital features.',
    url: 'https://hamper-queen.vercel.app/eula',
  },
};

export default function EulaPage() {
  const { phone, phoneDisplay, email } = HAMPER_QUEEN_OFFICIAL_CONTACT;

  return (
    <LegalPageLayout title="End-User Licence Agreement" updatedOn="22 September 2026">
      <LegalSection title="1. Scope of this agreement">
        <p>
          This End-User Licence Agreement ("EULA") covers the digital features of the Hamper Queen website, including
          the interactive 3D gift box viewer, the custom hamper builder/atelier, the item catalog and any other
          software components used to browse or configure your hamper online.
        </p>
      </LegalSection>

      <LegalSection title="2. Grant of licence">
        <p>
          Subject to your compliance with these terms, Hamper Queen grants you a personal, non-exclusive,
          non-transferable, revocable licence to use the website and its digital features for your own gifting needs.
          This licence does not grant you any ownership in the software or its content.
        </p>
      </LegalSection>

      <LegalSection title="3. Restrictions">
        <p>
          You agree not to copy, modify, reverse-engineer, scrape, resell or republish the website, its design, item
          names, images or software, nor to use automated tools to extract data at scale. Hamper Queen's name, logo,
          imagery and product styling are protected material and may not be reused without prior written consent.
        </p>
      </LegalSection>

      <LegalSection title="4. Interactive tools provide estimates">
        <p>
          The atelier builder, 3D viewer and price hints are design aids for planning purposes. The final hamper
          contents, price and delivery are confirmed only when our team personally reviews and confirms your order -
          the digital tools alone do not create a binding order.
        </p>
      </LegalSection>

      <LegalSection title="5. Acceptable use">
        <p>
          You must not use the website for any unlawful purpose, to transmit malicious content, or to interfere with
          the availability of the site for other users. We may suspend access in the event of misuse.
        </p>
      </LegalSection>

      <LegalSection title="6. Availability and disclaimers">
        <p>
          The website and its digital features are provided on an "as is" and "as available" basis without warranties
          of any kind. We work to keep the site reliable, but do not guarantee uninterrupted or error-free
          availability.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Hamper Queen shall not be liable for any direct, indirect,
          incidental or consequential loss arising from your use of, or inability to use, the website and its digital
          features. This limitation does not affect your consumer rights for the physical hamper products themselves.
        </p>
      </LegalSection>

      <LegalSection title="8. Governing law and jurisdiction">
        <p>
          This EULA is governed by the laws of India. Any dispute arising from the digital features shall be subject
          to the exclusive jurisdiction of the courts at <strong>Mumbai, Maharashtra, India</strong>.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact us">
        <p>
          For questions about this EULA, contact us at WhatsApp/call <strong>{phoneDisplay}</strong> or email{' '}
          <a href={`mailto:${email}`} className="text-[#8C6821] underline underline-offset-2">
            {email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}