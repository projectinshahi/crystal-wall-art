import React from 'react'
import CartSidebar from '../CartSidebar';
import HeaderContext from '../common/LayoutContext/LayoutContext';

interface LayoutContainerProps {
    children: React.ReactNode
}

const LayoutContainer = ({ children }: LayoutContainerProps) => {

    return (
        <>
            <HeaderContext>
                <main className='flex-1'>
                    {children}
                </main>
                <CartSidebar />
            </HeaderContext>
        </>
    )
}

export default LayoutContainer