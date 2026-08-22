import { NextRequest } from 'next/server';
import { ExpenseService } from '@/lib/services/expense.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import { createExpenseSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return apiError('Invalid trip ID', 400);

    const financials = await ExpenseService.getTripFinancials(tripId);
    if (!financials) return apiError('Trip not found', 404);

    return apiSuccess(financials, 'Financial metrics retrieved');
  } catch (err: any) {
    console.error('Error fetching expenses:', err);
    return apiError('Failed to fetch expenses', 500, err);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return apiError('Invalid trip ID', 400);

    const body = await request.json();
    const validation = createExpenseSchema.safeParse({ ...body, tripId });
    if (!validation.success) {
      return apiError(validation.error.issues[0].message, 400, validation.error.format());
    }

    const { category, title, amount, expenseDate, paymentMethod, tripStopId } = validation.data;

    const newExpense = await ExpenseService.addExpense({
      tripId,
      tripStopId,
      category,
      title,
      amount,
      expenseDate,
      paymentMethod,
    });

    return apiSuccess(newExpense, 'Expense logged successfully', 201);
  } catch (err: any) {
    console.error('Error logging expense:', err);
    return apiError('Failed to log expense', 500, err);
  }
}
