-- Insérer des tâches de test (si vous utilisez H2 en développement)
INSERT INTO tasks (id, title, description, status, priority, due_date, assignee_id, assignee_name, created_by, created_at, updated_at)
VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Configurer Keycloak', 'Configurer Keycloak pour l authentification', 'COMPLETED', 'HIGH', '2024-01-15 10:00:00', 'user1', 'John Doe', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440001', 'Développer frontend', 'Créer l interface utilisateur React', 'IN_PROGRESS', 'HIGH', '2024-01-20 14:00:00', 'user2', 'Jane Smith', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440002', 'Tests unitaires', 'Écrire les tests unitaires pour le backend', 'PENDING', 'MEDIUM', '2024-01-25 16:00:00', 'user1', 'John Doe', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440003', 'Documentation API', 'Rédiger la documentation Swagger', 'PENDING', 'LOW', '2024-01-30 09:00:00', 'user3', 'Bob Wilson', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);