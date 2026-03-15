import { Button } from '@radix-ui/themes';
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

interface LayoutContainerProps {
    children: React.ReactNode
}

const DESKTOP_NAV = [
    { to: "/store", label: "Shop" },
    { to: "/store/about", label: "About" },
    { to: "/store/contact", label: "Contact" },
    { to: "/store/track-order", label: "Track Order" },
  ];

const LayoutContainer = ({ children }: LayoutContainerProps) => {

    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <header className='sticky top-0 z-40 bg-white'>
            {/* Main nav bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Left: hamburger (mobile) */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
                            aria-label="Open menu"
                        >
                            <Menu className="h-6 w-6 text-primary" />
                        </button>
                    </div>

                    {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {DESKTOP_NAV.map((link) => (
                <Link key={link.to} href={link.to}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-sm ${
                      isActive(link.to)
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
                </div>
            </div>
            {children}
        </header>
    )
}

export default LayoutContainer