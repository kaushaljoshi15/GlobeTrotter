import { z } from 'zod';

// ================= AUTH SCHEMAS =================
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[@$!%*?&]/, 'Password must contain at least one special character'),
  role: z.enum(['traveler', 'organizer', 'admin']).default('traveler'),
  adminPasscode: z.string().optional(),
});

// ================= TRIP SCHEMAS =================
export const createTripSchema = z.object({
  userId: z.number().optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date format',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date format',
  }),
  totalBudget: z.coerce.number().min(0, 'Budget cannot be negative').default(2000),
  currency: z.string().default('USD'),
  isPublic: z.boolean().default(true),
  status: z.enum(['planning', 'active', 'completed']).default('planning'),
});

export const updateTripSchema = createTripSchema.partial();

// ================= TRIP STOP SCHEMAS =================
export const addStopSchema = z.object({
  cityId: z.coerce.number().int().positive('City ID is required'),
  arrivalDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid arrival date',
  }),
  departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid departure date',
  }),
  stayCostEstimated: z.coerce.number().min(0).optional().default(0),
  transportCostEstimated: z.coerce.number().min(0).optional().default(0),
  notes: z.string().optional(),
});

export const reorderStopsSchema = z.object({
  stopOrders: z.array(
    z.object({
      stopId: z.number().int().positive(),
      order: z.number().int().positive(),
    })
  ),
});

// ================= ACTIVITY SCHEMAS =================
export const addActivitySchema = z.object({
  tripStopId: z.coerce.number().int().positive(),
  activityId: z.coerce.number().int().positive().optional(),
  customTitle: z.string().optional(),
  category: z.string().default('sightseeing'),
  activityDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid activity date',
  }),
  startTime: z.string().default('10:00'),
  endTime: z.string().default('12:00'),
  cost: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
});

// ================= EXPENSE SCHEMAS =================
export const createExpenseSchema = z.object({
  tripId: z.coerce.number().int().positive(),
  tripStopId: z.coerce.number().int().positive().optional(),
  category: z.enum(['stay', 'transport', 'activities', 'meals', 'misc']).default('misc'),
  title: z.string().min(2, 'Expense title is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  expenseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid expense date',
  }),
  paymentMethod: z.string().default('Card'),
});

// ================= DESTINATION SCHEMAS =================
export const createDestinationSchema = z.object({
  name: z.string().min(2, 'City name is required'),
  country: z.string().min(2, 'Country is required'),
  continent: z.string().min(2, 'Continent is required'),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  costIndex: z.enum(['budget', 'moderate', 'luxury']).default('moderate'),
  avgDailyCost: z.coerce.number().positive().default(120),
  currency: z.string().default('USD'),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  bestTimeToVisit: z.string().optional(),
});
