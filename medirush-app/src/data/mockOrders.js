export const mockOrders = [
  {
    id: "ORD-IN-74912",
    status: "Out for Delivery",
    date: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    total: 285.00,
    pharmacy_name: "Apollo Pharmacy 24/7",
    pharmacy_address: "100 Ft Road, Indiranagar, Bengaluru",
    pharmacist_name: "Dr. Arvind Swaminathan (Reg. #49102)",
    delivery_address: "Flat 402, Green Glen Layout, Indiranagar, Bengaluru",
    deliveryEta: "8 mins",
    otp: "4921",
    items: [
      { name: "Dolo 650mg Strip", quantity: 2, price: 32.50 },
      { name: "Azithromycin 500mg", quantity: 1, price: 110.00 },
      { name: "Pantocid 40mg Strip", quantity: 1, price: 110.00 }
    ],
    timeline: [
      { status: "Pending", time: "10:15 AM", completed: true },
      { status: "Accepted", time: "10:18 AM", completed: true },
      { status: "Packed", time: "10:22 AM", completed: true },
      { status: "Out for Delivery", time: "10:26 AM", completed: true },
      { status: "Delivered", time: null, completed: false }
    ]
  },
  {
    id: "ORD-IN-61028",
    status: "Packed",
    date: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    total: 310.00,
    pharmacy_name: "MedPlus 24x7 Superstore",
    pharmacy_address: "Block B, Connaught Place, New Delhi",
    pharmacist_name: "Pooja Malhotra (Lic. #38192)",
    delivery_address: "Barakhamba Road, Connaught Place, New Delhi",
    deliveryEta: "12 mins",
    otp: "8192",
    items: [
      { name: "Glycomet 500mg SR", quantity: 2, price: 45.00 },
      { name: "Telma 40mg Tablet", quantity: 1, price: 140.00 },
      { name: "ORS Hydration Sachet", quantity: 4, price: 20.00 }
    ],
    timeline: [
      { status: "Pending", time: "09:45 AM", completed: true },
      { status: "Accepted", time: "09:48 AM", completed: true },
      { status: "Packed", time: "09:55 AM", completed: true },
      { status: "Out for Delivery", time: null, completed: false },
      { status: "Delivered", time: null, completed: false }
    ]
  },
  {
    id: "ORD-IN-49201",
    status: "Delivered",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    total: 145.00,
    pharmacy_name: "Jan Aushadhi Generic Kendra",
    pharmacy_address: "Hill Road Junction, Bandra West, Mumbai",
    pharmacist_name: "Suresh Patel (Govt. Reg. #31890)",
    delivery_address: "Perry Cross Road, Bandra West, Mumbai",
    deliveryEta: "Delivered",
    otp: "3109",
    items: [
      { name: "Montelukast + Levocetirizine (Generic)", quantity: 1, price: 68.00 },
      { name: "Paracetamol 650mg Generic", quantity: 1, price: 18.00 },
      { name: "Vitamin C Chewable (500mg)", quantity: 1, price: 59.00 }
    ],
    timeline: [
      { status: "Pending", time: "Yesterday, 02:20 PM", completed: true },
      { status: "Accepted", time: "Yesterday, 02:24 PM", completed: true },
      { status: "Packed", time: "Yesterday, 02:30 PM", completed: true },
      { status: "Out for Delivery", time: "Yesterday, 02:35 PM", completed: true },
      { status: "Delivered", time: "Yesterday, 02:44 PM", completed: true }
    ]
  }
];
