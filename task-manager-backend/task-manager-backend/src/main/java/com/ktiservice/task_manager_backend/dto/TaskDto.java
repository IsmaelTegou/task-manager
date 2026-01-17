package com.ktiservice.task_manager_backend.dto;

import com.ktiservice.task_manager_backend.model.TaskPriority;
import com.ktiservice.task_manager_backend.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {
    private String id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private String assigneeId;
    private String assigneeName;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}