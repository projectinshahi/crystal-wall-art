import { useEffect, useRef } from "react";
import { CartItem, useCartStore } from "@/store/cartStore";

const items = [
    {
        id: 'it1',
        image: 'https://ikiru.in/cdn/shop/products/buy-wall-decor-two-pods-abstract-wall-art-painting-frame-for-living-room-bedroom-and-home-decor-by-the-atrang-on-ikiru-online-store-4.jpg',
        title: 'Two Pods Abstract Wall Art Painting',
        size: '24 x 36 inches',
        thickness: '1.25 inches',
        mountingMethod: 'Wall Mount (Hook Included)',
        price: '2618',
        quantity: '1',
        orientation: ''
    },
    {
        id: 'it2',
        image: 'https://ikiru.in/cdn/shop/files/buy-wall-accents-selective-edition-luna-wall-art-decor-by-la-dimora-selections-on-ikiru-online-store-1.jpg',
        title: 'Luna Wall Art Decor Sculpture',
        size: '30 x 30 inches',
        thickness: '2 inches',
        mountingMethod: 'Wall Mount (Screws Required)',
        price: '18199',
        quantity: '1',
        orientation: ''
    },
    {
        id: 'it3',
        image: 'https://ikiru.in/cdn/shop/products/buy-modern-metal-wall-art-decor-for-living-room-bedroom-office-home-decoration.jpg',
        title: 'Modern Metal Wall Art Decor',
        size: '36 x 18 inches',
        thickness: '0.5 inches',
        mountingMethod: 'Wall Mount (Bracket Included)',
        price: '4999',
        quantity: '2',
        orientation: ''
    }
];

export function useCartSync() {

    useEffect(() => {
        const loadData = async () => {
            await mergeAndLoad();
        }
        loadData()
    }, []);
}


async function mergeAndLoad() {
    useCartStore.setState({ items });
}

function fromDbRow(row: any): CartItem {
    return {
        id: row.product_id,
        title: row.title,
        image: row.image,
        size: row.size,
        thickness: row.thickness,
        mountingMethod: row.mounting_method,
        orientation: row.orientation,
        price: Number(row.price),
        quantity: row.quantity,
    };
}
