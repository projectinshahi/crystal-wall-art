"use client"

import { ArrowLeft } from 'lucide-react'
import Container from '../Container/Container'

const PageHeader = ({ title, handleBack }: { title?: string, handleBack?: () => void }) => {
    return (
        <div className='w-full relative'>
            <Container>
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {handleBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 cursor-pointer"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="h-5 w-5 text-primary" />
                        </button>
                    )}
                    {title && (
                        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold truncate max-w-[60%] text-black capitalize">
                            {title}
                        </h1>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default PageHeader