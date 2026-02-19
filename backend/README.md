# CineVerse Auth Backend

Spring Boot backend for CineVerse authentication (signup/login) using Aiven MySQL.

## Requirements

- Java 17+
- Maven

## Aiven MySQL setup

1. Open your [Aiven Console](https://console.aiven.io/account/a5958fe98392/project/harshitagonkar-af73/services/mysql-3f303ecb/overview).
2. In **Connection information**, copy:
   - **Host**
   - **Port**
   - **Database name** (e.g. `defaultdb`)
   - **User** (e.g. `avnadmin`)
   - **Password**

## Configuration

Create a `.env` file in the `backend` folder (or set environment variables):

```properties
# Option A: Full JDBC URL (recommended)
AIVEN_MYSQL_JDBC_URL=jdbc:mysql://YOUR_HOST:YOUR_PORT/defaultdb?sslMode=REQUIRED

# Option B: Separate properties (set in application.properties or env)
AIVEN_MYSQL_USER=avnadmin
AIVEN_MYSQL_PASSWORD=your_password
```

For **Option A**, build the URL as:

```
jdbc:mysql://<Host>:<Port>/<Database>?sslMode=REQUIRED
```

Example (replace with your values):

```
AIVEN_MYSQL_JDBC_URL=jdbc:mysql://mysql-xxx.aivencloud.com:12345/defaultdb?sslMode=REQUIRED
AIVEN_MYSQL_USER=avnadmin
AIVEN_MYSQL_PASSWORD=your_password
```

Spring Boot does not load `.env` by default. Either:

- Export the variables in your shell before running, or
- Put the same values in `src/main/resources/application.properties` (do not commit passwords).

## Build and run

```bash
cd backend
mvn spring-boot:run
```

Server runs at `http://localhost:8080`.

## API

- **POST /api/auth/signup**  
  Body: `{ "username", "email", "phone", "password" }`  
  Returns 201 on success; 400 if username/email already taken.

- **POST /api/auth/login**  
  Body: `{ "username", "password" }`  
  Returns 200 with `{ "success": true, "username": "..." }` on success; 401 on invalid credentials.

## Database

The `users` table is created/updated by Hibernate (`spring.jpa.hibernate.ddl-auto=update`) with:

- `id` (PK, auto increment)
- `username` (unique, not null)
- `email` (unique, not null)
- `phone`
- `password` (BCrypt-encoded only; never stored in plain text)

Passwords are encoded with `BCryptPasswordEncoder`; login uses `PasswordEncoder.matches(raw, encoded)` only (no decoding).
