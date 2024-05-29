// Send the DELETE request
(async () => {
	const requestOptions = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({}),
	};
	const orderId = "hjgvas-dfaq-wekjhb"; // Replace with an existing orderId

	fetch(`http://localhost:3000/order/${orderId}`, requestOptions)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		.then((data) => {
			console.log("Response:", data);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
})();
