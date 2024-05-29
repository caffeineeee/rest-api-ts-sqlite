import { dbClient } from "@/db/database";

const dropTables = await dbClient.batch(
	// Only able to drop tables starting from one with most deps (REFERENCES) to least
	[
		{
			sql: "DROP TABLE IF EXISTS inventory;",
			args: [],
		},
		{
			sql: "DROP TABLE IF EXISTS order_details;",
			args: [],
		},
		{
			sql: "DROP TABLE IF EXISTS orders;",
			args: [],
		},
		{
			sql: "DROP TABLE IF EXISTS products;",
			args: [],
		},
		{
			sql: "DROP TABLE IF EXISTS customers;",
			args: [],
		},
	],
	"write",
);

dropTables;
