import { dbClient } from "@/db/database";
import { type NextRequest, NextResponse } from "next/server";

type Params = {
	orderId: string;
};

export async function POST(_: NextRequest, context: { params: Params }) {
	const orderId = context.params.orderId;

	try {
		if (!orderId) {
			return NextResponse.json(
				{ error: "Order ID is required" },
				{ status: 400 },
			);
		}

		// Update the order status to 'paid' in the `orders` table
		await dbClient.execute({
			sql: `
				UPDATE orders SET status = 'paid'
				WHERE order_id = ?
				AND is_deleted = 0;
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
