// Define union types for allowed `orderBy` and `order` values
export type OrderBy = "productName" | "customerName" | "subtotal" | "createdAt";
export type Order = "ASC" | "DESC";

// Define type for `limit` and `page` parameters
export type PositiveIntString = `${number}`;

// Validation functions
export const isOrderBy = (value: string | null): value is OrderBy => {
	return (
		value === "productName" ||
		value === "customerName" ||
		value === "subtotal" ||
		value === "createdAt"
	);
};

export const isOrder = (value: string | null): value is Order => {
	return value === "ASC" || value === "DESC";
};

export const isPositiveIntString = (
	value: string | null,
): value is PositiveIntString => {
	return /^[1-9]\d*$/.test(value ?? "");
};
