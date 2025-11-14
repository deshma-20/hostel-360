-- Run these commands in PostgreSQL (pgAdmin or psql)

-- Create database
CREATE DATABASE hostel_db;

-- Create user (optional, or use postgres user)
CREATE USER hostel_admin WITH PASSWORD 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE hostel_db TO hostel_admin;
