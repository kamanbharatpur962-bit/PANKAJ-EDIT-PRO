// Pankaj Edit Pro - Exactly 300 Unique Professional Filters
// Categorized into Cinematic, Vintage, Portrait, Nature, Neon, Black & White, Moody, Retro, Travel, Wedding, Food, HDR, Aesthetic

export interface FilterParams {
  brightness?: number; // Delta %
  contrast?: number;   // Delta %
  saturate?: number;   // Delta %
  sepia?: number;      // 0 to 100%
  hueRotate?: number;  // Degrees -180 to 180
  grayscale?: number;  // 0 to 100%
  invert?: number;     // 0 to 100%
}

export interface FilterPreset300 {
  id: number;
  name: string;
  category: 
    | "Cinematic"
    | "Vintage"
    | "Portrait"
    | "Nature"
    | "Neon"
    | "Black & White"
    | "Moody"
    | "Retro"
    | "Travel"
    | "Wedding"
    | "Food"
    | "HDR"
    | "Aesthetic";
  gradient: string;
  params: FilterParams;
}

export const FILTER_CATEGORIES = [
  "All",
  "Cinematic",
  "Vintage",
  "Portrait",
  "Nature",
  "Neon",
  "Black & White",
  "Moody",
  "Retro",
  "Travel",
  "Wedding",
  "Food",
  "HDR",
  "Aesthetic"
] as const;

export type FilterCategory = typeof FILTER_CATEGORIES[number];

