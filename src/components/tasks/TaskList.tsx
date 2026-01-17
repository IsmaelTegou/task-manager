import React, { useState } from 'react';
import {
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonAlert,
  IonToast,
  IonButton,
} from '@ionic/react';
import { RefresherEventDetail } from '@ionic/core';
import TaskCard from './TaskCard';
import { Task } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: Task['status']) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await onRefresh();
    event.detail.complete();
  };

  const handleDeleteClick = (id: string) => {
    setTaskToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await onDelete(taskToDelete);
      setToastMessage('Task deleted successfully');
      setShowToast(true);
    }
    setTaskToDelete(null);
    setShowDeleteAlert(false);
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    await onStatusChange(id, status);
    setToastMessage(`Task marked as ${status}`);
    setShowToast(true);
  };

  if (loading && tasks.length === 0) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  if (error) {
    return (
      <div className="ion-padding ion-text-center">
        <p className="text-red-600">{error}</p>
        <IonButton onClick={onRefresh}>Retry</IonButton>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="ion-padding ion-text-center">
        <p className="text-gray-600">No tasks found</p>
        <IonButton onClick={onRefresh}>Refresh</IonButton>
      </div>
    );
  }

  return (
    <>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>

      <IonList className="divide-y divide-gray-100">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
          />
        ))}
      </IonList>

      <IonInfiniteScroll>
        <IonInfiniteScrollContent />
      </IonInfiniteScroll>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: confirmDelete,
          },
        ]}
      />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
      />
    </>
  );
};

export default TaskList;