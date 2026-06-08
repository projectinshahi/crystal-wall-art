import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import Container from '@/components/Container/Container';
import { Typography } from '@/components/ui/Typography';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

const page = () => {
  const sections = [
    {
      title: 'What We Collect',
      text: 'At Crystal Wall Art, protecting your privacy is one of our highest priorities. We collect customer information such as name, phone number, email address, shipping address, uploaded photographs, and order details solely for order processing, customer support, production, and delivery purposes.',
    },
    {
      title: 'How We Use Your Information',
      text: 'We use the customer information we collect to process orders, communicate with you about your purchase, support production and customization, complete shipping and delivery, and provide timely customer service.',
    },
    {
      title: 'Data Sharing',
      text: 'We do not sell, rent, or share customer personal information with third parties except where required for payment processing, shipping, legal compliance, or service fulfillment.',
    },
    {
      title: 'Uploaded Photographs',
      text: 'Uploaded photographs are stored securely and are accessible only to authorized team members involved in design, production, and customer support.',
    },
    {
      title: 'Security Measures',
      text: 'We use industry-standard security measures to protect customer information from unauthorized access, misuse, or disclosure.',
    },
    {
      title: 'Your Rights',
      text: 'Customers may contact us at any time regarding data access, correction, or deletion requests.',
    },
    {
      title: 'Consent',
      text: 'By using our website, you consent to the collection and use of information as described in this Privacy Policy.',
    },
  ];

  return (
    <main className="bg-white text-slate-950">
      <PageHeader title="Privacy Policy" />

      <Container className="py-10 space-y-10">
        <section className="space-y-6">
          <Typography variant="h2" as="h1">
            Protecting Your Privacy Is Our Priority
          </Typography>
          <Typography variant="body-lg">
            "A Brand of Crystal Glass Art"
            <br />
            References to "Crystal Wall Art", "we", "our", or "us" in this Privacy Policy refer to Crystal Glass Art, the legal entity operating the Crystal Wall Art brand.
          </Typography>
        </section>

        <div className="grid gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="rounded-4xl border border-slate-200 p-8 shadow-sm">
              <CardHeader>
                <CardTitle>
                  <Typography variant="h4">{section.title}</Typography>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body">{section.text}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
};

export default page;
