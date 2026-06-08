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
  const policySections = [
    {
      title: 'Replacement and Reprint Eligibility',
      content: (
        <>
          <Typography variant="body">
            Replacement or reprint requests may be approved under the following circumstances:
          </Typography>
          <ul className="mt-4 space-y-3 text-slate-700 leading-7">
            <li className="list-disc pl-5">Product received damaged during transit.</li>
            <li className="list-disc pl-5">Incorrect product delivered.</li>
            <li className="list-disc pl-5">Manufacturing defect.</li>
            <li className="list-disc pl-5">Significant printing error caused by our production team.</li>
          </ul>
        </>
      ),
    },
    {
      title: 'How to Qualify',
      content: (
        <>
          <Typography variant="body">
            To qualify for replacement, customers must report the issue within 48 hours of delivery and provide the following:
          </Typography>
          <ul className="mt-4 space-y-3 text-slate-700 leading-7">
            <li className="list-disc pl-5">Complete unboxing video.</li>
            <li className="list-disc pl-5">Product photographs.</li>
            <li className="list-disc pl-5">Packaging photographs.</li>
          </ul>
        </>
      ),
    },
    {
      title: 'When Refunds or Replacements Are Not Available',
      content: (
        <>
          <Typography variant="body">
            Refunds or replacements will not be provided for the following reasons:
          </Typography>
          <ul className="mt-4 space-y-3 text-slate-700 leading-7">
            <li className="list-disc pl-5">Customer-approved designs.</li>
            <li className="list-disc pl-5">Incorrect information provided by customers.</li>
            <li className="list-disc pl-5">Low-quality uploaded photographs.</li>
            <li className="list-disc pl-5">Minor color variations.</li>
            <li className="list-disc pl-5">Personal preference changes after production.</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Claim Resolution',
      content: (
        <Typography variant="body">
          Approved claims will be resolved through replacement, reprint, store credit, or refund at the sole discretion of Crystal Wall Art.
        </Typography>
      ),
    },
  ];

  return (
    <main className="bg-white text-slate-950">
      <PageHeader title="Refund & Replacement Policy" />

      <Container className="py-10 space-y-10">
        <section className="space-y-6">
          <Typography variant="h2" as="h1">
            All refunds, replacements, and customer service resolutions are processed by Crystal Glass Art.
          </Typography>
          <Typography variant="body-lg">
            All Crystal Wall Art products are personalized and custom-made specifically for each customer. Due to the customized nature of our products, refunds are generally not available once production has started.
          </Typography>
        </section>

        <div className="grid gap-6">
          {policySections.map((section) => (
            <Card key={section.title} className="rounded-[2rem] border border-slate-200 p-8 shadow-sm">
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
  );
};

export default page;
