<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditRequestSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_form_submission_is_persisted_and_redirected_to_thank_you_page(): void
    {
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

        $this->assertDatabaseHas('audit_requests', [
            'name' => 'Sarah Mitchell',
            'email' => 'sarah@example.com',
            'country_code' => '+44',
            'phone' => '7911 123456',
            'website' => 'https://yourbrand.com',
            'monthly_revenue' => '$100k – $250k',
            'list_size' => '20,000 – 50,000',
            'email_revenue_pct' => '10% – 20%',
        ]);
    }

    public function test_invalid_submission_is_not_persisted(): void
    {
        $this->from('/')->post('/audit-requests', [
            'name' => 'Invalid Lead',
            'email' => 'not-an-email',
            'locale' => 'en',
        ])->assertRedirect('/')->assertSessionHasErrors();

        $this->assertDatabaseCount('audit_requests', 0);
    }
}
