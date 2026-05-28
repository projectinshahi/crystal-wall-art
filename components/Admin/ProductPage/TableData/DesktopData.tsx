import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CategoryTypes } from '@/types/Admin/categories.types';
import { ProductTypes } from '@/types/Admin/products.types';
import { Edit, ImageOff, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import AdminPagination from './AdminPagination';
import { PaginationMeta } from '@/lib/db/content.db';
import { useGlobalLoading } from '@/providers/loading-provider';
import { toast } from 'sonner';


interface Props {
    products: ProductTypes[];
    meta?: PaginationMeta;
    categories: CategoryTypes[];
    setData: React.Dispatch<React.SetStateAction<ProductTypes[]>>
}

const DesktopData = ({ products, meta, categories, setData }: Props) => {

    const router = useRouter();
    const { startLoading, stopLoading } = useGlobalLoading();

    const toggleStatus = async (id: string, value: boolean) => {
        startLoading()
        try {
            const res = await fetch(`/api/admin/product/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ is_active: value }),
            });

            const text = await res.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Invalid server response");
            }

            if (!res.ok) {
                throw new Error(data?.message || "Failed to update status");
            }

            // ✅ Update state ONLY after success
            setData((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? { ...p, status: value ? "active" : "inactive" }
                        : p
                )
            );

            // ✅ Success toast
            toast.success(
                value ? "Product activated" : "Product deactivated"
            );

        } catch (error: any) {
            console.error("🔥 Update failed:", error.message);

            toast.error(error.message || "Something went wrong");
        } finally {
            stopLoading()
        }
    }

    const statusBadge = (status: string) => {
        switch (status) {
            case "active": return <Badge className="bg-success/10 text-success border-success/30" variant="outline">Active</Badge>;
            case "inactive": return <Badge variant="destructive">Inactive</Badge>;
            default: return <Badge variant="secondary">Draft</Badge>;
        }
    };

    const handleDelete = async (id: string) => { };

    return (
        <>
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="p-3 text-left w-10">
                                    <input type="checkbox" className="rounded" />
                                </th>
                                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                <th className="p-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                                {/* <th className="p-3 text-right text-sm font-medium text-muted-foreground">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p: ProductTypes) => {
                                const cat = categories.find(c => c.id === p.category_id);
                                const image = p.thumbnail ? JSON.parse(p.thumbnail).url : null;

                                return (
                                    <tr key={p.id}>
                                        <td className="p-3">
                                            <input type="checkbox" className="rounded" />
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                                                    {image ? (
                                                        <img src={image} alt={p.title} className="h-full w-full object-cover" />
                                                    ) : <ImageOff className="h-4 w-4 text-muted-foreground" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="font-medium text-sm">{p.title}</p>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{p.orientations}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div>
                                                <p className="font-semibold text-sm">₹{Number(p.price).toLocaleString("en-IN")}</p>
                                                {p.discount_price && <p className="text-xs text-destructive line-through">₹{Number(p.discount_price).toLocaleString("en-IN")}</p>}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant={p.stock_quantity < 10 ? "destructive" : "secondary"}>{p.stock_quantity}</Badge>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-2">
                                                {statusBadge(p.status)}
                                                <Switch checked={p.status === "active"} onCheckedChange={(val) => toggleStatus(p.id, val)} className="scale-75" />
                                            </div>
                                        </td>
                                        <td className="p-3 text-sm text-muted-foreground">{cat?.title || "—"}</td>
                                        {/* <td className="p-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button size="icon" variant="ghost" onClick={() => router.push(`/products/${p.id}/edit`)}><Edit className="h-4 w-4" /></Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </div>
                                        </td> */}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <AdminPagination currentPage={meta ? meta.page : 1} totalItems={meta ? meta.total : 0} pageSize={meta ? meta.limit : 0} onPageChange={() => { }} />
        </>
    )
}

export default DesktopData