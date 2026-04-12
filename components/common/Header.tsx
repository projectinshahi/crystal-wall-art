"use client"

import { Heart, Menu, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useState } from 'react'
import { Button } from '../ui/button';
import MobileDrawerMenus from './MobileDrawerMenus';
import Container from '../Container/Container';

const DESKTOP_NAV = [
    { to: "/", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/track-order", label: "Track Order" },
];

const Header = ({ cartOpen, setCartOpen }: any) => {


    const [drawerOpen, setDrawerOpen] = useState(false);

    const cartItemCount = 10;

    const pathname = usePathname();

    const isActive = (path: string) => pathname === path

    return (
        <>
            <header className='bg-white border-b-2 border-primary'>
                {/* Main nav bar */}
                <Container>
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Left: hamburger (mobile) */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Open menu"
                                onClick={() => setDrawerOpen(true)}
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
                                        className={`text-sm cursor-pointer ${isActive(link.to)
                                            ? "text-primary font-semibold"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {link.label}
                                    </Button>
                                </Link>
                            ))}
                        </nav>

                        {/* Center: Logo */}
                        <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 shrink-0">
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
                            <span className="hidden font-display text-lg sm:text-xl font-bold tracking-tight">
                                <span className="text-primary">CRYSTAL</span>
                                <span className="block text-xs tracking-[0.2em] text-primary font-medium -mt-1">WALL ART</span>
                            </span>
                        </Link>

                        {/* Right: actions */}
                        <div className="flex items-center gap-0.5 sm:gap-1">

                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-5 w-5 cursor-pointer"
                            >
                                <Heart className="h-5 w-5 text-primary" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-9 w-9 cursor-pointer"
                                onClick={() => setCartOpen(true)}
                            >
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 min-w-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Button>

                            <Link href="/account">
                                <Button variant="ghost" size="icon" className="h- w-5 cursor-pointer">
                                    <User className="h-5 w-5 text-primary" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </header>

            {/* Mobile Drawer Menu */}
            <MobileDrawerMenus open={drawerOpen} close={setDrawerOpen} />
        </>
    )
}

export default Header