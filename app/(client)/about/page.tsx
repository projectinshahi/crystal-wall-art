import React from 'react'
import PageHeader from '@/components/common/PageHeader'
import Container from '@/components/Container/Container'
import { Typography } from '@/components/ui/Typography'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

const page = () => {
  const highlights = [
    'A child’s first smile.',
    'A wedding that united two hearts.',
    'A family portrait filled with love.',
    'A cherished memory of someone who will always remain close to our hearts.',
    'A spiritual image that brings peace, faith, and inspiration every day.',
  ]

  return (
    <main className="bg-white text-slate-950">
      <PageHeader title="About" />

      <Container className="py-10 space-y-16">
        <section className="space-y-6">
          <Typography variant="h2" as="h1">
            Every Wall Deserves a Story
          </Typography>
          <Typography variant="body-lg">
            Crystal Wall Art is the consumer-facing brand of Crystal Glass Art, a company specializing in premium personalized wall art, UV printing, and customized décor solutions.
          </Typography>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <Card className="rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h3">Some memories are too precious to remain hidden inside a phone gallery.</Typography>
              </CardTitle>
              <CardDescription>
                <Typography variant="body">Some moments deserve to be seen, celebrated, and remembered every day.</Typography>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <Typography variant="body" className="font-semibold text-slate-900">
                    {item}
                  </Typography>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h3">Our purpose is simple</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Typography variant="body">To transform life’s most meaningful moments, memories, and beliefs into timeless works of art.</Typography>
              <Typography variant="body">At Crystal Wall Art, we believe that every photograph tells a story, every story carries an emotion, and every wall deserves to display something meaningful.</Typography>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Typography variant="h3">Our Journey</Typography>
            <Typography variant="body">
              Crystal Wall Art was founded on October 30, 2020, with a vision to create more than just printed products.
            </Typography>
            <Typography variant="body">
              We saw a world where people were capturing more memories than ever before, yet most of those memories remained forgotten inside mobile phones, hard drives, and cloud storage. We believed those moments deserved more. They deserved to be experienced. They deserved to be celebrated. They deserved a place in people’s homes, workplaces, and hearts.
            </Typography>
            <Typography variant="body">
              That belief became Crystal Wall Art. What started as a passion for creativity, photography, design, and printing has grown into a trusted brand serving customers across India and around the world.
            </Typography>
            <Typography variant="body" className="font-medium">
              Today, with more than 1,00,000+ completed orders, a dedicated team of 20+ professionals, and customers from different cultures, communities, and countries, we continue our mission of helping people bring their stories to life.
            </Typography>
          </div>

          <Card className="rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h3">More Than Printing. We Preserve Emotions.</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Typography variant="body">
                For us, every order represents something deeper than a product. Behind every image is a story. A mother’s love. A father’s sacrifice. A lifelong friendship. A wedding filled with dreams. A child’s precious milestone. A beloved pet. A memory that deserves to last forever.
              </Typography>
              <Typography variant="body" className="font-medium">
                Our responsibility is not simply to print an image. Our responsibility is to preserve an emotion.
              </Typography>
              <Typography variant="body">
                That is why every design is handled with care, creativity, and respect for the story it represents.
              </Typography>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h3">Crafted In-House With Pride</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Typography variant="body">
                Unlike many online printing brands, we do not outsource our production process. Every Crystal Wall Art product is designed, printed, finished, inspected, packed, and dispatched by our own team.
              </Typography>
              <ul className="space-y-3 text-slate-700 leading-7">
                <li className="list-disc pl-5">Professional Design Services</li>
                <li className="list-disc pl-5">Photo Restoration & Enhancement</li>
                <li className="list-disc pl-5">Premium UV Printing</li>
                <li className="list-disc pl-5">Acrylic Processing & Cutting</li>
                <li className="list-disc pl-5">Finishing & Quality Control</li>
                <li className="list-disc pl-5">Secure Packaging & Dispatch</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h3">What We Create</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Typography variant="body">We specialize in premium personalized wall décor products including:</Typography>
              <ul className="space-y-3 text-slate-700 leading-7">
                <li className="list-disc pl-5">Acrylic UV Photo Prints</li>
                <li className="list-disc pl-5">Premium Wall Art</li>
                <li className="list-disc pl-5">Canvas Prints</li>
                <li className="list-disc pl-5">Personalized Home Décor</li>
                <li className="list-disc pl-5">Spiritual & Religious Wall Art</li>
                <li className="list-disc pl-5">Photo Restoration & Enhancement Services</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {[
            {
              title: 'Professional Design Excellence',
              text: 'Every image is carefully reviewed and enhanced by experienced designers to ensure outstanding results.',
            },
            {
              title: 'Advanced UV Printing Technology',
              text: 'Our premium UV printing delivers vibrant colors, sharp details, exceptional durability, and a luxurious finish.',
            },
            {
              title: 'Trusted Worldwide',
              text: 'From Kerala to every corner of India and international destinations, customers trust us to preserve their most meaningful memories.',
            },
          ].map((item) => (
            <Card key={item.title} className="rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
              <CardHeader>
                <CardTitle>
                  <Typography variant="h5">{item.title}</Typography>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Typography variant="body">{item.text}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h5">Our Mission</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body">
                To help people preserve, celebrate, and showcase their most meaningful moments, memories, and beliefs through premium personalized wall art that inspires emotion and creates lasting connections.
              </Typography>
            </CardContent>
          </Card>
          <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h5">Our Vision</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="body">
                To become the world’s most trusted personalized wall art brand by transforming memories, emotions, and stories into timeless masterpieces that enrich homes, workplaces, and lives across generations.
              </Typography>
            </CardContent>
          </Card>
          <Card className="rounded-4xl border border-slate-200 p-8 shadow-sm">
            <CardHeader>
              <CardTitle>
                <Typography variant="h5">Our Core Values</Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700 leading-7">
              <Typography variant="body">Quality: We never compromise on craftsmanship, materials, or finishing.</Typography>
              <Typography variant="body">Trust: We build lasting relationships through honesty, transparency, and reliability.</Typography>
              <Typography variant="body">Creativity: We combine imagination, artistry, and technology to create extraordinary products.</Typography>
              <Typography variant="body">Customer Happiness: The smile and satisfaction of our customers remain at the heart of everything we do.</Typography>
              <Typography variant="body">Innovation: We continuously embrace new ideas, technologies, and creative possibilities to deliver exceptional experiences.</Typography>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-4xl border border-slate-200 p-10 shadow-sm sm:p-14">
          <CardHeader>
            <CardTitle>
              <Typography variant="h3">Our Promise</Typography>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Typography variant="body">
              When you choose Crystal Wall Art, you receive more than a product. You receive a team that values your memories as much as you do.
            </Typography>
            <ul className="space-y-3 text-slate-700 leading-7">
              <li className="list-disc pl-5">Premium Quality Craftsmanship</li>
              <li className="list-disc pl-5">Professional Design Support</li>
              <li className="list-disc pl-5">Personalized Customer Care</li>
              <li className="list-disc pl-5">Safe & Secure Packaging</li>
              <li className="list-disc pl-5">Reliable Worldwide Delivery</li>
              <li className="list-disc pl-5">Long-Lasting Durability</li>
              <li className="list-disc pl-5">Exceptional Attention to Detail</li>
            </ul>
            <Typography variant="body" className="font-medium">
              Memories Preserved for a Lifetime.
            </Typography>
            <Typography variant="body">
              Technology will continue to evolve. Design trends will continue to change. But one thing will always remain timeless: human memories.
            </Typography>
            <Typography variant="body">
              As we continue to grow, innovate, and serve customers around the world, our purpose remains unchanged. To help people celebrate the moments, relationships, beliefs, and stories that matter most.
            </Typography>
            <Typography variant="body">
              Because memories are not meant to be forgotten. They are meant to be displayed, shared, celebrated, and cherished every day.
            </Typography>
            <Typography variant="body" className="font-semibold">
              Crystal Wall Art: Transforming Memories into Timeless Art.
            </Typography>
            <Typography variant="body">Crystal Wall Art is a brand owned and operated by Crystal Glass Art.</Typography>
          </CardContent>
        </Card>
      </Container>
    </main>
  )
}

export default page
