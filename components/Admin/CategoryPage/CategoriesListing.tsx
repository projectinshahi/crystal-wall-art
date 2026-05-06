"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CategoryTypes } from "@/types/Admin/categories.types";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { UseFormReset } from "react-hook-form";
import { CategoryFormInput } from "@/schema/category.schema";
import { Typography } from "@/components/ui/Typography";
import { toast } from "sonner";
import AppDialog from "../Common/AppDialog";
import { DialogClose } from "@/components/ui/dialog";
import { useState } from "react";

type ImageType = {
  url: string;
  public_id: string;
};

interface Props {
  setEditCat: (editCat: CategoryFormInput | null) => void;
  setDialogOpen: (dialogOpen: boolean) => void;
  data: CategoryTypes[];
  resetForm: UseFormReset<CategoryFormInput>;
  setCategories: React.Dispatch<React.SetStateAction<CategoryTypes[]>>;
}

const CategoriesListing = ({
  setEditCat,
  setDialogOpen,
  data,
  resetForm,
  setCategories
}: Props) => {

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);

  const [selectedDeleteId, setSelectedDeleteId] =
    useState<string | null>(null);

  // ✅ DB → Form mapper
  const mapDbToForm = (c: CategoryTypes): CategoryFormInput => {
    let image: any | undefined = undefined;

    try {
      image = c.image_url ? JSON.parse(c.image_url) : undefined;
    } catch (err) {
      console.error("Invalid image JSON", err);
    }

    return {
      id: c.id,
      title: c.title,
      description: c.description ?? null,
      image_url: image,
      priority: c.priority ?? 0,
      is_active: c.is_active ?? true,
    };
  };

  // ✅ Edit handler (DB → Form)
  const openEdit = (c: CategoryTypes) => {
    const formData = mapDbToForm(c);

    setEditCat(formData);
    resetForm(formData);
    setDialogOpen(true);
  };

  // ✅ Delete handler
  const handleDelete = async (id: string) => {

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/category/${id}`, {
        method: "DELETE",
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Delete failed");
      }

      // ✅ Update state AFTER success
      setCategories((prev) => prev.filter((cat) => cat.id !== id));

      // ✅ Success toast
      toast.success("Category deleted successfully");
      setDeleteOpen(false);

    } catch (error: any) {
      console.error("🔥 Delete failed:", error.message);

      toast.error(error.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  // ✅ Toggle active
  const toggleActive = async (id: string, value: boolean) => {
    try {
      const res = await fetch(`/api/admin/category/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: value }),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update status");
      }

      // ✅ Update state ONLY after success
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, is_active: value } : cat
        )
      );

      // ✅ Success toast
      toast.success(
        value ? "Category activated" : "Category deactivated"
      );

    } catch (error: any) {
      console.error("🔥 Update failed:", error.message);

      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((c: CategoryTypes, index: number) => {
          let image: { url: string; public_id: string } | null = null;
          image = c.image_url ? JSON.parse(c.image_url) : null;

          return (
            <Card key={index} className="border-border/50">
              <CardContent className="p-4">

                {/* Image */}
                {image && (
                  <div className="relative w-full h-32 mb-3">
                    <Image
                      src={image.url}
                      alt={c.title || "image"}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex items-start justify-between">
                  <div>
                    <Typography variant="body" className="font-semibold">{c.title}</Typography>

                    {c.description && (
                      <Typography variant="body-sm" className="text-muted-foreground">{c.description}</Typography>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">
                        Priority: {c.priority}
                      </Badge>

                      <Badge variant={c.is_active ? "default" : "destructive"}>
                        {c.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">

                  <Switch
                    checked={c.is_active}
                    className="cursor-pointer"
                    onCheckedChange={(val) => toggleActive(c.id, val)}
                  />

                  <div className="flex gap-1">

                    {/* Button for Edit */}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(c)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>


                    {/* Button for Delete and Alery Dialog Box */}
                    <AppDialog
                      key={index}
                      open={selectedDeleteId === c.id}

                      onOpenChange={(open) => {
                        if (open) {
                          setSelectedDeleteId(c.id);
                        } else {
                          setSelectedDeleteId(null);
                        }
                      }}
                      trigger={
                        <Button
                          size="icon"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      }
                      showClose={false}
                      title="Delete Category"
                      description="This action cannot be undone."
                      content={
                        <Typography>
                          Do you want to delete this category permanently?
                        </Typography>
                      }
                      footer={
                        <>
                          <DialogClose asChild>
                            <Button>Cancel</Button>
                          </DialogClose>
                          <Button variant="destructive"
                            onClick={() => handleDelete(c.id)}>
                            {deleting ? "Deleting..." : "Delete"}
                          </Button>
                        </>
                      }
                      disableOutsideClose
                    />
                  </div>

                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  );
};

export default CategoriesListing;