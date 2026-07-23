export const mockOrders = [
  {
    id: "ORD-98234",
    status: "Packed",
    date: "2026-06-12T10:30:00Z",
    total: 24.48,
    pharmacy_name: "City Care Pharmacy",
    delivery_address: "123 Main St, Apt 4B, NY",
    items: [
      { name: "Paracetamol 500mg", quantity: 2, price: 5.99 },
      { name: "Amoxicillin 250mg", quantity: 1, price: 12.50 }
    ],
    timeline: [
      { status: "Pending", time: "10:30 AM", completed: true },
      { status: "Accepted", time: "10:35 AM", completed: true },
      { status: "Packed", time: "10:45 AM", completed: true },
      { status: "Out for Delivery", time: null, completed: false },
      { status: "Delivered", time: null, completed: false }
    ]
  },
  {
    id: "ORD-98101",
    status: "Delivered",
    date: "2026-06-05T14:20:00Z",
    total: 15.00,
    pharmacy_name: "HealthPlus 24/7",
    delivery_address: "123 Main St, Apt 4B, NY",
    items: [
      { name: "Cough Syrup", quantity: 1, price: 15.00 }
    ],
    timeline: [
      { status: "Pending", time: "02:20 PM", completed: true },
      { status: "Accepted", time: "02:25 PM", completed: true },
      { status: "Packed", time: "02:40 PM", completed: true },
      { status: "Out for Delivery", time: "02:55 PM", completed: true },
      { status: "Delivered", time: "03:15 PM", completed: true }
    ]
  }
];
