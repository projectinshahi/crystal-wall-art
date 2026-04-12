"use client"

import PageHeader from '../common/PageHeader'
import Container from '../Container/Container'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'
import ProductOptions from './ProductOptions'
import SizeChart from './SizeChart'
import Description from './Description'
import ProductDescription from './ProductDescription'
import { useEffect } from 'react'
import { useNavbarHeight } from '@/hooks/useNavbarHeight'
import { Button } from '../ui/button'

const ProductDetails = ({ title }: { title: string }) => {

    const height = useNavbarHeight();

    useEffect(() => {
        const el = document.getElementById("product-header");
        if (!el) return;

        const update = () => {
            const h = el.offsetHeight;
            document.documentElement.style.setProperty(
                "--product-header-height",
                `${h}px`
            );
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section
                id="product-header"
                className="sticky z-40 bg-white"
                style={{ top: `var(--nav-height)` }}
            >
                <PageHeader title={title || 'All Products'} handleBack={() => { }} />
            </section>
            <Container className='max-w-7xl mx-auto'>
                <div className='w-full relative grid grid-cols-5 gap-4 mb-6'>
                    <div className='col-span-5 lg:col-span-3'>
                        <div
                            className="sticky pt-3"
                            style={{
                                top: "calc(var(--nav-height) + var(--product-header-height))",
                                maxHeight: "calc(100vh - var(--nav-height) - var(--product-header-height))",
                                overflow: "auto"
                            }}
                        >
                            <ProductGallery />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 col-span-5 lg:col-span-2'>
                        <ProductInfo />
                        <ProductOptions />
                        <ProductDescription />
                        <SizeChart />
                        <Description />
                        <Button className="w-full cursor-pointer text-white font-semibold mt-3" size="lg">
                            Add to Cart
                        </Button>
                    </div>
                </div>
                <div className='flex flex-col'>
                </div>
            </Container>
        </>
    )
}

export default ProductDetails