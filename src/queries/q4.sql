WITH SeatFlights AS (
    SELECT
        b.seat,
        b.flight_id,
        f.flightno,
        f.from AS departure_airport_id,
        f.to AS arrival_airport_id,
        CONCAT(dep.name, ', ', dep.city, ', ', dep.country) AS departure_airport,
        CONCAT(arr.name, ', ', arr.city, ', ', arr.country) AS arrival_airport,
        b.price
    FROM
        booking b
    JOIN
        flight f ON b.flight_id = f.flight_id
    JOIN
        airport_geo dep ON f.from = dep.airport_id
    JOIN
        airport_geo arr ON f.to = arr.airport_id
)
SELECT
    sf.seat,
    sf.flight_id,
    sf.flightno,
    sf.departure_airport_id,
    sf.arrival_airport_id,
    sf.departure_airport,
    sf.arrival_airport,
    sf.price
FROM
    SeatFlights sf
JOIN (
    SELECT
        arrival_airport_id,
        MAX(price) AS max_price
    FROM
        SeatFlights
    GROUP BY
        arrival_airport_id
) max_prices ON sf.arrival_airport_id = max_prices.arrival_airport_id AND sf.price = max_prices.max_price
ORDER BY
    sf.price DESC;
