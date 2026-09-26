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
import { homeIntroSchema, HomeIntroFormValues } from '@/schema/content.schema'
import { HOME_INTRO_DEFAULTS } from '@/lib/constants/content.constants'
import { ContentFormOutput } from '@/types/Admin/content.types'
import { useGlobalLoading } from '@/providers/loading-provider'

const HomeIntroForm = ({ content }: { content?: ContentFormOutput }) => {

    const { startLoading, stopLoading } = useGlobalLoading();
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { control, handleSubmit, reset } = useForm<HomeIntroFormValues>({
        resolver: zodResolver(homeIntroSchema),
        defaultValues: {
            title: content?.title ?? HOME_INTRO_DEFAULTS.title,
            description: content?.description ?? HOME_INTRO_DEFAULTS.description,
        },
    });

    const handleSave = async (values: HomeIntroFormValues) => {
        try {
            setIsSaving(true);
            startLoading();

            const res = await fetch('/api/admin/content/home-intro', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const result = await res.json().catch(() => null);

            if (!res.ok || !result?.success) {
                throw new Error(result?.error || result?.message || 'Failed to save section');
            }

            reset({
                title: result.data?.title ?? values.title,
                description: result.data?.description ?? values.description,
            });

            toast.success('Homepage section updated successfully');
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
                <CardTitle>Homepage Intro Section</CardTitle>
                <CardDescription>Heading and description shown in the green section below the homepage hero.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(handleSave)} className="grid gap-4">
                    <AdminFormInput control={control} name='title' label='Heading' required />
                    <AdminFormTextarea control={control} name='description' label='Description' rows={5} />
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

export default HomeIntroForm
