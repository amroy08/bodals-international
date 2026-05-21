-- BODAL'S INTERNATIONAL Database Schema
-- Run this in MySQL Workbench after creating the database

CREATE DATABASE IF NOT EXISTS bodals_international;
USE bodals_international;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Website Settings (single row)
CREATE TABLE IF NOT EXISTS website_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) DEFAULT 'BODAL''S INTERNATIONAL',
  logo VARCHAR(500) DEFAULT NULL,
  motto VARCHAR(500) DEFAULT 'WE CARE, WE COMMIT, WE CONNECT',
  hero_title VARCHAR(500) DEFAULT 'BODAL''S INTERNATIONAL',
  hero_subtitle TEXT NULL,
  about_us TEXT NULL,
  vision TEXT NULL,
  purpose TEXT NULL,
  mobile VARCHAR(20) DEFAULT '+91 9082377097',
  email VARCHAR(100) DEFAULT 'b.manish95@gmail.com',
  address VARCHAR(500) DEFAULT 'Mumbai, Maharashtra, India',
  facebook_url VARCHAR(500) DEFAULT '',
  instagram_url VARCHAR(500) DEFAULT '',
  linkedin_url VARCHAR(500) DEFAULT '',
  whatsapp_url VARCHAR(500) DEFAULT '',
  footer_text TEXT NULL,
  whatsapp_number VARCHAR(30) DEFAULT '+91 9082377097',
  whatsapp_default_message TEXT NULL,
  contact_email VARCHAR(255) DEFAULT 'b.manish95@gmail.com',
  floating_contact_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  short_description TEXT,
  full_description TEXT,
  image VARCHAR(500) DEFAULT NULL,
  badges JSON DEFAULT NULL,
  images JSON DEFAULT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) DEFAULT '',
  description TEXT,
  document VARCHAR(500) DEFAULT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  position VARCHAR(100) DEFAULT '',
  company VARCHAR(200) DEFAULT '',
  email VARCHAR(100) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  city_country VARCHAR(200) DEFAULT '',
  message TEXT NOT NULL,
  status ENUM('New', 'Contacted', 'Closed') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Visitors (Analytics)
CREATE TABLE IF NOT EXISTS visitors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ip_address VARCHAR(45) DEFAULT '',
  country VARCHAR(100) DEFAULT 'Unknown',
  city VARCHAR(100) DEFAULT 'Unknown',
  page VARCHAR(255) DEFAULT '/',
  device VARCHAR(50) DEFAULT 'Unknown',
  browser VARCHAR(100) DEFAULT 'Unknown',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specialities
CREATE TABLE IF NOT EXISTS specialities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'Sprout',
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Core Values
CREATE TABLE IF NOT EXISTS core_values (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(255) DEFAULT '',
  description TEXT,
  icon VARCHAR(50) DEFAULT 'Heart',
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
