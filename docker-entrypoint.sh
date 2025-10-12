#!/bin/sh

echo "wait postgres-db server"
dockerize -wait tcp://postgres-db:$DB_PORT -timeout 20s

echo "start node server"
node dist/main.js

# 참고: https://velog.io/@chaerim1001/dockerize%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-docker-compose-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%8B%A4%ED%96%89-%EC%88%9C%EC%84%9C-%EC%A1%B0%EC%A0%95%ED%95%98%EA%B8%B0
