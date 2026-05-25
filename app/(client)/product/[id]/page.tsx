import ProductDetails from '@/components/ProductDetails';

const ProductPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${id}`);

    const productRes = await res.json();

    if (!productRes.success) {
        return null;
    }

    return (
        <div className='w-full'>
            <ProductDetails title={productRes.data.title || id} data={productRes.data} />
        </div>
    );
};

export default ProductPage;