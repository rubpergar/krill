<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class NewLeadNotification extends Mailable
{
    public Lead $lead;

    public function __construct(Lead $lead)
    {
        $this->lead = $lead;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nueva solicitud recibida - PrawnForms',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.new-lead-notification',
        );
    }
}
