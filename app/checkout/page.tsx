"use client"

import { useStoreLayout } from '@/components/common/LayoutContext/LayoutContext';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useEffect, useState } from 'react'

const page = () => {
    const isMobile = useIsMobile();
    const { setOverride } = useStoreLayout();

    const [loading, setLoading] = useState<boolean>(true);

    const isMobileCustomizer = isMobile && !loading;

    useEffect(() => {
        if (isMobileCustomizer) {
            setOverride({ headerMode: "full", showFooter: true });
        }
        setLoading(false)
        return () => setOverride(null);
    }, [isMobileCustomizer, setOverride]);

    return (
        <div>page</div>
    )
}

export default page