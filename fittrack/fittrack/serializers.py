from rest_framework import serializers
from django.contrib.auth.models import User
from .models import MembershipPlan, Membership, WorkoutClass, Booking


# ─── serializers.Serializer (минимум 2) ───────────────────────────────────────

class RegisterSerializer(serializers.Serializer):
    """Регистрация пользователя — чистый Serializer"""
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Пароли не совпадают")
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Пользователь уже существует")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class BookingCreateSerializer(serializers.Serializer):
    """Создание записи на тренировку — чистый Serializer"""
    workout_class_id = serializers.IntegerField()

    def validate_workout_class_id(self, value):
        try:
            wc = WorkoutClass.objects.get(id=value)
        except WorkoutClass.DoesNotExist:
            raise serializers.ValidationError("Тренировка не найдена")
        if wc.available_spots <= 0:
            raise serializers.ValidationError("Нет свободных мест")
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        wc = WorkoutClass.objects.get(id=validated_data['workout_class_id'])
        booking, created = Booking.objects.get_or_create(
            user=user,
            workout_class=wc,
            defaults={'status': 'confirmed'}
        )
        if not created:
            raise serializers.ValidationError("Вы уже записаны на эту тренировку")
        return booking


# ─── serializers.ModelSerializer (минимум 2) ──────────────────────────────────

class MembershipPlanSerializer(serializers.ModelSerializer):
    """Тарифные планы — ModelSerializer"""
    class Meta:
        model = MembershipPlan
        fields = '__all__'


class WorkoutClassSerializer(serializers.ModelSerializer):
    """Тренировки — ModelSerializer"""
    available_spots = serializers.ReadOnlyField()

    class Meta:
        model = WorkoutClass
        fields = '__all__'


class MembershipSerializer(serializers.ModelSerializer):
    """Абонементы — ModelSerializer"""
    plan = MembershipPlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=MembershipPlan.objects.all(), source='plan', write_only=True
    )
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'username', 'plan', 'plan_id', 'status', 'start_date', 'end_date', 'created_at']
        read_only_fields = ['user', 'start_date', 'created_at']


class BookingSerializer(serializers.ModelSerializer):
    """Записи на тренировки — ModelSerializer"""
    workout_class = WorkoutClassSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'username', 'workout_class', 'status', 'booked_at']
        read_only_fields = ['user', 'booked_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']

    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
class WorkoutClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutClass
        fields = '__all__'