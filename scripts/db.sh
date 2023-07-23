#!/usr/bin/env bash

# Lightweight wrapper over psql to connect to the database.

usage() {
    echo "Usage: $0 [-h host] [-u user] [-w password] [-d database] [-f input] [-o output]"
}

host='localhost'
user='dev'
password='dbdr'
database='postgres'
file=/dev/stdin
output=/dev/stdout

while getopts ":h:u:w:d:f:o:" opt; do
    case $opt in
        h)
            host="$OPTARG";;
        u)
            user="$OPTARG";;
        w)
            password="$OPTARG";;
        d)
            database="$OPTARG";;
        f)
            file="$OPTARG";;
        o)
            output="$OPTARG";;
        *)
            usage
            exit 1;;
    esac
done

export PGPASSWORD="$password"
psql -h $host -U $user -d $database < $file > $output
