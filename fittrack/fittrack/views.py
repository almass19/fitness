from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import MembershipPlan, Membership, WorkoutClass, Booking
from .serializers import (
    RegisterSerializer, BookingCreateSerializer,
    MembershipPlanSerializer, UpdateProfileSerializer, WorkoutClassSerializer,
    MembershipSerializer, BookingSerializer, UserSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """FBV #1 — Регистрация"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Регистрация успешна',
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """FBV #2 — Логин, возвращает JWT токены"""
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })
    return Response({'error': 'Неверный логин или пароль'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """FBV #3 — Логаут (блокировка refresh токена)"""
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Выход выполнен'})
    except Exception:
        return Response({'error': 'Неверный токен'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_class_view(request):
    """FBV #4 — Запись на тренировку"""
    serializer = BookingCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        booking = serializer.save()
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_profile_view(request):
    """FBV #5 — Профиль текущего пользователя"""
    return Response(UserSerializer(request.user).data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    serializer = UpdateProfileSerializer(
        request.user,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def classes_list_view(request):
    classes = WorkoutClass.objects.all().order_by('-created_at')
    serializer = WorkoutClassSerializer(classes, many=True)
    return Response(serializer.data)

class WorkoutClassListView(APIView):
    """CBV #1 — Список тренировок (GET) + создание (POST, для админа)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        classes = WorkoutClass.objects.all().order_by('schedule')
        serializer = WorkoutClassSerializer(classes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WorkoutClassSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WorkoutClassDetailView(APIView):
    """CBV #2 — Детали тренировки (GET, PUT, DELETE)"""
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return WorkoutClass.objects.get(pk=pk)
        except WorkoutClass.DoesNotExist:
            return None

    def get(self, request, pk):
        wc = self.get_object(pk)
        if not wc:
            return Response({'error': 'Не найдено'}, status=status.HTTP_404_NOT_FOUND)
        return Response(WorkoutClassSerializer(wc).data)

    def put(self, request, pk):
        wc = self.get_object(pk)
        if not wc:
            return Response({'error': 'Не найдено'}, status=status.HTTP_404_NOT_FOUND)
        serializer = WorkoutClassSerializer(wc, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        wc = self.get_object(pk)
        if not wc:
            return Response({'error': 'Не найдено'}, status=status.HTTP_404_NOT_FOUND)
        wc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MembershipPlanListView(APIView):
    """CBV #3 — Список тарифных планов"""
    permission_classes = [AllowAny]

    def get(self, request):
        plans = MembershipPlan.objects.all()
        serializer = MembershipPlanSerializer(plans, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MembershipPlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyBookingsView(APIView):
    """CBV #4 — Мои записи на тренировки (GET) + отмена (DELETE)"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).select_related('workout_class')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk, user=request.user)
            booking.status = 'cancelled'
            booking.save()
            return Response({'message': 'Запись отменена'})
        except Booking.DoesNotExist:
            return Response({'error': 'Не найдено'}, status=status.HTTP_404_NOT_FOUND)


class MyMembershipView(APIView):
    """CBV #5 — Мой абонемент"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        memberships = Membership.objects.filter(
            user=request.user, status='active'
        ).select_related('plan')
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Купить абонемент"""
        serializer = MembershipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ── AI Views (Groq) ─────────────────────────────────────────────────────────
import os
import re
import json as json_module
import traceback

GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
GROQ_MODEL = 'llama-3.1-8b-instant'


def _groq_generate(messages):
    from groq import Groq
    client = Groq(api_key=GROQ_API_KEY)
    response = client.chat.completions.create(model=GROQ_MODEL, messages=messages, temperature=0.7)
    return response.choices[0].message.content.strip()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_workout_view(request):
    """Генерация тренировки через Groq"""
    data = request.data
    age = data.get('age', 25)
    weight = data.get('weight', 70)
    height = data.get('height', 175)
    goal = data.get('goal', 'weight_loss')
    fitness_level = data.get('fitnessLevel', 'beginner')
    location = data.get('location', 'home')
    bmi = round(weight / ((height / 100) ** 2), 1)

    language = data.get('language', 'en')
    lang_instructions = {
        'ru': 'Respond in Russian. All text fields (summary, name, muscleGroup, description, rest) must be in Russian.',
        'kz': 'Respond in Kazakh. All text fields (summary, name, muscleGroup, description, rest) must be in Kazakh.',
        'en': 'Respond in English.',
    }
    lang_note = lang_instructions.get(language, lang_instructions['en'])

    goal_labels = {
        'weight_loss': 'weight loss', 'muscle_gain': 'muscle gain',
        'endurance': 'endurance', 'flexibility': 'flexibility',
    }
    location_label = 'at home (no equipment)' if location == 'home' else 'at the gym (full equipment)'

    prompt = (
        f"You are a professional fitness coach. Create a personalized workout plan.\n"
        f"Age: {age}, Weight: {weight}kg, Height: {height}cm, BMI: {bmi}\n"
        f"Goal: {goal_labels.get(goal, goal)}, Level: {fitness_level}, Location: {location_label}\n"
        f"Language instruction: {lang_note}\n\n"
        'Respond ONLY with valid JSON, no markdown, no backticks:\n'
        '{"summary":"2-3 sentence overview","exercises":['
        '{"name":"...","muscleGroup":"...","sets":3,"reps":"10-12","rest":"60 сек","description":"..."}'
        ']}\n'
        f'Include 6-8 exercises for {location_label} at {fitness_level} level.'
    )

    try:
        text = _groq_generate([{'role': 'user', 'content': prompt}])
        clean = text
        if '```' in clean:
            match = re.search(r'\{.*\}', clean, re.DOTALL)
            if match:
                clean = match.group(0)
        parsed = json_module.loads(clean)
        return Response(parsed)
    except json_module.JSONDecodeError as e:
        return Response({'error': f'Failed to parse AI response: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({'error': str(e), 'detail': traceback.format_exc()}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_view(request):
    """AI чат-ассистент через Groq"""
    message = request.data.get('message', '').strip()
    history = request.data.get('history', [])

    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    system_prompt = (
        "You are a friendly fitness assistant for the FITMAX app. "
        "Help with workouts, nutrition, weight loss, muscle gain, and healthy lifestyle. "
        "Be concise and practical. Respond in the same language the user writes in."
    )

    messages = [{'role': 'system', 'content': system_prompt}]
    for msg in history[-10:]:
        if msg.get('role') in ('user', 'assistant') and msg.get('content'):
            messages.append({'role': msg['role'], 'content': msg['content']})
    messages.append({'role': 'user', 'content': message})

    try:
        reply = _groq_generate(messages)
        return Response({'reply': reply})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)