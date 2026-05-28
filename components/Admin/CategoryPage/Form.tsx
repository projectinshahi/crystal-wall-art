"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import AdminFormTextarea from "../inputs/FormTextArea";
import { Typography } from "@/components/ui/Typography";
import AdminImageUpload from "../inputs/ImageUpload";
import { Button } from "@/components/ui/button";
import {
    Control,
    FormState,
    UseFormHandleSubmit,
    UseFormReset,
    UseFormSetError,
    UseFormWatch,
} from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { useCloudinaryDelete } from "@/hooks/useCloudinaryDelete";
import { toast } from "sonner";
import { CategoryFormInput } from "@/schema/category.schema";
import { CategoryTypes } from "@/types/Admin/categories.types";
import AdminFormInput from "../inputs/FormInput/AdminFormInput";
import { useGlobalLoading } from "@/providers/loading-provider";

type ImageType = {
    url: string;
    public_id: string;
};

interface Props {
    formControl: Control<CategoryFormInput>;
    dialogOpen: boolean;
    setDialogOpen: (dialogOpen: boolean) => void;

    editCat: CategoryFormInput | null;
    setEditCat: (editCat: CategoryFormInput | null) => void;

    watch: UseFormWatch<CategoryFormInput>;
    resetForm: UseFormReset<CategoryFormInput>;
    handleSubmit: UseFormHandleSubmit<CategoryFormInput>;

    setCategories: React.Dispatch<React.SetStateAction<CategoryTypes[]>>;
    formState: FormState<CategoryFormInput>;
    setError: UseFormSetError<CategoryFormInput>;
}

const CategoryForm = ({
    formControl,
    dialogOpen,
    setDialogOpen,
    editCat,
    setEditCat,
    watch,
    resetForm,
    handleSubmit,
    setCategories,
    formState,
    setError
}: Props) => {
    const { deleteFile } = useCloudinaryDelete();
    const { startLoading, stopLoading } = useGlobalLoading();
    const [saving, setSaving] = useState(false);

    const image_url = watch("image_url");

    const { isDirty } = formState;

    const isSubmitDisabled = saving || (!!editCat && !isDirty);

    const handleSave = async (formData: CategoryFormInput) => {
        try {
            setSaving(true);
            startLoading()

            const image = formData.image_url;

            // ✅ Validate image existence
            if (!image) {
                setError("image_url", {
                    type: "manual",
                    message: "Category image is required",
                });
                toast.error("Category image is required");
                return;
            }

            // ✅ Validate basic shape before sending
            const fd = new FormData();

            fd.append("title", formData.title);
            fd.append("description", formData.description ?? "");
            fd.append("priority", String(formData.priority));
            fd.append("is_active", String(formData.is_active));

            // ✅ Handle image
            if ("__pendingFile" in formData.image_url) {
                fd.append("file", formData.image_url.__pendingFile);
                fd.append("folder", formData.image_url.__folder);
            } else {
                fd.append("image_url", JSON.stringify(formData.image_url));
            }

            const url = editCat?.id
            ? `/api/admin/category/${editCat.id}`
            : `/api/admin/category`;
            
            const method = editCat?.id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: fd,
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result?.message || "Save failed");

            // ✅ Update UI
            if (editCat?.id) {
                setCategories((prev) =>
                    prev.map((cat) => (cat.id === editCat.id ? result.data : cat))
                );
            } else {
                setCategories((prev) => [result.data, ...prev]);
            }

            toast.success(editCat ? "Updated successfully" : "Created successfully");

            // ✅ Reset
            setDialogOpen(false);
            setEditCat(null);
            resetForm({
                title: "",
                description: null,
                image_url: undefined,
                priority: 0,
                is_active: true,
            });

        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setSaving(false);
            stopLoading()
        }
    };

    const isUploadedImage = (v: unknown): v is { url: string; public_id: string } =>
        !!v && typeof v === "object" && "url" in v && "public_id" in v;

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display">
                        {editCat ? "Edit Category" : "Add Category"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleSave)} className="grid gap-4 py-4">
                    <AdminFormInput
                        control={formControl}
                        name="title"
                        label="Title"
                        required
                    />

                    <AdminFormTextarea
                        control={formControl}
                        name="description"
                        rows={2}
                        label="Description"
                    />

                    <div className="space-y-2">
                        <Typography variant="body">
                            Category Image <span className="text-red-500 ml-1">*</span>
                        </Typography>

                        {isUploadedImage(image_url) ? (
                            <div className="relative group w-full">
                                <img
                                    src={image_url.url}
                                    alt="Category"
                                    className="w-full h-32 object-cover rounded border"
                                />

                                <button
                                    type="button"
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                    onClick={async () => {
                                        try {
                                            if (image_url.public_id) {
                                                await deleteFile(image_url.public_id);
                                            }

                                            resetForm({
                                                ...watch(),
                                                image_url: undefined,
                                            });
                                        } catch (err) {
                                            console.error(err);
                                            toast.error("Failed to remove image");
                                        }
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <AdminImageUpload
                                required
                                control={formControl}
                                name="image_url"
                                folder="categories"
                            />
                        )}
                    </div>

                    <AdminFormInput
                        type="number"
                        control={formControl}
                        name="priority"
                        label="Priority"
                    />

                    <Button type="submit" disabled={isSubmitDisabled}>
                        {saving && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        )}
                        {editCat ? "Update" : "Create"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryForm;