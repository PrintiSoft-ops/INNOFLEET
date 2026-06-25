-- phpMyAdmin ou CLI
CREATE DATABASE IF NOT EXISTS innofleet;
USE innofleet;

-- Table users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    cin VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) DEFAULT '',
    role ENUM('admin','user') DEFAULT 'user',
    statut ENUM('Connecté','Déconnecté') DEFAULT 'Déconnecté',
    lastLogin DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cin (cin),
    INDEX idx_statut (statut)
);

-- Table vehicles
CREATE TABLE vehicles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    immat VARCHAR(20) NOT NULL UNIQUE,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    statut ENUM('disponible','en mission','maintenance') DEFAULT 'disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_immat (immat),
    INDEX idx_statut (statut)
);

-- Table missions
CREATE TABLE missions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conducteur VARCHAR(100) NOT NULL,
    vehicule_id INT NOT NULL,
    destination VARCHAR(255),
    debut DATETIME NOT NULL,
    fin DATETIME,
    kmDepart INT,
    kmRetour INT,
    statut ENUM('En cours','Terminée') DEFAULT 'En cours',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicule_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    INDEX idx_vehicule (vehicule_id),
    INDEX idx_debut (debut),
    INDEX idx_statut (statut)
);

-- Table fuel
CREATE TABLE fuel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vehicule_id INT NOT NULL,
    date DATE NOT NULL,
    litres DECIMAL(10,2) NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicule_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_vehicule (vehicule_id),
    INDEX idx_date (date)
);

-- Table maintenances
CREATE TABLE maintenances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ordreReparation VARCHAR(50) NOT NULL UNIQUE,
    vehicule_id INT NOT NULL,
    type ENUM('Préventive','Curative','Inspection') DEFAULT 'Préventive',
    composant VARCHAR(100) NOT NULL,
    coutPiece DECIMAL(10,2) DEFAULT 0,
    coutMainOeuvre DECIMAL(10,2) DEFAULT 0,
    dateDebut DATE NOT NULL,
    dateFin DATE,
    statut ENUM('Planifiée','En cours','Terminée') DEFAULT 'Planifiée',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicule_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_ordre (ordreReparation),
    INDEX idx_vehicule_statut (vehicule_id, statut)
);

-- Insertion admin (mot de passe "admin") 
-- Le hash ci-dessous a été généré avec bcrypt pour le mot de passe "admin".
-- Vous pouvez le régénérer avec : bcrypt.hashSync('admin', 10);
INSERT INTO users (nom, cin, password, role) 
VALUES ('Administrateur', 'ADMIN001', '$2b$10$9fXGpJ5qXZzYzZyZzZyZzO9fXGpJ5qXZzYzZyZzZyZzO', 'admin');

-- Véhicule exemple
INSERT INTO vehicles (immat, marque, modele) VALUES ('12653p1', 'Toyota', 'Hilux');
INSERT INTO users (nom, cin, password, role) VALUES ('Administrateur', 'ADMIN001', '', 'admin');