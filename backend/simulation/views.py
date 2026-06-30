import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .simulation_engine import Warehouse


warehouse = Warehouse()


def state(request):
    return JsonResponse(warehouse.to_dict())


@csrf_exempt
def step(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    warehouse.step()
    return JsonResponse(warehouse.to_dict())


@csrf_exempt
def reset(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    global warehouse
    warehouse = Warehouse()
    return JsonResponse(warehouse.to_dict())


@csrf_exempt
def treatment(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        treatment_type = data.get("type")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if treatment_type not in ["poison", "trap", "cleaning"]:
        return JsonResponse({"error": "Unknown treatment type"}, status=400)

    warehouse.apply_treatment(treatment_type)
    return JsonResponse(warehouse.to_dict())