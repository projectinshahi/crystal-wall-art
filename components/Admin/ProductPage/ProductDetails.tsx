import Link from 'next/link';
import AdminPageHeader from '../Common/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminProductDetailsDTO, ProductVariantTypes, ProductImage } from '@/lib/db/dto/products.dto';
import { Edit, Image, Sparkles } from 'lucide-react';

const statusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <Badge className="bg-success/10 text-success border-success/30" variant="outline">Active</Badge>;
        case 'inactive':
            return <Badge variant="destructive">Inactive</Badge>;
        default:
            return <Badge variant="secondary">Draft</Badge>;
    }
};

const parseThumbnail = (value?: string) => {
    if (!value) return null;

    try {
        const parsed = JSON.parse(value);
        return parsed?.url || value;
    } catch {
        return value;
    }
};

const parseImageUrl = (img: ProductImage | string | unknown): string => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (typeof img === "object" && img !== null) {
        if ("image_url" in img && typeof img.image_url === "string") {
            return JSON.parse(img.image_url).url || img.image_url;
        }
        if ("url" in img && typeof img.url === "string") {
            return img.url;
        }
    }
    return "";
};

const ProductDetails = ({ product }: { product: AdminProductDetailsDTO }) => {
    const thumbnailUrl = parseThumbnail(product.thumbnail);
    const imageUrls = (product.images ?? [])
        .map((img: ProductImage) => parseImageUrl(img))
        .filter(Boolean) as string[];
    const displayImages = imageUrls.length > 0 ? imageUrls : thumbnailUrl ? [thumbnailUrl] : [];
    return (
        <div className="space-y-6">
            <AdminPageHeader
                title={product.title}
                subTitle={`Updated ${new Date(product.updated_at).toLocaleDateString()} • ${product.status}`}
                showBackButton
            >
                <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/products/new?id=${product.id}`}>
                        <Button variant="secondary" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit product
                        </Button>
                    </Link>
                    <Link href="/admin/products">
                        <Button variant="outline" size="sm">
                            Back to products
                        </Button>
                    </Link>
                </div>
            </AdminPageHeader>

            <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
                <section className="rounded-2xl border bg-card p-5 shadow-sm">
                    <div className="space-y-4">
                        <div className="overflow-hidden rounded-3xl bg-slate-950/5 shadow-inner">
                            {displayImages.length > 0 ? (
                                <img
                                    src={displayImages[0]}
                                    alt={product.title}
                                    className="h-72 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-72 w-full items-center justify-center text-muted-foreground">
                                    <Image className="h-10 w-10" />
                                </div>
                            )}
                        </div>

                        {displayImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-2">
                                {displayImages.slice(0, 6).map((src: string, index: number) => (
                                    <div key={index} className="h-20 overflow-hidden rounded-2xl border bg-slate-50">
                                        <img src={src} alt={`${product.title} image ${index + 1}`} className="h-full w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="rounded-2xl border border-slate-200 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="text-2xl font-semibold">₹{product.price.toLocaleString('en-IN')}</p>
                                </div>
                                {product.discount_price ? (
                                    <Badge variant="secondary">Discount</Badge>
                                ) : null}
                            </div>
                            {product.discount_price ? (
                                <p className="text-sm text-destructive line-through">
                                    ₹{product.discount_price.toLocaleString('en-IN')}
                                </p>
                            ) : null}
                        </div>

                        <div className="grid gap-3">
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="text-sm text-muted-foreground">Stock quantity</p>
                                <p className="text-xl font-semibold">{product.stock_quantity}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="text-sm text-muted-foreground">Product status</p>
                                <div className="mt-2">{statusBadge(product.status)}</div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="space-y-4">
                    <section className="rounded-2xl border bg-card p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm uppercase tracking-wide text-muted-foreground">Product overview</p>
                                <h2 className="mt-2 text-xl font-semibold">{product.title}</h2>
                            </div>
                            <Badge variant="outline">{product.category_title ?? product.category_id}</Badge>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <DetailItem label="Sizes" value={product.sizes.join(', ') || 'None'} />
                            <DetailItem label="Thickness" value={product.thickness.join(', ') || 'None'} />
                            <DetailItem label="Orientations" value={product.orientations.join(', ') || 'None'} />
                            <DetailItem label="Mounting" value={product.mounting_methods.join(', ') || 'None'} />
                        </div>
                    </section>

                    <section className="rounded-2xl border bg-card p-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className="h-4 w-4" />
                            <span>Product metadata</span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <Attribute label="Created" value={new Date(product.created_at).toLocaleDateString()} />
                            <Attribute label="Updated" value={new Date(product.updated_at).toLocaleDateString()} />
                            <Attribute label="Variant count" value={String(product.variants?.length ?? 0)} />
                            <Attribute label="Image count" value={String(displayImages.length)} />
                        </div>
                    </section>

                    {product.variants && product.variants.length > 0 ? (
                        <section className="rounded-2xl border bg-card p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm uppercase tracking-wide text-muted-foreground">Variants</p>
                                    <h3 className="mt-2 text-lg font-semibold">Price and stock matrix</h3>
                                </div>
                            </div>

                            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                                <table className="min-w-full text-left text-sm">
                                    <thead className="bg-muted/50 text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-3">Size</th>
                                            <th className="px-3 py-3">Thickness</th>
                                            <th className="px-3 py-3">Orientation</th>
                                            <th className="px-3 py-3">Price</th>
                                            <th className="px-3 py-3">Sale</th>
                                            <th className="px-3 py-3">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.variants.map((variant: ProductVariantTypes) => (
                                            <tr key={variant.id ?? `${variant.size}-${variant.thickness}-${variant.orientation}`} className="border-t border-slate-200 even:bg-slate-50/10">
                                                <td className="px-3 py-3">{variant.size || '—'}</td>
                                                <td className="px-3 py-3">{variant.thickness || '—'}</td>
                                                <td className="px-3 py-3 capitalize">{variant.orientation || '—'}</td>
                                                <td className="px-3 py-3">₹{Number(variant.price).toLocaleString('en-IN')}</td>
                                                <td className="px-3 py-3 text-destructive">{variant.discount_price ? `₹${Number(variant.discount_price).toLocaleString('en-IN')}` : '—'}</td>
                                                <td className="px-3 py-3">{variant.stock_quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
);

const Attribute = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-2xl border border-slate-200 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-sm">{value}</p>
    </div>
);

export default ProductDetails;
