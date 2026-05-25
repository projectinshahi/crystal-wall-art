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

const CategoryPage = () => {
  const [editCat, setEditCat] = useState<CategoryFormInput | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<CategoryTypes[]>([]);

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
      const res = await fetch("/api/admin/category", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();

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
        title="Categories"
        subTitle="Organize your wall art collection"
      >
        <AddCategoryButton handleAction={openAdd} />
      </AdminPageHeader>

      {loading && <Spinner />}

      {!loading && categories.length === 0 ? (
        <NoCategory />
      ) : (
        <CategoriesListing
          setEditCat={setEditCat}
          setDialogOpen={setDialogOpen}
          data={categories}
          resetForm={reset}
          setCategories={setCategories}
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
      />
    </>
  );
};

export default CategoryPage;