package com.ktiservice.task_manager_backend.controller;

import com.ktiservice.task_manager_backend.dto.ApiResponse;
import com.ktiservice.task_manager_backend.dto.CreateTaskDto;
import com.ktiservice.task_manager_backend.dto.TaskDto;
import com.ktiservice.task_manager_backend.dto.UpdateTaskDto;
import com.ktiservice.task_manager_backend.service.TaskService;
import com.ktiservice.task_manager_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all tasks for current user")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getUserTasks() {
        String userId = userService.getCurrentUserId();
        List<TaskDto> tasks = taskService.getTasksByUser(userId);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all tasks (Admin only)")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getAllTasks() {
        List<TaskDto> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<ApiResponse<TaskDto>> getTask(@PathVariable String id) {
        TaskDto task = taskService.getTaskById(id);
        return ResponseEntity.ok(ApiResponse.success(task));
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(
            @Valid @RequestBody CreateTaskDto createTaskDto) {
        String userId = userService.getCurrentUserId();
        TaskDto createdTask = taskService.createTask(createTaskDto, userId);
        return ResponseEntity.ok(ApiResponse.success(createdTask, "Task created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a task")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @PathVariable String id,
            @Valid @RequestBody UpdateTaskDto updateTaskDto) {
        String userId = userService.getCurrentUserId();
        TaskDto updatedTask = taskService.updateTask(id, updateTaskDto, userId);
        return ResponseEntity.ok(ApiResponse.success(updatedTask, "Task updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable String id) {
        String userId = userService.getCurrentUserId();
        taskService.deleteTask(id, userId);
        return ResponseEntity.ok(ApiResponse.success(null, "Task deleted successfully"));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter tasks")
    public ResponseEntity<ApiResponse<List<TaskDto>>> filterTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        String userId = userService.getCurrentUserId();
        List<TaskDto> tasks = taskService.getTasksWithFilters(userId, status, priority);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get user task statistics")
    public ResponseEntity<ApiResponse<Long>> getUserStatistics() {
        String userId = userService.getCurrentUserId();
        long pendingTasks = taskService.getUserTaskStatistics(userId);
        return ResponseEntity.ok(ApiResponse.success(pendingTasks));
    }
}
