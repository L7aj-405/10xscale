<?php

namespace Tests\Feature;

use App\Actions\StoreAuditRequest;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery\MockInterface;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    public function test_landing_page_renders_the_inertia_component(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('10xscale-theme', false)
            ->assertSee('10xscale-locale', false)
            ->assertSee('prefers-color-scheme: dark', false)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Landing')
                ->has('flash.audit_success')
                ->where('routes.auditRequestsStore', '/audit-requests')
                ->where('routes.thankYou', '/thank-you')
            );
    }

    public function test_blog_page_renders_as_a_separate_inertia_page(): void
    {
        $this->get('/blog')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Blog'));
    }

    public function test_thank_you_page_renders_as_an_inertia_page(): void
    {
        $this->get('/thank-you')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('ThankYou')
                ->has('flash.audit_success')
            );
    }

    public function test_footer_policy_links_have_inertia_pages(): void
    {
        foreach ([
            'privacy-policy',
            'terms-and-conditions',
            'cookie-policy',
            'data-processing-agreement',
        ] as $document) {
            $this->get("/{$document}")
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('Legal')
                    ->where('document', $document)
                );
        }
    }

    public function test_a_valid_audit_request_is_stored(): void
    {
        $this->mock(StoreAuditRequest::class, function (MockInterface $mock) {
            $mock->shouldReceive('handle')
                ->once()
                ->withArgs(fn (array $attributes) => $attributes['email'] === 'sarah@example.com'
                    && $attributes['website'] === 'https://yourbrand.com'
                );
        });

        $response = $this->post('/audit-requests', [
            'name' => 'Sarah Mitchell',
            'email' => 'sarah@example.com',
            'country_code' => '+44',
            'phone' => '7911 123456',
            'website' => 'yourbrand.com',
            'monthly_revenue' => '$100k – $250k',
            'list_size' => '20,000 – 50,000',
            'email_revenue_pct' => '10% – 20%',
            'company' => '',
            'locale' => 'en',
        ]);

        $response
            ->assertRedirect('/thank-you')
            ->assertSessionHas('audit_success');
    }

    public function test_audit_request_requires_qualification_fields(): void
    {
        $this->from('/')
            ->post('/audit-requests', [
                'name' => 'Sarah Mitchell',
                'email' => 'not-an-email',
                'locale' => 'en',
            ])
            ->assertRedirect('/')
            ->assertSessionHasErrors([
                'email',
                'country_code',
                'phone',
                'website',
                'monthly_revenue',
                'list_size',
                'email_revenue_pct',
            ]);
    }

    public function test_audit_success_feedback_uses_the_submitted_locale(): void
    {
        $this->mock(StoreAuditRequest::class, function (MockInterface $mock) {
            $mock->shouldReceive('handle')->twice();
        });

        $this->post('/audit-requests', $this->validAuditPayload('fr'))
            ->assertSessionHas('audit_success', fn (string $message) => str_contains($message, 'Merci'));

        $this->post('/audit-requests', $this->validAuditPayload('ar'))
            ->assertSessionHas('audit_success', fn (string $message) => str_contains($message, 'شكراً'));
    }

    /**
     * @return array<string, string>
     */
    private function validAuditPayload(string $locale): array
    {
        return [
            'name' => 'Sarah Mitchell',
            'email' => 'sarah@example.com',
            'country_code' => '+44',
            'phone' => '7911 123456',
            'website' => 'yourbrand.com',
            'monthly_revenue' => '$100k – $250k',
            'list_size' => '20,000 – 50,000',
            'email_revenue_pct' => '10% – 20%',
            'company' => '',
            'locale' => $locale,
        ];
    }
}
