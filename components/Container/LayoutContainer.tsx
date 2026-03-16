
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
            <main className='flex-1'>
                {children}
            </main>
            <CartSidebar />
        </>
    )
}

export default LayoutContainer