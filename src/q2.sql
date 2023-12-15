SELECT
    ag.airport_id,
    ag.name AS airport_name,
    ag.city,
    ag.country,
    COUNT(DISTINCT b.passenger_id) AS passenger_count
FROM
    airport_geo ag
JOIN
    flight f ON ag.airport_id = f.to
JOIN
    booking b ON f.flight_id = b.flight_id
WHERE
    YEAR(f.arrival) = 2015
GROUP BY
    ag.airport_id, ag.name, ag.city, ag.country
ORDER BY
    passenger_count DESC;
