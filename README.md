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

### Relationships

- **order_details** table references **orders** table with a foreign key `order_id`.
- **order_details** table references **products** table with a foreign key `product_id`.
- **inventory** table references **order_details** table with a foreign key `order_detail_id`.
- **inventory** table references **orders** table with a foreign key `order_id`.
- 
This schema ensures that each order and its details are linked correctly, and the products are tracked in relation to specific order details.