import React from 'react'
import PageHeader from '@/components/common/PageHeader'
import Container from '@/components/Container/Container'
import { Typography } from '@/components/ui/Typography'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

const sections = [
  {
    title: '1. About Crystal Wall Art',
    content: (
      <>
        <Typography variant="body">
          Crystal Wall Art specializes in premium personalized wall décor products including Acrylic UV Prints, Wall Art, Canvas Prints, Spiritual Artwork, and Photo Restoration Services.
        </Typography>
        <Typography variant="body" className="mt-4">
          By using our website, you agree to these Terms & Conditions and all applicable laws and regulations.
        </Typography>
      </>
    ),
  },
  {
    title: '2. Eligibility',
    content: (
      <div className="space-y-3">
        <Typography variant="body">By using this website, you confirm that:</Typography>
        <ul className="space-y-2 text-slate-700 leading-7 pl-5">
          <li className="list-disc">
            <Typography variant="body">You are at least 18 years of age or using the website under parental supervision.</Typography>
          </li>
          <li className="list-disc">
            <Typography variant="body">The information provided by you is accurate and complete.</Typography>
          </li>
          <li className="list-disc">
            <Typography variant="body">You are legally authorized to purchase products and use our services.</Typography>
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: '3. Customized Product Policy',
    content: (
      <div className="space-y-3">
        <Typography variant="body">
          All Crystal Wall Art products are customized based on customer-provided photographs, artwork, text, or design instructions.
        </Typography>
        <Typography variant="body">Because every product is made specifically for each customer:</Typography>
        <ul className="space-y-2 text-slate-700 leading-7 pl-5">
          <li className="list-disc">
            <Typography variant="body">Product appearance may vary slightly from on-screen previews.</Typography>
          </li>
          <li className="list-disc">
            <Typography variant="body">Minor variations in color, brightness, contrast, and print output are normal.</Typography>
          </li>
          <li className="list-disc">
            <Typography variant="body">Customized products cannot be resold to another customer.</Typography>
          </li>
        </ul>
        <Typography variant="body">
          Customers are responsible for reviewing all information provided before confirming an order.
        </Typography>
      </div>
    ),
  },
  {
    title: '4. Photo Upload & Ownership Policy',
    content: (
      <div className="space-y-3">
        <Typography variant="body">
          By uploading any image, photograph, artwork, logo, or content to Crystal Wall Art, you confirm that:
        </Typography>
        <ul className="space-y-2 text-slate-700 leading-7 pl-5">
          <li className="list-disc">
            <Typography variant="body">You own the content; or</Typography>
          </li>
          <li className="list-disc">
            <Typography variant="body">You have obtained permission from the rightful owner.</Typography>
          </li>
        </ul>
        <Typography variant="body">You may not upload:</Typography>
        <ul className="space-y-2 text-slate-700 leading-7 pl-5">
          <li className="list-disc">
            <Typography variant="body">Copyright-protected content without authorization.</Typography>
          </li>
          <li className="list-disc">
            <Typography variant="body">Celebrity photographs without proper rights.</Typography>
          </li>
          <li className="list-disc">
            <Typography variant="body">Illegal, offensive, hateful, or harmful content.</Typography>
          </li>
          <li className="list-disc">
            <Typography variant="body">Content that violates any applicable laws.</Typography>
          </li>
        </ul>
        <Typography variant="body">
          Crystal Wall Art reserves the right to reject any order that violates these conditions. No refund will be issued for rejected orders involving unauthorized copyrighted material.
        </Typography>
      </div>
    ),
  },
  {
    title: '5. Design, Editing & Approval',
    content: (
      <div className="space-y-3">
        <Typography variant="body">Crystal Wall Art may provide:</Typography>
        <ul className="space-y-2 text-slate-700 leading-7 pl-5">
          <li className="list-disc"><Typography variant="body">Design enhancement</Typography></li>
          <li className="list-disc"><Typography variant="body">Background correction</Typography></li>
          <li className="list-disc"><Typography variant="body">Photo restoration</Typography></li>
          <li className="list-disc"><Typography variant="body">Image improvement</Typography></li>
          <li className="list-disc"><Typography variant="body">Color correction</Typography></li>
          <li className="list-disc"><Typography variant="body">Custom design services</Typography></li>
        </ul>
        <Typography variant="body">
          Customers are responsible for reviewing any design preview provided before production. Once customer approval is received and production begins, design-related changes may not be possible and additional modification charges may apply.
        </Typography>
      </div>
    ),
  },
  {
    title: '6. Photo Restoration Disclaimer',
    content: (
      <div className="space-y-3">
        <Typography variant="body">
          Photo restoration and enhancement services are performed using professional editing techniques.
        </Typography>
        <Typography variant="body">However:</Typography>
        <ul className="space-y-2 text-slate-700 leading-7 pl-5">
          <li className="list-disc"><Typography variant="body">Final results depend on the quality of the original image.</Typography></li>
          <li className="list-disc"><Typography variant="body">Extremely damaged or low-resolution photos may have limitations.</Typography></li>
          <li className="list-disc"><Typography variant="body">Crystal Wall Art does not guarantee restoration of missing details that do not exist in the original image.</Typography></li>
        </ul>
      </div>
    ),
  },
  {
    title: '7. Religious & Spiritual Artwork Policy',
    content: (
      <div className="space-y-3">
        <Typography variant="body">
          Crystal Wall Art proudly serves customers from diverse cultures, communities, and faiths. We create customized spiritual and religious artwork according to customer preferences.
        </Typography>
        <Typography variant="body">However, we reserve the right to refuse:</Typography>
        <ul className="space-y-2 text-slate-700 leading-7 pl-5">
          <li className="list-disc"><Typography variant="body">Content promoting hatred.</Typography></li>
          <li className="list-disc"><Typography variant="body">Offensive religious material.</Typography></li>
          <li className="list-disc"><Typography variant="body">Defamatory or discriminatory content.</Typography></li>
          <li className="list-disc"><Typography variant="body">Content that may create social, legal, or ethical concerns.</Typography></li>
        </ul>
      </div>
    ),
  },
  {
    title: '8. Pricing & Payments',
    content: (
      <div className="space-y-3">
        <Typography variant="body">All prices displayed on our website are subject to change without prior notice. We reserve the right to correct pricing errors, cancel incorrectly priced orders, and modify product pricing at any time.</Typography>
        <Typography variant="body">Orders will be processed only after successful payment confirmation.</Typography>
      </div>
    ),
  },
  {
    title: '9. Production Timeline',
    content: (
      <div className="space-y-3">
        <Typography variant="body">Production begins only after order confirmation, payment verification, and design approval (where applicable). Production timelines may vary depending on product type, order quantity, customization requirements, seasonal demand, and estimated production times are approximate and not guaranteed.</Typography>
      </div>
    ),
  },
  {
    title: '10. Shipping & Delivery',
    content: (
      <div className="space-y-3">
        <Typography variant="body">Crystal Wall Art delivers across Kerala, India, and international destinations. Delivery timelines depend on customer location, courier partner availability, weather conditions, public holidays, and customs clearance for international shipments.</Typography>
        <Typography variant="body">While we strive for timely delivery, delays caused by courier companies or external factors are beyond our control.</Typography>
      </div>
    ),
  },
  {
    title: '11. Product Damage During Transit',
    content: (
      <div className="space-y-3">
        <Typography variant="body">If a product arrives damaged, customers must notify us within 48 hours of delivery. The claim must include an unboxing video, product photographs, and packaging photographs. Failure to provide required evidence may affect replacement eligibility.</Typography>
        <Typography variant="body">Approved claims may qualify for replacement, reprint, partial or full resolution at our discretion.</Typography>
      </div>
    ),
  },
  {
    title: '12. Cancellation Policy',
    content: (
      <div className="space-y-3">
        <Typography variant="body">Orders may be cancelled only before production begins. Once design work is completed or production has started, the order may not be cancelled. Customized products are generally non-refundable.</Typography>
      </div>
    ),
  },
  {
    title: '13. Returns & Refunds',
    content: (
      <div className="space-y-3">
        <Typography variant="body">Because our products are personalized and custom-made, returns are accepted only for manufacturing defects, incorrect product delivery, and approved transit damage claims.</Typography>
        <Typography variant="body">Refunds are not available for customer-approved designs, incorrect information provided by customers, low-quality original photographs, color variations within normal printing standards, or personal preference changes.</Typography>
      </div>
    ),
  },
  {
    title: '14. Privacy & Photo Security',
    content: (
      <div className="space-y-3">
        <Typography variant="body">Customer privacy is important to us. Uploaded photographs and personal information are handled securely and used solely for order processing, design creation, customer support, and production requirements.</Typography>
        <Typography variant="body">We do not sell customer data to third parties. Customer images may be permanently deleted from our systems after project completion and operational retention periods.</Typography>
      </div>
    ),
  },
  {
    title: '15. Intellectual Property',
    content: (
      <Typography variant="body">All website content including logos, product images, designs, graphics, text, and branding elements are the intellectual property of Crystal Wall Art. Unauthorized reproduction, copying, distribution, or commercial use is prohibited.</Typography>
    ),
  },
  {
    title: '16. Limitation of Liability',
    content: (
      <Typography variant="body">Crystal Wall Art shall not be liable for indirect losses, consequential damages, loss of profits, emotional distress claims, or delays caused by third-party service providers. Maximum liability shall not exceed the amount paid for the affected order.</Typography>
    ),
  },
  {
    title: '17. Website Usage',
    content: (
      <div className="space-y-3">
        <Typography variant="body">You agree not to upload malicious software, attempt unauthorized access, interfere with website operations, submit misleading information, or use the website for unlawful activities. Violation may result in suspension or termination of access.</Typography>
      </div>
    ),
  },
  {
    title: '18. Changes to Terms',
    content: (
      <Typography variant="body">Crystal Wall Art reserves the right to update these Terms & Conditions at any time. Updated versions will be published on this page. Continued use of our website constitutes acceptance of any changes.</Typography>
    ),
  },
  {
    title: '19. Governing Law',
    content: (
      <Typography variant="body">These Terms & Conditions shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from the use of our services shall be subject to the jurisdiction of the competent courts in Kerala, India.</Typography>
    ),
  },
  {
    title: '20. Contact Us',
    content: (
      <div className="space-y-3">
        <Typography variant="body">For questions regarding these Terms & Conditions, please contact:</Typography>
        <Typography variant="body">Crystal Wall Art</Typography>
        <Typography variant="body">Email: wallartcrystal@gmail.com</Typography>
        <Typography variant="body">Website: crystalwallart.com</Typography>
        <Typography variant="body">Phone: +91 9288010051, +91 9288010052, +91 9288010053</Typography>
      </div>
    ),
  },
]

const page = () => {
  return (
    <main className="bg-white text-slate-950">
      <PageHeader title="Terms & Conditions" />

      <Container className="py-10 space-y-10">
        <section className="space-y-4">
          <Typography variant="body-lg" className="font-semibold">
            This website, Crystal Wall Art, is owned and operated by Crystal Glass Art. All orders, invoices, GST billing, and business transactions are processed under Crystal Glass Art.
          </Typography>
          <Typography variant="body-sm" className="text-slate-600">
            Last Updated: June 2026
          </Typography>
          <Typography variant="body">
            Welcome to Crystal Wall Art. By accessing our website, placing an order, uploading photographs, or using any of our services, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our website or purchasing our products.
          </Typography>
        </section>

        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.title} className="rounded-4xl border border-slate-200 p-8 shadow-sm">
              <CardHeader>
                <CardTitle>
                  <Typography variant="h4">{section.title}</Typography>
                </CardTitle>
              </CardHeader>
              <CardContent>{section.content}</CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  )
}

export default page
