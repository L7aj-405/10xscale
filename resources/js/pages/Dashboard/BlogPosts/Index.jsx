import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../../Components/Dashboard/DashboardLayout';
import BlogCoverMedia from '../../../Components/BlogCoverMedia';
import PageHeader from '../../../Components/Dashboard/PageHeader';

const locales = [
    ['en', 'English'],
    ['fr', 'French'],
    ['ar', 'Arabic'],
];

export default function Index({ posts, storeUrl }) {
    const [editor, setEditor] = useState(null);
    const [deleting, setDeleting] = useState(null);

    return (
        <DashboardLayout title="Blog posts">
            <PageHeader eyebrow="Content management" title="Blog posts" description="Create, translate, schedule and publish articles for the retention journal." />

            <section className="overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-soft px-5 py-5 min-[700px]:px-7">
                    <div>
                        <h2 className="font-[Archivo] text-xl font-black">Published and draft articles</h2>
                        <p className="mt-1 text-sm text-copy-muted">{posts.length} active record{posts.length === 1 ? '' : 's'}</p>
                    </div>
                    <button className={primaryButtonClass} onClick={() => setEditor({ mode: 'create' })} type="button">+ Add blog post</button>
                </div>

                {posts.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[880px] border-collapse text-left">
                            <thead className="bg-surface-muted font-['IBM_Plex_Mono'] text-[10px] tracking-[0.1em] text-copy-muted uppercase">
                                <tr><th className="px-6 py-3">Article</th><th className="px-5 py-3">Author</th><th className="px-5 py-3">Publish date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-center">Order</th><th className="px-6 py-3 text-right">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-border-soft">
                                {posts.map((post) => <PostRow key={post.id} onDelete={() => setDeleting(post)} onEdit={() => setEditor({ mode: 'edit', post })} post={post} />)}
                            </tbody>
                        </table>
                    </div>
                ) : <EmptyState onAdd={() => setEditor({ mode: 'create' })} />}
            </section>

            {editor ? <PostEditorModal onClose={() => setEditor(null)} post={editor.post} storeUrl={storeUrl} /> : null}
            {deleting ? <DeleteModal onClose={() => setDeleting(null)} post={deleting} /> : null}
        </DashboardLayout>
    );
}

function PostRow({ onDelete, onEdit, post }) {
    return (
        <tr className="cursor-pointer hover:bg-surface-muted" onClick={onEdit}>
            <td className="px-6 py-4"><div className="flex items-center gap-3"><Cover post={post} /><div className="min-w-0"><p className="max-w-[320px] truncate font-[Archivo] text-sm font-bold">{post.title.en}</p><p className="mt-0.5 max-w-[320px] truncate text-xs text-copy-muted">/{post.slug}</p></div></div></td>
            <td className="px-5 py-4 text-sm">{post.author}</td>
            <td className="px-5 py-4 text-sm text-copy-muted">{post.published_at ? post.published_at.slice(0, 10) : 'Not scheduled'}</td>
            <td className="px-5 py-4"><Status post={post} /></td>
            <td className="px-5 py-4 text-center"><span className="rounded-lg bg-surface-muted px-2 py-1 text-xs font-bold">{post.position}</span></td>
            <td className="px-6 py-4"><div className="flex justify-end gap-2">{post.is_live ? <a className={iconButtonClass} href={post.public_url} onClick={(event) => event.stopPropagation()} target="_blank" title="View article">↗</a> : null}<button className={iconButtonClass} onClick={(event) => { event.stopPropagation(); onEdit(); }} type="button">Edit</button><button className={`${iconButtonClass} text-leak`} onClick={(event) => { event.stopPropagation(); onDelete(); }} type="button">Delete</button></div></td>
        </tr>
    );
}

