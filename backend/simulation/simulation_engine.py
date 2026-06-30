import random


class Cell:
    def __init__(self, x, y, cell_type="empty"):
        self.x = x
        self.y = y
        self.type = cell_type


class Resource:
    def __init__(self, resource_type, x, y, amount, price):
        self.type = resource_type
        self.x = x
        self.y = y
        self.amount = amount
        self.price = price
        self.damage = 0

    def apply_damage(self, value):
        self.damage = min(100, self.damage + value)

    def current_value(self):
        return round(self.price * self.amount * (1 - self.damage / 100), 2)

    def to_dict(self):
        return {
            "type": self.type,
            "x": self.x,
            "y": self.y,
            "amount": self.amount,
            "price": self.price,
            "damage": self.damage,
            "value": self.current_value(),
        }


class Pest:
    PEST_RULES = {
        "rat": {
            "name": "Крыса",
            "damage_power": 12,
            "targets": ["food", "chemistry"],
            "reproduction_chance": 0.12,
        },
        "cockroach": {
            "name": "Таракан",
            "damage_power": 8,
            "targets": ["food"],
            "reproduction_chance": 0.18,
        },
        "moth": {
            "name": "Моль",
            "damage_power": 6,
            "targets": ["materials"],
            "reproduction_chance": 0.08,
        },
    }

    def __init__(self, pest_type, x, y):
        self.type = pest_type
        self.x = x
        self.y = y
        self.alive = True

    @property
    def rules(self):
        return self.PEST_RULES[self.type]

    def move(self, width, height):
        dx = random.choice([-1, 0, 1])
        dy = random.choice([-1, 0, 1])

        self.x = max(0, min(width - 1, self.x + dx))
        self.y = max(0, min(height - 1, self.y + dy))

    def damage_resource(self, resources):
        for resource in resources:
            distance = abs(resource.x - self.x) + abs(resource.y - self.y)

            if distance <= 1 and resource.type in self.rules["targets"]:
                resource.apply_damage(self.rules["damage_power"])
                return True

        return False

    def can_reproduce(self):
        return random.random() < self.rules["reproduction_chance"]

    def to_dict(self):
        return {
            "type": self.type,
            "name": self.rules["name"],
            "x": self.x,
            "y": self.y,
        }


class Treatment:
    TREATMENTS = {
        "poison": {
            "name": "Яд",
            "cost": 150,
            "radius": 2,
            "efficiency": 0.55,
        },
        "trap": {
            "name": "Ловушка",
            "cost": 100,
            "radius": 1,
            "efficiency": 0.8,
        },
        "cleaning": {
            "name": "Санобработка",
            "cost": 400,
            "radius": 4,
            "efficiency": 0.75,
        },
    }

    def __init__(self, treatment_type):
        self.type = treatment_type
        self.data = self.TREATMENTS[treatment_type]

    def to_dict(self):
        return {
            "type": self.type,
            **self.data,
        }


class SimulationStats:
    def __init__(self):
        self.total_damage_loss = 0
        self.destroyed_pests = 0

    def to_dict(self):
        return {
            "totalDamageLoss": round(self.total_damage_loss, 2),
            "destroyedPests": self.destroyed_pests,
        }


