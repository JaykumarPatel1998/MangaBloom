-- +goose Up

CREATE TABLE migration_table (
    id SERIAL PRIMARY KEY,
    migration_begin TIMESTAMP,
    migration_end TIMESTAMP
);

-- +goose Down

DROP TABLE migration_table;