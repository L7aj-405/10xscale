import { useI18n } from '../i18n/I18nContext';

const brandSlots = Array.from({ length: 8 }, (_, index) => index + 1);

function LogoGroup({ brands, hidden = false }) {
    const { t } = useI18n();
    const items = brands.length ? fillMarquee(brands) : brandSlots;

    return (
        <div
            aria-hidden={hidden || undefined}
            className="flex shrink-0 items-center gap-[18px] pe-[18px]"
        >
            {items.map((item, index) => brands.length
                ? <BrandItem brand={item} hidden={hidden || item.duplicate} key={`${hidden ? 'copy' : 'main'}-${item.id}-${index}`} />
                : (
                    <div className="flex h-[78px] w-[190px] shrink-0 items-center justify-center rounded-[10px] border border-[#3a3a3a] bg-[#151515] px-[22px] py-4" key={item}>
                        <span className="text-center font-[Archivo] text-sm font-extrabold tracking-[0.08em] text-[#dadada]">
                            {t('brands.placeholder')} {String(item).padStart(2, '0')}
                        </span>
                    </div>
                ))}
        </div>
    );
}

export default function BrandMarquee({ brands = [] }) {
    const { t } = useI18n();

    return (
        <section
            aria-label={t('brands.aria')}
            className="overflow-hidden border-b-2 border-border bg-nav py-[22px] text-on-nav"
        >
            <p className="mb-4 text-center font-['IBM_Plex_Mono'] text-[10.5px] font-semibold tracking-[0.16em] text-[#bdbdbd] uppercase">
                {t('brands.label')}
            </p>
            <div className="brand-marquee-window relative overflow-hidden before:pointer-events-none before:absolute before:inset-y-0 before:start-0 before:z-10 before:w-[90px] before:bg-linear-to-r before:from-nav before:to-transparent after:pointer-events-none after:absolute after:inset-y-0 after:end-0 after:z-10 after:w-[90px] after:bg-linear-to-l after:from-nav after:to-transparent">
                <div className="brand-marquee-track flex w-max will-change-transform">
                    <LogoGroup brands={brands} />
                    <LogoGroup brands={brands} hidden />
                </div>
            </div>
        </section>
    );
}

function BrandItem({ brand, hidden }) {
    const content = (
        <img
            alt={hidden ? '' : brand.name}
            className="max-h-12 max-w-[150px] object-contain"
            loading="lazy"
            src={brand.image_url}
        />
    );
    const className = 'flex h-[78px] w-[190px] shrink-0 items-center justify-center rounded-[10px] border border-[#3a3a3a] bg-white px-[22px] py-4';

    if (brand.website_url && !hidden) {
        return <a aria-label={brand.name} className={`${className} transition-transform hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-marker`} href={brand.website_url} rel="noreferrer" target="_blank">{content}</a>;
    }

    return <div aria-hidden={hidden || undefined} className={className}>{content}</div>;
}

function fillMarquee(brands) {
    const minimumItems = 8;
    const count = Math.max(minimumItems, brands.length);

    return Array.from({ length: count }, (_, index) => ({
        ...brands[index % brands.length],
        duplicate: index >= brands.length,
    }));
}
