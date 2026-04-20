from django.db import models
from django.contrib.auth.models import User

class WorkoutClass(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.IntegerField()  # минуты
    level = models.CharField(max_length=50)  # Beginner, Intermediate, Advanced
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class MembershipPlan(models.Model):
    PLAN_TYPES = [
        ('basic', 'Basic'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    ]

    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    duration_days = models.IntegerField(default=30)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ${self.price}"


class Membership(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.CASCADE, related_name='memberships')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name} ({self.status})"


class WorkoutClass(models.Model):
    CATEGORY_CHOICES = [
        ('cardio', 'Cardio'),
        ('yoga', 'Yoga'),
        ('strength', 'Strength'),
        ('pilates', 'Pilates'),
        ('hiit', 'HIIT'),
    ]

    title = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    instructor = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    schedule = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    capacity = models.IntegerField(default=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.instructor}"

    @property
    def available_spots(self):
        booked = self.bookings.filter(status='confirmed').count()
        return self.capacity - booked


class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('attended', 'Attended'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    workout_class = models.ForeignKey(WorkoutClass, on_delete=models.CASCADE, related_name='bookings')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    booked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'workout_class')

    def __str__(self):
        return f"{self.user.username} → {self.workout_class.title} ({self.status})"
    
    
