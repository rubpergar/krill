# Security and Privacy Notes — PrawnForms

## Public Data Flow
- The public form collects name, email, phone, company, need type, message, consent flag, consent timestamp, source IP, and user-agent.
- Successful submissions redirect to `/gracias` using PRG and do not display submitted personal data.
- Honeypot submissions redirect to `/gracias` without creating a lead.
- The public form is rate-limited per source IP.

## Private Access Controls
- `/admin` is protected by Filament authentication.
- Inactive users are blocked from the admin panel by `User::canAccessPanel()`.
- User management is restricted to active admins through `UserPolicy`.
- Lead physical deletion is restricted to active admins and only for archived leads.
- Active internal users can archive and restore leads.

## Privacy Controls
- Consent is required before saving a public lead.
- The public form links to `/privacidad` for a basic privacy notice.
- Confirmation pages remain generic and must not reflect submitted PII.
- Internal notes and audit history are only displayed in the authenticated panel.

## Residual Risks
- The privacy text is operational and not a legal review.
- Lead PII is stored in plain database fields; encryption at rest is an infrastructure/application decision not implemented in this task.
- Hard deletion of an archived lead removes related notes and audit events by cascade under the current schema.
- Formal retention periods and privacy contact details remain pending before production.

## Validation
- TASK-019 security/privacy tests cover public privacy notice, PII-free confirmation, private route access, inactive-user blocking, non-admin restrictions, honeypot, and rate limiting.
- Project validation commands remain defined in `agents/docs/testing.md`.
