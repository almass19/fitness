from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # ── Auth (FBV) ──────────────────────────────────────
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.my_profile_view, name='profile'),
    path('auth/profile/update/', views.update_profile_view, name='profile-update'),

    # ── Workout Classes (CBV) ────────────────────────────
    path('classes/', views.WorkoutClassListView.as_view(), name='class-list'),
    path('classes/<int:pk>/', views.WorkoutClassDetailView.as_view(), name='class-detail'),
    path('classes/', views.classes_list_view, name='classes-list'),

    # ── Bookings ─────────────────────────────────────────
    path('bookings/', views.MyBookingsView.as_view(), name='my-bookings'),
    path('bookings/<int:pk>/', views.MyBookingsView.as_view(), name='cancel-booking'),
    path('bookings/create/', views.book_class_view, name='book-class'),

    # ── Membership Plans (CBV) ───────────────────────────
    path('plans/', views.MembershipPlanListView.as_view(), name='plan-list'),
    path('memberships/', views.MyMembershipView.as_view(), name='my-membership'),
    path('generate-workout/', views.generate_workout_view, name='generate-workout'),
    path('chat/', views.chat_view, name='chat'),
]