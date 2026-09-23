import type { Metadata } from 'next';
import { LegalPageLayout } from '../../components/legal/LegalPageLayout';
import { LegalSection } from '../../components/legal/LegalSection';
import { HAMPER_QUEEN_OFFICIAL_CONTACT } from '../../data/hamperQueenCatalog';

export const metadata: Metadata = {
  title: 'Terms of Service | Hamper Queen',
  description:
    'Ordering, payment, delivery, returns and liability terms for custom gift hampers, chocolate bouquets and gift boxes from Hamper Queen, Mumbai.',
  alternates: { canonical: '/terms-of-service' },
  openGraph: {
    title: 'Terms of Service | Hamper Queen',
    description: 'Ordering, payment, delivery, returns and liability terms for Hamper Queen hampers and bouquets.',
    url: 'https://hamper-queen.vercel.app/terms-of-service',
  },
};

export default function TermsOfServicePage() {
  const { phone, phoneDisplay, email } = HAMPER_QUEEN_OFFICIAL_CONTACT;

  return (
    <LegalPageLayout title="Terms of Service" updatedOn="22 September 2026">
      <LegalSection title="1. About these terms">
        <p>
          These Terms of Service ("Terms") govern your use of the Hamper Queen website and any order you place with
          us for handcrafted gift hampers, chocolate bouquets, gift boxes and related gifting services. By placing an
          order or using this website, you agree to be bound by these Terms.
        </p>
        <p>
          Hamper Queen is operated by <strong>Ms. Supriya Khandekar</strong>, a homegrown gifting boutique based in
          Mumbai, Maharashtra, India.
        </p>
      </LegalSection>

      <LegalSection title="2. Products and pricing">
        <p>
          All product descriptions, approximate prices and "What is Present" item lists are published in good faith and
          may change without prior notice. Approx prices are indicative; the final price depends on selection,
          customisation, size and delivery location. You will always be given the final price before we confirm your
          order.
        </p>
        <p>
          Minor variations in chocolates, flowers, prints and packing materials are normal since every hamper is
          handcrafted and may be substituted with an equivalent or better item at our discretion when the exact product
          is not available.
        </p>
      </LegalSection>

      <LegalSection title="3. Orders and payments">
        <p>
          Orders are confirmed only after payment (advance or full) is received and you receive a confirmation over
          WhatsApp or by phone. Payment is accepted via UPI, bank transfer or the payment options shared during
          booking. We never ask for card payments over email.
        </p>
      </LegalSection>

      <LegalSection title="4. Delivery">
        <p>
          We dispatch within Mumbai and across Indian pin codes. Same-day or next-day dispatch is offered for most
          hampers but depends on stock, order time and location. Delivery timelines are estimates, not guarantees.
          Free delivery above the amount shown on the website at the time of booking.
        </p>
      </LegalSection>

      <LegalSection title="5. Returns, cancellations and replacements">
        <p>
          Because hampers are handcrafted and perishable, we do not offer cancellations once production has begun.
          If the delivered hamper arrives damaged, is missing items, or does not match the confirmed order, contact us
          within 48 hours of delivery with a photo or video. We will replace the hamper or refund the amount, at our
          discretion.
        </p>
      </LegalSection>

      <LegalSection title="6. Your responsibilities">
        <p>
          You are responsible for providing correct delivery address, recipient name and phone number. We are not
          liable for failed deliveries caused by an incorrect address or by the recipient not being available.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation of liability">
        <p>
          To the maximum extent permitted by law, our total liability in connection with any order is limited to the
          amount you paid for that order. We are not liable for indirect losses including loss of profits, goodwill or
          sentimental value of a delayed or missed occasion.
        </p>
      </LegalSection>

      <LegalSection title="8. Governing law and jurisdiction">
        <p>
          These Terms are governed by the laws of India. Any dispute shall be subject to the exclusive jurisdiction of
          the courts at <strong>Mumbai, Maharashtra, India</strong>.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact us">
        <p>
          For any question about these Terms, reach us at WhatsApp/call <strong>{phoneDisplay}</strong> or email{' '}
          <a href={`mailto:${email}`} className="text-[#8C6821] underline underline-offset-2">
            {email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}