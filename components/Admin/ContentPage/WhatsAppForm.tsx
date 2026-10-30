"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AdminFormInput from '../inputs/FormInput/AdminFormInput'
import AdminFormTextarea from '../inputs/FormTextArea'
import { whatsappSchema, WhatsAppFormValues } from '@/schema/content.schema'
import { WHATSAPP_DEFAULTS } from '@/lib/constants/content.constants'
import { ContentFormOutput } from '@/types/Admin/content.types'
import { useGlobalLoading } from '@/providers/loading-provider'

const WhatsAppForm = ({ content }: { content?: ContentFormOutput }) => {

    const { startLoading, stopLoading } = useGlobalLoading();
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { control, handleSubmit, reset } = useForm<WhatsAppFormValues>({
        resolver: zodResolver(whatsappSchema),
        defaultValues: {
            phone: content?.title ?? WHATSAPP_DEFAULTS.phone,
            message: content ? (content.description ?? '') : WHATSAPP_DEFAULTS.message,
        },
    });

    const handleSave = async (values: WhatsAppFormValues) => {
        try {
            setIsSaving(true);
            startLoading();

            const res = await fetch('/api/admin/content/whatsapp', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const result = await res.json().catch(() => null);

            if (!res.ok || !result?.success) {
                throw new Error(result?.error || result?.message || 'Failed to save WhatsApp number');
            }

            reset({
                phone: result.data?.title ?? values.phone,
                message: result.data?.description ?? values.message,
            });

            toast.success('WhatsApp number updated successfully');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong');
        } finally {
            setIsSaving(false);
            stopLoading();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>WhatsApp Button</CardTitle>
                <CardDescription>Number customers reach from the floating WhatsApp button on the website. Include the country code, e.g. 919876543210.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleSave)} className="grid gap-4">
                    <AdminFormInput control={control} name='phone' label='WhatsApp Number' required />
                    <AdminFormTextarea control={control} name='message' label='Pre-filled Message (optional)' rows={2} />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Save
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default WhatsAppForm
