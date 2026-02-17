-- Custom SQL migration file, put your code below! --
INSERT INTO "jobs" ("name", "schedule", "method", "is_enabled") VALUES
('Вычислить параметры за 30 дней', '0 6 * * *', 'calculateLast30CandleParameters', true),
('Получить свечи', '0 4 * * *', 'fetchLastCandles', true),
('Получить акции', '0 4 1 * *', 'fetchActualShares', true),
('Рассчитать свечи', '0 5 * * *', 'calculateSuggestions', true),
('Вычислить параметры', '30 4 * * *', 'calculateCandleParameters', true),
('Получить все свечи', '0 4 1 * *', 'fetchOldCandles', true),
('Вычислить кастомные параметры', '0 5 * * *', 'calculateCandleCustomParameters', true)