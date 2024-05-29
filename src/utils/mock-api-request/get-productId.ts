// Send the GET request
(async () => {
	const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	};

	const productId = "prod-001"; // Replace with an existing productId

	fetch(`http://localhost:3000/inventory/${productId}`, requestOptions)
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
