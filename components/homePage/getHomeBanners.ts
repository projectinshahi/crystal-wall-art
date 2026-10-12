// Server-side loader for admin-managed homepage banners (Admin → Content), ordered by priority.

export type HomeBanner = {
    url: string;               // image or video (see isVideoUrl)
    mobileUrl: string | null;  // hero only
    link: string | null;
};

const parseUrl = (raw: string | null): string | null => {
    try {
        return raw ? JSON.parse(raw).url ?? null : null;
    } catch {
        return null;
    }
};

export async function getHomeBanners(type: string): Promise<HomeBanner[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/content?type=${encodeURIComponent(type)}&active=true`, { cache: 'no-store' });
        const json = await res.json();
        const rows: any[] = json?.success ? json.data?.data ?? [] : [];

        return rows
            .sort((a, b) => a.priority - b.priority)
            .map((row) => ({ url: parseUrl(row.image), mobileUrl: parseUrl(row.mobile_image), link: row.link_url || null }))
            .filter((banner): banner is HomeBanner => Boolean(banner.url));
    } catch {
        return [];
    }
}
