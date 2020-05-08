CREATE TABLE accountDragon(
    PRIMARY KEY ("accountId", "dragonId"),
    "accountId" INTEGER REFERENCES account(id),
    "dragonId"  INTEGER REFERENCES dragon(id)
);