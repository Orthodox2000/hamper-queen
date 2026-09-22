import type { Metadata } from 'next';
import { LegalPageLayout } from '../../components/legal/LegalPageLayout';
import { LegalSection } from '../../components/legal/LegalSection';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../../data/hamperQueenCatalog';

export const metadata: Metadata = {
  title: 'Privacy Policy | Hamper Queen',
  description:
    'How Hamper Queen collects, uses and protects your personal data when you book a custom hamper, contact us or browse our website.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | Hamper Queen',
    description: 'How Hamper Queen collects, uses and protects your personal data.',
    url: 'https://hamper-queen.vercel.app/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  const { phone, phoneDisplay, email } = HAMPER_QUEEN_OFFICIAL_CONTACT;

  return (
    <LegalPageLayout title="Privacy Policy" updatedOn="22 September 2026">
      <LegalSection title="1. Information we collect">
        <p>
          We collect only the information needed to serve you: your name, phone number, delivery address, order
          details, and any note or photo you choose to share for a personalised hamper. This is collected when you
          fill a booking form, message us on WhatsApp, call us, or email us.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use your information">
        <p>
          We use your information solely to confirm and fulfil your order, coordinate delivery, communicate updates,
          and answer your queries. We do not sell, rent or trade your personal data to any third party.
        </p>
      </LegalSection>

      <LegalSection title="3. Photos and personalisation">
        <p>
          Photos you share for personalised prints and keepsakes are used only to create the product you ordered. We
          do not publish them anywhere without your explicit consent.
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies and analytics">
        <p>
          Our website may use basic cookies and anonymised analytics to understand overall usage and improve the
          site. These statistics do not identify you personally. You can disable cookies in your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="5. Data retention and security">
        <p>
          We retain order records for as long as needed for accounting, tax and after-sales support. Access to your
          personal data is restricted to the boutique owners and is processed over secure, password-protected
          connections.
        </p>
      </LegalSection>

      <LegalSection title="6. Third-party links and WhatsApp">
        <p>
          Ordering via WhatsApp uses Meta's messaging platform and is subject to Meta's own privacy policy. Our
          website may link to Instagram and payment pages; their privacy practices are governed by those platforms.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>
          You may request a copy of the data we hold about you, ask us to correct it, or request deletion by
          contacting us. We will act on reasonable requests within 7 working days, subject to legal record-keeping
          requirements.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to this policy">
        <p>
          We may update this policy from time to time. The "Last updated" date at the top of this page will reflect
          the latest version. Continued use of our services after changes means you accept the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact us">
        <p>
          For privacy questions, contact us at WhatsApp/call <strong>{phoneDisplay}</strong> or email{' '}
          <a href={`mailto:${email}`} className="text-[#8C6821] underline underline-offset-2">
            {email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}