import { dbClient } from "@/db/database";
import {
	type Order,
	type OrderBy,
	isOrder,
	isOrderBy,
	isPositiveIntString,
} from "@/utils/validators";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const productId = searchParams.get("productId") ?? "";
	const customerId = searchParams.get("customerId") ?? "";
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
                order_details od
                JOIN orders o ON od.order_id = o.order_id
                JOIN customers c ON o.customer_id = c.customer_id
				JOIN products p ON od.product_id = p.product_id
            WHERE
                (? = '' OR p.product_id = ?)
                AND (? = '' OR c.customer_id = ?)
				AND o.is_deleted = 0
            ORDER BY
                CASE
                    WHEN ? = 'productName' THEN p.product_name
                    WHEN ? = 'customerName' THEN c.full_name
                    WHEN ? = 'subtotal' THEN o.subtotal
                    ELSE o.created_at
                END
                COLLATE NOCASE ${orderValue}
            LIMIT ? OFFSET ?;
        `,
		args: [
			productId,
			productId,
			customerId,
			customerId,
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
