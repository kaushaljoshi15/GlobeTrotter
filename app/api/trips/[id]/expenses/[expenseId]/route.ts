import { NextRequest } from 'next/server';
import { ExpenseService } from '@/lib/services/expense.service';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; expenseId: string }> }
) {
  try {
    const { id, expenseId } = await params;
    const tripId = parseInt(id);
    const expId = parseInt(expenseId);

    if (isNaN(tripId) || isNaN(expId)) {
      return apiError('Invalid trip ID or expense ID', 400);
    }

    const success = await ExpenseService.deleteExpense(expId, tripId);
    if (!success) {
      return apiError('Expense not found or could not be removed', 404);
    }

    return apiSuccess({ deletedExpenseId: expId }, 'Expense deleted successfully');
  } catch (err: any) {
    console.error('Error deleting expense:', err);
    return apiError('Failed to delete expense', 500, err);
  }
}
