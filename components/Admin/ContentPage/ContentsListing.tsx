import React, { useState } from 'react'
import AdminPagination from '../ProductPage/TableData/AdminPagination'
import { Card, CardContent } from '@/components/ui/card'
import { ContentFormOutput } from '@/types/Admin/content.types'
import { Badge } from '@/components/ui/badge'
import { CONTENT_TYPES } from '@/lib/constants/content.constants'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import AppDialog from '../Common/AppDialog'
import { Typography } from '@/components/ui/Typography'
import { DialogClose } from '@/components/ui/dialog'
import { useGlobalLoading } from '@/providers/loading-provider'

interface Props {
    contentsData: ContentFormOutput[];
    setContentsData: any;
}

const ContentsListing = ({ contentsData, setContentsData }: Props) => {

    const { startLoading, stopLoading } = useGlobalLoading();

    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [deleting, setDeleting] = useState(false);

    // ✅ Toggle active
    const toggleActive = async (id: string, value: boolean) => {
        startLoading()
        try {
            const res = await fetch(`/api/admin/content/${id}`, {
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
            setContentsData((prev: ContentFormOutput[]) =>
                prev.map((c) =>
                    c.id === id ? { ...c, is_active: value } : c
                )
            );

            // ✅ Success toast
            toast.success(
                value ? "Content activated" : "Content deactivated"
            );

        } catch (error: any) {
            console.error("🔥 Update failed:", error.message);

            toast.error(error.message || "Something went wrong");
        }finally{
            stopLoading()
        }
    };

    const handleDelete = async (id: string) => {

        setDeleting(true);
        startLoading()

        try {
            const res = await fetch(`/api/admin/content/${id}`, {
                method: "DELETE",
            });

            const text = await res.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Invalid server response");
            }

            if (!res.ok) {
                throw new Error(data?.message || "Delete failed");
            }

            // ✅ Update state AFTER success
            setContentsData((prev: any) => prev.filter((c: any) => c.id !== id));

            // ✅ Success toast
            toast.success("Content deleted successfully");
            setDeleteOpen(false);

        } catch (error: any) {
            console.error("🔥 Delete failed:", error.message);

            toast.error(error.message || "Something went wrong");
        } finally {
            setDeleting(false);
            stopLoading()
        }
    };

    return (
        <div className='space-y-2'>
            <div className="space-y-3">
                {contentsData.map((c: ContentFormOutput) => {
                    let image: { url: string; public_id: string } | null = null;
                    image = c.image ? JSON.parse(c.image) : null;

                    const typeOf = CONTENT_TYPES.find((content) => content.value === c.type)?.label || "";

                    return (
                        <Card key={c.id}>
                            <CardContent className="p-4 flex items-center gap-4">
                                {(image && image.url) && <img src={image.url} alt="" className="h-16 w-24 object-cover rounded shrink-0" />}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className='text-primary'>{typeOf}</Badge>
                                        <Badge variant={c.is_active ? "default" : "destructive"}>{c.is_active ? "Active" : "Inactive"}</Badge>
                                        <Badge variant="outline">P:{c.priority}</Badge>
                                    </div>
                                    <p className="font-medium mt-1">{c.title || "Untitled"}</p>
                                    {c.description && <p className="text-sm text-muted-foreground truncate">{c.description}</p>}
                                </div>
                                <div className='flex items-center gap-2 shrink-0'>
                                    <Switch
                                        checked={c.is_active}
                                        className="cursor-pointer"
                                        onCheckedChange={(val) => toggleActive(c.id, val)}
                                    />

                                    {/* Button for Edit */}
                                    {/* <Button
                                        size="icon"
                                        variant="ghost"
                                    //   onClick={() => openEdit(c)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button> */}

                                    {/* Button for Delete and Alery Dialog Box */}
                                    <AppDialog
                                        open={deleteOpen}
                                        onOpenChange={setDeleteOpen}
                                        trigger={
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        }
                                        showClose={false}
                                        title="Delete Content"
                                        description="This action cannot be undone."
                                        content={
                                            <Typography>
                                                Do you want to delete this content permanently?
                                            </Typography>
                                        }
                                        footer={
                                            <>
                                                <DialogClose asChild>
                                                    <Button>Cancel</Button>
                                                </DialogClose>
                                                <Button variant="destructive"
                                                    onClick={() => handleDelete(c.id)}>
                                                    {deleting ? "Deleting..." : "Delete"}
                                                </Button>
                                            </>
                                        }
                                        disableOutsideClose
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            {/* <AdminPagination currentPage={1} pageSize={10} totalItems={100} onPageChange={() => { }} /> */}
        </div>

    )
}

export default ContentsListing