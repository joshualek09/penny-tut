import { useLoaderData } from "react-router-dom"

// library
import { toast } from "react-toastify"

// components
import AddExpenseForm from "../components/AddExpenseForm"
import BudgetItem from "../components/BudgetItem"
import Table from "../components/Table"

// helpers
import { createExpense, deleteItem, getAllMatchingItems } from "../helpers"

// loader function to tell react router dom how to load the data (in this case Dashboard)
export async function budgetLoader({params}) {
    const budget = await getAllMatchingItems({
        category: "budgets",
        key: "id",
        value: params.id // "id" must follow what you used in App.jsx after /: 
    
    })[0]

    const expenses = await getAllMatchingItems({
        category: "expenses",
        key: "budgetId",
        value: params.id // "id" must follow what you used in App.jsx after /: 
    
    })

    if (!budget) {
        throw new Error("Budget not found")
    }

    return { budget, expenses }
}

//action
export async function budgetAction({request}) {
    const data = await request.formData()
    const { _action, ...values } = Object.fromEntries(data)

    if (_action === "createExpense") {
        try {
            // create expense
            createExpense({
                name: values.newExpense,
                amount: values.newExpenseAmount,
                budgetId: values.newExpenseBudget,
            })
            return toast.success(`Expense ${values.newExpense} created successfully`)
        } catch (e) {
            throw new Error("There was a problem creating your expense.")
        }
    }

    if (_action === "deleteExpense") {
        try {
            // delete expense
            deleteItem({
                key: "expenses",
                id: values.expenseId,
            })
            return toast.success("Expense deleted")
        } catch (e) {
            throw new Error("There was a problem deleting your expense.")
        }
    }
}

const BudgetPage = () => {
    const { budget, expenses } = useLoaderData()

    return (
        <div className="grid-lg" style={{"--accent": budget.color}}>
            <h1 className="h2">
                <span className="accent">{budget.name}</span> Overview
            </h1>
            <div className="flex-lg">
                <BudgetItem budget={budget} showDelete={true} />
                <AddExpenseForm budgets={[budget]} />
            </div>
            {
                expenses && expenses.length > 0 ? (
                    <div className="grid-md">
                        <h2>
                            <span className="accent">{budget.name}</span> Expenses
                        </h2>
                        <Table expenses={expenses} />
                    </div>
                ) : <p>No expenses found</p>
            }
        </div>
    )
}

export default BudgetPage