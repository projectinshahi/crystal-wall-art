import { Button } from '@/components/ui/button'
import { CheckCircle, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {

    const { slug } = await params;

    if (!slug) return null;

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-primary" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-display font-bold">Order confirmed successfully!</h1>
                    <p className="text-muted-foreground text-sm">
                        Thank you for your order.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Order ID: {slug}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Link href="/">
                        <Button className="w-full text-white rounded-2xl py-6">
                            <ShoppingBag className="h-4 w-4 mr-2" /> Back to browsing
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Page;