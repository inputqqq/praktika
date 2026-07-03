import { useEffect, useRef } from 'react';

const CELL_SIZE = 25;

function getResourceColor(type) {
  if (type === 'food') return '#84cc16';
  if (type === 'materials') return '#f97316';
  if (type === 'chemistry') return '#14b8a6';
  return '#ffffff';
}

function getPestColor(type) {
  if (type === 'rat') return '#dc2626';
  if (type === 'cockroach') return '#92400e';
  if (type === 'moth') return '#a855f7';
  return '#ffffff';
}

function getPestLabel(type) {
  if (type === 'rat') return 'К';
  if (type === 'cockroach') return 'Т';
  if (type === 'moth') return 'М';
  return '?';
}

function getTreatmentZoneColor(type) {
  if (type === 'poison') return 'rgba(132, 204, 22, 0.25)';
  if (type === 'trap') return 'rgba(250, 204, 21, 0.28)';
  if (type === 'cleaning') return 'rgba(249, 115, 22, 0.22)';
  return 'rgba(255, 255, 255, 0.2)';
}

function getTreatmentZoneBorder(type) {
  if (type === 'poison') return '#84cc16';
  if (type === 'trap') return '#facc15';
  if (type === 'cleaning') return '#f97316';
  return '#ffffff';
}

function getTreatmentZoneLabel(type) {
  if (type === 'poison') return 'Яд';
  if (type === 'trap') return 'Ловушка';
  if (type === 'cleaning') return 'Санобработка';
  return 'Обработка';
}

function WarehouseCanvas({ warehouse, selectedObjectId, onSelectObject }) {
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

    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < warehouse.height; y++) {
      for (let x = 0; x < warehouse.width; x++) {
        ctx.strokeStyle = '#44403c';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    if (warehouse.treatmentZones) {
      warehouse.treatmentZones.forEach((zone) => {
        const centerX = zone.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = zone.y * CELL_SIZE + CELL_SIZE / 2;
        const radiusPx = zone.radius * CELL_SIZE;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = getTreatmentZoneColor(zone.type);
        ctx.fill();

        ctx.strokeStyle = getTreatmentZoneBorder(zone.type);
        ctx.lineWidth = 2;
        ctx.stroke();

        if (zone.id === selectedObjectId) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, radiusPx + 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        ctx.fillStyle = getTreatmentZoneBorder(zone.type);
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(getTreatmentZoneLabel(zone.type), centerX, centerY);
      });
    }

    warehouse.resources.forEach((resource) => {
      const x = resource.x * CELL_SIZE;
      const y = resource.y * CELL_SIZE;

      ctx.fillStyle = getResourceColor(resource.type);
      ctx.fillRect(x + 5, y + 5, CELL_SIZE - 10, CELL_SIZE - 10);

      if (resource.damage > 0) {
        ctx.fillStyle = `rgba(127, 29, 29, ${Math.min(0.75, resource.damage / 120)})`;
        ctx.fillRect(x + 5, y + 5, CELL_SIZE - 10, CELL_SIZE - 10);
      }

      if (resource.isDestroyed) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(x + 5, y + 5, CELL_SIZE - 10, CELL_SIZE - 10);
      }

      ctx.fillStyle = '#0c0a09';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${resource.damage}%`, x + CELL_SIZE / 2, y + CELL_SIZE / 2 + 4);

      if (resource.id === selectedObjectId) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 3, y + 3, CELL_SIZE - 6, CELL_SIZE - 6);
      }
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

      if (pest.id === selectedObjectId) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, CELL_SIZE / 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    if (warehouse.destroyedPestMarkers) {
      warehouse.destroyedPestMarkers.forEach((marker) => {
        const centerX = marker.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = marker.y * CELL_SIZE + CELL_SIZE / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, CELL_SIZE / 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.35)';
        ctx.fill();

        ctx.strokeStyle = marker.id === selectedObjectId ? '#ffffff' : '#ef4444';
        ctx.lineWidth = marker.id === selectedObjectId ? 4 : 3;

        ctx.beginPath();
        ctx.moveTo(centerX - 8, centerY - 8);
        ctx.lineTo(centerX + 8, centerY + 8);
        ctx.moveTo(centerX + 8, centerY - 8);
        ctx.lineTo(centerX - 8, centerY + 8);
        ctx.stroke();

        ctx.fillStyle = '#fecaca';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
      });
    }

    if (warehouse.isFinished) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Симуляция завершена', width / 2, height / 2);
    }
  }, [warehouse, selectedObjectId]);

  function handleCanvasClick(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);

    const cellX = Math.floor(mouseX / CELL_SIZE);
    const cellY = Math.floor(mouseY / CELL_SIZE);

    const clickedPest = [...warehouse.pests].reverse().find((pest) => {
      return pest.x === cellX && pest.y === cellY;
    });

    if (clickedPest) {
      onSelectObject(clickedPest.id);
      return;
    }

    const clickedResource = [...warehouse.resources].reverse().find((resource) => {
      return resource.x === cellX && resource.y === cellY;
    });

    if (clickedResource) {
      onSelectObject(clickedResource.id);
      return;
    }

    const clickedMarker = [...(warehouse.destroyedPestMarkers || [])].reverse().find((marker) => {
      return marker.x === cellX && marker.y === cellY;
    });

    if (clickedMarker) {
      onSelectObject(clickedMarker.id);
      return;
    }

    const clickedZone = [...(warehouse.treatmentZones || [])].reverse().find((zone) => {
      const dx = cellX - zone.x;
      const dy = cellY - zone.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance <= zone.radius;
    });

    if (clickedZone) {
      onSelectObject(clickedZone.id);
      return;
    }

    onSelectObject(null);
  }

  return (
    <div className="canvas-card">
      <h2>Склад</h2>
      <canvas
        ref={canvasRef}
        className="warehouse-canvas"
        onClick={handleCanvasClick}
      />
      <p className="message">{warehouse.message}</p>
    </div>
  );
}

export default WarehouseCanvas;
