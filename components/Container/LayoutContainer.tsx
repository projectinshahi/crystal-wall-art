
import React from 'react'
import Header from '../common/Header';
import CartSidebar from '../CartSidebar';

interface LayoutContainerProps {
    children: React.ReactNode
}

const LayoutContainer = ({ children }: LayoutContainerProps) => {

    return (
        <>
            <Header />
            {children}
            <CartSidebar/>
        </>
    )
}

export default LayoutContainer