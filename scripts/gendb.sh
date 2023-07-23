#!/usr/bin/env bash

db_folder="db"
db_exec="scripts/db.sh"

prisma_folder="prisma/migrations"
migration_file="migration.sql"
schema_file="schema.sql"

queries_folder="queries"
queries="r6 r7 r8 r9 r10 r11"
prod_query_file="test-production.sql"
query_output="test-production.out"

# Create the database folder if it doesn't exist.
mkdir -p $db_folder

# Create schema file
cat $(find "$prisma_folder" -type f -name "$migration_file") > "$db_folder/$schema_file"

# Run queries against database
for query in $queries; do
    query_file="$db_folder/$queries_folder/$query/$prod_query_file"
    if test -f $query_file; then
        echo "Running query $query"
        bash "$db_exec" -f $query_file -o "$db_folder/$queries_folder/$query/$query_output"
    fi
done
