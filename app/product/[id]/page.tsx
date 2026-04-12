import ProductDetails from '@/components/ProductDetails';

const ProductPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params; // ✅ unwrap

    return (
        <div className='w-full'>
            <ProductDetails title={id} />
        </div>
    );
};

export default ProductPage;