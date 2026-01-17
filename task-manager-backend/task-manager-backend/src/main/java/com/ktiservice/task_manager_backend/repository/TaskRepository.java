package com.ktiservice.task_manager_backend.repository;

import com.ktiservice.task_manager_backend.model.Task;
import com.ktiservice.task_manager_backend.model.TaskPriority;
import com.ktiservice.task_manager_backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    List<Task> findByAssigneeId(String assigneeId);

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByCreatedBy(String createdBy);

    @Query("SELECT t FROM Task t WHERE t.assigneeId = :userId OR t.createdBy = :userId")
    List<Task> findByUserId(@Param("userId") String userId);

    @Query("SELECT t FROM Task t WHERE " +
            "(:userId IS NULL OR t.assigneeId = :userId OR t.createdBy = :userId) AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:priority IS NULL OR t.priority = :priority)")
    List<Task> findWithFilters(
            @Param("userId") String userId,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority
    );

    long countByAssigneeIdAndStatus(String assigneeId, TaskStatus status);
}
