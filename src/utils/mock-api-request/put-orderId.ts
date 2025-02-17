import {
	fetchCustomerIds,
	fetchOrderDetailIds,
	fetchProductIds,
} from "@/utils/fetch-ids";
import type { OrderRequest } from "@/app/order/types";
import {
	randNumber,
	randProductDescription,
	randRecentDate,
	randUuid,
} from "@ngneat/falso";
import { nanoid } from "nanoid";

// Define the request payload (fake/dummy data generated by falso)
async function createMockOrder(): Promise<OrderRequest> {
	// For `orders` table
	const subtotal = randNumber({ min: 0, max: 1000 });
	const discount = randNumber({ min: 0, max: 75 });
	const afterDiscount = Number.parseFloat(
		(subtotal - subtotal * discount * 0.01).toFixed(2),
	);
	const tax = randNumber({ min: 0, max: 50 });
	const afterTax = Number.parseFloat(
		(afterDiscount * tax * 0.01 + afterDiscount).toFixed(2),
	);
	const qty = randNumber({ min: 0, max: 100 });
	const price = randNumber({ min: 1, max: 1000 });

	// For `order_details` table
	const subtotalOrderDetail = qty * price;
	const discountPerItem = randNumber({ min: 0, max: 75 });
	const afterDiscountOrderDetail = Number.parseFloat(
		(
			subtotalOrderDetail -
			subtotalOrderDetail * discountPerItem * 0.01
		).toFixed(2),
	);
	const taxOrderDetail = randNumber({ min: 0, max: 50 });
	const afterTaxOrderDetail = Number.parseFloat(
		(
			afterDiscountOrderDetail * taxOrderDetail * 0.01 +
			afterDiscountOrderDetail
		).toFixed(2),
	);

	let customerIds: string[];
	let productIds: string[];
	let orderDetailIds: string[];

	try {
		customerIds = (await fetchCustomerIds()) as unknown as string[];
		productIds = (await fetchProductIds()) as unknown as string[];
		orderDetailIds = (await fetchOrderDetailIds()) as unknown as string[];
	} catch (error) {
		console.error("Error fetching IDs:", error);
		throw new Error("Failed to fetch required IDs.");
	}

	// Select a random customer ID from the fetched IDs
	const customerId = customerIds[
		Math.floor(Math.random() * customerIds.length)
	]?.toString() as string;

	if (!customerId) {
		throw new Error("Failed to fetch a valid customer ID.");
	}

	// Create order details with random product IDs from the fetched IDs
	const orderDetails = Array.from({ length: 2 }).map(() => {
		const productId = productIds[
			Math.floor(Math.random() * productIds.length)
		]?.toString() as string;

		if (!productId) {
			throw new Error("Failed to fetch a valid product ID.");
		}

		return {
			orderDetailId: nanoid(),
			productId: productId,
			qty: qty,
			qtySent: randNumber({ min: 0, max: qty }), // simulate different order states
			price: price,
			subtotal: subtotalOrderDetail,
			discountPerItem: discountPerItem,
			afterDiscount: afterDiscountOrderDetail,
			tax: taxOrderDetail,
			afterTax: afterTaxOrderDetail,
			description: randProductDescription(),
		};
	});

	return {
		customerId: customerId,
		documentNo: randUuid(),
		subtotal: subtotal,
		discount: discount,
		afterDiscount: afterDiscount,
		tax: tax,
		afterTax: afterTax,
		createdAt: randRecentDate().toISOString(),
		status: "pending",
		orderDetails: orderDetails,
	};
}

// Send the PUT request
(async () => {
	try {
		const requestBody = await createMockOrder();

		const requestOptions = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		};
		const orderId = "hjgvas-dfaq-wekjhb"; // Replace with an existing orderId

		const response = await fetch(
			`http://localhost:3000/order/${orderId}`,
			requestOptions,
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		console.log("Response:", data);
	} catch (error) {
		console.error("Error:", error);
	}
})();
