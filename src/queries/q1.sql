SELECT
    p.firstname,
    p.lastname,
    pd.emailaddress,
    pd.sex,
    pd.birthdate,
    pd.street,
    pd.city,
    pd.zip,
    pd.country AS 'PassengerCountry',
    p.passenger_id,
    a.name AS 'TransitAirportName',
    ag.city AS 'TransitAirportCity',
    ag.country AS 'TransitAirportCountry'
FROM
    passengerdetails pd
JOIN
    passenger p ON pd.passenger_id = p.passenger_id
JOIN
    booking b ON p.passenger_id = b.passenger_id
JOIN
    flight f ON b.flight_id = f.flight_id
JOIN
    airport a ON f.to = a.airport_id
JOIN
    airport_geo ag ON f.to = ag.airport_id
WHERE
    ag.country = 'France'