class Warehouse:
    def __init__(self, width=20, height=14):
        self.width = width
        self.height = height
        self.day = 0
        self.money = 1000
        self.rent_income = 180
        self.is_finished = False
        self.message = "Симуляция готова к запуску"

        self.cells = []
        self.resources = []
        self.pests = []
        self.stats = SimulationStats()

        self.init_world()

    def init_world(self):
        self.cells = [
            Cell(x, y)
            for y in range(self.height)
            for x in range(self.width)
        ]

        self.resources = [
            Resource("food", 3, 3, 10, 80),
            Resource("food", 4, 3, 10, 80),
            Resource("food", 5, 3, 10, 80),

            Resource("materials", 12, 4, 8, 120),
            Resource("materials", 13, 4, 8, 120),
            Resource("materials", 14, 4, 8, 120),

            Resource("chemistry", 6, 9, 6, 100),
            Resource("chemistry", 7, 9, 6, 100),
            Resource("chemistry", 8, 9, 6, 100),
        ]

        self.pests = [
            Pest("rat", 2, 2),
            Pest("cockroach", 6, 4),
            Pest("moth", 15, 6),
        ]

    def spawn_random_pest(self):
        chance = random.random()

        if chance < 0.20:
            pest_type = random.choice(["rat", "cockroach", "moth"])
            x = random.randint(0, self.width - 1)
            y = random.randint(0, self.height - 1)
            self.pests.append(Pest(pest_type, x, y))
            self.message = "На складе появился новый вредитель"

    def calculate_damage_loss(self):
        start_value = sum(resource.price * resource.amount for resource in self.resources)
        current_value = sum(resource.current_value() for resource in self.resources)
        self.stats.total_damage_loss = start_value - current_value

    def step(self):
        if self.is_finished:
            return

        self.day += 1
        self.money += self.rent_income
        self.message = "Прошел один день работы склада"

        self.spawn_random_pest()

        new_pests = []

        for pest in self.pests:
            pest.move(self.width, self.height)
            pest.damage_resource(self.resources)

            if pest.can_reproduce() and len(self.pests) + len(new_pests) < 40:
                new_pests.append(Pest(pest.type, pest.x, pest.y))

        self.pests.extend(new_pests)

        if new_pests:
            self.message = "Часть вредителей размножилась"

        self.calculate_damage_loss()
        self.check_finish()

    def apply_treatment(self, treatment_type):
        treatment = Treatment(treatment_type)

        if self.money < treatment.data["cost"]:
            self.message = "Недостаточно денег для применения средства"
            return

        self.money -= treatment.data["cost"]

        center_x = self.width // 2
        center_y = self.height // 2
        radius = treatment.data["radius"]
        efficiency = treatment.data["efficiency"]

        survived_pests = []
        destroyed = 0

        for pest in self.pests:
            distance = abs(pest.x - center_x) + abs(pest.y - center_y)

            if distance <= radius and random.random() < efficiency:
                destroyed += 1
            else:
                survived_pests.append(pest)

        self.pests = survived_pests
        self.stats.destroyed_pests += destroyed

        self.message = f"Применено средство: {treatment.data['name']}. Уничтожено вредителей: {destroyed}"

    def check_finish(self):
        badly_damaged = all(resource.damage >= 90 for resource in self.resources)

        if badly_damaged:
            self.is_finished = True
            self.message = "Склад проигран: почти все товары испорчены"

        if self.money < 0:
            self.is_finished = True
            self.message = "Склад проигран: закончились деньги"

    def get_resource_summary(self):
        result = {
            "food": {"name": "Продукты", "amount": 0, "avgDamage": 0},
            "materials": {"name": "Стройматериалы", "amount": 0, "avgDamage": 0},
            "chemistry": {"name": "Бытовая химия", "amount": 0, "avgDamage": 0},
        }

        for resource_type in result:
            filtered = [r for r in self.resources if r.type == resource_type]

            if filtered:
                result[resource_type]["amount"] = sum(r.amount for r in filtered)
                result[resource_type]["avgDamage"] = round(
                    sum(r.damage for r in filtered) / len(filtered),
                    1
                )

        return result

    def get_pest_summary(self):
        return {
            "rat": len([p for p in self.pests if p.type == "rat"]),
            "cockroach": len([p for p in self.pests if p.type == "cockroach"]),
            "moth": len([p for p in self.pests if p.type == "moth"]),
        }

    def to_dict(self):
        return {
            "width": self.width,
            "height": self.height,
            "day": self.day,
            "money": round(self.money, 2),
            "rentIncome": self.rent_income,
            "isFinished": self.is_finished,
            "message": self.message,
            "resources": [resource.to_dict() for resource in self.resources],
            "pests": [pest.to_dict() for pest in self.pests],
            "resourceSummary": self.get_resource_summary(),
            "pestSummary": self.get_pest_summary(),
            "stats": self.stats.to_dict(),
            "treatments": [
                Treatment("poison").to_dict(),
                Treatment("trap").to_dict(),
                Treatment("cleaning").to_dict(),
            ],
        }