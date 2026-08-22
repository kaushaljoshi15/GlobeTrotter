import { NextRequest } from 'next/server';
import { ExpenseService } from '@/lib/services/expense.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = parseInt(id);
    if (isNaN(tripId)) return apiError('Invalid trip ID', 400);

    const financials = await ExpenseService.getTripFinancials(tripId);
    if (!financials) {
      return apiError('Trip not found or no financial data', 404);
    }

    return apiSuccess(financials, 'Financial metrics calculated successfully');
  } catch (err: any) {
    console.error('Error fetching trip financials:', err);
    return apiError('Failed to fetch financial metrics', 500, err);
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
    const { tripStopId, category, title, amount, expenseDate, paymentMethod } = body;

    if (!category || !title || amount === undefined || !expenseDate) {
      return apiError('Category, title, amount, and expense date are required', 400);
    }

    const newExpense = await ExpenseService.addExpense({
      tripId,
      tripStopId: tripStopId ? parseInt(tripStopId) : undefined,
      category,
      title,
      amount: parseFloat(amount),
      expenseDate,
      paymentMethod,
    });

    return apiSuccess(newExpense, 'Expense recorded successfully', 201);
  } catch (err: any) {
    console.error('Error adding expense:', err);
    return apiError('Failed to record expense', 500, err);
  }
}
