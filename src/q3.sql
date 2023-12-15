SELECT
    f.flight_id,
    f.flightno,
    f.from AS departure_airport_id,
    f.to AS arrival_airport_id,
    CONCAT(dep.name, ', ', dep.city, ', ', dep.country) AS departure_airport,
    CONCAT(arr.name, ', ', arr.city, ', ', arr.country) AS arrival_airport,
    f.departure,
    f.arrival,
    -- Haversine formula for distance calculation
    2 * 6371 * ASIN(SQRT(
        POWER(SIN(RADIANS(arr.latitude - dep.latitude) / 2), 2) +
        COS(RADIANS(dep.latitude)) * COS(RADIANS(arr.latitude)) *
        POWER(SIN(RADIANS(arr.longitude - dep.longitude) / 2), 2)
    )) AS distance_km
FROM
    flight f
JOIN
    airport_geo dep ON f.from = dep.airport_id
JOIN
    airport_geo arr ON f.to = arr.airport_id
ORDER BY
    distance_km DESC;
