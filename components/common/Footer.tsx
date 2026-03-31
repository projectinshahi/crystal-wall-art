"use client"

import { Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import Container from '../Container/Container';

const Footer = () => {
    return (
        <footer className="bg-lightGray text-black mt-12 sm:mt-16">
            <Container className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14'>
                <div className='flex flex-col sm:flex-row gap-3 justify-between items-center sm:items-start'>
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-10 justify-center sm:justify-start items-center sm:items-start'>
                        <Link href="/" className="inline-block mb-4">
                            <img
                                src="/logo/logo2.svg"
                                alt="Crystal Wall Art"
                                className="h-[170px] w-auto"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </Link>

                        <ul className="space-y-2 text-center sm:text-left">
                            {["Privacy Policy", "Terms & Conditions", "Return Policy", "Shipping Policy"].map(label => (
                                <li key={label}>
                                    <span className="text-sm text-black hover:text-black54 transition-colors cursor-pointer">
                                        {label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='flex flex-row gap-3 mt-6 sm:mt-0'>
                        <Instagram className='text-black' />
                        <Facebook className='text-black' />
                    </div>

                </div>

                <div className="border-t border-lightBackground mt-8 pt-6 text-center">
                    <p className="text-xs text-[#262525]/59">
                        © {new Date().getFullYear()} Crystal Wall Art. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    )
}

export default Footer