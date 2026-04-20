from django.contrib import admin
from .models import MembershipPlan, Membership, WorkoutClass, Booking
from .models import WorkoutClass

admin.site.register(MembershipPlan)
admin.site.register(Membership)
admin.site.register(WorkoutClass)
admin.site.register(Booking)