import React, { useState } from 'react'
import AppDialog from '../Common/AppDialog'
import AdminFormSelect from '../inputs/FormSelect'
import AdminFormTextarea from '../inputs/FormTextArea'
import AdminImageUpload from '../inputs/ImageUpload'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Control, UseFormHandleSubmit, UseFormSetError } from 'react-hook-form'
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
    editContent?: string | null;
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
                <Form control={control} formSubmit={formSubmit} setError={setError} editContentId={editContent && editContent} closeDialog={closeDialog} setContentsData={setContentsData} />
            }
            disableOutsideClose
            onOpenChange={closeDialog}
        />
    )
}

export default ContectForm

const Form = ({ control, formSubmit, setError, editContentId, closeDialog, setContentsData }: {
    control: Control<ContentFormInput>;
    formSubmit: UseFormHandleSubmit<ContentFormInput>;
    setError: UseFormSetError<ContentFormInput>;
    editContentId?: string | null;
    closeDialog: () => void;
    setContentsData: any;
}) => {

    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSave = async (formData: ContentFormInput) => {
        try {
            setIsSaving(true)

            const image = formData.image;

            // Validate image existence
            if (!image) {
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
                // Do nothing OR handle default
            }
            else if ("__pendingFile" in image) {
                // Case 2: new file upload
                fd.append("file", image.__pendingFile);
                fd.append("folder", image.__folder);
            }
            else {
                // Case 3: existing image
                fd.append("image_url", JSON.stringify(image));
            }

            const url = editContentId
                ? `/api/admin/content/${editContentId}`
                : `/api/admin/content`;

            const method = editContentId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: fd
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result?.message || "Save failed");

            // Update UI
            if (editContentId) {
                // setContentsData((prev: ContentFormOutput[]) =>
                //     prev.map((c) => (c.id === editCon.id ? result.data : c))
                // );
            } else {
                setContentsData((prev:ContentFormOutput[]) => [result.data, ...prev]);
            }

            toast.success(editContentId ? "Updated successfully" : "Created successfully");
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
            <AdminImageUpload control={control} name='image' label='Image' folder='content' required />
            <AdminFormInput control={control} name='link_url' label='Link URL' />
            <AdminFormInput control={control} name='priority' label='Priority' type='number' />

            <Button type='submit'>
                {isSaving && (
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                )}
                {isSaving ? "Creating..." : "Create"}
            </Button>
        </form>
    )
}