"use client"

import PageHeader from '../common/PageHeader'
import Container from '../Container/Container'
import ProductGallery from './ProductGallery'
import ProductInfo from './ProductInfo'
import ProductOptions, { ChipsOptionsSelector } from './ProductOptions'
import SizeChart from './SizeChart'
import Description from './Description'
import ProductDescription from './ProductDescription'
import { useEffect, useMemo, useState } from 'react'
import { useNavbarHeight } from '@/hooks/useNavbarHeight'
import { Button } from '../ui/button'
import { ProductTypes } from '@/types/Admin/products.types'
import { Variant } from '../Admin/AddProducts/ProductStepperForm'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'sonner'

const ProductDetails = ({ title, data }: { title: string, data: ProductTypes }) => {

    const addItem = useCartStore(s => s.addItem);

    const [loading, setLoading] = useState<boolean>(true);
    const [variants, setVariants] = useState<Variant[]>([]);

    const [sizes, setSizes] = useState<ChipsOptionsSelector>()
    const [thicknesses, setThicknesses] = useState<ChipsOptionsSelector>()
    const [mounting_methods, setMountingMethods] = useState<ChipsOptionsSelector>()
    const [orientations, setOrientations] = useState<ChipsOptionsSelector>()

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

    const loadProduct = async () => {
        const productId = data.id;
        if (!productId) { setLoading(false); return; }

        setLoading(true);

        if (!data) return;
        if (data.sizes?.length) {
            setSizes({
                options:
                    data.sizes.map((v: string) => ({
                        label: v,
                        value: v,
                        disabled: false,
                    })),
                selected: data.sizes[0]
            });
        }

        if (data.thicknesses?.length) {
            setThicknesses({
                options:
                    data.thicknesses.map((v: string) => ({
                        label: v,
                        value: v,
                        disabled: false,
                    })),
                selected: data.thicknesses[0]
            });
        }

        if (data.mounting_methods?.length) {
            setMountingMethods({
                options:
                    data.mounting_methods.map((v: string) => ({
                        label: v,
                        value: v,
                        disabled: false,
                    })),
                selected: data.mounting_methods[0]
            });
        }
        if (data.orientations?.length) {
            setOrientations({
                options:
                    data.orientations.map((v: string) => ({
                        label: v,
                        value: v,
                        disabled: false,
                    })),
                selected: data.orientations[0]
            });
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${productId}/variants`);

        const variantsRes = await res.json();

        if (variantsRes.success && variantsRes.data.length > 0) {
            setVariants(variantsRes.data)
        } else {
            setVariants([])
        }


    }

    useEffect(() => { if (data) loadProduct(); }, [data]);

    const { activeVariant, displayPrice, displayDiscountPrice, effectivePrice } =
        useMemo(() => {
            const normalize = (v?: string) => v?.trim().toLowerCase();

            const variant = variants.find(
                v =>
                    normalize(v.size) === normalize(sizes?.selected) &&
                    normalize(v.thickness) === normalize(thicknesses?.selected)
            );

            const basePrice = Number(data?.price ?? 0);
            const baseDiscount = data?.discount_price
                ? Number(data.discount_price)
                : null;

            const price = variant?.price ?? basePrice;
            const discount = variant?.discount_price ?? baseDiscount;

            const finalPrice =
                discount !== null && discount !== undefined
                    ? discount
                    : price;

            return {
                activeVariant: variant,
                displayPrice: price,
                displayDiscountPrice: discount,
                effectivePrice: finalPrice,
            };
        }, [variants, sizes?.selected, thicknesses?.selected, mounting_methods?.selected, orientations?.selected, data]);

    const handleChangeSelectedOptions = (type: string, value: string) => {
        switch (type) {
            case "size":
                setSizes((prev) => prev ? { ...prev, selected: value } : prev);
                break;

            case "thickness":
                setThicknesses((prev) => prev ? { ...prev, selected: value } : prev);
                break;

            case "mounting":
                setMountingMethods((prev) => prev ? { ...prev, selected: value } : prev);
                break;

            case "orientation":
                setOrientations((prev) => prev ? { ...prev, selected: value } : prev);
                break;

            default:
                break;
        }
    };

    const handleAddToCart = ()=>{
        if (!data) return;

        addItem({
            productId: data.id, title: data.title, image: JSON.parse(data.thumbnail).url || null,
            size: sizes?.selected || '', thickness: thicknesses?.selected || '', mountingMethod: mounting_methods?.selected || '',
            orientation: orientations?.selected || '', price: effectivePrice, quantity: 1,
            variantId: activeVariant?.id
        });
        toast.success("Added to cart!");
    }

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
                        <ProductInfo title={data.title} price={effectivePrice.toLocaleString("en-IN")} finalPrice={displayDiscountPrice && displayPrice.toLocaleString("en-IN")} />
                        <ProductOptions
                            size={sizes || undefined}
                            thickness={thicknesses || undefined}
                            mounting={mounting_methods || undefined}
                            orientations={orientations || undefined}
                            onChange={handleChangeSelectedOptions}
                        />
                        <ProductDescription desc={data.description} />
                        <SizeChart />
                        <Description />
                        <Button className="w-full cursor-pointer text-white font-semibold mt-3" size="lg" onClick={handleAddToCart}>
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default ProductDetails