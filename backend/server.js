const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// File paths for data storage
const clientsFilePath = path.join(__dirname, 'clients.json');
const ordersFilePath = path.join(__dirname, 'orders.json');

// In-memory data caches, loaded from files
let clients = [];
let orders = [];

// --- Helper Functions for Data Persistence ---

const loadData = async () => {
    try {
        const clientsData = await fs.readFile(clientsFilePath, 'utf-8');
        const ordersData = await fs.readFile(ordersFilePath, 'utf-8');
        clients = JSON.parse(clientsData);
        orders = JSON.parse(ordersData);
        console.log('Data loaded successfully.');
    } catch (error) {
        console.error('Error loading data:', error);
        // If files don't exist, start with empty arrays
        clients = [];
        orders = [];
    }
};

const saveClients = async () => {
    try {
        await fs.writeFile(clientsFilePath, JSON.stringify(clients, null, 2));
    } catch (error) {
        console.error('Error saving clients:', error);
    }
};

const saveOrders = async () => {
    try {
        await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
    } catch (error) {
        console.error('Error saving orders:', error);
    }
};

// --- API Endpoints ---

// GET all clients
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// POST a new client
app.post('/api/clients', async (req, res) => {
  const newClient = { id: Date.now(), ...req.body };
  clients.push(newClient);
  await saveClients();
  res.status(201).json(newClient);
});

// GET all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// POST a new order
app.post('/api/orders', async (req, res) => {
  const newOrder = { id: Date.now(), ...req.body };
  orders.push(newOrder);
  await saveOrders();
  res.status(201).json(newOrder);
});

// --- Server Startup ---

app.listen(port, () => {
  loadData();
  console.log(`Backend server is running on http://localhost:${port}`);
});