import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonFab,
  IonFabButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSearchbar,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Header from '../components/common/Header';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { Task, CreateTaskDto } from '../types';

const TasksPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (data: CreateTaskDto) => {
    await createTask(data);
    setShowModal(false);
    fetchTasks();
  };

  const handleUpdateTask = async (data: CreateTaskDto) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, data);
      setShowModal(false);
      setSelectedTask(undefined);
      fetchTasks();
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    await updateTask(id, { status });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter !== 'all' && task.status !== filter) return false;
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <IonPage>
      <Header title="Tasks" />
      <IonContent>
        <div className="sticky top-0 z-10 bg-white">
          <IonToolbar>
            <IonSearchbar
              value={searchTerm}
              onIonChange={e => setSearchTerm(e.detail.value || '')}
              placeholder="Search tasks..."
              className="px-4"
            />
          </IonToolbar>

          <IonSegment
            value={filter}
            onIonChange={e => setFilter(e.detail.value as any)}
            className="px-4"
          >
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pending">
              <IonLabel>Pending</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="in-progress">
              <IonLabel>In Progress</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="completed">
              <IonLabel>Completed</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onRefresh={fetchTasks}
          onEdit={(task) => {
            setSelectedTask(task);
            setShowModal(true);
          }}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => {
            setShowModal(false);
            setSelectedTask(undefined);
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {selectedTask ? 'Edit Task' : 'New Task'}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <TaskForm
              task={selectedTask}
              onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => setShowModal(false)}
              loading={loading}
            />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TasksPage;