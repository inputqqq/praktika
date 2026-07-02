function getResourceName(type) {
  if (type === 'food') return 'Продукты';
  if (type === 'materials') return 'Стройматериалы';
  if (type === 'chemistry') return 'Бытовая химия';
  return type;
}

function getPestName(type) {
  if (type === 'rat') return 'Крыса';
  if (type === 'cockroach') return 'Таракан';
  if (type === 'moth') return 'Моль';
  return type;
}

function getTreatmentName(type) {
  if (type === 'poison') return 'Яд';
  if (type === 'trap') return 'Ловушка';
  if (type === 'cleaning') return 'Санобработка';
  return type;
}

function SelectedObjectPanel({ selectedObject }) {
  if (!selectedObject) {
    return (
      <div className="selected-panel">
        <h2>Выбранный объект</h2>
        <p className="muted">Кликни по ресурсу, вредителю, зоне обработки или метке уничтожения.</p>
      </div>
    );
  }

  if (selectedObject.objectType === 'resource') {
    return (
      <div className="selected-panel">
        <h2>Выбранный объект</h2>
        <p><strong>ID:</strong> {selectedObject.id}</p>
        <p><strong>Тип:</strong> {getResourceName(selectedObject.type)}</p>
        <p><strong>Координаты:</strong> ({selectedObject.x}, {selectedObject.y})</p>
        <p><strong>Количество:</strong> {selectedObject.amount}</p>
        <p><strong>Цена за ед.:</strong> {selectedObject.price} ₽</p>
        <p><strong>Повреждение:</strong> {selectedObject.damage}%</p>
        <p><strong>Состояние:</strong> {selectedObject.isDestroyed ? 'списан' : 'хранится'}</p>
        <p><strong>Текущая стоимость:</strong> {selectedObject.value} ₽</p>
      </div>
    );
  }

  if (selectedObject.objectType === 'pest') {
    return (
      <div className="selected-panel">
        <h2>Выбранный объект</h2>
        <p><strong>ID:</strong> {selectedObject.id}</p>
        <p><strong>Тип:</strong> {getPestName(selectedObject.type)}</p>
        <p><strong>Координаты:</strong> ({selectedObject.x}, {selectedObject.y})</p>
        <p><strong>Сила порчи:</strong> {selectedObject.damagePower}</p>
        <p><strong>Вероятность размножения:</strong> {(selectedObject.reproductionChance * 100).toFixed(0)}%</p>
        <p>
  <strong>Повреждает:</strong>{' '}
  {selectedObject.targets.map(getResourceName).join(', ')}
</p>
      </div>
    );
  }

  if (selectedObject.objectType === 'treatmentZone') {
    return (
      <div className="selected-panel">
        <h2>Выбранный объект</h2>
        <p><strong>ID:</strong> {selectedObject.id}</p>
        <p><strong>Тип:</strong> {getTreatmentName(selectedObject.type)}</p>
        <p><strong>Координаты:</strong> ({selectedObject.x}, {selectedObject.y})</p>
        <p><strong>Радиус:</strong> {selectedObject.radius}</p>
      </div>
    );
  }

  if (selectedObject.objectType === 'destroyedPest') {
    return (
      <div className="selected-panel">
        <h2>Выбранный объект</h2>
        <p><strong>ID:</strong> {selectedObject.id}</p>
        <p><strong>Тип:</strong> уничтоженный {getPestName(selectedObject.pestType)}</p>
        <p><strong>Координаты:</strong> ({selectedObject.x}, {selectedObject.y})</p>
        <p><strong>Метка исчезнет через:</strong> {selectedObject.lifetime} дн.</p>
      </div>
    );
  }

  return null;
}

export default SelectedObjectPanel;
