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
  return (
    <main className="bg-white text-slate-950">
      <PageHeader title="Photo Upload & Copyright Policy" />

      <Container className="py-10 space-y-10">
        <section className="space-y-6">
          <Typography variant="h2" as="h1">
            Photo Upload & Copyright Policy
          </Typography>
          <Typography variant="body-lg">
            By uploading photographs, artwork, logos, religious images, or any other content to Crystal Wall Art, you confirm that you own the content or have obtained permission from the rightful owner.
          </Typography>
        </section>

        <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Typography variant="h4">Customer Responsibility</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="body">
              Customers are solely responsible for ensuring that uploaded content does not violate copyright, trademark, privacy, or intellectual property rights.
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Typography variant="h4">Order Rejection</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="body">
              Crystal Wall Art reserves the right to reject any order containing unauthorized or inappropriate content.
            </Typography>
            <ul className="space-y-2 text-slate-700 leading-7 pl-5">
              <li className="list-disc"><Typography variant="body">Copyright-protected material without authorization.</Typography></li>
              <li className="list-disc"><Typography variant="body">Unauthorized celebrity images.</Typography></li>
              <li className="list-disc"><Typography variant="body">Illegal, offensive, hateful, defamatory, or inappropriate content.</Typography></li>
              <li className="list-disc"><Typography variant="body">Content that violates applicable laws.</Typography></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Typography variant="h4">Cultural and Religious Content</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="body">
              We proudly create customized artwork for customers from diverse cultures, communities, and faiths. However, we reserve the right to refuse content that promotes hatred, discrimination, violence, or religious intolerance.
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
          <CardHeader>
            <CardTitle>
              <Typography variant="h4">Image Editing and Usage</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Typography variant="body">
              Uploaded images may be edited, enhanced, restored, resized, or optimized to improve final print quality.
            </Typography>
            <Typography variant="body">
              By uploading content, you grant Crystal Wall Art permission to use the uploaded files solely for design, production, quality control, and order fulfillment purposes.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </main>
  )
}

export default page
