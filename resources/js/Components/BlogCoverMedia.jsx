export default function BlogCoverMedia({ className = '', label, post }) {
    const isVideo = post.cover_media_type === 'video' && post.cover_video_url;

    if (isVideo && post.cover_video_embed_url) {
        return (
            <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={className}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={post.cover_video_embed_url}
                title={label || 'Blog cover video'}
            />
        );
    }

    if (isVideo) {
        return (
            <video
                aria-label={label || 'Blog cover video'}
                className={className}
                controls
                playsInline
                poster={post.cover_image_url || undefined}
                preload="metadata"
                src={post.cover_video_url}
            />
        );
    }

    if (post.cover_image_url) {
        return <img alt={label || ''} className={className} loading="lazy" src={post.cover_image_url} />;
    }

    return null;
}
