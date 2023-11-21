WITH RECURSIVE months AS (  SELECT 1 AS month_number
  UNION ALL  SELECT month_number + 1
  FROM months  WHERE month_number < 12
)
SELECT 
  CASE     WHEN month_number = 1 THEN 'Январь'
    WHEN month_number = 2 THEN 'Февраль'    WHEN month_number = 3 THEN 'Март'
    WHEN month_number = 4 THEN 'Апрель'    WHEN month_number = 5 THEN 'Май'
    WHEN month_number = 6 THEN 'Июнь'    WHEN month_number = 7 THEN 'Июль'
    WHEN month_number = 8 THEN 'Август'    WHEN month_number = 9 THEN 'Сентябрь'
    WHEN month_number = 10 THEN 'Октябрь'    WHEN month_number = 11 THEN 'Ноябрь'
    ELSE 'Декабрь'  END AS month_name,
  CASE     WHEN month_number IN (1, 3, 5, 7, 8, 10, 12) THEN 31
    WHEN month_number = 2 THEN      CASE 
        WHEN (YEAR(CURRENT_DATE()) % 4 = 0 AND YEAR(CURRENT_DATE()) % 100 != 0) OR YEAR(CURRENT_DATE()) % 400 = 0 THEN 29        ELSE 28
      END    ELSE 30
  END AS days_in_month FROM months;


  