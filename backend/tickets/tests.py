from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Ticket


class TicketCreateTests(APITestCase):
    def test_create_ticket(self):
        url = reverse('ticket-list-create')
        payload = {'title': 'Printer is on fire', 'priority': 'high'}
        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Ticket.objects.count(), 1)
        self.assertEqual(response.data['status'], 'open')

    def test_create_ticket_requires_title(self):
        url = reverse('ticket-list-create')
        response = self.client.post(url, {}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TicketListFilterTests(APITestCase):
    def test_list_filters_by_status(self):
        Ticket.objects.create(title='Open one', status=Ticket.Status.OPEN)
        Ticket.objects.create(title='Closed one', status=Ticket.Status.CLOSED)

        url = reverse('ticket-list-create')
        response = self.client.get(url, {'status': 'closed'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['status'], 'closed')


class TicketUpdateTests(APITestCase):
    def test_patch_updates_status(self):
        ticket = Ticket.objects.create(title='Needs update')
        url = reverse('ticket-update', args=[ticket.id])

        response = self.client.patch(url, {'status': 'in_progress'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ticket.refresh_from_db()
        self.assertEqual(ticket.status, 'in_progress')


class TicketDeleteTests(APITestCase):
    def test_delete_soft_deletes_and_hides_from_list(self):
        ticket = Ticket.objects.create(title='To be removed')
        url = reverse('ticket-update', args=[ticket.id])

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Ticket.objects.filter(id=ticket.id).exists())
        deleted = Ticket.all_objects.get(id=ticket.id)
        self.assertFalse(deleted.is_active)
        self.assertIsNotNone(deleted.deleted_at)


class TicketStatsTests(APITestCase):
    def test_stats_groups_by_status(self):
        Ticket.objects.create(title='A', status=Ticket.Status.OPEN)
        Ticket.objects.create(title='B', status=Ticket.Status.OPEN)
        Ticket.objects.create(title='C', status=Ticket.Status.CLOSED)

        url = reverse('ticket-stats')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['open'], 2)
        self.assertEqual(response.data['closed'], 1)
        self.assertEqual(response.data['in_progress'], 0)
