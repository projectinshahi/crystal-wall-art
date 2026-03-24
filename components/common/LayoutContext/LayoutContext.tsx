"use client"

import React, { createContext, useCallback, useContext, useState } from 'react'
import Header from '../Header';
import BackHeader from './BackHeader';
import { usePathname } from 'next/navigation';
import Footer from '../Footer';
import CartSidebar from '@/components/CartSidebar';

export type HeaderMode = "full" | "none" | "back";

interface LayoutOverride {
    headerMode?: HeaderMode;
    backTitle?: string;
    onBack?: () => void;
    backRightAction?: React.ReactNode;
    showFooter?: boolean;
    showSearch?: boolean;
    search?: string;
    onSearchChange?: (v: string) => void;
}

interface RouteLayoutContextValue {
    setOverride: (o: LayoutOverride | null) => void;
}


const RouteLayoutContext = createContext<RouteLayoutContextValue>({
    setOverride: () => { },
});

/** Pages call this hook to override the global layout header/footer */
export function useStoreLayout() {
    return useContext(RouteLayoutContext);
}

/**
 * Maps pathname → default header mode.
 * Pages can override via useStoreLayout().setOverride(...)
 */
function getDefaultMode(pathname: string): { headerMode: HeaderMode; backTitle?: string; showFooter?: boolean; showSearch?: boolean } {
    // No header pages
    if (pathname === "/checkout") return { headerMode: "back", backTitle: "Checkout", showFooter: false };
    if (pathname.startsWith("/order-success")) return { headerMode: "none", showFooter: false };

    // Back-header pages
    if (pathname.startsWith("/store/order/")) return { headerMode: "back", backTitle: "Order Details", showFooter: false };
    if (pathname === "/track-order") return { headerMode: "full", showSearch: false };

    // Full navbar pages
    if (pathname === "/") return { headerMode: "full", showSearch: true };
    if (pathname.startsWith("/product/")) return { headerMode: "full", showSearch: false };
    if (pathname === "/about") return { headerMode: "full", showSearch: false };
    if (pathname === "/contact") return { headerMode: "full", showSearch: false };
    if (pathname === "/account") return { headerMode: "full", showSearch: false };

    // Fallback
    return { headerMode: "full", showSearch: false };
}

const LayoutContext = ({ children }: { children: React.ReactNode }) => {

    const pathname = usePathname();

    const [override, setOverrideState] = useState<LayoutOverride | null>(null);

    const setOverride = useCallback((o: LayoutOverride | null) => {
        setOverrideState(o);
    }, []);

    const defaults = getDefaultMode(pathname);
    const headerMode = override?.headerMode ?? defaults.headerMode;
    const backTitle = override?.backTitle ?? defaults.backTitle;
    const showFooter = override?.showFooter ?? defaults.showFooter ?? headerMode === "full";
    const onBack = override?.onBack;

    return (
        <RouteLayoutContext.Provider value={{ setOverride }}>
            {headerMode === "full" && (
                <Header />
            )}
            {headerMode === "back" && (
                <BackHeader title={backTitle} onBack={onBack} />
            )}
            <main className='flex-1'>
                {children}
            </main>
            <CartSidebar />
            {showFooter && <Footer />}
        </RouteLayoutContext.Provider >
    )
}

export default LayoutContext