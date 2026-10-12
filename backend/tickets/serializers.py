from rest_framework import serializers

from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'status', 'priority', 'created_at']
        read_only_fields = ['id', 'created_at']
