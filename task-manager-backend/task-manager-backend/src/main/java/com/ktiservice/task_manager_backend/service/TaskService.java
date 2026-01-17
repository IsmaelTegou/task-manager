package com.ktiservice.task_manager_backend.service;

import com.ktiservice.task_manager_backend.dto.CreateTaskDto;
import com.ktiservice.task_manager_backend.dto.TaskDto;
import com.ktiservice.task_manager_backend.dto.UpdateTaskDto;
import com.ktiservice.task_manager_backend.exception.ForbiddenException;
import com.ktiservice.task_manager_backend.exception.TaskNotFoundException;
import com.ktiservice.task_manager_backend.model.Task;
import com.ktiservice.task_manager_backend.model.TaskPriority;
import com.ktiservice.task_manager_backend.model.TaskStatus;
import com.ktiservice.task_manager_backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TaskDto> getTasksByUser(String userId) {
        return taskRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TaskDto getTaskById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));
        return convertToDto(task);
    }

    @Transactional
    public TaskDto createTask(CreateTaskDto createTaskDto, String createdBy) {
        Task task = modelMapper.map(createTaskDto, Task.class);
        task.setCreatedBy(createdBy);

        // Si l'assignee n'est pas spécifié, assigner à l'utilisateur créateur
        if (task.getAssigneeId() == null) {
            task.setAssigneeId(createdBy);
            task.setAssigneeName(createdBy);
        }

        Task savedTask = taskRepository.save(task);
        return convertToDto(savedTask);
    }

    @Transactional
    public TaskDto updateTask(String id, UpdateTaskDto updateTaskDto, String userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));

        // Vérifier les permissions
        if (!task.getCreatedBy().equals(userId) && !task.getAssigneeId().equals(userId)) {
            throw new ForbiddenException("You don't have permission to update this task");
        }

        // Mettre à jour les champs
        if (updateTaskDto.getTitle() != null) {
            task.setTitle(updateTaskDto.getTitle());
        }
        if (updateTaskDto.getDescription() != null) {
            task.setDescription(updateTaskDto.getDescription());
        }
        if (updateTaskDto.getStatus() != null) {
            task.setStatus(updateTaskDto.getStatus());
        }
        if (updateTaskDto.getPriority() != null) {
            task.setPriority(updateTaskDto.getPriority());
        }
        if (updateTaskDto.getDueDate() != null) {
            task.setDueDate(updateTaskDto.getDueDate());
        }
        if (updateTaskDto.getAssigneeId() != null) {
            task.setAssigneeId(updateTaskDto.getAssigneeId());
        }
        if (updateTaskDto.getAssigneeName() != null) {
            task.setAssigneeName(updateTaskDto.getAssigneeName());
        }

        Task updatedTask = taskRepository.save(task);
        return convertToDto(updatedTask);
    }

    @Transactional
    public void deleteTask(String id, String userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));

        // Seul le créateur peut supprimer la tâche
        if (!task.getCreatedBy().equals(userId)) {
            throw new ForbiddenException("Only the task creator can delete this task");
        }

        taskRepository.delete(task);
    }

    public List<TaskDto> getTasksWithFilters(String userId, String status, String priority) {
        TaskStatus taskStatus = null;
        TaskPriority taskPriority = null;

        if (status != null) {
            taskStatus = TaskStatus.valueOf(status.toUpperCase());
        }

        if (priority != null) {
            taskPriority = TaskPriority.valueOf(priority.toUpperCase());
        }

        return taskRepository.findWithFilters(userId, taskStatus, taskPriority)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public long getUserTaskStatistics(String userId) {
        return taskRepository.countByAssigneeIdAndStatus(userId, TaskStatus.PENDING);
    }

    private TaskDto convertToDto(Task task) {
        return modelMapper.map(task, TaskDto.class);
    }
}
