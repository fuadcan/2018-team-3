#!/bin/bash

export DATABASE_URL=postgres://postgres:dummypassword@localhost:5432/team3dev
sequelize db:drop;
sequelize db:create;
sequelize db:migrate;
sequelize db:seed:all;
npm run heroku-postbuild;
