# CTS_backend

# Backend
in current folder (in the root of the project)

* run `npm i` 	
* then run `npm start` 	

# Login
send `POST` request to `http://localhost:3000/api/auth/login` with such body:
``` JSON
{
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiZmlyc3RuYW1lIjoiT3N0YXAiLCJsYXN0bmFtZSI6IlB5cGtpbiIsImlhdCI6MTU1OTg5NDExOCwiZXhwIjoyNzY5NDk0MTE4fQ.Ft5tVUkBi7j28-N3ao97-AloBlw-CdqHIPb3V9KQ384"
}
```
where `token` is extenal token from external system of authorization

For test purposes use this token to login
`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjcyMWY1MWUzLTU3ZDgtNGZjZS05YzA1LWUwYjk0ODA1MWEwYiIsImlkIjoiNWQ1ZmM0ZDdkYjE3MmJkYTlmODJhOGRkIiwiZmlyc3RuYW1lIjoiUnVzc2tpeSIsImxhc3RuYW1lIjoiVmFueWEiLCJpYXQiOjE1NjY4OTg4MTQsImV4cCI6Mjc3NjQ5ODkyNX0.1RGPex-tEP9ht6owtRhwjXkkd3-dvp60NdUOv-koy_k`

In this token saved `721f51e3-57d8-4fce-9c05-e0b948051a0b` as **externalId**

# Start with Docker
> **Note:** to start project make sure you have **docker** and **docker-compose** installed.

## Run application

### Notes: Settings for application --> .env 

- docker-compose up -d

### To stop application:

- docker-compose down

### To view logs in realtime

- docker-compose logs -f