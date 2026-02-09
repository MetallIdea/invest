-- Custom SQL migration file, put your code below! --
INSERT INTO "jobs" ("name", "schedule", "method") VALUES
('Вычислить параметры за 30 дней', '0 6 * * *', 'calculateLast30CandleParameters')
('Получить свечи', '0 4 * * *', 'fetchLastCandles')
('Получить акции', '0 4 1 * *', 'fetchActualShares')
('Рассчитать свечи', '0 5 * * *', 'calculateSuggestions')
('Вычислить параметры', '30 4 * * *', 'calculateCandleParameters')
('Получить все свечи', '0 4 1 * *', 'fetchOldCandles')