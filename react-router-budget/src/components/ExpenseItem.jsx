import { Link, useFetcher } from "react-router-dom"

// helpers
import { formatCurrency, getAllMatchingItems } from "../helpers"

// library
import { TrashIcon } from "@heroicons/react/24/solid"

export const ExpenseItem = ({ expense }) => {
    const fetcher = useFetcher()
    const budget = getAllMatchingItems({
        category: "budgets",
        key: "id",
        value: expense.budgetId
    })[0] // in this case, we only need the first element of the array, since the array will have x reps of the same category

    return (
        <>
            <td>{expense.name}</td>
            <td>{formatCurrency(expense.amount)}</td>
            <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
            <td><Link 
                    to={`/budget/${budget.id}`}
                    style={{"--accent": budget.color}}>{budget.name}
            </Link></td>
            <td>
                <fetcher.Form method="post">
                    <input type="hidden" name="_action" value="deleteExpense" />
                    <button type="submit" className="btn btn--warning" 
                        name="expenseId" value={expense.id} 
                        aria-label={`Delete ${expense.name} expense`}>
                        <TrashIcon width={20} />
                    </button>
                </fetcher.Form>
            </td>
        </>
    )
}

export default ExpenseItem