from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import *
from core.models import *
# Register your models here.

class FavoriteTrackInline(admin.TabularInline):
    model = FavoriteTrack
    extra = 0
    verbose_name = "Любимый трек"
    verbose_name_plural = "Любимые треки"
    
class HistoryInline(admin.TabularInline):
    model = History
    extra = 0
    verbose_name = 'История'
    verbose_name_plural = 'Истории'

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    fieldsets = DjangoUserAdmin.fieldsets + (
        ('Дополнительно', {'fields': ('avatar',)}),
    )
    inlines = [FavoriteTrackInline]
