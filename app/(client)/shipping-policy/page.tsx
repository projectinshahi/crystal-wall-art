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

const page = () => {
  const points = [
    'Product type',
    'Location',
    'Courier partner availability',
    'Public holidays',
    'Weather conditions',
    'Customs clearance requirements',
  ]

  return (
    <main className="bg-white text-slate-950">
      <PageHeader title="Shipping Policy" />

      <Container className="py-10 space-y-10">
        <section className="space-y-6">
          <Typography variant="h2" as="h1">
            Shipping Policy
          </Typography>
          <Typography variant="body-lg">
            All shipments are dispatched by Crystal Glass Art or its authorized logistics partners. Crystal Wall Art proudly delivers across Kerala, India, and selected international destinations.
          </Typography>
        </section>

        <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Typography variant="h4">Production and Dispatch</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="body">
              Production typically begins after payment confirmation and design approval (where applicable). Customers will receive tracking details once the order is dispatched.
            </Typography>
            <Typography variant="body">
              While we strive to ensure timely delivery, delays caused by courier companies or external circumstances are beyond our control.
            </Typography>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h5">Kerala</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body">3–8 Business Days</Typography>
            </CardContent>
          </Card>
          <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h5">India</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body">3–12 Business Days</Typography>
            </CardContent>
          </Card>
          <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h5">International Orders</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body">7–25 Business Days</Typography>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Typography variant="h4">Delivery timelines may vary depending on</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-slate-700 leading-7">
              {points.map((point) => (
                <li key={point} className="list-disc pl-5">
                  <Typography variant="body">{point}</Typography>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Typography variant="h4">Shipping Charges</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="body">
              Shipping charges, if applicable, will be displayed during checkout.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </main>
  )
}

export default page
