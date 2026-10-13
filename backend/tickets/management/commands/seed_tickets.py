import random

from django.core.management.base import BaseCommand

from tickets.models import Ticket

TITLES = [
    'Printer is on fire',
    'Cannot reset password',
    'Dashboard chart not loading',
    'Export to CSV fails silently',
    'Login page shows 500 error',
    'Mobile layout broken on iPhone',
    'Email notifications not sending',
    'Slow response on /api/reports',
    'Typo in invoice template',
    'Dark mode toggle does nothing',
    'User avatar upload rejected',
    'Search returns stale results',
    'Timezone off by one hour',
    'Duplicate entries in audit log',
    'Session expires too quickly',
    'Broken link in welcome email',
    'CSV import ignores last row',
    'Pagination skips a page',
    'Webhook retries never stop',
    'Date picker crashes on Safari',
]

DESCRIPTIONS = [
    '',
    'Reported by a customer this morning.',
    'Happens intermittently, hard to reproduce.',
    'Blocking a demo scheduled for this week.',
    'Low impact, cosmetic only.',
    'Seen in staging, not yet confirmed in prod.',
]


class Command(BaseCommand):
    help = 'Seed the database with dummy tickets for local testing/demos.'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=15)

    def handle(self, *args, **options):
        count = options['count']
        statuses = [choice for choice, _ in Ticket.Status.choices]
        priorities = [choice for choice, _ in Ticket.Priority.choices]

        created = []
        for _ in range(count):
            created.append(
                Ticket(
                    title=random.choice(TITLES),
                    description=random.choice(DESCRIPTIONS),
                    status=random.choice(statuses),
                    priority=random.choice(priorities),
                )
            )
        Ticket.objects.bulk_create(created)

        self.stdout.write(self.style.SUCCESS(f'Created {count} dummy tickets.'))
