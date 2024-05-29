import type { OrderRequest } from "@/app/order/types";
import { dbClient } from "@/db/database";
import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";

type Params = {
	orderId: string;
};

export async function PUT(request: NextRequest, context: { params: Params }) {
	const orderId = context.params.orderId;

	try {
		if (!orderId) {
			return NextResponse.json(
				{ error: "Order ID is required" },
				{ status: 400 },
			);
		}

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

		// Fetch the current status of the order
		const { rows } = await dbClient.execute({
			sql: `
				SELECT status FROM orders WHERE order_id = ? AND is_deleted = 0;
			`,
			args: [orderId],
		});

		if (rows.length === 0) {
			return NextResponse.json(
				{ error: "Order not found or has been deleted" },
				{ status: 404 },
			);
		}

		const currentStatus = rows[0].status;

		if (currentStatus === "paid") {
			// If the order is paid, allow only description updates
			for (const { description, orderDetailId } of orderDetails) {
				await dbClient.execute({
					sql: `
						UPDATE order_details SET description = ? WHERE order_detail_id = ?;
					`,
					args: [description, orderDetailId],
				});
			}
			return NextResponse.json({ success: true, orderId }, { status: 200 });
		}

		// Update the order in the `orders` table
		await dbClient.execute({
			sql: `
				UPDATE orders
				SET document_no = ?, customer_id = ?, subtotal = ?, discount = ?, after_discount = ?, tax = ?, after_tax = ?, created_at = ?, status = ?
				WHERE order_id = ? AND is_deleted = 0;
			`,
			args: [
				documentNo,
				customerId,
				subtotal,
				discount,
				afterDiscount,
				tax,
				afterTax,
				createdAt,
				status,
				orderId,
			],
		});

		for (const {
			orderDetailId,
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
			// Check if the order detail exists
			const { rows: detailRows } = await dbClient.execute({
				sql: `
					SELECT order_detail_id FROM order_details WHERE order_detail_id = ?;
				`,
				args: [orderDetailId],
			});

			if (detailRows.length > 0) {
				// Update existing order detail
				await dbClient.execute({
					sql: `
						UPDATE order_details
						SET product_id = ?, qty = ?, qty_sent = ?, price = ?, subtotal = ?, discount_per_item = ?, after_discount = ?, tax = ?, after_tax = ?, description = ?
						WHERE order_detail_id = ?;
					`,
					args: [
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
						orderDetailId,
					],
				});
			} else {
				// Insert new order detail
				const newOrderDetailId = nanoid();
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
						newOrderDetailId,
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
		}

		// Check if all items are sent and update the status accordingly
		const allItemsSent = orderDetails.every(
			(detail) => detail.qtySent >= detail.qty,
		);
		const newStatus = allItemsSent ? "sent" : "pending";

		await dbClient.execute({
			sql: `
				UPDATE orders
				SET status = ?
				WHERE order_id = ? AND is_deleted = 0;
			`,
			args: [newStatus, orderId],
		});

		return NextResponse.json({ success: true, orderId }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(_: NextRequest, context: { params: Params }) {
	const orderId = context.params.orderId;

	try {
		if (!orderId) {
			return NextResponse.json(
				{ error: "Order ID is required" },
				{ status: 400 },
			);
		}

		// Update the order is_deleted to 1 to represent deletion (soft delete)
		await dbClient.execute({
			sql: `
				UPDATE orders SET is_deleted = 1
				WHERE order_id = ?;
			`,
			args: [orderId],
		});
		return NextResponse.json(
			{
				success: true,
				orderId: orderId,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
