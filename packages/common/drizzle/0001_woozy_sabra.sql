-- Custom SQL migration file, put your code below! --
INSERT INTO "jobs" ("name", "schedule", "method", "is_enabled") VALUES
('Вычислить параметры за 30 дней', '0 6 * * *', 'calculateLast30CandleParameters', 1),
('Получить свечи', '0 4 * * *', 'fetchLastCandles', 1),
('Получить акции', '0 4 1 * *', 'fetchActualShares', 1),
('Рассчитать свечи', '0 5 * * *', 'calculateSuggestions', 1),
('Вычислить параметры', '30 4 * * *', 'calculateCandleParameters', 1),
('Получить все свечи', '0 4 1 * *', 'fetchOldCandles', 1)