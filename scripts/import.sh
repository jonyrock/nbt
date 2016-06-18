#!/bin/bash

for f in ./../data/sqls/*.sql
do
  psql -U corp -f $f nbt
done
