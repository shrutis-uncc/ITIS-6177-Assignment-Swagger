const express = require("express");
const app = express();
const port = 3000;

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
app.use(cors({
  origin: `http://24.199.89.204:${port}`
}));
app.use(express.json());

const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "sample",
  port: 3306,
  connectionLimit: 5,
});

const options = {
  swaggerDefinition: {
    info: {
      title: "Customer API",
      version: "1.0.0",
      description: "APIs for Customer related changes",
    },
    host: `24.199.89.204:${port}`,
    basePath: "/",
  },
  apis: ["./server.js"],
};

const specs = swaggerJsDoc(options);

app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs));

// Helper function to query the database
async function queryDB(query) {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.query(query);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
}

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Retrieve all agents
 *     description: Get a list of all agents in the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all agents
 *       500:
 *         description: Internal Server Error
 */
app.get("/agents", async (req, res) => {
  try {
    const agents = await queryDB("SELECT * FROM agents");
    res.status(200).json(agents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Retrieve all customers
 *     description: Get a list of all customers in the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all customers
 *       500:
 *         description: Internal Server Error
 */
app.get("/customers", async (req, res) => {
  try {
    const customers = await queryDB("SELECT * FROM customer");
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     description: Get a list of all orders in the database.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders
 *       500:
 *         description: Internal Server Error
 */
app.get("/orders", async (req, res) => {
  try {
    const orders = await queryDB("SELECT * FROM orders");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Add a new customer
 *     description: Add a new customer to the database.
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: customer
 *         description: Customer data to add
 *         schema:
 *           type: object
 *           required:
 *             - CUST_CODE
 *             - CUST_NAME
 *           properties:
 *             CUST_CODE:
 *               type: string
 *             CUST_NAME:
 *               type: string
 *             CUST_CITY:
 *               type: string
 *             WORKING_AREA:
 *               type: string
 *             CUST_COUNTRY:
 *               type: string
 *             GRADE:
 *               type: number
 *             OPENING_AMT:
 *               type: number
 *             RECEIVE_AMT:
 *               type: number
 *             PAYMENT_AMT:
 *               type: number
 *             OUTSTANDING_AMT:
 *               type: number
 *             PHONE_NO:
 *               type: string
 *             AGENT_CODE:
 *               type: string
 *     responses:
 *       201:
 *         description: Customer added successfully
 *       500:
 *         description: Internal Server Error
 */
app.post("/customers", async (req, res) => {
  const {
    CUST_CODE,
    CUST_NAME,
    CUST_CITY,
    WORKING_AREA,
    CUST_COUNTRY,
    GRADE,
    OPENING_AMT,
    RECEIVE_AMT,
    PAYMENT_AMT,
    OUTSTANDING_AMT,
    PHONE_NO,
    AGENT_CODE,
  } = req.body;
  try {
    await pool.query(
      "INSERT INTO customer (CUST_CODE, CUST_NAME, CUST_CITY, WORKING_AREA, CUST_COUNTRY, GRADE, OPENING_AMT, RECEIVE_AMT, PAYMENT_AMT, OUTSTANDING_AMT, PHONE_NO, AGENT_CODE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        CUST_CODE,
        CUST_NAME,
        CUST_CITY,
        WORKING_AREA,
        CUST_COUNTRY,
        GRADE,
        OPENING_AMT,
        RECEIVE_AMT,
        PAYMENT_AMT,
        OUTSTANDING_AMT,
        PHONE_NO,
        AGENT_CODE,
      ]
    );
    res.status(201).json({ message: "Customer added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add customer" });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     description: Fetch a customer from the database by its unique CUST_CODE (Customer ID).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Customer ID (CUST_CODE) to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CUST_CODE:
 *                   type: string
 *                 CUST_NAME:
 *                   type: string
 *                 CUST_CITY:
 *                   type: string
 *                 WORKING_AREA:
 *                   type: string
 *                 CUST_COUNTRY:
 *                   type: string
 *                 GRADE:
 *                   type: integer
 *                 OPENING_AMT:
 *                   type: number
 *                 RECEIVE_AMT:
 *                   type: number
 *                 PAYMENT_AMT:
 *                   type: number
 *                 OUTSTANDING_AMT:
 *                   type: number
 *                 PHONE_NO:
 *                   type: string
 *                 AGENT_CODE:
 *                   type: string
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal Server Error
 */

app.get("/customers/:id", async (req, res) => {
  const { id } = req.params; // Get the ID from the request parameters
  try {
    // Pass the 'id' as a parameter in the query
    const checkQuery = "SELECT * FROM customer WHERE CUST_CODE = ?";
    const customer = await pool.query(checkQuery, [id]);

    if (customer.length > 0) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (err) {
    console.error("Error fetching customer:", err.message);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update a customer by ID
 *     description: Fully update an existing customer in the database by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Customer ID to update
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: customer
 *         description: The updated customer data
 *         schema:
 *           type: object
 *           properties:
 *             CUST_NAME:
 *               type: string
 *             CUST_CITY:
 *               type: string
 *             WORKING_AREA:
 *               type: string
 *             CUST_COUNTRY:
 *               type: string
 *             GRADE:
 *               type: number
 *             OPENING_AMT:
 *               type: number
 *             RECEIVE_AMT:
 *               type: number
 *             PAYMENT_AMT:
 *               type: number
 *             OUTSTANDING_AMT:
 *               type: number
 *             PHONE_NO:
 *               type: string
 *             AGENT_CODE:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully updated the customer
 *       500:
 *         description: Internal Server Error
 */
// PUT endpoint to update a customer
app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const {
    CUST_NAME,
    CUST_CITY,
    WORKING_AREA,
    CUST_COUNTRY,
    GRADE,
    OPENING_AMT,
    RECEIVE_AMT,
    PAYMENT_AMT,
    OUTSTANDING_AMT,
    PHONE_NO,
    AGENT_CODE,
  } = req.body;
  try {
    await pool.query(
      "UPDATE customer SET CUST_NAME = ?, CUST_CITY = ?, WORKING_AREA = ?, CUST_COUNTRY = ?, GRADE = ?, OPENING_AMT = ?, RECEIVE_AMT = ?, PAYMENT_AMT = ?, OUTSTANDING_AMT = ?, PHONE_NO = ?, AGENT_CODE = ? WHERE CUST_CODE = ?",
      [
        CUST_NAME,
        CUST_CITY,
        WORKING_AREA,
        CUST_COUNTRY,
        GRADE,
        OPENING_AMT,
        RECEIVE_AMT,
        PAYMENT_AMT,
        OUTSTANDING_AMT,
        PHONE_NO,
        AGENT_CODE,
        id,
      ]
    );
    res.status(200).json({ message: "Customer updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update customer" });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   patch:
 *     summary: Partially update a customer by ID
 *     description: Update certain fields of an existing customer by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Customer ID to update
 *         required: true
 *         schema:
 *           type: string
 *       - in: body
 *         name: customer
 *         description: Fields to update
 *         schema:
 *           type: object
 *           properties:
 *             CUST_NAME:
 *               type: string
 *             CUST_CITY:
 *               type: string
 *             WORKING_AREA:
 *               type: string
 *             CUST_COUNTRY:
 *               type: string
 *             GRADE:
 *               type: number
 *             OPENING_AMT:
 *               type: number
 *             RECEIVE_AMT:
 *               type: number
 *             PAYMENT_AMT:
 *               type: number
 *             OUTSTANDING_AMT:
 *               type: number
 *             PHONE_NO:
 *               type: string
 *             AGENT_CODE:
 *               type: string
 *     responses:
 *       200:
 *         description: Customer partially updated successfully
 *       500:
 *         description: Internal Server Error
 */
// PATCH endpoint to partially update a customer
app.patch("/customers/:id", async (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = Object.keys(req.body)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(req.body);

  try {
    await pool.query(
      `UPDATE customer SET ${fieldsToUpdate} WHERE CUST_CODE = ?`,
      [...values, id]
    );
    res.status(200).json({ message: "Customer updated partially" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update customer" });
  }
});

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     description: Remove an existing customer from the database by ID.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Customer ID to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       500:
 *         description: Internal Server Error
 */
// DELETE endpoint to remove a customer
app.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM customer WHERE CUST_CODE = ?", [id]);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://24.199.89.204:${port}`);
});
