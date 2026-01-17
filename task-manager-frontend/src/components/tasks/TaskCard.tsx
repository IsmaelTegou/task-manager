import React from 'react';
import {
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { Task } from '../../types';
import { 
  timeOutline, 
  flagOutline, 
  checkmarkCircleOutline,
  time,
  alertCircle,
  checkmarkDone
} from 'ionicons/icons';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'pending': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return checkmarkDone;
      case 'in-progress': return time;
      case 'pending': return alertCircle;
      default: return alertCircle;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <IonItemSliding>
      <IonItem 
        button 
        detail={false}
        onClick={() => onEdit(task)}
        className="ion-activatable"
      >
        <div slot="start" className="flex flex-col items-center mr-4">
          <IonIcon 
            icon={getStatusIcon(task.status)} 
            className={`text-xl ${getStatusColor(task.status)}`}
          />
          <span className="text-xs mt-1 capitalize">{task.status}</span>
        </div>

        <IonLabel className="ion-text-wrap">
          <h2 className="font-semibold text-lg">{task.title}</h2>
          <p className="text-gray-600 mt-1">{task.description}</p>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <IonIcon icon={timeOutline} className="text-gray-400" />
              <IonNote className="text-sm">{formatDate(task.dueDate)}</IonNote>
            </div>
            
            <div className="flex items-center gap-1">
              <IonIcon icon={flagOutline} className="text-gray-400" />
              <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
        </IonLabel>

        <div slot="end" className="flex flex-col items-end">
          {task.status !== 'completed' && (
            <IonButton
              size="small"
              fill="clear"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, 'completed');
              }}
            >
              <IonIcon icon={checkmarkCircleOutline} />
            </IonButton>
          )}
        </div>
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption 
          color="success" 
          onClick={() => {
            const nextStatus = task.status === 'completed' ? 'pending' : 'in-progress';
            onStatusChange(task.id, nextStatus);
          }}
        >
          Status
        </IonItemOption>
        <IonItemOption 
          color="primary" 
          onClick={() => onEdit(task)}
        >
          Edit
        </IonItemOption>
        <IonItemOption 
          color="danger" 
          onClick={() => onDelete(task.id)}
        >
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default TaskCard;