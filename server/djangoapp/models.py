"""Django models for the CarMake and CarModel classes."""

from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator


# Create your models here.
class CarMake(models.Model):
    """Car Make class"""
    name = models.CharField(null=False, max_length=100)
    description = models.CharField(null=False, max_length=1000)
    id = models.AutoField(primary_key=True)

    def __str__(self):
        return f'{self.name}: {self.description}'

class CarModel(models.Model):
    """Car Model class"""
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    name = models.CharField(null=False, max_length=100)
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('HATCHBACK', 'Hatchback'),
        ('SPORTS', 'Sports'),
        ('TRUCK', 'Truck'),
        ('VAN', 'Van'),
        ('CONVERTIBLE', 'Convertible'),
        ('COUPE', 'Coupe'),
        ('MOTORCYCLE', 'Motorcycle'),
        ('MINIVAN', 'Minivan'),
        ('PICKUP', 'Pickup'),
        ('CROSSOVER', 'Crossover'),
        ('OTHER', 'Other'),
        ]
    type = models.CharField(null=False, max_length=12, choices=CAR_TYPES, default='SEDAN')
    year = models.IntegerField(default=2023,
        validators=[
            MinValueValidator(2015), 
            MaxValueValidator(2023)
        ])
    
    CAR_STATUS = [
        ('AVAILABLE', 'Available'),
        ('SOLD', 'Sold'),
        ('REPAIR', 'Repair'),
        ('IN_TRANSIT', 'In Transit'),
        ('HOLD', 'Hold')
        ]
    status = models.CharField(null=False, max_length=10, choices=CAR_STATUS, default='AVAILABLE')
    dateAdded = models.DateTimeField(default=now, editable=False)

    def __str__(self):
        return f'{self.year} {self.car_make.name} {self.name} {self.type}'
