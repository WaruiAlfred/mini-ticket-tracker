from django.db.models import Count
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ticket
from .serializers import TicketSerializer, TicketUpdateSerializer


class TicketListCreateView(generics.ListCreateAPIView):
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = Ticket.objects.all()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset


class TicketUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketUpdateSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()


class TicketStatsView(APIView):
    def get(self, request):
        counts = Ticket.objects.values('status').annotate(count=Count('id'))
        stats = {choice: 0 for choice, _ in Ticket.Status.choices}
        for row in counts:
            stats[row['status']] = row['count']
        return Response(stats)
