import React from 'react';
import {
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { Task, CreateTaskDto } from '../../types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, loading }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateTaskDto>({
    defaultValues: task || {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date().toISOString(),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <IonItem className={errors.title ? 'ion-invalid' : ''}>
        <IonLabel position="floating">Title *</IonLabel>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <IonInput
              value={field.value}
              onIonChange={e => field.onChange(e.detail.value)}
            />
          )}
        />
        {errors.title && (
          <IonNote slot="error" color="danger">
            {errors.title.message}
          </IonNote>
        )}
      </IonItem>

      <IonItem className={errors.description ? 'ion-invalid' : ''}>
        <IonLabel position="floating">Description</IonLabel>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <IonTextarea
              value={field.value}
              onIonChange={e => field.onChange(e.detail.value)}
              rows={4}
            />
          )}
        />
      </IonItem>

      <div className="grid grid-cols-2 gap-4">
        <IonItem>
          <IonLabel position="floating">Status</IonLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <IonSelect
                value={field.value}
                onIonChange={e => field.onChange(e.detail.value)}
              >
                <IonSelectOption value="pending">Pending</IonSelectOption>
                <IonSelectOption value="in-progress">In Progress</IonSelectOption>
                <IonSelectOption value="completed">Completed</IonSelectOption>
              </IonSelect>
            )}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Priority</IonLabel>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <IonSelect
                value={field.value}
                onIonChange={e => field.onChange(e.detail.value)}
              >
                <IonSelectOption value="low">Low</IonSelectOption>
                <IonSelectOption value="medium">Medium</IonSelectOption>
                <IonSelectOption value="high">High</IonSelectOption>
              </IonSelect>
            )}
          />
        </IonItem>
      </div>

      <IonItem>
        <IonLabel position="floating">Due Date</IonLabel>
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <IonDatetime
              value={field.value}
              onIonChange={e => field.onChange(e.detail.value)}
              presentation="date"
            />
          )}
        />
      </IonItem>

      <div className="flex gap-3 pt-4">
        <IonButton
          type="button"
          expand="block"
          color="medium"
          fill="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </IonButton>
        <IonButton
          type="submit"
          expand="block"
          disabled={loading}
        >
          {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </IonButton>
      </div>
    </form>
  );
};

export default TaskForm;