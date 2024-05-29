import type { OrderRequest } from "@/app/order/types";
import { dbClient } from "@/db/database";
import {
	type Order,
	type OrderBy,
	isOrder,
	isOrderBy,
	isPositiveIntString,
} from "@/utils/validators";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const q = searchParams.get("q") ?? "";
	const limit = searchParams.get("limit");
	const page = searchParams.get("page");
	const orderBy = searchParams.get("orderBy");
	const order = searchParams.get("order");

	// Validate the `orderBy` parameter
	if (orderBy !== null && !isOrderBy(orderBy)) {
		return NextResponse.json(
			{ error: "Invalid orderBy parameter" },
			{ status: 400 },
		);
	}

	// Validate the `order` parameter
	if (order !== null && !isOrder(order.toUpperCase())) {
		return NextResponse.json(
			{ error: "Invalid order parameter" },
			{ status: 400 },
		);
	}

	// Validate the `limit` parameter
	if (limit !== null && !isPositiveIntString(limit)) {
		return NextResponse.json(
			{ error: "Invalid limit parameter" },
			{ status: 400 },
		);
	}

	// Validate the `page` parameter
	if (page !== null && !isPositiveIntString(page)) {
		return NextResponse.json(
			{ error: "Invalid page parameter" },
			{ status: 400 },
		);
	}

	const limitValue = limit !== null ? Number.parseInt(limit, 10) : 10;
	const pageValue = page !== null ? Number.parseInt(page, 10) : 1;
	const orderByValue: OrderBy = (orderBy as OrderBy) ?? "createdAt";
	const orderValue: Order = (order?.toUpperCase() as Order) ?? "ASC";
	const offset = (pageValue - 1) * limitValue;

	const { rows } = await dbClient.execute({
		sql: `
            SELECT *
            FROM
                orders o
                JOIN customers c ON o.customer_id = c.customer_id
                LEFT JOIN order_details od ON o.order_id = od.order_id
                LEFT JOIN products p ON od.product_id = p.product_id
            WHERE
                (
					c.full_name LIKE '%' || ? || '%'
					OR od.description LIKE '%' || ? || '%'
					OR o.document_no LIKE '%' || ? || '%'
				)
				AND o.is_deleted = 0
            ORDER BY
                CASE
                    WHEN ? = 'customerName' THEN c.full_name
                    WHEN ? = 'productName' THEN p.product_name
                    WHEN ? = 'subtotal' THEN o.subtotal
                    ELSE o.created_at
                END
                COLLATE NOCASE ${orderValue}
            LIMIT ? OFFSET ?;
        `,
		args: [
			q,
			q,
			q,
			orderByValue,
			orderByValue,
			orderByValue,
			limitValue,
			offset,
		],
	});

	const data = rows;

	return NextResponse.json({ data }, { status: 200 });
}

export async function POST(request: NextRequest) {
	try {
		const requestData: OrderRequest = await request.json();
		const {
			customerId,
			documentNo,
			subtotal,
			discount,
			afterDiscount,
			tax,
			afterTax,
			createdAt,
			status,
			orderDetails,
		} = requestData;

		// Generate a unique ID for the order
		const orderId = nanoid();

		// Insert the order into the `orders` table
		await dbClient.execute({
			sql: `
				INSERT INTO orders (
					order_id,
					document_no,
					customer_id,
					subtotal,
					discount,
					after_discount,
					tax,
					after_tax,
					created_at,
					status
				)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
			`,
			args: [
				orderId,
				documentNo,
				customerId,
				subtotal,
				discount,
				afterDiscount,
				tax,
				afterTax,
				createdAt,
				status,
			],
		});

		// Insert each order detail into the `order_details` table
		for (const {
			productId,
			qty,
			qtySent,
			price,
			subtotal,
			discountPerItem,
			afterDiscount,
			tax,
			afterTax,
			description,
		} of orderDetails) {
			const orderDetailId = nanoid();
			await dbClient.execute({
				sql: `
					INSERT INTO order_details (
						order_detail_id,
						order_id,
						product_id,
						qty,
						qty_sent,
						price,
						subtotal,
						discount_per_item,
						after_discount,
						tax,
						after_tax,
						description
					)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
				`,
				args: [
					orderDetailId,
					orderId,
					productId,
					qty,
					qtySent,
					price,
					subtotal,
					discountPerItem,
					afterDiscount,
					tax,
					afterTax,
					description,
				],
			});
		}

		return NextResponse.json({ success: true, orderId }, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
