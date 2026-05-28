"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryTypes } from "@/types/Admin/categories.types";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  search: string;
  setSearch: (v: string) => void;

  statusFilter: string;
  setStatusFilter: (v: string) => void;

  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
}

const Filters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}: Props) => {

    const [categories, setCategories] = useState<CategoryTypes[]>([]);

    const fetchCategories = async () => {
        const res = await fetch("/api/admin/category", {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data.data || []);
    }

    useEffect(() => {
        fetchCategories()
    }, [])
    
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      
      {/* SEARCH */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filters;