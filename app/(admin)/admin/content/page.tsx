import ContentPage from '@/components/Admin/ContentPage'
import { WHATSAPP_CONTENT_TYPE } from '@/lib/constants/content.constants';
import { headers } from 'next/headers';
import React from 'react'

const page = async () => {

  const headerList = await headers(); // 👈 FIX

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/admin/content?page=1&limit=10`,
    {
      headers: {
        cookie: headerList.get('cookie') || '',
      },
      cache: 'no-store',
    }
  );

  // Loaded on its own so the setting is found even when it isn't in the first page of contents
  const whatsappRes = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/content?type=${WHATSAPP_CONTENT_TYPE}`,
    { cache: 'no-store' }
  ).catch(() => null);
  const whatsappJson = await whatsappRes?.json().catch(() => null);
  const whatsapp = whatsappJson?.success ? whatsappJson.data?.data?.[0] : undefined;

  const contents = await res.json()

  if (!contents || !contents.success) return null
  return (
    <ContentPage data={contents.data} metaData={contents.meta} whatsapp={whatsapp} />
  )
}

export default page
