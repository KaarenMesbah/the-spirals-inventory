# Inventory & Sales Management System

A lightweight inventory and sales management application built with **Node.js, Express, and SQLite**. It provides a simple way to manage products, track purchases, monitor price changes, and generate PDF reports.

## Features

### Inventory Management

* Add, view, and manage products.
* Store product names, prices, quantities, and categories.
* Search and filter inventory items.

### Purchase Management

* Create purchases containing multiple products.
* Set individual prices and quantities for each purchased item.
* Track original prices and changes in purchase prices.
* Calculate purchase totals automatically.
* View and manage purchase records.

### PDF Reports

* Export inventory lists as PDF documents.
* Generate PDF reports for purchases.
* Display product information, quantities, prices, and totals.
* Format large numbers with thousands separators.

### Lightweight Database

* SQLite database for persistent data storage.
* No separate database server required.

### Simple Web Interface

* Browser-based interface.
* Lightweight frontend using HTML, CSS, and JavaScript.
* Express-powered REST API.

## Technologies

| Technology                  | Purpose                  |
| --------------------------- | ------------------------ |
| **Node.js**                 | Backend runtime          |
| **Express.js**              | HTTP server and REST API |
| **SQLite**                  | Database                 |
| **better-sqlite3**          | SQLite integration       |
| **PDFKit**                  | PDF generation           |
| **HTML / CSS / JavaScript** | Frontend                 |
