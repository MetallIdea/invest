select sum(price) from (SELECT CASE
        WHEN buy < 10 THEN (sell-buy) * 100
        WHEN buy < 100 THEN (sell-buy) * 10
        ELSE sell-buy
    END as price FROM public.invest_suggestions
WHERE sell IS NOT NULL AND buy < 1000)