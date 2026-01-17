package com.ktiservice.task_manager_backend.dto;

import com.ktiservice.task_manager_backend.model.TaskPriority;
import com.ktiservice.task_manager_backend.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskDto {
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private String assigneeId;
    private String assigneeName;
}
