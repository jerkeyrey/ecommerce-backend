# Database Setup Guide for E-commerce API

This document provides detailed instructions on how to set up the PostgreSQL database required for the E-commerce API.

## PostgreSQL Installation

### Windows

1. **Download the installer**:

   - Go to https://www.postgresql.org/download/windows/
   - Download the installer for the latest version

2. **Run the installer**:

   - Launch the downloaded installer
   - Choose installation directory
   - Select components (default is fine)
   - Specify data directory (default is fine)
   - Set a password for the postgres superuser
   - Specify port (default: 5432)
   - Choose locale (default is fine)

3. **Verify installation**:
   - Open pgAdmin (installed with PostgreSQL)
   - Connect to the server using the password you set
   - You should see the default `postgres` database

### macOS

#### Method 1: Using Homebrew (Recommended)

1. **Install Homebrew** (if not installed):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install PostgreSQL**:

   ```bash
   brew install postgresql
   ```

3. **Start PostgreSQL service**:
   ```bash
   brew services start postgresql
   ```

#### Method 2: Using Postgres.app

1. Download Postgres.app from https://postgresapp.com/
2. Drag to Applications folder and open
3. Click "Initialize" to create a PostgreSQL server

### Linux (Ubuntu/Debian)

1. **Update package list**:

   ```bash
   sudo apt update
   ```

2. **Install PostgreSQL**:

   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

3. **Start PostgreSQL service**:

   ```bash
   sudo service postgresql start
   ```

4. **Set PostgreSQL to start on boot** (optional):
   ```bash
   sudo systemctl enable postgresql
   ```

## Creating the Database

### Using GUI (pgAdmin)

1. **Open pgAdmin**
2. **Connect to your PostgreSQL server**
3. **Create a new database**:
   - Right-click on "Databases"
   - Select "Create" > "Database..."
   - Enter "ecommerce" as the database name
   - Click "Save"

### Using Command Line

#### Windows

1. **Open Command Prompt**
2. **Connect to PostgreSQL**:

   ```bash
   psql -U postgres
   ```

   (Enter the password you set during installation)

3. **Create database**:

   ```sql
   CREATE DATABASE ecommerce;
   ```

4. **Verify database creation**:
   ```sql
   \l
   ```
   (You should see "ecommerce" in the list)

#### macOS / Linux

1. **Connect to PostgreSQL**:

   ```bash
   sudo -u postgres psql
   ```

   (On macOS with Homebrew, you might not need sudo)

2. **Create database**:

   ```sql
   CREATE DATABASE ecommerce;
   ```

3. **Create a dedicated user** (optional but recommended):

   ```sql
   CREATE USER ecommerce_user WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce_user;
   ```

4. **Verify database creation**:

   ```sql
   \l
   ```

   (You should see "ecommerce" in the list)

5. **Exit PostgreSQL**:
   ```sql
   \q
   ```

## Configuring Environment Variables

1. **Create a `.env` file** in the root of the project:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"
   JWT_SECRET="your-secure-random-string"
   ```

   Replace:

   - `username` with your PostgreSQL username (default is "postgres")
   - `password` with your PostgreSQL password
   - `your-secure-random-string` with a secure random string for JWT signing

2. **For a dedicated user** (if you created one):
   ```
   DATABASE_URL="postgresql://ecommerce_user:your_secure_password@localhost:5432/ecommerce"
   ```

## Running Prisma Migrations

After setting up the database and environment variables:

1. **Apply migrations**:

   ```bash
   npx prisma migrate dev
   ```

   This will:

   - Create the database schema based on your Prisma models
   - Generate the Prisma client

2. **Seed the database** (optional):
   ```bash
   npm run seed
   ```
   This will populate your database with initial data for testing.

## Database Management

### Using Prisma Studio

Prisma provides a visual editor for your database:

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can view and edit data.

### Resetting the Database

If you need to reset your database (⚠️ this will delete all data):

```bash
npx prisma migrate reset
```

### Updating the Schema

When you make changes to your Prisma schema file:

1. Update the schema.prisma file
2. Run migrations:
   ```bash
   npx prisma migrate dev --name describe_your_changes
   ```

## Troubleshooting

### Connection Issues

1. **Check PostgreSQL is running**:

   - Windows: Check Services app
   - macOS: `brew services list`
   - Linux: `sudo service postgresql status`

2. **Verify connection string**:
   Make sure your DATABASE_URL is correctly formatted:

   ```
   postgresql://username:password@hostname:port/database
   ```

3. **Check network settings**:
   By default, PostgreSQL only accepts connections from localhost.

### Permission Issues

1. \*\*Check user
