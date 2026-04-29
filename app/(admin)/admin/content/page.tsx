import ContentPage from '@/components/Admin/ContentPage'
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

  const contents = await res.json()

  if (!contents || !contents.success) return null
  return (
    <ContentPage data={contents.data} metaData={contents.meta}  />
  )
}

export default page