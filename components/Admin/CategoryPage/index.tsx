"use client";

import React, { useEffect, useState } from "react";
import AdminPageHeader from "../Common/PageHeader";
import Spinner from "../Loader/Spinner";
import AddCategoryButton from "./AddCategoryButton";
import NoCategory from "./NoCategory";
import CategoriesListing from "./CategoriesListing";
import { CategoryTypes } from "@/types/Admin/categories.types";
import { useForm } from "react-hook-form";
import CategoryForm from "./Form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryFormInput,
  CategoryFormOutput,
  categorySchema,
} from "@/schema/category.schema";

// Without parentId: main categories. With parentId: the subcategories of that category.
const CategoryPage = ({ parentId }: { parentId?: string }) => {
  const [editCat, setEditCat] = useState<CategoryFormInput | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);
  const [parent, setParent] = useState<CategoryTypes | null>(null);
  const isSub = !!parentId;

  const form = useForm<CategoryFormInput, any, CategoryFormOutput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      description: null,
      image_url: undefined,
      priority: 0,
      is_active: true,
    },
  });

  const { control, handleSubmit, setValue, reset, watch, formState, setError } = form;

  // Load categories
  const loadCategories = async () => {
    setLoading(true);

    try {
      // Load the list (and, for subcategories, the parent's name) together
      const [res, parentRes] = await Promise.all([
        fetch(`/api/admin/category?parent=${parentId ?? "root"}`, {
          method: "GET",
          credentials: "include",
        }),
        parentId ? fetch(`/api/admin/category?id=${parentId}`, { credentials: "include" }) : null,
      ]);

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();

      if (parentRes) {
        const parentData = parentRes.ok ? await parentRes.json() : null;
        setParent(parentData?.data?.[0] ?? null);
      }

      setCategories(data.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open Add Modal
  const openAdd = () => {
    setEditCat(null);

    reset({
      title: "",
      description: null,
      image_url: undefined,
      priority: 0,
      is_active: true,
    });

    setDialogOpen(true);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <>
      <AdminPageHeader
        title={isSub ? (parent ? `${parent.title} · Subcategories` : "Subcategories") : "Categories"}
        subTitle={isSub ? "Products are added under these subcategories" : "Organize your wall art collection"}
        showBackButton={isSub}
      >
        <AddCategoryButton handleAction={openAdd} label={isSub ? "Add Subcategory" : "Add Category"} />
      </AdminPageHeader>

      {loading && <Spinner />}

      {!loading && categories.length === 0 ? (
        <NoCategory isSub={isSub} />
      ) : (
        <CategoriesListing
          setEditCat={setEditCat}
          setDialogOpen={setDialogOpen}
          data={categories}
          resetForm={reset}
          setCategories={setCategories}
          isSub={isSub}
        />
      )}

      {/* Form Modal */}
      <CategoryForm
        formControl={control}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        editCat={editCat}
        setEditCat={setEditCat}
        watch={watch}
        resetForm={reset}
        handleSubmit={handleSubmit}
        setCategories={setCategories}
        formState={formState}
        setError={setError}
        parentId={parentId}
      />
    </>
  );
};

export default CategoryPage;