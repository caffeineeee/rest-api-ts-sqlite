export type OrderRequest = {
	customerId: string;
	documentNo: string;
	subtotal: number;
	discount: number;
	afterDiscount: number;
	tax: number;
	afterTax: number;
	createdAt: string;
	status: "pending" | "sent" | "paid" | "closed";
	orderDetails: {
		orderDetailId: string;
		productId: string;
		qty: number;
		qtySent: number;
		price: number;
		subtotal: number;
		discountPerItem: number;
		afterDiscount: number;
		tax: number;
		afterTax: number;
		description: string;
	}[];
};