export const FILTERS_300: FilterPreset300[] = [
  {
    "id": 1,
    "name": "Cinematic Gold",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 6,
      "contrast": 13,
      "saturate": 29,
      "sepia": 33,
      "hueRotate": -6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 2,
    "name": "Cinematic Blue",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 7,
      "contrast": 17,
      "saturate": 27,
      "sepia": 0,
      "hueRotate": 182,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 3,
    "name": "Cinematic Teal",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    "params": {
      "brightness": 8,
      "contrast": 22,
      "saturate": 29,
      "sepia": 0,
      "hueRotate": 163,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 4,
    "name": "Hollywood",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 23,
      "saturate": 20,
      "sepia": 14,
      "hueRotate": 19,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 5,
    "name": "Blockbuster",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 24,
      "saturate": 26,
      "sepia": 15,
      "hueRotate": -20,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 6,
    "name": "Movie Night",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 25,
      "saturate": 23,
      "sepia": 16,
      "hueRotate": -9,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 7,
    "name": "Film Grain",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 8,
      "contrast": 16,
      "saturate": 1,
      "sepia": 44,
      "hueRotate": -1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 8,
    "name": "Vintage Film",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 4,
      "contrast": 17,
      "saturate": -2,
      "sepia": 31,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 9,
    "name": "Retro Film",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 3,
      "contrast": 18,
      "saturate": -5,
      "sepia": 33,
      "hueRotate": 1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 10,
    "name": "Classic Film",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 2,
      "contrast": 9,
      "saturate": 1,
      "sepia": 35,
      "hueRotate": 2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 11,
    "name": "Kodak Style",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 6,
      "contrast": 10,
      "saturate": -2,
      "sepia": 37,
      "hueRotate": 3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 12,
    "name": "Fuji Style",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 5,
      "contrast": 11,
      "saturate": 4,
      "sepia": 39,
      "hueRotate": -8,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 13,
    "name": "Polaroid",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 9,
      "contrast": 12,
      "saturate": 1,
      "sepia": 41,
      "hueRotate": -7,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 14,
    "name": "Super 8",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 21,
      "saturate": 21,
      "sepia": 12,
      "hueRotate": -21,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 15,
    "name": "VHS",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 7,
      "contrast": 14,
      "saturate": 4,
      "sepia": 30,
      "hueRotate": -5,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 16,
    "name": "Analog",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 8,
      "contrast": 23,
      "saturate": 24,
      "sepia": 14,
      "hueRotate": 1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 17,
    "name": "Old Camera",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 24,
      "saturate": 21,
      "sepia": 15,
      "hueRotate": 12,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 18,
    "name": "90s Retro",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 6,
      "contrast": 17,
      "saturate": 4,
      "sepia": 36,
      "hueRotate": -2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 19,
    "name": "80s Retro",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 5,
      "contrast": 18,
      "saturate": 10,
      "sepia": 38,
      "hueRotate": -1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 20,
    "name": "70s Retro",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 4,
      "contrast": 9,
      "saturate": -13,
      "sepia": 40,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 21,
    "name": "Warm Sunset",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 28,
      "saturate": 27,
      "sepia": 19,
      "hueRotate": 6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 22,
    "name": "Golden Hour",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 7,
      "contrast": 22,
      "saturate": 29,
      "sepia": 36,
      "hueRotate": -7,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 23,
    "name": "Sunrise Glow",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 10,
      "contrast": 30,
      "saturate": 30,
      "sepia": 21,
      "hueRotate": -22,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 24,
    "name": "Sunset Orange",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 3,
      "contrast": 19,
      "saturate": 27,
      "sepia": 10,
      "hueRotate": -11,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 25,
    "name": "Sunset Pink",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 4,
      "contrast": 14,
      "saturate": 44,
      "sepia": 0,
      "hueRotate": 325,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 26,
    "name": "Sunset Purple",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 5,
      "contrast": 17,
      "saturate": 32,
      "sepia": 0,
      "hueRotate": 291,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 27,
    "name": "Summer Glow",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 22,
      "saturate": 27,
      "sepia": 13,
      "hueRotate": 22,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 28,
    "name": "Beach Warm",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #0ea5e9 0%, #10b981 50%, #f59e0b 100%)",
    "params": {
      "brightness": 11,
      "contrast": 23,
      "saturate": 45,
      "sepia": 0,
      "hueRotate": 15,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 29,
    "name": "Tropical",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 8,
      "contrast": 24,
      "saturate": 16,
      "sepia": 15,
      "hueRotate": -6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 30,
    "name": "Desert Gold",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 2,
      "contrast": 18,
      "saturate": 27,
      "sepia": 30,
      "hueRotate": -5,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 31,
    "name": "Moody Blue",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 14,
      "contrast": 18,
      "saturate": 23,
      "sepia": 0,
      "hueRotate": 186,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 32,
    "name": "Deep Blue",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #0284c7 100%)",
    "params": {
      "brightness": -16,
      "contrast": 19,
      "saturate": 33,
      "sepia": 0,
      "hueRotate": 187,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 33,
    "name": "Ocean Blue",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 9,
      "contrast": 20,
      "saturate": 34,
      "sepia": 0,
      "hueRotate": 188,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 34,
    "name": "Arctic Blue",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    "params": {
      "brightness": 7,
      "contrast": 23,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 164,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 35,
    "name": "Midnight Blue",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 50%, #0284c7 100%)",
    "params": {
      "brightness": -20,
      "contrast": 22,
      "saturate": 45,
      "sepia": 0,
      "hueRotate": 190,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 36,
    "name": "Royal Blue",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 11,
      "contrast": 23,
      "saturate": 16,
      "sepia": 0,
      "hueRotate": 191,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 37,
    "name": "Sky Blue",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 10,
      "contrast": 24,
      "saturate": 26,
      "sepia": 0,
      "hueRotate": 192,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 38,
    "name": "Electric Blue",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 14,
      "contrast": 25,
      "saturate": 27,
      "sepia": 0,
      "hueRotate": 193,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 39,
    "name": "Neon Blue",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 13,
      "contrast": 26,
      "saturate": 37,
      "sepia": 0,
      "hueRotate": 194,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 40,
    "name": "Ice Blue",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 4,
      "contrast": 27,
      "saturate": 38,
      "sepia": 0,
      "hueRotate": 195,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 41,
    "name": "Teal Orange",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    "params": {
      "brightness": 5,
      "contrast": 20,
      "saturate": 32,
      "sepia": 0,
      "hueRotate": 171,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 42,
    "name": "Teal Gold",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 3,
      "contrast": 18,
      "saturate": 30,
      "sepia": 36,
      "hueRotate": -7,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 43,
    "name": "Teal Cyan",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    "params": {
      "brightness": 8,
      "contrast": 22,
      "saturate": 41,
      "sepia": 0,
      "hueRotate": 173,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 44,
    "name": "Orange Crush",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 27,
      "saturate": 20,
      "sepia": 18,
      "hueRotate": 9,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 45,
    "name": "Warm Orange",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 28,
      "saturate": 17,
      "sepia": 19,
      "hueRotate": 20,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 46,
    "name": "Burnt Orange",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 8,
      "contrast": 29,
      "saturate": 23,
      "sepia": 20,
      "hueRotate": -19,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 47,
    "name": "Amber Glow",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 8,
      "contrast": 23,
      "saturate": 28,
      "sepia": 36,
      "hueRotate": -12,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 48,
    "name": "Copper Tone",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 6,
      "contrast": 12,
      "saturate": 36,
      "sepia": 39,
      "hueRotate": -13,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 49,
    "name": "Bronze Tone",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 5,
      "contrast": 13,
      "saturate": 35,
      "sepia": 42,
      "hueRotate": -14,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 50,
    "name": "Golden Brown",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 4,
      "contrast": 14,
      "saturate": 28,
      "sepia": 30,
      "hueRotate": -5,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 51,
    "name": "Emerald Green",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 6,
      "contrast": 13,
      "saturate": 21,
      "sepia": 0,
      "hueRotate": 101,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 52,
    "name": "Forest Green",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)",
    "params": {
      "brightness": -11,
      "contrast": 14,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 102,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 53,
    "name": "Dark Green",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)",
    "params": {
      "brightness": -8,
      "contrast": 15,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 103,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 54,
    "name": "Mint Green",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 5,
      "contrast": 16,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 104,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 55,
    "name": "Lime Green",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 3,
      "contrast": 17,
      "saturate": 19,
      "sepia": 0,
      "hueRotate": 105,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 56,
    "name": "Olive Tone",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 6,
      "contrast": 18,
      "saturate": 19,
      "sepia": 0,
      "hueRotate": 106,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 57,
    "name": "Sage Green",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 4,
      "contrast": 19,
      "saturate": 28,
      "sepia": 0,
      "hueRotate": 107,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 58,
    "name": "Neon Green",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 7,
      "contrast": 20,
      "saturate": 28,
      "sepia": 0,
      "hueRotate": 108,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 59,
    "name": "Aqua Green",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    "params": {
      "brightness": 7,
      "contrast": 28,
      "saturate": 29,
      "sepia": 0,
      "hueRotate": 189,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 60,
    "name": "Green Film",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 3,
      "contrast": 12,
      "saturate": 17,
      "sepia": 0,
      "hueRotate": 110,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 61,
    "name": "Rose Pink",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 7,
      "contrast": 10,
      "saturate": 32,
      "sepia": 0,
      "hueRotate": 301,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 62,
    "name": "Soft Pink",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 6,
      "contrast": 11,
      "saturate": 31,
      "sepia": 0,
      "hueRotate": 302,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 63,
    "name": "Hot Pink",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 10,
      "contrast": 12,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 303,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 64,
    "name": "Magenta",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 23,
      "saturate": 27,
      "sepia": 14,
      "hueRotate": -21,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 65,
    "name": "Berry Pink",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 8,
      "contrast": 14,
      "saturate": 37,
      "sepia": 0,
      "hueRotate": 305,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 66,
    "name": "Cherry Pink",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 6,
      "contrast": 15,
      "saturate": 45,
      "sepia": 0,
      "hueRotate": 306,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 67,
    "name": "Blush",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 5,
      "contrast": 16,
      "saturate": 24,
      "sepia": 0,
      "hueRotate": 307,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 68,
    "name": "Romantic Pink",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 9,
      "contrast": 17,
      "saturate": 32,
      "sepia": 0,
      "hueRotate": 308,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 69,
    "name": "Cotton Candy",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 28,
      "saturate": 30,
      "sepia": 19,
      "hueRotate": -16,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 70,
    "name": "Pink Dream",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 7,
      "contrast": 9,
      "saturate": 39,
      "sepia": 0,
      "hueRotate": 310,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 71,
    "name": "Purple Dream",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 5,
      "contrast": 26,
      "saturate": 32,
      "sepia": 0,
      "hueRotate": 276,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 72,
    "name": "Lavender",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 3,
      "contrast": 15,
      "saturate": 32,
      "sepia": 0,
      "hueRotate": 277,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 73,
    "name": "Violet",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 6,
      "contrast": 16,
      "saturate": 41,
      "sepia": 0,
      "hueRotate": 278,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 74,
    "name": "Deep Purple",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #3b0764 0%, #581c87 50%, #7e22ce 100%)",
    "params": {
      "brightness": -12,
      "contrast": 17,
      "saturate": 41,
      "sepia": 0,
      "hueRotate": 279,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 75,
    "name": "Royal Purple",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 2,
      "contrast": 18,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 280,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 76,
    "name": "Neon Purple",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 5,
      "contrast": 19,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 281,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 77,
    "name": "Mystic Purple",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 3,
      "contrast": 20,
      "saturate": 39,
      "sepia": 0,
      "hueRotate": 282,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 78,
    "name": "Grape Tone",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 6,
      "contrast": 21,
      "saturate": 39,
      "sepia": 0,
      "hueRotate": 283,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 79,
    "name": "Plum Tone",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #3b0764 0%, #581c87 50%, #7e22ce 100%)",
    "params": {
      "brightness": -12,
      "contrast": 22,
      "saturate": 48,
      "sepia": 0,
      "hueRotate": 284,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 80,
    "name": "Purple Film",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 2,
      "contrast": 23,
      "saturate": 28,
      "sepia": 0,
      "hueRotate": 285,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 81,
    "name": "Black & White",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
    "params": {
      "brightness": 3,
      "contrast": 24,
      "saturate": -4,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 82,
    "name": "Classic B&W",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
    "params": {
      "brightness": 1,
      "contrast": 25,
      "saturate": 1,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 83,
    "name": "High Contrast B&W",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #000000 0%, #434343 50%, #ffffff 100%)",
    "params": {
      "brightness": -3,
      "contrast": 45,
      "saturate": -3,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 84,
    "name": "Soft B&W",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #2b2b2b 0%, #8e9eab 50%, #eef2f3 100%)",
    "params": {
      "brightness": 14,
      "contrast": -8,
      "saturate": 2,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 85,
    "name": "Matte B&W",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    "params": {
      "brightness": -20,
      "contrast": 17,
      "saturate": -2,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 86,
    "name": "Noir",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
    "params": {
      "brightness": 3,
      "contrast": 17,
      "saturate": 3,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 87,
    "name": "Dark Noir",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    "params": {
      "brightness": -21,
      "contrast": 17,
      "saturate": -1,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 88,
    "name": "Silver B&W",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #2b2b2b 0%, #8e9eab 50%, #eef2f3 100%)",
    "params": {
      "brightness": 12,
      "contrast": -4,
      "saturate": 4,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 89,
    "name": "Vintage B&W",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
    "params": {
      "brightness": 2,
      "contrast": 20,
      "saturate": 0,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 90,
    "name": "Dramatic B&W",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #000000 0%, #434343 50%, #ffffff 100%)",
    "params": {
      "brightness": -7,
      "contrast": 42,
      "saturate": -4,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 91,
    "name": "Soft Matte",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 12,
      "contrast": -18,
      "saturate": -15,
      "sepia": 21,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 92,
    "name": "Dark Matte",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -17,
      "contrast": 37,
      "saturate": -20,
      "sepia": 14,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 93,
    "name": "Cinematic Matte",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 15,
      "contrast": -20,
      "saturate": -16,
      "sepia": 23,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 94,
    "name": "Black Matte",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 14,
      "contrast": -21,
      "saturate": -21,
      "sepia": 24,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 95,
    "name": "Film Matte",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 7,
      "contrast": 14,
      "saturate": 8,
      "sepia": 40,
      "hueRotate": 3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 96,
    "name": "Faded Matte",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 17,
      "contrast": -15,
      "saturate": -22,
      "sepia": 14,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 97,
    "name": "Cream Matte",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 16,
      "contrast": -16,
      "saturate": -18,
      "sepia": 15,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 98,
    "name": "Warm Matte",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 20,
      "contrast": -17,
      "saturate": -23,
      "sepia": 16,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 99,
    "name": "Cool Matte",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 19,
      "contrast": -18,
      "saturate": -28,
      "sepia": 17,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 100,
    "name": "Vintage Matte",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 4,
      "contrast": 9,
      "saturate": -9,
      "sepia": 35,
      "hueRotate": -4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 101,
    "name": "Dreamy",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 17,
      "contrast": -14,
      "saturate": 26,
      "sepia": 13,
      "hueRotate": 15,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 102,
    "name": "Soft Dream",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 16,
      "contrast": -9,
      "saturate": 32,
      "sepia": 14,
      "hueRotate": 30,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 103,
    "name": "Dream Glow",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 20,
      "contrast": -10,
      "saturate": 29,
      "sepia": 15,
      "hueRotate": 45,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 104,
    "name": "Fantasy",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 19,
      "contrast": -11,
      "saturate": 35,
      "sepia": 8,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 105,
    "name": "Fairy Glow",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 18,
      "contrast": -12,
      "saturate": 17,
      "sepia": 9,
      "hueRotate": 15,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 106,
    "name": "Magical",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 22,
      "contrast": -13,
      "saturate": 23,
      "sepia": 10,
      "hueRotate": 30,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 107,
    "name": "Ethereal",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 21,
      "contrast": -14,
      "saturate": 20,
      "sepia": 11,
      "hueRotate": 45,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 108,
    "name": "Cloudy Dream",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 25,
      "contrast": -9,
      "saturate": 17,
      "sepia": 12,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 109,
    "name": "Soft Focus",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 20,
      "saturate": 30,
      "sepia": 11,
      "hueRotate": 24,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 110,
    "name": "Glow Dream",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 13,
      "contrast": -11,
      "saturate": 20,
      "sepia": 14,
      "hueRotate": 30,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 111,
    "name": "Neon Glow",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #06b6d4 100%)",
    "params": {
      "brightness": 16,
      "contrast": 38,
      "saturate": 75,
      "sepia": 0,
      "hueRotate": -63,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 112,
    "name": "Cyberpunk",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #06b6d4 100%)",
    "params": {
      "brightness": 7,
      "contrast": 39,
      "saturate": 74,
      "sepia": 0,
      "hueRotate": -36,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 113,
    "name": "Cyber Blue",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 9,
      "contrast": 16,
      "saturate": 48,
      "sepia": 0,
      "hueRotate": 193,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 114,
    "name": "Cyber Purple",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 4,
      "contrast": 21,
      "saturate": 43,
      "sepia": 0,
      "hueRotate": 289,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 115,
    "name": "Neon City",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #06b6d4 100%)",
    "params": {
      "brightness": 9,
      "contrast": 42,
      "saturate": 89,
      "sepia": 0,
      "hueRotate": 45,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 116,
    "name": "Night Neon",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #06b6d4 100%)",
    "params": {
      "brightness": 13,
      "contrast": 43,
      "saturate": 88,
      "sepia": 0,
      "hueRotate": 72,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 117,
    "name": "Electric Pink",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 7,
      "contrast": 16,
      "saturate": 32,
      "sepia": 0,
      "hueRotate": 327,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 118,
    "name": "Electric Purple",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 6,
      "contrast": 25,
      "saturate": 41,
      "sepia": 0,
      "hueRotate": 293,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 119,
    "name": "Electric Cyan",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    "params": {
      "brightness": 7,
      "contrast": 28,
      "saturate": 13,
      "sepia": 0,
      "hueRotate": 189,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 120,
    "name": "Future Glow",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #06b6d4 100%)",
    "params": {
      "brightness": 6,
      "contrast": 32,
      "saturate": 62,
      "sepia": 0,
      "hueRotate": -180,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 121,
    "name": "Street",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 20,
      "saturate": 25,
      "sepia": 11,
      "hueRotate": 6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 122,
    "name": "Urban",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 21,
      "saturate": 31,
      "sepia": 12,
      "hueRotate": 17,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 123,
    "name": "Urban Night",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 8,
      "contrast": 22,
      "saturate": 28,
      "sepia": 13,
      "hueRotate": -22,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 124,
    "name": "Street Film",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 6,
      "contrast": 13,
      "saturate": -2,
      "sepia": 38,
      "hueRotate": -4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 125,
    "name": "Street Moody",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -21,
      "contrast": 42,
      "saturate": -20,
      "sepia": 17,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 126,
    "name": "Street Blue",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 13,
      "contrast": 15,
      "saturate": 16,
      "sepia": 0,
      "hueRotate": 181,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 127,
    "name": "Street Orange",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 3,
      "contrast": 26,
      "saturate": 20,
      "sepia": 17,
      "hueRotate": 22,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 128,
    "name": "City Lights",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 27,
      "saturate": 17,
      "sepia": 18,
      "hueRotate": -17,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 129,
    "name": "Downtown",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 28,
      "saturate": 23,
      "sepia": 19,
      "hueRotate": -6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 130,
    "name": "Metro Film",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 2,
      "contrast": 9,
      "saturate": -2,
      "sepia": 35,
      "hueRotate": 2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 131,
    "name": "Portrait Pro",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 12,
      "contrast": 10,
      "saturate": 26,
      "sepia": 13,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 132,
    "name": "Portrait Warm",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 5,
      "contrast": 11,
      "saturate": 11,
      "sepia": 8,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 133,
    "name": "Portrait Cool",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 9,
      "contrast": 12,
      "saturate": 17,
      "sepia": 9,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 134,
    "name": "Portrait Glow",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 8,
      "contrast": 13,
      "saturate": 14,
      "sepia": 10,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 135,
    "name": "Portrait Matte",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 13,
      "contrast": -22,
      "saturate": -19,
      "sepia": 17,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 136,
    "name": "Portrait Film",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 3,
      "contrast": 15,
      "saturate": 7,
      "sepia": 32,
      "hueRotate": -4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 137,
    "name": "Skin Glow",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 10,
      "contrast": 8,
      "saturate": 14,
      "sepia": 13,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 138,
    "name": "Soft Skin",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 8,
      "contrast": 9,
      "saturate": 20,
      "sepia": 8,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 139,
    "name": "Natural Portrait",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 7,
      "contrast": 10,
      "saturate": 17,
      "sepia": 9,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 140,
    "name": "Studio Portrait",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 6,
      "contrast": 11,
      "saturate": 23,
      "sepia": 10,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 141,
    "name": "Fashion",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 28,
      "saturate": 18,
      "sepia": 19,
      "hueRotate": -24,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 142,
    "name": "Fashion Film",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 7,
      "contrast": 11,
      "saturate": -4,
      "sepia": 44,
      "hueRotate": 2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 143,
    "name": "Fashion Matte",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 15,
      "contrast": -22,
      "saturate": -23,
      "sepia": 25,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 144,
    "name": "Fashion Gold",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 4,
      "contrast": 12,
      "saturate": 33,
      "sepia": 42,
      "hueRotate": -9,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 145,
    "name": "Fashion Noir",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
    "params": {
      "brightness": 0,
      "contrast": 16,
      "saturate": 1,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 146,
    "name": "Beauty Glow",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 9,
      "contrast": 9,
      "saturate": 11,
      "sepia": 10,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 147,
    "name": "Soft Beauty",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 8,
      "contrast": 10,
      "saturate": 17,
      "sepia": 11,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 148,
    "name": "Natural Beauty",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 12,
      "contrast": 11,
      "saturate": 14,
      "sepia": 12,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 149,
    "name": "Clean Beauty",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 11,
      "contrast": 12,
      "saturate": 20,
      "sepia": 13,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 150,
    "name": "Luxury Portrait",
    "category": "Portrait",
    "gradient": "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #fb923c 100%)",
    "params": {
      "brightness": 4,
      "contrast": 13,
      "saturate": 17,
      "sepia": 8,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 151,
    "name": "Travel Film",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 10,
      "contrast": 10,
      "saturate": 5,
      "sepia": 32,
      "hueRotate": -1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 152,
    "name": "Adventure",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #0ea5e9 0%, #10b981 50%, #f59e0b 100%)",
    "params": {
      "brightness": 6,
      "contrast": 27,
      "saturate": 40,
      "sepia": 0,
      "hueRotate": 15,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 153,
    "name": "Mountain",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #0ea5e9 0%, #10b981 50%, #f59e0b 100%)",
    "params": {
      "brightness": 10,
      "contrast": 28,
      "saturate": 37,
      "sepia": 0,
      "hueRotate": -10,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 154,
    "name": "Mountain Blue",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 8,
      "contrast": 15,
      "saturate": 41,
      "sepia": 0,
      "hueRotate": 184,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 155,
    "name": "Forest Film",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)",
    "params": {
      "brightness": -12,
      "contrast": 17,
      "saturate": 15,
      "sepia": 0,
      "hueRotate": 100,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 156,
    "name": "Nature Green",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 6,
      "contrast": 18,
      "saturate": 24,
      "sepia": 0,
      "hueRotate": 101,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 157,
    "name": "Nature Warm",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 3,
      "contrast": 20,
      "saturate": 19,
      "sepia": 11,
      "hueRotate": 2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 158,
    "name": "Nature HDR",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 7,
      "contrast": 41,
      "saturate": 33,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 159,
    "name": "Landscape Pro",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 22,
      "saturate": 22,
      "sepia": 13,
      "hueRotate": 24,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 160,
    "name": "Landscape Gold",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 6,
      "contrast": 16,
      "saturate": 29,
      "sepia": 30,
      "hueRotate": -5,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 161,
    "name": "Sky Enhance",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 8,
      "contrast": 22,
      "saturate": 45,
      "sepia": 0,
      "hueRotate": 191,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 162,
    "name": "Cloud Enhance",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 2,
      "contrast": 25,
      "saturate": 22,
      "sepia": 16,
      "hueRotate": 7,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 163,
    "name": "Water Blue",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 11,
      "contrast": 24,
      "saturate": 26,
      "sepia": 0,
      "hueRotate": 193,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 164,
    "name": "Ocean Film",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 10,
      "contrast": 25,
      "saturate": 27,
      "sepia": 0,
      "hueRotate": 194,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 165,
    "name": "Beach Film",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 5,
      "contrast": 14,
      "saturate": -3,
      "sepia": 30,
      "hueRotate": 1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 166,
    "name": "Travel Warm",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #0ea5e9 0%, #10b981 50%, #f59e0b 100%)",
    "params": {
      "brightness": 10,
      "contrast": 29,
      "saturate": 36,
      "sepia": 0,
      "hueRotate": 15,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 167,
    "name": "Travel Vintage",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 8,
      "contrast": 16,
      "saturate": 0,
      "sepia": 34,
      "hueRotate": 3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 168,
    "name": "Travel Moody",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -20,
      "contrast": 29,
      "saturate": -19,
      "sepia": 20,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 169,
    "name": "Explore",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #0ea5e9 0%, #10b981 50%, #f59e0b 100%)",
    "params": {
      "brightness": 6,
      "contrast": 20,
      "saturate": 45,
      "sepia": 0,
      "hueRotate": -10,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 170,
    "name": "Wanderlust",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #0ea5e9 0%, #10b981 50%, #f59e0b 100%)",
    "params": {
      "brightness": 5,
      "contrast": 21,
      "saturate": 42,
      "sepia": 0,
      "hueRotate": 15,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 171,
    "name": "Food Warm",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 10,
      "contrast": 18,
      "saturate": 32,
      "sepia": 11,
      "hueRotate": -4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 172,
    "name": "Food Fresh",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 9,
      "contrast": 19,
      "saturate": 38,
      "sepia": 12,
      "hueRotate": -3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 173,
    "name": "Food Pop",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 13,
      "contrast": 20,
      "saturate": 35,
      "sepia": 13,
      "hueRotate": -2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 174,
    "name": "Food Cinematic",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 6,
      "contrast": 21,
      "saturate": 41,
      "sepia": 14,
      "hueRotate": -1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 175,
    "name": "Food Matte",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 13,
      "contrast": -22,
      "saturate": -27,
      "sepia": 21,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 176,
    "name": "Restaurant",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 9,
      "contrast": 23,
      "saturate": 44,
      "sepia": 16,
      "hueRotate": 1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 177,
    "name": "Cafe",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 8,
      "contrast": 24,
      "saturate": 41,
      "sepia": 17,
      "hueRotate": 2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 178,
    "name": "Coffee Tone",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 12,
      "contrast": 25,
      "saturate": 47,
      "sepia": 18,
      "hueRotate": 3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 179,
    "name": "Dessert Glow",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 11,
      "contrast": 26,
      "saturate": 44,
      "sepia": 19,
      "hueRotate": 4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 180,
    "name": "Fresh Food",
    "category": "Food",
    "gradient": "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #84cc16 100%)",
    "params": {
      "brightness": 4,
      "contrast": 17,
      "saturate": 26,
      "sepia": 10,
      "hueRotate": -5,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 181,
    "name": "Wedding Warm",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #fed7aa 100%)",
    "params": {
      "brightness": 12,
      "contrast": 10,
      "saturate": 7,
      "sepia": 17,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 182,
    "name": "Wedding Glow",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #fed7aa 100%)",
    "params": {
      "brightness": 11,
      "contrast": 11,
      "saturate": 4,
      "sepia": 18,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 183,
    "name": "Wedding Film",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 11,
      "contrast": 12,
      "saturate": -5,
      "sepia": 36,
      "hueRotate": -5,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 184,
    "name": "Wedding Vintage",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 2,
      "contrast": 13,
      "saturate": -8,
      "sepia": 38,
      "hueRotate": -4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 185,
    "name": "Wedding Dream",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 18,
      "contrast": -14,
      "saturate": 26,
      "sepia": 9,
      "hueRotate": 15,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 186,
    "name": "Wedding Gold",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 5,
      "contrast": 18,
      "saturate": 27,
      "sepia": 33,
      "hueRotate": -11,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 187,
    "name": "Love Story",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #fed7aa 100%)",
    "params": {
      "brightness": 10,
      "contrast": 8,
      "saturate": 16,
      "sepia": 15,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 188,
    "name": "Romantic Film",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 8,
      "contrast": 17,
      "saturate": -2,
      "sepia": 31,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 189,
    "name": "Soft Romance",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #fed7aa 100%)",
    "params": {
      "brightness": 13,
      "contrast": 10,
      "saturate": 10,
      "sepia": 17,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 190,
    "name": "Bridal Glow",
    "category": "Wedding",
    "gradient": "linear-gradient(135deg, #fef3c7 0%, #fbcfe8 50%, #fed7aa 100%)",
    "params": {
      "brightness": 12,
      "contrast": 11,
      "saturate": 6,
      "sepia": 18,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 191,
    "name": "Festival",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 9,
      "contrast": 30,
      "saturate": 24,
      "sepia": 21,
      "hueRotate": -24,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 192,
    "name": "Celebration",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 2,
      "contrast": 19,
      "saturate": 30,
      "sepia": 10,
      "hueRotate": -13,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 193,
    "name": "Party Glow",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 20,
      "saturate": 27,
      "sepia": 11,
      "hueRotate": -2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 194,
    "name": "Color Pop",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 21,
      "saturate": 33,
      "sepia": 12,
      "hueRotate": 9,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 195,
    "name": "Vibrant",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 22,
      "saturate": 30,
      "sepia": 13,
      "hueRotate": 20,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 196,
    "name": "Super Vibrant",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 8,
      "contrast": 23,
      "saturate": 22,
      "sepia": 14,
      "hueRotate": -19,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 197,
    "name": "Colorful",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 24,
      "saturate": 19,
      "sepia": 15,
      "hueRotate": -8,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 198,
    "name": "Rainbow",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 25,
      "saturate": 16,
      "sepia": 16,
      "hueRotate": 3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 199,
    "name": "Candy Color",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 26,
      "saturate": 22,
      "sepia": 17,
      "hueRotate": 14,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 200,
    "name": "Pop Art",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 3,
      "contrast": 27,
      "saturate": 19,
      "sepia": 18,
      "hueRotate": -25,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 201,
    "name": "HDR Pro",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 7,
      "contrast": 30,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 202,
    "name": "HDR Natural",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 6,
      "contrast": 31,
      "saturate": 27,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 203,
    "name": "HDR Cinematic",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 10,
      "contrast": 32,
      "saturate": 33,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 204,
    "name": "HDR Landscape",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 3,
      "contrast": 33,
      "saturate": 30,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 205,
    "name": "HDR Portrait",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 2,
      "contrast": 34,
      "saturate": 36,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 206,
    "name": "Ultra Contrast",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 21,
      "saturate": 28,
      "sepia": 12,
      "hueRotate": -9,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 207,
    "name": "Deep Contrast",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 22,
      "saturate": 25,
      "sepia": 13,
      "hueRotate": 2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 208,
    "name": "Soft Contrast",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 9,
      "contrast": 23,
      "saturate": 31,
      "sepia": 14,
      "hueRotate": 13,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 209,
    "name": "Dynamic",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 8,
      "contrast": 24,
      "saturate": 28,
      "sepia": 15,
      "hueRotate": 24,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 210,
    "name": "Clarity Pro",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 1,
      "contrast": 39,
      "saturate": 24,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 211,
    "name": "Sharp Film",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 5,
      "contrast": 40,
      "saturate": 21,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 212,
    "name": "Crisp",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 4,
      "contrast": 41,
      "saturate": 27,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 213,
    "name": "Clean",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 8,
      "contrast": 28,
      "saturate": 20,
      "sepia": 19,
      "hueRotate": 18,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 214,
    "name": "Clear Vision",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 29,
      "saturate": 26,
      "sepia": 20,
      "hueRotate": -21,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 215,
    "name": "Detail Boost",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 6,
      "contrast": 44,
      "saturate": 27,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 216,
    "name": "Texture Pro",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 4,
      "contrast": 27,
      "saturate": 24,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 217,
    "name": "High Definition",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 3,
      "contrast": 20,
      "saturate": 26,
      "sepia": 11,
      "hueRotate": 12,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 218,
    "name": "Ultra Detail",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 7,
      "contrast": 29,
      "saturate": 27,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 219,
    "name": "Natural HDR",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #f97316 0%, #ec4899 50%, #6366f1 100%)",
    "params": {
      "brightness": 6,
      "contrast": 30,
      "saturate": 33,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 220,
    "name": "Realistic",
    "category": "HDR",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 23,
      "saturate": 26,
      "sepia": 14,
      "hueRotate": -5,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 221,
    "name": "Dark Moody",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -14,
      "contrast": 40,
      "saturate": -23,
      "sepia": 13,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 222,
    "name": "Deep Moody",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -17,
      "contrast": 41,
      "saturate": -28,
      "sepia": 14,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 223,
    "name": "Moody Brown",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -15,
      "contrast": 42,
      "saturate": -24,
      "sepia": 15,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 224,
    "name": "Moody Green",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 5,
      "contrast": 16,
      "saturate": 34,
      "sepia": 0,
      "hueRotate": 99,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 225,
    "name": "Moody Orange",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -21,
      "contrast": 30,
      "saturate": -19,
      "sepia": 0,
      "hueRotate": 25,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 226,
    "name": "Moody Red",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -19,
      "contrast": 31,
      "saturate": -15,
      "sepia": 0,
      "hueRotate": 340,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 227,
    "name": "Moody Purple",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 3,
      "contrast": 26,
      "saturate": 33,
      "sepia": 0,
      "hueRotate": 282,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 228,
    "name": "Moody Teal",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    "params": {
      "brightness": 8,
      "contrast": 27,
      "saturate": 29,
      "sepia": 0,
      "hueRotate": 178,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 229,
    "name": "Moody Night",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -23,
      "contrast": 34,
      "saturate": -21,
      "sepia": 21,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 230,
    "name": "Dark Cinematic",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -16,
      "contrast": 35,
      "saturate": -17,
      "sepia": 12,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 231,
    "name": "Red Crush",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 22,
      "saturate": 24,
      "sepia": 13,
      "hueRotate": 16,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 232,
    "name": "Crimson",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 23,
      "saturate": 30,
      "sepia": 14,
      "hueRotate": -23,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 233,
    "name": "Scarlet",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 10,
      "contrast": 24,
      "saturate": 27,
      "sepia": 15,
      "hueRotate": -12,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 234,
    "name": "Ruby",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 3,
      "contrast": 25,
      "saturate": 24,
      "sepia": 16,
      "hueRotate": -1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 235,
    "name": "Wine Tone",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 2,
      "contrast": 26,
      "saturate": 30,
      "sepia": 17,
      "hueRotate": 10,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 236,
    "name": "Burgundy",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 27,
      "saturate": 27,
      "sepia": 18,
      "hueRotate": 21,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 237,
    "name": "Red Film",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 6,
      "contrast": 16,
      "saturate": 9,
      "sepia": 39,
      "hueRotate": 1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 238,
    "name": "Fire Red",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 9,
      "contrast": 29,
      "saturate": 16,
      "sepia": 20,
      "hueRotate": -7,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 239,
    "name": "Red Neon",
    "category": "Neon",
    "gradient": "linear-gradient(135deg, #f43f5e 0%, #8b5cf6 50%, #06b6d4 100%)",
    "params": {
      "brightness": 15,
      "contrast": 46,
      "saturate": 100,
      "sepia": 0,
      "hueRotate": 153,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 240,
    "name": "Cherry Red",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 3,
      "contrast": 9,
      "saturate": 24,
      "sepia": 0,
      "hueRotate": 300,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 241,
    "name": "Pastel Blue",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 8,
      "contrast": 18,
      "saturate": 29,
      "sepia": 0,
      "hueRotate": 196,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 242,
    "name": "Pastel Pink",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb7185 100%)",
    "params": {
      "brightness": 6,
      "contrast": 11,
      "saturate": 31,
      "sepia": 0,
      "hueRotate": 302,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 243,
    "name": "Pastel Purple",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #c084fc 100%)",
    "params": {
      "brightness": 6,
      "contrast": 18,
      "saturate": 36,
      "sepia": 0,
      "hueRotate": 268,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 244,
    "name": "Pastel Green",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #10b981 0%, #34d399 50%, #059669 100%)",
    "params": {
      "brightness": 5,
      "contrast": 16,
      "saturate": 35,
      "sepia": 0,
      "hueRotate": 119,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 245,
    "name": "Pastel Yellow",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fed7aa 0%, #fbcfe8 50%, #bfdbfe 100%)",
    "params": {
      "brightness": 17,
      "contrast": -11,
      "saturate": -8,
      "sepia": 0,
      "hueRotate": 115,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 246,
    "name": "Pastel Orange",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fed7aa 0%, #fbcfe8 50%, #bfdbfe 100%)",
    "params": {
      "brightness": 21,
      "contrast": -11,
      "saturate": -2,
      "sepia": 0,
      "hueRotate": 150,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 247,
    "name": "Soft Pastel",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fed7aa 0%, #fbcfe8 50%, #bfdbfe 100%)",
    "params": {
      "brightness": 20,
      "contrast": -11,
      "saturate": -5,
      "sepia": 0,
      "hueRotate": -175,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 248,
    "name": "Dream Pastel",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fbcfe8 0%, #c084fc 50%, #67e8f9 100%)",
    "params": {
      "brightness": 25,
      "contrast": -11,
      "saturate": 29,
      "sepia": 8,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 249,
    "name": "Vintage Pastel",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 3,
      "contrast": 18,
      "saturate": -2,
      "sepia": 33,
      "hueRotate": 1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 250,
    "name": "Candy Pastel",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #fed7aa 0%, #fbcfe8 50%, #bfdbfe 100%)",
    "params": {
      "brightness": 14,
      "contrast": -11,
      "saturate": 4,
      "sepia": 0,
      "hueRotate": -70,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 251,
    "name": "Sepia",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 6,
      "contrast": 10,
      "saturate": 1,
      "sepia": 37,
      "hueRotate": 3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 252,
    "name": "Warm Sepia",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 5,
      "contrast": 11,
      "saturate": -2,
      "sepia": 39,
      "hueRotate": -8,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 253,
    "name": "Old Paper",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 20,
      "saturate": 20,
      "sepia": 11,
      "hueRotate": 8,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 254,
    "name": "Antique",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 8,
      "contrast": 13,
      "saturate": 1,
      "sepia": 43,
      "hueRotate": -6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 255,
    "name": "Antique Gold",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 5,
      "contrast": 15,
      "saturate": 27,
      "sepia": 30,
      "hueRotate": -10,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 256,
    "name": "Retro Brown",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 3,
      "contrast": 15,
      "saturate": 4,
      "sepia": 32,
      "hueRotate": -4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 257,
    "name": "Faded Retro",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 2,
      "contrast": 16,
      "saturate": 10,
      "sepia": 34,
      "hueRotate": -3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 258,
    "name": "Classic Retro",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 6,
      "contrast": 17,
      "saturate": 7,
      "sepia": 36,
      "hueRotate": -2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 259,
    "name": "Nostalgia",
    "category": "Retro",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 26,
      "saturate": 29,
      "sepia": 17,
      "hueRotate": 24,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 260,
    "name": "Memory Film",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 4,
      "contrast": 9,
      "saturate": -10,
      "sepia": 40,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 261,
    "name": "Cool Tone",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 28,
      "saturate": 23,
      "sepia": 19,
      "hueRotate": -4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 262,
    "name": "Cold Film",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 7,
      "contrast": 11,
      "saturate": -7,
      "sepia": 44,
      "hueRotate": 2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 263,
    "name": "Winter",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 10,
      "contrast": 30,
      "saturate": 26,
      "sepia": 21,
      "hueRotate": 18,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 264,
    "name": "Winter Blue",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 6,
      "contrast": 27,
      "saturate": 22,
      "sepia": 0,
      "hueRotate": 194,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 265,
    "name": "Snow Glow",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 2,
      "contrast": 20,
      "saturate": 29,
      "sepia": 11,
      "hueRotate": -10,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 266,
    "name": "Arctic Film",
    "category": "Travel",
    "gradient": "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)",
    "params": {
      "brightness": 5,
      "contrast": 25,
      "saturate": 32,
      "sepia": 0,
      "hueRotate": 186,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 267,
    "name": "Frost",
    "category": "Nature",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 22,
      "saturate": 18,
      "sepia": 13,
      "hueRotate": 12,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 268,
    "name": "Ice Matte",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 20,
      "contrast": -19,
      "saturate": -24,
      "sepia": 18,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 269,
    "name": "Cold Noir",
    "category": "Black & White",
    "gradient": "linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)",
    "params": {
      "brightness": 2,
      "contrast": 20,
      "saturate": 0,
      "sepia": 0,
      "hueRotate": 0,
      "grayscale": 100,
      "invert": 0
    }
  },
  {
    "id": 270,
    "name": "Blue Shadow",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)",
    "params": {
      "brightness": 10,
      "contrast": 19,
      "saturate": 16,
      "sepia": 0,
      "hueRotate": 200,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 271,
    "name": "Golden Shadow",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 6,
      "contrast": 19,
      "saturate": 29,
      "sepia": 33,
      "hueRotate": -6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 272,
    "name": "Soft Shadow",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -17,
      "contrast": 35,
      "saturate": -20,
      "sepia": 14,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 273,
    "name": "Deep Shadow",
    "category": "Moody",
    "gradient": "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
    "params": {
      "brightness": -15,
      "contrast": 36,
      "saturate": -16,
      "sepia": 15,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 274,
    "name": "Lifted Black",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 29,
      "saturate": 24,
      "sepia": 20,
      "hueRotate": -11,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 275,
    "name": "Fade",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 13,
      "contrast": -18,
      "saturate": -17,
      "sepia": 25,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 276,
    "name": "Faded Color",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 17,
      "contrast": -19,
      "saturate": -22,
      "sepia": 14,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 277,
    "name": "Dusty Film",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 6,
      "contrast": 16,
      "saturate": 11,
      "sepia": 44,
      "hueRotate": -7,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 278,
    "name": "Grainy Vintage",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 10,
      "contrast": 17,
      "saturate": 8,
      "sepia": 31,
      "hueRotate": -6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 279,
    "name": "Grain & Fade",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #52525b 0%, #a1a1aa 50%, #e4e4e7 100%)",
    "params": {
      "brightness": 19,
      "contrast": -22,
      "saturate": -28,
      "sepia": 17,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 280,
    "name": "Analog Dust",
    "category": "Vintage",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 23,
      "saturate": 19,
      "sepia": 14,
      "hueRotate": 5,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 281,
    "name": "Luxury Gold",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 10,
      "contrast": 17,
      "saturate": 25,
      "sepia": 33,
      "hueRotate": -6,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 282,
    "name": "Rich Gold",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)",
    "params": {
      "brightness": 3,
      "contrast": 18,
      "saturate": 33,
      "sepia": 36,
      "hueRotate": -7,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 283,
    "name": "Platinum",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 26,
      "saturate": 19,
      "sepia": 17,
      "hueRotate": -12,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 284,
    "name": "Silver Luxury",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 27,
      "saturate": 25,
      "sepia": 18,
      "hueRotate": -1,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 285,
    "name": "Diamond Glow",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 28,
      "saturate": 22,
      "sepia": 19,
      "hueRotate": 10,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 286,
    "name": "Premium Film",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 9,
      "contrast": 15,
      "saturate": 0,
      "sepia": 32,
      "hueRotate": 2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 287,
    "name": "Royal Luxury",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 30,
      "saturate": 25,
      "sepia": 21,
      "hueRotate": -18,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 288,
    "name": "Elegant",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 19,
      "saturate": 22,
      "sepia": 10,
      "hueRotate": -7,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 289,
    "name": "Rich Contrast",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 4,
      "contrast": 20,
      "saturate": 28,
      "sepia": 11,
      "hueRotate": 4,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 290,
    "name": "Professional",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 3,
      "contrast": 21,
      "saturate": 25,
      "sepia": 12,
      "hueRotate": 15,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 291,
    "name": "Creator Pro",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 7,
      "contrast": 22,
      "saturate": 31,
      "sepia": 13,
      "hueRotate": -24,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 292,
    "name": "Instagram Style",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 6,
      "contrast": 23,
      "saturate": 28,
      "sepia": 14,
      "hueRotate": -13,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 293,
    "name": "Social Pop",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 10,
      "contrast": 24,
      "saturate": 34,
      "sepia": 15,
      "hueRotate": -2,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 294,
    "name": "Reel Cinematic",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 3,
      "contrast": 25,
      "saturate": 17,
      "sepia": 16,
      "hueRotate": 9,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 295,
    "name": "Viral Look",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 2,
      "contrast": 26,
      "saturate": 23,
      "sepia": 17,
      "hueRotate": 20,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 296,
    "name": "Trending Film",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)",
    "params": {
      "brightness": 3,
      "contrast": 15,
      "saturate": 6,
      "sepia": 37,
      "hueRotate": 0,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 297,
    "name": "Aesthetic",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 5,
      "contrast": 28,
      "saturate": 17,
      "sepia": 19,
      "hueRotate": -8,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 298,
    "name": "Clean Aesthetic",
    "category": "Aesthetic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 9,
      "contrast": 29,
      "saturate": 23,
      "sepia": 20,
      "hueRotate": 3,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 299,
    "name": "Cinematic Aesthetic",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 8,
      "contrast": 30,
      "saturate": 20,
      "sepia": 21,
      "hueRotate": 14,
      "grayscale": 0,
      "invert": 0
    }
  },
  {
    "id": 300,
    "name": "Ultimate Cinema",
    "category": "Cinematic",
    "gradient": "linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%)",
    "params": {
      "brightness": 1,
      "contrast": 19,
      "saturate": 26,
      "sepia": 10,
      "hueRotate": -25,
      "grayscale": 0,
      "invert": 0
    }
  }
];

// Fast lookup map by filter name
export const FILTERS_300_MAP = new Map<string, FilterPreset300>(
  FILTERS_300.map(f => [f.name, f])
);

/**
 * Computes hardware-accelerated CSS filter string for any of the 300 presets
 * Linearly scales with intensity (0% to 100%)
 */
export function getPresetCSSFilter(filterName: string, intensityPct: number = 85): string {
  if (!filterName || filterName === "none") return "";
  const filter = FILTERS_300_MAP.get(filterName);
  if (!filter) return "";

  const factor = Math.max(0, Math.min(1, intensityPct / 100));
  if (factor <= 0) return "";

  const p = filter.params;
  const parts: string[] = [];

  if (p.grayscale) {
    const val = Math.round(p.grayscale * factor);
    if (val > 0) parts.push(`grayscale(${val}%)`);
  }

  if (p.contrast) {
    const val = Math.round(100 + p.contrast * factor);
    if (val !== 100) parts.push(`contrast(${val}%)`);
  }

  if (p.brightness) {
    const val = Math.round(100 + p.brightness * factor);
    if (val !== 100) parts.push(`brightness(${val}%)`);
  }

  if (p.saturate) {
    const val = Math.round(100 + p.saturate * factor);
    if (val !== 100) parts.push(`saturate(${val}%)`);
  }

  if (p.sepia) {
    const val = Math.round(p.sepia * factor);
    if (val > 0) parts.push(`sepia(${val}%)`);
  }

  if (p.hueRotate) {
    const val = Math.round(p.hueRotate * factor);
    if (val !== 0) parts.push(`hue-rotate(${val}deg)`);
  }

  if (p.invert) {
    const val = Math.round(p.invert * factor);
    if (val > 0) parts.push(`invert(${val}%)`);
  }

  return parts.join(" ");
}
