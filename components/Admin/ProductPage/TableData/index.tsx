"use client"

import React from 'react'
import DesktopData from './DesktopData'
import { useIsMobile } from '@/hooks/use-mobile';

const TableData = () => {

    const isMobile = useIsMobile();

    return (
        <DesktopData />
    )
}

export default TableData