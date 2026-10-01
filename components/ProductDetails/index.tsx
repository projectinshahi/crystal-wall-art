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
import { useRouter } from 'next/navigation'

const ProductDetails = ({ title, data }: { title: string, data: ProductTypes }) => {

    const router = useRouter();

    const addItem = useCartStore(s => s.addItem);

    const [loading, setLoading] = useState<boolean>(true);
    const [variants, setVariants] = useState<Variant[]>([]);

    const [sizes, setSizes] = useState<ChipsOptionsSelector>()
    const [thickness, setThickness] = useState<ChipsOptionsSelector>()
    const [mounting_methods, setMountingMethods] = useState<ChipsOptionsSelector>()
    const [orientations, setOrientations] = useState<ChipsOptionsSelector>();

    const height = useNavbarHeight();

    const sizeImage = sizes?.selected ? data.size_images?.[sizes.selected]?.url : undefined;

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

        if (data.thickness?.length) {
            setThickness({
                options:
                    data.thickness.map((v: string) => ({
                        label: v,
                        value: v,
                        disabled: false,
                    })),
                selected: data.thickness[0]
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

            const sizeThickness = variants.filter(
                v =>
                    normalize(v.size) === normalize(sizes?.selected) &&
                    normalize(v.thickness) === normalize(thickness?.selected)
            );
            // A variant priced for the selected mounting method wins; one without a mounting method applies to all
            const variant =
                sizeThickness.find(v => v.mounting_method && normalize(v.mounting_method) === normalize(mounting_methods?.selected)) ??
                sizeThickness.find(v => !v.mounting_method);

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
        }, [variants, sizes?.selected, thickness?.selected, mounting_methods?.selected, orientations?.selected, data]);

    const handleChangeSelectedOptions = (type: string, value: string) => {
        switch (type) {
            case "size":
                setSizes((prev) => prev ? { ...prev, selected: value } : prev);
                break;

            case "thickness":
                setThickness((prev) => prev ? { ...prev, selected: value } : prev);
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

    const getThumbnailUrl = (value?: string | null): string | null => {
        if (!value) return null;

        const trimmed = value.trim();
        if (!trimmed) return null;

        try {
            const parsed = JSON.parse(trimmed);
            const url = typeof parsed === 'string'
                ? parsed
                : parsed?.url || parsed?.image_url || parsed?.secure_url;
            return typeof url === 'string' ? url : trimmed;
        } catch {
            return trimmed;
        }
    };

    const handleAddToCart = () => {
        if (!data) return;
        addItem({
            product_id: data.id, title: data.title, image: getThumbnailUrl(data.thumbnail) || null,
            size: sizes?.selected || '', thickness: thickness?.selected || '', mounting_method: mounting_methods?.selected || '',
            orientation: orientations?.selected || '', price: effectivePrice, quantity: 1,
            variant_id: activeVariant?.id
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
                <PageHeader title={title || 'All Products'} handleBack={() => router.back()} />
            </section>
            <Container className='max-w-7xl mx-auto'>
                <div className='w-full relative grid grid-cols-5 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-4 lg:gap-8 mb-6'>
                    <div className='col-span-5 lg:col-span-1'>
                        <div
                            className="sticky pt-3"
                            style={{
                                top: "calc(var(--nav-height) + var(--product-header-height))",
                                maxHeight: "calc(100vh - var(--nav-height) - var(--product-header-height))",
                                overflow: "auto"
                            }}
                        >
                            {/* Selected size's image (if any) leads the gallery and stays put until the size changes */}
                            <ProductGallery
                                key={sizeImage || "gallery"}
                                images={sizeImage ? [{ id: `size-${sizes?.selected}`, image_url: sizeImage }, ...(data.images || [])] : data.images || []}
                                autoplay={!sizeImage}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 col-span-5 lg:col-span-1'>
                        <ProductInfo title={data.title} price={effectivePrice.toLocaleString("en-IN")} finalPrice={displayDiscountPrice && displayPrice.toLocaleString("en-IN")} />
                        <ProductOptions
                            size={sizes || undefined}
                            thickness={thickness || undefined}
                            mounting={mounting_methods || undefined}
                            orientations={orientations || undefined}
                            onChange={handleChangeSelectedOptions}
                        />
                        <ProductDescription desc={data.description} />
                        <SizeChart
                            size={sizes?.selected}
                            thickness={thickness?.selected}
                            mounting={mounting_methods?.selected}
                            orientation={orientations?.selected}
                        />
                        {/* <Description /> */}
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