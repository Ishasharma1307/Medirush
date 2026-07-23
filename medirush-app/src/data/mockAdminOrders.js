export const mockAdminOrders = [
  {
    id: "ORD-98235",
    customer_name: "John Doe",
    status: "Pending",
    date: "2026-06-12T11:05:00Z",
    total: 32.50,
    delivery_address: "456 Oak Ave, Brooklyn",
    is_emergency: true,
    prescription_url: "https://example.com/rx.pdf",
    items: [
      { name: "Insulin Pen", quantity: 1, price: 25.00 },
      { name: "Syringes (10pk)", quantity: 1, price: 7.50 }
    ]
  },
  {
    id: "ORD-98236",
    customer_name: "Jane Smith",
    status: "Accepted",
    date: "2026-06-12T10:50:00Z",
    total: 18.00,
    delivery_address: "789 Pine St, Queens",
    is_emergency: false,
    prescription_url: null,
    items: [
      { name: "Vitamin C 1000mg", quantity: 2, price: 9.00 }
    ]
  }
];
