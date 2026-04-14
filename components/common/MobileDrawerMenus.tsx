"use client"

import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
import Link from 'next/link';
import { ChevronDown, ChevronUp, Heart, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
    LayoutGrid,
    TrendingUp,
    Tag,
    LogIn,
    ClipboardList,
    BookOpen,
    HelpCircle,
    Info,
    Phone,
    MapPin,
    Shield,
    FileText,
    CornerDownLeft,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

interface MenuChild {
    to: string
    label: string
}

interface MenuItem {
    to: string
    label: string
    icon: React.ReactNode
    expandable?: boolean
    children?: MenuChild[]
}

interface MenuSection {
    label: string
    items: MenuItem[]
}

const categories = [
    {
        "id": "533effe5-ab10-4616-95b8-cd0054a46d7b",
        "title": "Special Gifts",
    },
    {
        "id": "a535fd19-29b9-42ad-bfb8-318937bdd6f4",
        "title": "Photo Frames",
    },
    {
        "id": "5ae4ee6c-9ed8-483c-8128-6cbb60b6ce10",
        "title": "Wall Clocks",
    }
]

const menuSections: MenuSection[] = [
    {
        label: "SHOP",
        items: [
            {
                to: "/store",
                label: "Categories",
                icon: <LayoutGrid className="h-5 w-5" />,
                expandable: true,
                children: categories.map(c => ({ to: `/store?category=${c.id}`, label: c.title })),
            },
            {
                to: "/store",
                label: "Trending design",
                icon: <TrendingUp className="h-5 w-5" />,
                expandable: true,
                children: categories.map(c => ({ to: `/store?trending=${c.id}`, label: c.title })),
            },
            {
                to: "/wishlist",
                label: "Wishlist",
                icon: <Heart className="h-5 w-5" />,
            },
            {
                to: "/offers",
                label: "Offers",
                icon: <Tag className="h-5 w-5" />,
            },
        ],
    },
    {
        label: "ACCOUNT",
        items: [
            {
                to: "/store/account",
                label: "Login / Signup",
                icon: <LogIn className="h-5 w-5" />,
            },
            {
                to: "/account/orders",
                label: "My Orders",
                icon: <ClipboardList className="h-5 w-5" />,
            },
        ],
    },
    {
        label: "EXPLORE",
        items: [
            {
                to: "/blogs",
                label: "Blogs",
                icon: <BookOpen className="h-5 w-5" />,
            },
            {
                to: "/faq",
                label: "FAQ",
                icon: <HelpCircle className="h-5 w-5" />,
            },
            {
                to: "/about",
                label: "About",
                icon: <Info className="h-5 w-5" />,
            },
        ],
    },
    {
        label: "HELP",
        items: [
            {
                to: "/contact",
                label: "Contact",
                icon: <Phone className="h-5 w-5" />,
            },
            {
                to: "/track-order",
                label: "Track Order",
                icon: <MapPin className="h-5 w-5" />,
            },
        ],
    },
    {
        label: "POLICY & LEGAL",
        items: [
            {
                to: "/privacy-policies",
                label: "Privacy Policy",
                icon: <Shield className="h-5 w-5" />,
            },
            {
                to: "/terms-condition",
                label: "Terms & Conditions",
                icon: <FileText className="h-5 w-5" />,
            },
            {
                to: "/return-policy",
                label: "Return Policy",
                icon: <CornerDownLeft className="h-5 w-5" />,
            },
        ],
    },
]

const MobileDrawerMenus = ({ open, close }: { open: boolean; close: (open: boolean) => void }) => {

    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState("")
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({ categories: true })

    const toggleExpand = (key: string) => {
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }))
    }

    /**
     * Normalizes a pathname:
     * - Lowercases it
     * - Strips trailing slashes
     * - Decodes URI components (%20, %2F etc.)
     * so "/Store/", "/store/", "/store" all resolve to "/store"
     */
    const normalizePath = (p: string): string => {
        if (!p) return "/"
        try {
            return decodeURIComponent(p)
                .toLowerCase()
                .replace(/\/+$/, "")
                || "/"
        } catch {
            return p.toLowerCase().replace(/\/+$/, "") || "/"
        }
    }

    /**
     * isActive handles every possible URL shape:
     *
     * 1. Exact path only             → "/store/account"
     * 2. Path + single param         → "/store?wishlist=true"
     * 3. Path + multiple params      → "/store?category=xxx&page=2"
     * 4. Trailing slash variants     → "/store/" treated same as "/store"
     * 5. Case-insensitive paths      → "/Store/Account" = "/store/account"
     * 6. No query on stored URL      → only pathname must match
     * 7. Extra params on live URL    → still matches if all stored params present
     * 8. Encoded characters          → %2F, %20, + all decoded before compare
     * 9. Malformed URLs              → safely caught and returns false
     * 10. Value with path segment    → "/store?category=533effe5/edit" won't
     *                                  match "/store?category=533effe5"
     */
    const isActive = (url: string): boolean => {
        if (!url || typeof url !== "string") return false

        const questionIdx = url.indexOf("?")
        const rawPath = questionIdx === -1 ? url : url.slice(0, questionIdx)
        const rawQuery = questionIdx === -1 ? "" : url.slice(questionIdx + 1)

        const storedPath = normalizePath(rawPath)
        const livePath = normalizePath(pathname)

        if (storedPath !== livePath) return false

        // ✅ KEY FIX:
        // If stored URL has NO query → only match when live URL also has NO query params
        if (!rawQuery) {
            return searchParams.toString() === ""
        }

        // Stored URL has query → check all stored params exist in live URL
        let storedParams: URLSearchParams
        try {
            storedParams = new URLSearchParams(rawQuery)
        } catch {
            return false
        }

        for (const [key, value] of storedParams.entries()) {
            const liveValue = searchParams.get(key)
            if (liveValue === null) return false
            if (decodeURIComponent(liveValue) !== decodeURIComponent(value)) return false
        }

        return true
    }

    /**
     * isParentActive — for expandable parent items only.
     * 
     * A parent is active ONLY when:
     * - Its own path matches the live URL, AND
     * - None of its children are currently active
     * 
     * This prevents "Categories" and "Trending design" both lighting up
     * when a child like "Wall Clocks" is the actual active item.
     */
    const isParentActive = (item: MenuItem): boolean => {
        if (item.children?.some(child => isActive(child.to))) return false
        return isActive(item.to)
    }

    const activeClass = "text-primary font-semibold"
    const inactiveClass = "text-foreground"

    return (
        <Sheet open={open} onOpenChange={() => close(false)}>
            <SheetContent
                side="left"
                className="w-[300px] sm:w-[340px] p-0 overflow-y-auto bg-white"
                showCloseButton={false}
            >
                <SheetHeader className="p-4 pb-2 border-b border-lightBackground sticky top-0 z-10 bg-white">
                    <SheetTitle className="text-center">
                        <Link href="/" onClick={() => close(false)} className="inline-block">
                            <img
                                src="/logo/logo.svg"
                                alt="Crystal Wall Art"
                                className="h-9 w-auto"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    target.nextElementSibling?.classList.remove('hidden')
                                }}
                            />
                            <span className="hidden font-display text-lg sm:text-xl font-bold tracking-tight">
                                <span className="text-primary">CRYSTAL</span>
                                <span className="block text-xs tracking-[0.2em] text-primary font-medium -mt-1">
                                    WALL ART
                                </span>
                            </span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                {/* Search in drawer */}
                <div className="px-4 py-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for you"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 rounded-full bg-muted/60 border-0 text-xs py-5"
                        />
                    </div>
                </div>

                {/* Menu Sections */}
                <div className="pb-6">
                    {menuSections.map((section) => (
                        <div key={section.label} className="pt-4">
                            <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground tracking-wider">
                                {section.label}
                            </p>
                            <div className="space-y-0.5">
                                {section.items.map((item) =>
                                    item.expandable ? (
                                        <Collapsible
                                            key={item.label}
                                            open={expandedItems[item.label.toLowerCase()] ?? false}
                                            onOpenChange={() => toggleExpand(item.label.toLowerCase())}
                                        >
                                            <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 transition-colors">
                                                <span
                                                    className={`flex items-center gap-3 text-sm
                                                        ${isParentActive(item) ? activeClass : "text-black"}`}
                                                >
                                                    {item.icon}
                                                    {item.label}
                                                </span>
                                                {expandedItems[item.label.toLowerCase()]
                                                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                }
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <div className="pl-12 pr-4 space-y-0.5">
                                                    {item.children?.map((child) => (
                                                        <Link
                                                            key={child.label}
                                                            href={child.to}
                                                            onClick={() => close(false)}
                                                            className={`block py-2 text-sm transition-colors
                                                                ${isActive(child.to) ? activeClass : inactiveClass}`}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                    {(!item.children || item.children.length === 0) && (
                                                        <p className="py-2 text-xs text-muted-foreground italic">
                                                            Coming soon
                                                        </p>
                                                    )}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <Link
                                            key={item.label}
                                            href={item.to}
                                            onClick={() => close(false)}
                                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium 
                                                transition-colors hover:bg-muted/50
                                                ${isActive(item.to) ? activeClass : inactiveClass}`}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileDrawerMenus