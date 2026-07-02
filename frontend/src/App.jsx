import { useEffect, useState } from 'react';
import WarehouseCanvas from './components/WarehouseCanvas';
import ControlPanel from './components/ControlPanel';
import StatisticsPanel from './components/StatisticsPanel';
import Legend from './components/Legend';
import SelectedObjectPanel from './components/SelectedObjectPanel';
import './App.css';

function App() {
  const [warehouse, setWarehouse] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [error, setError] = useState('');

  async function loadState() {
    try {
      const response = await fetch('/api/state/');
      const data = await response.json();
      setWarehouse(data);
      setError('');
    } catch (e) {
      setError('Не удалось получить состояние склада. Проверь, запущен ли Django backend.');
    }
  }

  async function makeStep() {
    try {
      const response = await fetch('/api/step/', {
        method: 'POST',
      });
      const data = await response.json();
      setWarehouse(data);
      setError('');
    } catch (e) {
      setError('Ошибка выполнения шага симуляции.');
    }
  }

  async function resetSimulation() {
    try {
      const response = await fetch('/api/reset/', {
        method: 'POST',
      });
      const data = await response.json();
      setWarehouse(data);
      setSelectedObjectId(null);
      setIsRunning(false);
      setError('');
    } catch (e) {
      setError('Ошибка сброса симуляции.');
    }
  }

  async function applyTreatment(type) {
    try {
      const response = await fetch('/api/treatment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });

      const data = await response.json();
      setWarehouse(data);
      setError('');
    } catch (e) {
      setError('Ошибка применения средства борьбы.');
    }
  }

  function findSelectedObject() {
    if (!warehouse || !selectedObjectId) {
      return null;
    }

    const allObjects = [
      ...warehouse.resources,
      ...warehouse.pests,
      ...(warehouse.treatmentZones || []),
      ...(warehouse.destroyedPestMarkers || []),
    ];

    return allObjects.find((object) => object.id === selectedObjectId) || null;
  }

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (!isRunning || !warehouse || warehouse.isFinished) {
      return;
    }

    const timer = setInterval(() => {
      makeStep();
    }, 800);

    return () => clearInterval(timer);
  }, [isRunning, warehouse]);

  if (!warehouse) {
    return (
      <div className="app">
        <h1>Имитационная модель работы склада</h1>
        <p>Загрузка модели...</p>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Имитационная модель работы склада</h1>
          <p>Борьба с вредителями и сохранение складских ресурсов</p>
        </div>

        <div className="status-badge">
          День {warehouse.day}
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <main className="layout">
        <section className="main-panel">
          <WarehouseCanvas
            warehouse={warehouse}
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
          />

          <ControlPanel
            isRunning={isRunning}
            isFinished={warehouse.isFinished}
            onStart={() => setIsRunning(true)}
            onPause={() => setIsRunning(false)}
            onStep={makeStep}
            onReset={resetSimulation}
            onTreatment={applyTreatment}
          />
        </section>

        <aside className="side-panel">
          <StatisticsPanel warehouse={warehouse} />
          <SelectedObjectPanel selectedObject={findSelectedObject()} />
          <Legend />
        </aside>
      </main>
    </div>
  );
}

export default App;
