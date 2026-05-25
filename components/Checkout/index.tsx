"use client"

import Checkout from '@/components/Checkout/CheckoutPage';
import { useStoreLayout } from '@/components/common/LayoutContext/LayoutContext';
import Container from '@/components/Container/Container';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const items = [{}]

const CheckOut = () => {
    const isMobile = useIsMobile();
    const { setOverride } = useStoreLayout();

    const [loading, setLoading] = useState<boolean>(true);

    const isMobileCustomizer = isMobile && !loading;

    useEffect(() => {
        if (isMobileCustomizer) {
            setOverride({ headerMode: "full", showFooter: false });
        }
        setLoading(false)
        return () => setOverride(null);
    }, [isMobileCustomizer, setOverride]);

    if (items.length === 0) {
        return (
            <Container>
                <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/20 mx-auto" />
                    <h2 className="text-xl font-bold">Your cart is empty</h2>
                    <Link href="/"><Button className='text-white font-semibold px-6 py-4 cursor-pointer'>Browse Products</Button></Link>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <Checkout />
        </Container>
    )
}

export default CheckOut