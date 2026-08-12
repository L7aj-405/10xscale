<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Illuminate\Validation\Validator;

class SaveBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $postId = $this->route('blog_post')?->id;

        return [
            'title' => ['required', 'array'],
            'title.en' => ['required', 'string', 'max:180'],
            'title.fr' => ['nullable', 'string', 'max:180'],
            'title.ar' => ['nullable', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:190', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('blog_posts', 'slug')->ignore($postId)],
            'excerpt' => ['required', 'array'],
            'excerpt.en' => ['required', 'string', 'max:700'],
            'excerpt.fr' => ['nullable', 'string', 'max:700'],
            'excerpt.ar' => ['nullable', 'string', 'max:700'],
            'content' => ['required', 'array'],
            'content.en' => ['required', 'string', 'max:50000'],
            'content.fr' => ['nullable', 'string', 'max:50000'],
            'content.ar' => ['nullable', 'string', 'max:50000'],
            'category' => ['required', 'array'],
            'category.en' => ['required', 'string', 'max:80'],
            'category.fr' => ['nullable', 'string', 'max:80'],
            'category.ar' => ['nullable', 'string', 'max:80'],
            'visual' => ['nullable', 'array'],
            'visual.*' => ['nullable', 'string', 'max:80'],
            'cover_label' => ['nullable', 'array'],
            'cover_label.*' => ['nullable', 'string', 'max:180'],
            'reading_minutes' => ['required', 'integer', 'min:1', 'max:120'],
            'author' => ['required', 'string', 'max:120'],
            'cover_media_type' => ['required', Rule::in(['image', 'video'])],
            'cover_image' => ['nullable', File::image()->types(['png', 'jpg', 'jpeg', 'webp'])->max(5 * 1024)],
            'cover_video_source' => ['nullable', 'required_if:cover_media_type,video', Rule::in(['upload', 'url'])],
            'cover_video' => ['nullable', File::types(['mp4', 'webm', 'ogg', 'mov'])->max(100 * 1024)],
            'cover_video_url' => ['nullable', Rule::requiredIf(fn () => $this->input('cover_media_type') === 'video' && $this->input('cover_video_source') === 'url'), 'url:http,https', 'max:2048'],
            'published_at' => ['nullable', 'date'],
            'is_published' => ['required', 'boolean'],
            'position' => ['required', 'integer', 'min:0', 'max:10000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => filled($this->slug) ? strtolower(trim((string) $this->slug)) : null,
            'is_published' => $this->boolean('is_published'),
        ]);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($this->input('cover_media_type') !== 'video' || $this->input('cover_video_source') !== 'upload') {
                return;
            }

            $post = $this->route('blog_post');

            if (! $this->hasFile('cover_video') && ! $post?->cover_video_path) {
                $validator->errors()->add('cover_video', 'Upload a video file or choose the external URL option.');
            }
        });
    }
}
