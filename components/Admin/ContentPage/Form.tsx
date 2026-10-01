import React, { useState } from 'react'
import AppDialog from '../Common/AppDialog'
import AdminFormSelect from '../inputs/FormSelect'
import AdminFormTextarea from '../inputs/FormTextArea'
import AdminImageUpload from '../inputs/ImageUpload'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Control, UseFormHandleSubmit, UseFormSetError, useWatch } from 'react-hook-form'
import { CONTENT_TYPES } from '@/lib/constants/content.constants'
import { toast } from 'sonner'
import { ContentFormInput, ContentFormOutput } from '@/types/Admin/content.types'
import AdminFormInput from '../inputs/FormInput/AdminFormInput'

interface Props {
    control: Control<ContentFormInput>
    dialogOpen: boolean;
    formSubmit: UseFormHandleSubmit<ContentFormInput>;
    closeDialog: () => void;
    setError: UseFormSetError<ContentFormInput>;
    editContent?: ContentFormOutput | null;
    setContentsData: any;
}

const ContectForm = ({
    control,
    dialogOpen,
    formSubmit,
    closeDialog,
    setError,
    editContent,
    setContentsData
}: Props) => {
    return (
        <AppDialog
            open={dialogOpen}
            title={editContent ? 'Edit Content' : 'Add Content'}
            content={
                <Form control={control} formSubmit={formSubmit} setError={setError} editContent={editContent} closeDialog={closeDialog} setContentsData={setContentsData} />
            }
            disableOutsideClose
            onOpenChange={closeDialog}
            className="max-h-[90vh] overflow-y-auto"
        />
    )
}

export default ContectForm

const Form = ({ control, formSubmit, setError, editContent, closeDialog, setContentsData }: {
    control: Control<ContentFormInput>;
    formSubmit: UseFormHandleSubmit<ContentFormInput>;
    setError: UseFormSetError<ContentFormInput>;
    editContent?: ContentFormOutput | null;
    closeDialog: () => void;
    setContentsData: any;
}) => {

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const isHero = useWatch({ control, name: 'type' }) === 'hero_section';

    const handleSave = async (formData: ContentFormInput) => {
        try {
            setIsSaving(true)

            const image = formData.image;

            console.log("[ContentForm] saving content", { editContent: editContent?.id });

            // Validate image existence: required for create, optional for edit (we support removal)
            if (!image && !editContent) {
                setError("image", {
                    type: "manual",
                    message: "Content image is required",
                });
                toast.error("Content image is required");
                return;
            }

            // Validate basic shape before sending
            const fd = new FormData();

            fd.append("type", formData.type ?? "");
            fd.append("title", formData.title);
            fd.append("description", formData.description ?? "");
            fd.append("link_url", formData.link_url ?? "");
            fd.append("priority", String(formData.priority));

            // ✅ Handle image
            if (!image) {
                // Case 1: no image provided
                // If we're editing existing content and the user removed the image,
                // send a remove flag so the server will clear the image.
                if (editContent) {
                    fd.append("remove_image", "1");
                    console.log("[ContentForm] appended remove_image flag for edit");
                }
            } else if ("__pendingFile" in image) {
                // Case 2: new file upload
                fd.append("file", image.__pendingFile);
                fd.append("folder", image.__folder);
                console.log("[ContentForm] appended file to FormData:", image.__pendingFile.name, image.__pendingFile.type, image.__pendingFile.size);
            } else {
                // Case 3: existing image
                fd.append("image_url", JSON.stringify(image));
                console.log("[ContentForm] keeping existing image", image);
            }

            // Mobile banner (hero only, optional)
            const mobileImage = isHero ? formData.mobile_image : null;
            if (mobileImage && "__pendingFile" in mobileImage) {
                fd.append("mobile_file", mobileImage.__pendingFile);
                // Mobile-only change: send the folder too, otherwise the server falls back to "categories"
                if (!fd.has("folder")) fd.append("folder", mobileImage.__folder);
            } else if (!mobileImage && editContent) {
                fd.append("remove_mobile_image", "1");
            }

            const url = editContent && editContent.id
                ? `/api/admin/content/${editContent.id}`
                : `/api/admin/content`;

            const method = editContent && editContent.id ? "PUT" : "POST";

            console.log("[ContentForm] sending request", { url, method });
            const res = await fetch(url, {
                method,
                body: fd
            });

            const text = await res.text();
            console.log("[ContentForm] server response status", res.status, "text:", text);

            let result: any = null;
            try {
                result = text ? JSON.parse(text) : null;
            } catch (parseErr) {
                console.warn("[ContentForm] failed to parse JSON response", parseErr);
            }

            if (!res.ok) {
                const message = result?.message || result?.error || `Save failed (status ${res.status})`;
                console.error("[ContentForm] save failed:", message, { result });
                throw new Error(message);
            }

            // Update UI
            if (editContent && editContent.id) {
                setContentsData((prev: ContentFormOutput[]) =>
                    prev.map((c) => (c.id === result.data.id ? result.data : c))
                );
            } else {
                setContentsData((prev:ContentFormOutput[]) => [result.data, ...prev]);
            }

            toast.success(editContent ? "Updated successfully" : "Created successfully");
            closeDialog()

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={formSubmit(handleSave)} className="grid gap-4 py-4">
            <AdminFormSelect control={control} name='type' label='Type' options={CONTENT_TYPES} required />
            <AdminFormInput control={control} name='title' label='Title' required />
            <AdminFormTextarea control={control} name='description' label='Description' />
            <AdminImageUpload control={control} name='image' label={isHero ? 'Desktop Banner Image' : 'Image'} folder='content' required />
            {/* Kept mounted (hidden) for non-hero types so a picked file's preview isn't revoked when toggling type; ignored on save unless hero */}
            <div className={isHero ? "grid gap-1" : "hidden"}>
                <AdminImageUpload control={control} name='mobile_image' label='Mobile Banner Image' folder='content' required />
                <p className="text-xs text-muted-foreground">Required for Hero Section. Shown on mobile &amp; tablet (below 1024px), uncropped at its own ratio — recommended portrait 4:5 (e.g. 1080×1350) or 1:1.</p>
            </div>
            <AdminFormInput control={control} name='link_url' label='Link URL' />
            <AdminFormInput control={control} name='priority' label='Priority' type='number' />

            <Button type='submit'>
                {isSaving && (
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                )}
                {isSaving ? (editContent ? "Updating..." : "Saving...") : (editContent ? "Update" : "Create")}
            </Button>
        </form>
    )
}