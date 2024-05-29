import { dbClient } from "@/db/database";

const seedDb = await dbClient.batch(
	[
		{
			sql: `
            INSERT INTO customers (customer_id, full_name, created_at)
            VALUES 
                ('we5z4-qw4z-2u3hs', 'John Doe', '2024-05-24 04:07:57.061592'),
                ('wxe544-we5xw-uxeyg', 'Jane Dean', '2024-05-25 04:07:57.061592'),
                ('ueiy7g-8zu7g-iwuehx', 'Amy Butcher', '2024-05-26 04:07:57.061592');
            `,
			args: [],
		},
		{
			sql: `
            INSERT INTO products (product_id, product_name, created_at)
            VALUES 
                ('prod-001', 'T-Shirt SUPREME Size XL', '2024-05-24 04:07:57.061592'),
                ('prod-002', 'Shoes NIKE Size 9', '2024-05-24 04:07:57.061592'),
                ('prod-003', 'Jeans LEVIS Size 22', '2024-05-24 04:07:57.061592');
            `,
			args: [],
		},
		{
			sql: `
            INSERT INTO orders (order_id, document_no, customer_id, subtotal, discount, after_discount, tax, after_tax, last_modified_at, sent_at, created_at, is_deleted, deleted_at, status)
            VALUES 
                ('hjgvas-dfaq-wekjhb', 'KJA62FJK892BWD0JH', 'we5z4-qw4z-2u3hs', 10000.55, 15, 8500.47, 6.5, 9053, '2024-05-27 04:07:57.061592', '2024-05-27 04:07:57.061592', '2024-05-27 04:07:57.061592', 0, NULL, 'pending'),
                ('234f-34js-ahjesv', 'KAJUSFHBVUYQ3ER47Y', 'wxe544-we5xw-uxeyg', 20000.99, 12, 17600.87, 6, 18656.92, '2024-05-27 04:07:57.061592', '2024-05-27 04:07:57.061592', '2024-05-27 04:07:57.061592', 0, NULL, 'pending'),
                ('234kjb-234r-jwhb34', '2B34RKJ2HB34FUYB', 'ueiy7g-8zu7g-iwuehx', 15000.85, 25, 11250.64, 7.5, 12094.44, '2024-05-27 04:07:57.061592', '2024-05-27 04:07:57.061592', '2024-05-27 04:07:57.061592', 0, NULL, 'pending');
            `,
			args: [],
		},
		{
			sql: `
            INSERT INTO order_details (order_detail_id, order_id, product_id, qty, qty_sent, price, subtotal, discount_per_item, after_discount, tax, after_tax, description)
            VALUES 
                ('34hbr-w3f4d-w3fe4-54xwd', 'hjgvas-dfaq-wekjhb', 'prod-001', 2, 2, 250.90, 501.80, 12.5, 439.08, 11, 487.38, 'This is the description'),
                ('wfec4-vr6es-wce54-wec5', '234f-34js-ahjesv', 'prod-002', 1, 1, 500.99, 500.99, 33, 335.66, 11, 372.58, 'This is the description'),
                ('koajs-dfsdf-dfgs3-sdfv', '234kjb-234r-jwhb34', 'prod-003', 3, 3, 200.75, 602.25, 12, 529.98, 9, 577.68, 'This is the description');
            `,
			args: [],
		},
		{
			sql: `
            INSERT INTO inventory (inventory_id, order_detail_id, order_id, qty_out, amount_out)
            VALUES 
                ('asdf-asefq-qwer2-234h', '34hbr-w3f4d-w3fe4-54xwd', 'hjgvas-dfaq-wekjhb', 2, 125.50),
                ('q34qw-wqer4-34xrq3-q34x', 'wfec4-vr6es-wce54-wec5', '234f-34js-ahjesv', 1, 278),
                ('etras-34sf-cs5ds-wex54f', 'koajs-dfsdf-dfgs3-sdfv', '234kjb-234r-jwhb34', 3, 333.50);
            `,
			args: [],
		},
	],
	"write",
);

seedDb;
