export interface CruiseLine {
  id: number;
  name: string;
  type: string;
  is_active: number;
}

export const CRUISE_LINES: CruiseLine[] = [
  {
    "id": 1,
    "name": "2GO Travel",
    "type": "DOMESTIC",
    "is_active": 1
  },
  {
    "id": 2,
    "name": "Carnival Cruise Line",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 3,
    "name": "Celebrity Cruises",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 4,
    "name": "Costa Cruises",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 5,
    "name": "Crystal Cruises",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 6,
    "name": "Disney Cruise Line",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 7,
    "name": "Holland America Line",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 8,
    "name": "MSC Cruises",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 9,
    "name": "Norwegian Cruise Line",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 10,
    "name": "Princess Cruises",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 11,
    "name": "Royal Caribbean International",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 12,
    "name": "Silversea Cruises",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 13,
    "name": "Star Cruises",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 14,
    "name": "SuperFerry",
    "type": "DOMESTIC",
    "is_active": 1
  },
  {
    "id": 15,
    "name": "Viking Ocean Cruises",
    "type": "INTERNATIONAL",
    "is_active": 1
  },
  {
    "id": 16,
    "name": "Other/Private Vessel",
    "type": "OTHER",
    "is_active": 1
  }
];

// Get active cruise lines sorted by name
export const getActiveCruiseLines = (): CruiseLine[] => {
  return CRUISE_LINES
    .filter(cruiseLine => cruiseLine.is_active === 1)
    .sort((a, b) => a.name.localeCompare(b.name));
};
