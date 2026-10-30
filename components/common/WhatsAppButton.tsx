"use client"

import React, { useEffect, useState } from 'react'
import { WHATSAPP_CONTENT_TYPE, WHATSAPP_DEFAULTS } from '@/lib/constants/content.constants'

// Floating chat button. Number + pre-filled message are managed in Admin → Content → WhatsApp Button.
const WhatsAppButton = () => {

    const [setting, setSetting] = useState(WHATSAPP_DEFAULTS);

    useEffect(() => {
        fetch(`/api/content?type=${WHATSAPP_CONTENT_TYPE}`)
            .then((res) => res.json())
            .then((json) => {
                const item = json?.success ? json.data?.data?.[0] : null;
                if (item?.title) setSetting({ phone: item.title, message: item.description ?? '' });
            })
            .catch(() => { /* keep defaults */ });
    }, []);

    const href = `https://wa.me/${setting.phone}${setting.message ? `?text=${encodeURIComponent(setting.message)}` : ''}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
        >
            <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden="true">
                <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.29.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16.004 3Zm0 23.64c-1.98 0-3.91-.53-5.6-1.54l-.4-.24-3.96 1.04 1.06-3.86-.26-.4A10.6 10.6 0 0 1 5.36 16c0-5.87 4.77-10.64 10.64-10.64S26.64 10.13 26.64 16 21.87 26.64 16 26.64Zm5.84-7.97c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
            </svg>
        </a>
    )
}

export default WhatsAppButton
