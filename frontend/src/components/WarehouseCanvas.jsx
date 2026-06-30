import { useEffect, useRef } from 'react';

const CELL_SIZE = 34;

function getResourceColor(type) {
  if (type === 'food') return '#6ee7b7';
  if (type === 'materials') return '#facc15';
  if (type === 'chemistry') return '#60a5fa';
  return '#ffffff';
}

function getPestColor(type) {
  if (type === 'rat') return '#ef4444';
  if (type === 'cockroach') return '#a16207';
  if (type === 'moth') return '#c084fc';
  return '#ffffff';
}

function getPestLabel(type) {
  if (type === 'rat') return 'К';
  if (type === 'cockroach') return 'Т';
  if (type === 'moth') return 'М';
  return '?';
}

function WarehouseCanvas({ warehouse }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!warehouse) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const width = warehouse.width * CELL_SIZE;
    const height = warehouse.height * CELL_SIZE;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < warehouse.height; y++) {
      for (let x = 0; x < warehouse.width; x++) {
        ctx.strokeStyle = '#374151';
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    warehouse.resources.forEach((resource) => {
      const x = resource.x * CELL_SIZE;
      const y = resource.y * CELL_SIZE;

      ctx.fillStyle = getResourceColor(resource.type);
      ctx.fillRect(x + 5, y + 5, CELL_SIZE - 10, CELL_SIZE - 10);

      if (resource.damage > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${resource.damage / 120})`;
        ctx.fillRect(x + 5, y + 5, CELL_SIZE - 10, CELL_SIZE - 10);
      }

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${resource.damage}%`, x + CELL_SIZE / 2, y + CELL_SIZE / 2 + 4);
    });

    warehouse.pests.forEach((pest) => {
      const centerX = pest.x * CELL_SIZE + CELL_SIZE / 2;
      const centerY = pest.y * CELL_SIZE + CELL_SIZE / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, CELL_SIZE / 3, 0, Math.PI * 2);
      ctx.fillStyle = getPestColor(pest.type);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(getPestLabel(pest.type), centerX, centerY + 5);
    });

    if (warehouse.isFinished) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Симуляция завершена', width / 2, height / 2);
    }
  }, [warehouse]);

  return (
    <div className="canvas-card">
      <h2>Склад</h2>
      <canvas ref={canvasRef} className="warehouse-canvas" />
      <p className="message">{warehouse.message}</p>
    </div>
  );
}

export default WarehouseCanvas;