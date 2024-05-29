import { dbClient } from "@/db/database";

export async function fetchCustomerIds() {
	const { rows } = await dbClient.execute({
		sql: "SELECT customer_id FROM customers;",
		args: [],
	});
	return rows.map((row) => row.customer_id);
}

export async function fetchProductIds() {
	const { rows } = await dbClient.execute({
		sql: "SELECT product_id FROM products;",
		args: [],
	});
	return rows.map((row) => row.product_id);
}

export async function fetchOrderDetailIds() {
	const { rows } = await dbClient.execute({
		sql: "SELECT order_detail_id FROM order_details;",
		args: [],
	});
	return rows.map((row) => row.order_detail_id);
}
