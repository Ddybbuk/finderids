
export interface Product {
  id: string;
  name: string;
  category: string;
  location: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  quantity: number;
  lastUpdated: string;
  specifications: Record<string, string | number>;
}

// Sample product data for demonstration
export const products: Product[] = [
  {
    id: "P1001",
    name: "Hydraulic Pump",
    category: "Hydraulics",
    location: "Warehouse A, Shelf 3",
    status: "in-stock",
    quantity: 42,
    lastUpdated: "2023-10-15",
    specifications: {
      "pressure": "200 bar",
      "flow-rate": "15 L/min",
      "weight": 5.2,
      "material": "Stainless Steel",
      "power": "1.5 kW"
    }
  },
  {
    id: "P1002",
    name: "Electric Motor",
    category: "Electric Components",
    location: "Warehouse B, Shelf 7",
    status: "low-stock",
    quantity: 7,
    lastUpdated: "2023-11-01",
    specifications: {
      "voltage": "220V",
      "power": "2.2 kW",
      "rpm": 1450,
      "weight": 12.7,
      "ip-rating": "IP54"
    }
  },
  {
    id: "P1003",
    name: "Control Valve",
    category: "Hydraulics",
    location: "Warehouse A, Shelf 9",
    status: "in-stock",
    quantity: 26,
    lastUpdated: "2023-10-22",
    specifications: {
      "pressure": "350 bar",
      "ports": 4,
      "material": "Carbon Steel",
      "weight": 3.8,
      "operating-temp": "-20°C to 80°C"
    }
  },
  {
    id: "P1004",
    name: "Pressure Sensor",
    category: "Sensors",
    location: "Warehouse C, Shelf 2",
    status: "out-of-stock",
    quantity: 0,
    lastUpdated: "2023-09-30",
    specifications: {
      "range": "0-500 bar",
      "output": "4-20 mA",
      "accuracy": "±0.5%",
      "weight": 0.25,
      "connection": "G1/4"
    }
  },
  {
    id: "P1005",
    name: "PLC Controller",
    category: "Automation",
    location: "Warehouse B, Shelf 10",
    status: "in-stock",
    quantity: 15,
    lastUpdated: "2023-11-05",
    specifications: {
      "inputs": 16,
      "outputs": 12,
      "voltage": "24V DC",
      "communication": "EtherNet/IP",
      "mounting": "DIN Rail"
    }
  },
  {
    id: "P1006",
    name: "Pneumatic Cylinder",
    category: "Pneumatics",
    location: "Warehouse A, Shelf 5",
    status: "in-stock",
    quantity: 38,
    lastUpdated: "2023-10-28",
    specifications: {
      "bore": "63 mm",
      "stroke": "200 mm",
      "pressure": "10 bar",
      "material": "Aluminum",
      "mounting": "Flange"
    }
  },
  {
    id: "P1007",
    name: "Gear Pump",
    category: "Hydraulics",
    location: "Warehouse A, Shelf 4",
    status: "low-stock",
    quantity: 5,
    lastUpdated: "2023-10-20",
    specifications: {
      "displacement": "22 cc/rev",
      "max-pressure": "250 bar",
      "speed": "1800 rpm",
      "weight": 7.3,
      "inlet-size": "1 inch"
    }
  },
  {
    id: "P1008",
    name: "Temperature Sensor",
    category: "Sensors",
    location: "Warehouse C, Shelf 3",
    status: "in-stock",
    quantity: 24,
    lastUpdated: "2023-11-02",
    specifications: {
      "range": "-50°C to 150°C",
      "output": "PT100",
      "accuracy": "±0.3°C",
      "length": "100 mm",
      "connection": "M12"
    }
  },
  {
    id: "P1009",
    name: "Servo Drive",
    category: "Electric Components",
    location: "Warehouse B, Shelf 8",
    status: "in-stock",
    quantity: 12,
    lastUpdated: "2023-10-25",
    specifications: {
      "voltage": "400V",
      "power": "5 kW",
      "current": "10A",
      "protection": "Short circuit, overvoltage",
      "communication": "EtherCAT"
    }
  },
  {
    id: "P1010",
    name: "Filter Element",
    category: "Hydraulics",
    location: "Warehouse A, Shelf 2",
    status: "out-of-stock",
    quantity: 0,
    lastUpdated: "2023-09-15",
    specifications: {
      "filtration": "10 micron",
      "material": "Cellulose",
      "flow-rate": "60 L/min",
      "pressure-drop": "0.5 bar",
      "length": "250 mm"
    }
  }
];

// Function to find a product by ID
export const findProductById = (id: string): Product | undefined => {
  return products.find(product => product.id.toLowerCase() === id.toLowerCase());
};
