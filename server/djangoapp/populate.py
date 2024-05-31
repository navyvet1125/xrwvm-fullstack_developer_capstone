"""Populate the CarMake and CarModel tables with data."""

from .models import CarMake, CarModel


def initiate() -> None:
    """Populate the CarMake and CarModel tables with data."""
    # clear the tables
    CarMake.objects.all().delete()
    CarModel.objects.all().delete()

    print("Populating CarMake and CarModel data...")
    car_make_data = [
        {
          "name": "NISSAN",
          "description": "Great cars. Japanese technology"
        },
        {
          "name": "Mercedes",
          "description": "Great cars. German technology"
        },
        {
          "name": "Audi",
          "description": "Great cars. German technology"
        },
        {
          "name": "Kia",
          "description": "Great cars. Korean technology"
        },
        {
          "name": "Toyota",
          "description": "Great cars. Japanese technology"
        },
    ]
    print("Populating CarMake data...")

    car_make_instances = []
    for data in car_make_data:
        car_make_instances.append(
            CarMake.objects.create(name=data['name'],
             description=data['description'])
        )

    # Create CarModel instances with the corresponding CarMake instances
    car_model_data = [
      {
        "name": "Pathfinder",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[0]
      },
      {
        "name": "Qashqai",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[0]
      },
      {
        "name": "XTRAIL",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[0]
      },
      {
        "name": "A-Class",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[1]
      },
      {
        "name": "C-Class",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[1]
      },
      {
        "name": "E-Class",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[1]
      },
      {
        "name": "A4",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[2]
      },
      {
        "name": "A5",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[2]
      },
      {
        "name": "A6",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[2]
      },
      {
        "name": "Sorrento",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[3]
      },
      {
        "name": "Carnival",
        "type": "SUV",
        "year": 2023,
        "car_make": car_make_instances[3]
      },
      {
        "name": "Cerato",
        "type": "Sedan",
        "year": 2023,
        "car_make": car_make_instances[3]
      },
      {
        "name": "Corolla",
        "type": "Sedan",
        "year": 2023,
        "car_make": car_make_instances[4]
      },
      {
        "name": "Camry",
        "type": "Sedan",
        "year": 2023,
        "car_make": car_make_instances[4]
      },
      {
        "name": "RAV4",
        "type": "Crossover",
        "year": 2023,
        "car_make": car_make_instances[4]
      },
      {
        "name": "Sienna",
        "type": "Minivan",
        "year": 2023,
        "car_make": car_make_instances[4]
      },
      {
        "name": "Tacoma",
        "type": "Pickup",
        "year": 2023,
        "car_make": car_make_instances[4]
      },
      {
        "name": "Tundra",
        "type": "Pickup",
        "year": 2023,
        "car_make": car_make_instances[4]
      },
    ]
    print("Populating CarModel data...")
    for data in car_model_data:
        CarModel.objects.create(
            name=data['name'],
            car_make=data['car_make'],
            type=data['type'],
            year=data['year']
        )

    print("CarMake and CarModel data populated.")
