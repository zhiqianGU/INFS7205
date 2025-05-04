CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE chipotle (
                          id          SERIAL PRIMARY KEY,
                          state       VARCHAR(20)     NOT NULL,
                          location    VARCHAR(20)   NOT NULL,
                          address     TEXT           NOT NULL,
                          latitude    DOUBLE PRECISION NOT NULL,
                          longitude   DOUBLE PRECISION NOT NULL,
                          geom        GEOGRAPHY(Point,4326)
);
# \copy chipotle(state, location, address, latitude, longitude) FROM 'E:/桌面/uq/INFS7205/prac2/archive/chipotle_stores.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');
COPY chipotle(state, location, address, latitude, longitude)
  FROM 'C:\\pgdata\\chipotle_stores.csv'
  WITH (FORMAT csv, HEADER true, DELIMITER ',');

CREATE INDEX idx_chipotle_geom ON chipotle USING GIST (geom);

UPDATE chipotle
SET geom = ST_SetSRID(
        ST_MakePoint(longitude, latitude),
        4326
           )::geography
WHERE geom IS NULL;