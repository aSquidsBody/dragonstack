#!/bin/bash

export PGPASSWORD='node_password' # actual password, not placeholder

echo "Configuring dragonstackdb"

C:\\PostgreSQL\\12\\bin\\dropdb.exe -U node_user dragonstackdb
C:\\PostgreSQL\\12\\bin\\createdb.exe -U node_user dragonstackdb

C:\\PostgreSQL\\12\\bin\\psql.exe -U node_user dragonstackdb < ./bin/sql/account.sql
C:\\PostgreSQL\\12\\bin\\psql.exe -U node_user dragonstackdb < ./bin/sql/generation.sql
C:\\PostgreSQL\\12\\bin\\psql.exe -U node_user dragonstackdb < ./bin/sql/dragon.sql
C:\\PostgreSQL\\12\\bin\\psql.exe -U node_user dragonstackdb < ./bin/sql/trait.sql
C:\\PostgreSQL\\12\\bin\\psql.exe -U node_user dragonstackdb < ./bin/sql/dragonTrait.sql

node ./bin/insertTraits.js

echo "dragonstackdb configured"