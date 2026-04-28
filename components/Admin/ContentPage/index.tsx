"use client"

import React, { useState } from 'react'
import AdminPageHeader from '../Common/PageHeader'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AddContentButton from './AddCategoryButton'
import ContectForm from './Form'
import { contentSchema } from '@/schema/content.schema'
import { CcontentFormOutput, ContentFormInput } from '@/types/Admin/content.types'

const ContentPage = () => {

    const [editContent, setEditContent] = useState<CcontentFormOutput | null>()
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const form = useForm<ContentFormInput>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
        type: undefined,
        title: "",
        description: "",
        image: undefined,
        link_url: "",
        priority: 0
    }
});

    const { control, handleSubmit, setValue, reset, watch, formState, setError } = form;

    // Open Add Modal
    const openAddDialog = () => {
        setEditContent(null);
        reset({
            type: undefined,
            title: "",
            description: "",
            image: undefined,
            link_url: "",
            priority: 0
        });

        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditContent(null);
        reset({
            type: undefined,
            title: "",
            description: "",
            image: undefined,
            link_url: "",
            priority: 0
        });
    }

    return (
        <div>
            <AdminPageHeader
                title="Content Management"
                subTitle="Manage banners, featured items, and sections"
            >
                <AddContentButton handleAction={openAddDialog} />
            </AdminPageHeader>

            <ContectForm control={control} dialogOpen={dialogOpen} formSubmit={handleSubmit} closeDialog={handleCloseDialog} setError={setError} editContent={editContent && editContent.id} />
        </div>
    )
}

export default ContentPage