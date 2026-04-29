import AddProductsPage from '@/components/Admin/AddProducts';
import AdminPageHeader from '@/components/Admin/Common/PageHeader'
import React from 'react'

const page = async ({
  searchParams,
}: {
  searchParams: { id?: string };
}) => {

  const { id } = await searchParams;

  const isEdit = !!id;

  return (
    <>
      <AdminPageHeader
        title={isEdit ? "Edit Product" : "Add Product"}
        subTitle={
          isEdit
            ? "Update product details"
            : "Create a new product"
        }
      />

      <AddProductsPage/>
    </>
  )
}

export default page;