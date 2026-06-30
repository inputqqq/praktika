function Legend() {
  return (
    <div className="legend">
      <h2>Легенда</h2>

      <div className="legend-item">
        <span className="legend-color food"></span>
        <p>Продукты</p>
      </div>

      <div className="legend-item">
        <span className="legend-color materials"></span>
        <p>Стройматериалы</p>
      </div>

      <div className="legend-item">
        <span className="legend-color chemistry"></span>
        <p>Бытовая химия</p>
      </div>

      <div className="legend-item">
        <span className="legend-color rat"></span>
        <p>Крыса</p>
      </div>

      <div className="legend-item">
        <span className="legend-color cockroach"></span>
        <p>Таракан</p>
      </div>

      <div className="legend-item">
        <span className="legend-color moth"></span>
        <p>Моль</p>
      </div>
    </div>
  );
}

export default Legend;