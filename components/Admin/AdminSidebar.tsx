"use client";

import {
  LayoutDashboard, Package, ShoppingCart, Tag, Settings, Gem,
  FolderOpen, Image, Boxes, Users, LogOut, BarChart3, UserCheck, Ticket, Truck, Frame
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Frames", url: "/admin/frames", icon: Frame },
  { title: "Categories", url: "/admin/categories", icon: FolderOpen },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Inventory", url: "/admin/inventory", icon: Boxes },
  { title: "Customers", url: "/admin/customers", icon: UserCheck },
];

const contentItems = [
  { title: "Content", url: "/admin/content", icon: Image },
  { title: "Discounts", url: "/admin/discounts", icon: Tag },
  { title: "Coupons", url: "/admin/coupons", icon: Ticket },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
];

const systemItems = [
  { title: "Admin Users", url: "/admin/admin-users", icon: Users },
  { title: "Shipping", url: "/admin/shipping", icon: Truck },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active}>
                  <Link
                    href={item.url}
                    className={`hover:bg-sidebar-accent/50 ${active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : ""
                      }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">

          {!collapsed ? (
            <div className="flex w-30 items-center justify-center rounded-lg">
              <img
                src="/logo/logo.svg"
                alt="Crystal Wall Art"
                className="h-9 sm:h-10 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center rounded-lg">
              <img
                src="/logo/logo2.svg"
                alt="Crystal Wall Art"
                className="h-9 sm:h-10 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            </div>
          )}

        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {renderGroup("Main", mainItems)}
        {renderGroup("Content & Marketing", contentItems)}
        {renderGroup("System", systemItems)}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="mb-2 px-1 space-y-1">
            <p className="text-xs text-sidebar-foreground truncate">
              admin@demo.com
            </p>

            <Badge
              variant="outline"
              className="text-[10px] bg-primary/10 text-primary border-primary/30"
            >
              admin
            </Badge>
          </div>
        )}

        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground"
          onClick={() => console.log("logout")}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}