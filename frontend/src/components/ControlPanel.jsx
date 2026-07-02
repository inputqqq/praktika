function ControlPanel({
  isRunning,
  isFinished,
  onStart,
  onPause,
  onStep,
  onReset,
  onTreatment,
}) {
  return (
    <div className="control-panel">
      <h2>Управление</h2>

      <div className="button-row">
        <button onClick={onStart} disabled={isRunning || isFinished}>
          Старт
        </button>

        <button onClick={onPause} disabled={!isRunning}>
          Пауза
        </button>

        <button onClick={onStep} disabled={isRunning || isFinished}>
          Шаг
        </button>

        <button onClick={onReset}>
          Сброс
        </button>
      </div>

      <h3>Средства борьбы</h3>

      <div className="button-row">
        <button onClick={() => onTreatment('poison')} disabled={isFinished}>
          Купить яд
        </button>

        <button onClick={() => onTreatment('trap')} disabled={isFinished}>
          Поставить ловушку
        </button>

        <button onClick={() => onTreatment('cleaning')} disabled={isFinished}>
          Санобработка
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
