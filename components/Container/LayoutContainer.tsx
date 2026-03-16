
import React from 'react'
import Header from '../common/Header';

interface LayoutContainerProps {
    children: React.ReactNode
}

const LayoutContainer = ({ children }: LayoutContainerProps) => {

    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default LayoutContainer