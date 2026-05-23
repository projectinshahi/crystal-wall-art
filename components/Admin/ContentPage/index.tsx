"use client"

import React, { useState } from 'react'
import AdminPageHeader from '../Common/PageHeader'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import AddContentButton from './AddCategoryButton'
import ContectForm from './Form'
import { contentSchema } from '@/schema/content.schema'
import { ContentFormOutput, ContentFormInput } from '@/types/Admin/content.types'
import ContentsListing from './ContentsListing'
import { PaginationMeta } from '@/lib/db/content.db'

interface Props {
    data: ContentFormOutput[];
    metaData: PaginationMeta;
}

const ContentPage = ({data,metaData}: Props) => {

    const [editContent, setEditContent] = useState<ContentFormOutput | null>()
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [contentsData, setContentsData] = useState<ContentFormOutput[]>(data || [])

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

            <ContectForm control={control} dialogOpen={dialogOpen} formSubmit={handleSubmit} closeDialog={handleCloseDialog} setError={setError} editContent={editContent && editContent.id} setContentsData={setContentsData} />

            <ContentsListing contentsData={contentsData} setContentsData={setContentsData}/>
        </div>
    )
}

export default ContentPage