function PostEditorModal({ onClose, post, storeUrl }) {
    const editing = Boolean(post);
    const [locale, setLocale] = useState('en');
    const form = useForm(editing ? postForm(post, true) : emptyPost());
    useModal(onClose, form.processing);

    const submit = (event) => {
        event.preventDefault();
        form.post(editing ? post.update_url : storeUrl, { forceFormData: true, preserveScroll: true, onSuccess: onClose });
    };

    return (
        <Modal onClose={() => !form.processing && onClose()}>
            <form className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border-soft bg-surface shadow-2xl" onSubmit={submit}>
                <div className="flex items-start justify-between gap-5 border-b border-border-soft px-5 py-5 min-[700px]:px-7">
                    <div><p className="font-['IBM_Plex_Mono'] text-[10px] font-bold tracking-[0.14em] text-copy-muted uppercase">{editing ? 'Edit article' : 'New article'}</p><h2 className="mt-1 font-[Archivo] text-2xl font-black">{editing ? post.title.en : 'Add blog post'}</h2></div>
                    <button className={iconButtonClass} disabled={form.processing} onClick={onClose} type="button">×</button>
                </div>

                <div className="overflow-y-auto px-5 py-6 min-[700px]:px-7">
                    {form.hasErrors ? <div className="mb-5 rounded-xl border border-leak/30 bg-leak/10 px-4 py-3 text-sm font-semibold text-leak" role="alert">Please review the highlighted fields.</div> : null}

                    <div className="grid gap-5 min-[760px]:grid-cols-2">
                        <Field error={form.errors.slug} label="Slug (leave empty to generate)"><input className={inputClass} onChange={(event) => form.setData('slug', slugify(event.target.value))} placeholder="article-url-slug" value={form.data.slug} /></Field>
                        <Field error={form.errors.author} label="Author"><input className={inputClass} onChange={(event) => form.setData('author', event.target.value)} required value={form.data.author} /></Field>
                        <Field error={form.errors.published_at} label="Publish date and time"><input className={inputClass} onChange={(event) => form.setData('published_at', event.target.value)} type="datetime-local" value={form.data.published_at} /></Field>
                        <div className="grid grid-cols-2 gap-3"><Field error={form.errors.reading_minutes} label="Reading minutes"><input className={inputClass} min="1" onChange={(event) => form.setData('reading_minutes', Number(event.target.value))} required type="number" value={form.data.reading_minutes} /></Field><Field error={form.errors.position} label="Display order"><input className={inputClass} min="0" onChange={(event) => form.setData('position', Number(event.target.value))} required type="number" value={form.data.position} /></Field></div>
                    </div>

                    <div className="mt-6 flex gap-2 rounded-xl bg-surface-muted p-1.5">
                        {locales.map(([value, label]) => <button className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${locale === value ? 'bg-surface shadow-sm' : 'text-copy-muted'}`} key={value} onClick={() => setLocale(value)} type="button">{label}</button>)}
                    </div>

                    <fieldset className="mt-5 rounded-xl border border-border-soft p-4 min-[700px]:p-5" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                        <legend className="px-2 font-['IBM_Plex_Mono'] text-[10px] font-bold tracking-[0.12em] text-copy-muted uppercase">{locales.find(([value]) => value === locale)[1]} content</legend>
                        <div className="grid gap-4">
                            <Field error={nestedError(form.errors, `title.${locale}`)} label="Title"><input className={inputClass} onChange={(event) => setLocalized(form, 'title', locale, event.target.value)} required={locale === 'en'} value={form.data.title[locale]} /></Field>
                            <div className="grid gap-4 min-[700px]:grid-cols-2"><Field error={nestedError(form.errors, `category.${locale}`)} label="Category"><input className={inputClass} onChange={(event) => setLocalized(form, 'category', locale, event.target.value)} required={locale === 'en'} value={form.data.category[locale]} /></Field><Field error={nestedError(form.errors, `visual.${locale}`)} label="Cover badge"><input className={inputClass} onChange={(event) => setLocalized(form, 'visual', locale, event.target.value)} value={form.data.visual[locale]} /></Field></div>
                            <Field error={nestedError(form.errors, `excerpt.${locale}`)} label="Excerpt"><textarea className={`${inputClass} min-h-24 resize-y`} maxLength="700" onChange={(event) => setLocalized(form, 'excerpt', locale, event.target.value)} required={locale === 'en'} value={form.data.excerpt[locale]} /></Field>
                            <Field error={nestedError(form.errors, `content.${locale}`)} label="Article content (blank lines create paragraphs)"><textarea className={`${inputClass} min-h-64 resize-y font-normal leading-relaxed`} maxLength="50000" onChange={(event) => setLocalized(form, 'content', locale, event.target.value)} required={locale === 'en'} value={form.data.content[locale]} /></Field>
                            <Field error={nestedError(form.errors, `cover_label.${locale}`)} label="Cover image accessibility label"><input className={inputClass} onChange={(event) => setLocalized(form, 'cover_label', locale, event.target.value)} value={form.data.cover_label[locale]} /></Field>
                        </div>
                    </fieldset>

                    <div className="mt-6 rounded-xl border border-border-soft p-4 min-[700px]:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div><h3 className="font-[Archivo] text-lg font-black">Cover media</h3><p className="mt-1 text-xs leading-relaxed text-copy-muted">Choose what visitors see at the top of the article and on Blog cards.</p></div>
                            <div className="inline-flex rounded-xl bg-surface-muted p-1">
                                <MediaChoice active={form.data.cover_media_type === 'image'} label="Image" onClick={() => form.setData('cover_media_type', 'image')} />
                                <MediaChoice active={form.data.cover_media_type === 'video'} label="Video" onClick={() => form.setData('cover_media_type', 'video')} />
                            </div>
                        </div>

                        <div className="mt-5 grid items-start gap-5 min-[760px]:grid-cols-[220px_minmax(0,1fr)]">
                            <Cover large post={post ? { ...post, cover_media_type: form.data.cover_media_type } : null} />
                            <div className="grid gap-5">
                                <Field error={form.errors.cover_image} label={post?.cover_image_url ? 'Replace cover image (optional)' : form.data.cover_media_type === 'video' ? 'Video poster image (optional)' : 'Cover image (optional)'}><input accept="image/png,image/jpeg,image/webp" className={fileClass} onChange={(event) => form.setData('cover_image', event.target.files[0] ?? null)} type="file" /><span className="mt-2 block text-xs font-normal text-copy-muted">PNG, JPG or WEBP up to 5 MB. Recommended ratio: 16:9. For videos, this image is used as the loading poster and fallback.</span></Field>

                                {form.data.cover_media_type === 'video' ? (
                                    <div>
                                        <p className="text-sm font-semibold">Video source</p>
                                        <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-surface-muted p-1.5">
                                            <MediaChoice active={form.data.cover_video_source === 'upload'} label="Upload file" onClick={() => form.setData('cover_video_source', 'upload')} />
                                            <MediaChoice active={form.data.cover_video_source === 'url'} label="External URL" onClick={() => form.setData('cover_video_source', 'url')} />
                                        </div>

                                        {form.data.cover_video_source === 'upload' ? (
                                            <Field error={form.errors.cover_video} label={post?.cover_video_source === 'upload' ? 'Replace hosted video (optional)' : 'Video file'}><input accept="video/mp4,video/webm,video/ogg,video/quicktime" className={fileClass} onChange={(event) => form.setData('cover_video', event.target.files[0] ?? null)} required={!(post?.cover_video_source === 'upload' && post?.cover_video_url)} type="file" /><span className="mt-2 block text-xs font-normal text-copy-muted">MP4, WEBM, OGG or MOV up to 100 MB. MP4 is recommended for broad browser support.</span></Field>
                                        ) : (
                                            <Field error={form.errors.cover_video_url} label="External video URL"><input className={inputClass} onChange={(event) => form.setData('cover_video_url', event.target.value)} placeholder="https://youtube.com/watch?v=… or https://example.com/video.mp4" required type="url" value={form.data.cover_video_url} /><span className="mt-2 block text-xs font-normal text-copy-muted">YouTube and Vimeo open in an embedded player. Direct HTTPS video links use the native video player.</span></Field>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <label className="mt-6 inline-flex cursor-pointer items-center gap-3 rounded-xl border border-border-soft bg-surface-muted px-4 py-3 text-sm font-bold"><input checked={form.data.is_published} className="size-4 accent-[var(--color-marker)]" onChange={(event) => form.setData('is_published', event.target.checked)} type="checkbox" />Published and visible on the website</label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-border-soft bg-surface-muted px-5 py-4 min-[520px]:flex-row min-[520px]:justify-end min-[700px]:px-7"><button className={secondaryButtonClass} disabled={form.processing} onClick={onClose} type="button">Cancel</button><button className={primaryButtonClass} disabled={form.processing} type="submit">{form.processing ? 'Saving…' : 'Save post'}</button></div>
            </form>
        </Modal>
    );
}

function DeleteModal({ onClose, post }) {
    const [processing, setProcessing] = useState(false);
    useModal(onClose, processing);
    const remove = () => { setProcessing(true); router.delete(post.delete_url, { preserveScroll: true, onSuccess: onClose, onFinish: () => setProcessing(false) }); };
    return <Modal onClose={() => !processing && onClose()}><div className="w-full max-w-md rounded-2xl border border-border-soft bg-surface p-7 shadow-2xl"><div className="grid size-12 place-items-center rounded-full bg-leak/10 text-leak">!</div><h2 className="mt-5 font-[Archivo] text-2xl font-black">Delete blog post?</h2><p className="mt-2 leading-relaxed text-copy-muted"><strong className="text-foreground">{post.title.en}</strong> will disappear from the website. The database record is soft deleted and remains recoverable.</p><div className="mt-7 flex justify-end gap-3"><button className={secondaryButtonClass} onClick={onClose} type="button">Cancel</button><button className="rounded-xl bg-leak px-5 py-3 text-sm font-bold text-white" disabled={processing} onClick={remove} type="button">{processing ? 'Deleting…' : 'Delete post'}</button></div></div></Modal>;
}

function Modal({ children, onClose }) { return <div aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="dialog">{children}</div>; }
function useModal(onClose, locked) { useEffect(() => { const old = document.body.style.overflow; const key = (event) => event.key === 'Escape' && !locked && onClose(); document.body.style.overflow = 'hidden'; window.addEventListener('keydown', key); return () => { document.body.style.overflow = old; window.removeEventListener('keydown', key); }; }, [locked, onClose]); }
function Cover({ large = false, post }) {
    if (large && post && (post.cover_image_url || post.cover_video_url)) {
        return <BlogCoverMedia className="aspect-video w-full rounded-lg border border-border-soft bg-black object-cover" label={`${post.title?.en || 'Blog post'} cover media`} post={post} />;
    }

    if (!large && post?.cover_media_type === 'video' && post.cover_video_url) {
        return <div className="grid size-12 shrink-0 place-items-center rounded-lg border border-border-soft bg-nav font-['IBM_Plex_Mono'] text-[8px] font-bold tracking-wider text-on-nav">VIDEO</div>;
    }

    return post?.cover_image_url ? <img alt="" className={`${large ? 'aspect-video w-full' : 'size-12'} shrink-0 rounded-lg border border-border-soft object-cover`} src={post.cover_image_url} /> : <div className={`${large ? 'aspect-video w-full' : 'size-12'} grid shrink-0 place-items-center rounded-lg border border-dashed border-border-soft bg-surface-muted font-['IBM_Plex_Mono'] text-[9px] font-bold text-copy-muted`}>NO COVER</div>;
}
function MediaChoice({ active, label, onClick }) { return <button className={`rounded-lg px-4 py-2 text-xs font-bold transition-colors ${active ? 'bg-surface text-foreground shadow-sm' : 'text-copy-muted hover:text-foreground'}`} onClick={onClick} type="button">{label}</button>; }
function Status({ post }) { const scheduled = post.is_published && post.published_at && new Date(post.published_at) > new Date(); const label = !post.is_published ? 'Draft' : scheduled ? 'Scheduled' : 'Published'; return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${label === 'Published' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : label === 'Scheduled' ? 'bg-marker/20 text-foreground' : 'bg-surface-muted text-copy-muted'}`}>{label}</span>; }
function Field({ children, error, label }) { return <label className="block text-sm font-semibold">{label}{children}{error ? <span className="mt-1.5 block text-xs font-medium text-leak">{error}</span> : null}</label>; }
function EmptyState({ onAdd }) { return <div className="px-6 py-16 text-center"><p className="font-[Archivo] text-xl font-black">No blog posts yet</p><p className="mt-2 text-sm text-copy-muted">Create the first article for the public journal.</p><button className={`${primaryButtonClass} mt-5`} onClick={onAdd} type="button">Add blog post</button></div>; }

function localizedBlank() { return { en: '', fr: '', ar: '' }; }
function emptyPost() { return { _method: 'post', title: localizedBlank(), slug: '', excerpt: localizedBlank(), content: localizedBlank(), category: localizedBlank(), visual: localizedBlank(), cover_label: localizedBlank(), reading_minutes: 5, author: '10Xscale Team', cover_media_type: 'image', cover_image: null, cover_video_source: 'upload', cover_video: null, cover_video_url: '', published_at: '', is_published: false, position: 0 }; }
function postForm(post, editing) { return { _method: editing ? 'put' : 'post', title: fillLocales(post.title), slug: post.slug, excerpt: fillLocales(post.excerpt), content: fillLocales(post.content), category: fillLocales(post.category), visual: fillLocales(post.visual), cover_label: fillLocales(post.cover_label), reading_minutes: post.reading_minutes, author: post.author, cover_media_type: post.cover_media_type || 'image', cover_image: null, cover_video_source: post.cover_video_source || 'upload', cover_video: null, cover_video_url: post.cover_video_external_url || '', published_at: post.published_at ?? '', is_published: post.is_published, position: post.position }; }
function fillLocales(value = {}) { return { en: value?.en ?? '', fr: value?.fr ?? '', ar: value?.ar ?? '' }; }
function setLocalized(form, field, locale, value) { form.setData(field, { ...form.data[field], [locale]: value }); }
function nestedError(errors, path) { return errors[path] ?? path.split('.').reduce((value, key) => value?.[key], errors); }
function slugify(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

const inputClass = 'mt-2 w-full rounded-xl border border-border-soft bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-foreground focus:ring-2 focus:ring-marker';
const fileClass = 'mt-2 block w-full cursor-pointer rounded-xl border border-border-soft bg-surface text-xs text-copy-muted file:me-3 file:cursor-pointer file:border-0 file:bg-foreground file:px-3 file:py-2.5 file:font-bold file:text-page';
const primaryButtonClass = 'cursor-pointer rounded-xl bg-foreground px-5 py-3 font-[Archivo] text-sm font-bold text-page hover:bg-marker hover:text-marker-ink disabled:opacity-60';
const secondaryButtonClass = 'cursor-pointer rounded-xl border border-border-soft bg-surface px-5 py-3 text-sm font-bold text-foreground hover:bg-surface-muted disabled:opacity-60';
const iconButtonClass = 'inline-grid min-h-9 min-w-9 cursor-pointer place-items-center rounded-lg border border-border-soft bg-surface px-2 text-xs font-bold text-copy-muted no-underline hover:bg-surface-muted hover:text-foreground';
