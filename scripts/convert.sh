#!/bin/bash

for f in ./../data/*.DBF
do
  pgdbf $f | iconv -c -f UTF-8 -t UTF-8 > "${f}.sql"
done
