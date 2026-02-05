import React, { useRef } from 'react';
import TaskCard from './TaskCard';
import { TaskRead } from '../../types/task';

interface DraggableTaskCardProps {
  task: TaskRead;
  onEdit?: (task: TaskRead) => void;
  onDelete?: (taskId: string) => void;
  onComplete?: (taskId: string) => void;
  onDragStart?: (taskId: string, e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onComplete,
  onDragStart,
  onDragEnd
}) => {
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';

    if (dragRef.current) {
      dragRef.current.style.opacity = '0.6';
    }

    if (onDragStart) {
      onDragStart(task.id, e);
    }
  };

  const handleDragEnd = () => {
    if (dragRef.current) {
      dragRef.current.style.opacity = '1';
    }

    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="cursor-move"
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onComplete={onComplete}
      />
    </div>
  );
};

export default DraggableTaskCard;