# rest-api-ts-sqlite

## Brief & Requirements

In this project, you will develop a REST API for an information system, focusing on two modules:

- Order
- Inventory

You must use FastAPI to build the API. For the database, you can choose any system (SQLite, MySQL, PostgreSQL, etc.), but MySQL or SQLite is preferred.

## Scope

### Order

#### Properties

- DocumentNo
- Customer
- Order details:
  - Product
  - Quantity
  - Quantity Sent
  - Price
  - Subtotal
  - Discount Per Item
  - After Discount
  - Tax
  - After Tax

- Description
- Status [**Pending** | **Sent** | **Paid** | **Closed**]
- Subtotal
- Discount
- After Discount
- Tax
- After Tax
- Last Modified At
- Sent At
- Created At
- Deleted At

#### Business Logic

- While the order status is pending, all properties can be modified.
- Once the order is paid, only certain properties, such as the description, can be edited.
- The order status automatically changes to **Sent** when all items are sent (Qty Sent = Qty). Conversely, it reverts to **Pending** if the sent items are updated (Qty Sent < Qty).

#### API Endpoints

| METHOD | ENDPOINT                      | Parameters                                                                                                                 |
| :----- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| GET    | /order                        | $q = search string in customer name, description, document no; $limit; $page; $orderBy = column name; $order = ASC/DESC    |
| GET    | /order/details                | $productId = filter by product; $customerId = filter by customer; $limit; $page; $orderBy = column name; $order = ASC/DESC |
| POST   | /order                        | $OrderObject                                                                                                               |
| POST   | /order/{orderId}/mark-as-paid | Marks the specified order as paid                                                                                          |
| PUT    | /order/{orderId}              | $OrderObject                                                                                                               |
| DELETE | /order/{orderId}              |

### Inventory

#### Properties

- OrderDetail (relation to order detail)
- Order (relation to order)
- Quantity Out
- Amount Out

#### Business Logic

- Inventory will subscribe to order events. Any changes or deletions to an order will trigger corresponding updates to the inventory. Thus, there are no API calls for creating or updating inventory directly.
- Inventory is added when an order is sent (partially or fully), updated when the sent order is updated, and removed when the order detail is deleted.

#### API Endpoints

| METHOD | ENDPOINT               | Parameters                                                                                                             |
| :----- | :--------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| GET    | /inventory             | $limit; $page; $orderBy = column name; $order = ASC/DESC; $orderId = filter by order; $customerId = filter by customer |
| GET    | /inventory/{productId} | $limit; $page; $orderBy = column name; $order = ASC/DESC; $orderId = filter by order; $customerId = filter by customer |

---

## Implementations

### SQL Schema Definitions

Here are the SQL statements to create these tables:

```sql
 CREATE TABLE customers (
    customer_id VARCHAR(128) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    last_modified_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id VARCHAR(128) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    last_modified_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id VARCHAR(128) PRIMARY KEY,
    document_no VARCHAR(255) UNIQUE NOT NULL,
    customer_id VARCHAR(128) NOT NULL,
    subtotal REAL NOT NULL,
    discount REAL,
    after_discount REAL,
    tax REAL,
    after_tax REAL,
    last_modified_at DATETIME,
    sent_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT 0,
    deleted_at DATETIME,
    status VARCHAR(15) CHECK( status IN ('pending', 'sent', 'paid', 'closed') ) NOT NULL DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE order_details (
    order_detail_id VARCHAR(128) PRIMARY KEY,
    order_id VARCHAR(128) NOT NULL,
    product_id VARCHAR(128) NOT NULL,
    qty INT NOT NULL,
    qty_sent INT NOT NULL,
    price REAL NOT NULL,
    subtotal REAL NOT NULL,
    discount_per_item REAL,
    after_discount REAL,
    tax REAL,
    after_tax REAL,
    description TEXT,
    last_modified_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (product_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE inventory (
    inventory_id VARCHAR(128) PRIMARY KEY,
    order_detail_id VARCHAR(128) NOT NULL,
    order_id VARCHAR(128) NOT NULL,
    qty_out INT NOT NULL,
    amount_out REAL NOT NULL,
    last_modified_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_detail_id) REFERENCES order_details (order_detail_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders (order_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
```

## Relationships

- **order_details** table references **orders** table with a foreign key `order_id`.
- **order_details** table references **products** table with a foreign key `product_id`.
- **inventory** table references **order_details** table with a foreign key `order_detail_id`.
- **inventory** table references **orders** table with a foreign key `order_id`.

This schema ensures that each order and its details are linked correctly, and the products are tracked in relation to specific order details.