function StatisticsPanel({ warehouse }) {
  const resources = warehouse.resourceSummary;
  const pests = warehouse.pestSummary;

  return (
    <div className="statistics-panel">
      <h2>Статистика</h2>

      <div className="stat-grid">
        <div className="stat-card">
          <span>День</span>
          <strong>{warehouse.day}</strong>
        </div>

        <div className="stat-card">
          <span>Деньги</span>
          <strong>{warehouse.money} ₽</strong>
        </div>

        <div className="stat-card">
          <span>Доход за день</span>
          <strong>+{warehouse.rentIncome} ₽</strong>
        </div>

        <div className="stat-card">
          <span>Ущерб</span>
          <strong>{warehouse.stats.totalDamageLoss} ₽</strong>
        </div>
      </div>

      <h3>Состояние ресурсов</h3>

      <div className="list">
        <p>Продукты: повреждение {resources.food.avgDamage}%</p>
        <p>Стройматериалы: повреждение {resources.materials.avgDamage}%</p>
        <p>Бытовая химия: повреждение {resources.chemistry.avgDamage}%</p>
      </div>

      <h3>Вредители</h3>

      <div className="list">
        <p>Крысы: {pests.rat}</p>
        <p>Тараканы: {pests.cockroach}</p>
        <p>Моль: {pests.moth}</p>
        <p>Уничтожено всего: {warehouse.stats.destroyedPests}</p>
      </div>
    </div>
  );
}

export default StatisticsPanel;