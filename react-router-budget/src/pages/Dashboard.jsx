import { Link, useLoaderData } from "react-router-dom"

// library
import { toast } from "react-toastify"

// components
import Intro from "../components/Intro"
import AddBudgetForm from "../components/AddBudgetForm"
import AddExpenseForm from "../components/AddExpenseForm"
import BudgetItem from "../components/BudgetItem"
import Table from "../components/Table"

// helper functions
import { createBudget, createExpense, deleteItem, fetchData } from "../helpers"

// loader function to tell react router dom how to load the data (in this case Dashboard)
export async function dashboardLoader() {
    const userName = fetchData("userName"); // where "userName" is the key
    const budgets = fetchData("budgets")
    const expenses = fetchData("expenses")
    return { userName, budgets, expenses }
}

// action of dashboard
export async function dashboardAction({request}) { // forms come with a request, in this case, the form in Intro.jsx
    const data = await request.formData() // gets the data from the form
    const { _action, ...values } = Object.fromEntries(data) // removes the _action key from the data

    // new user submission
    if (_action === "newUser") {
        try {
            localStorage.setItem("userName", JSON.stringify(values.userName)) // saves the data in local storage
            return toast.success(`Welcome, ${values.userName}`) // returns a toast message
        } catch (e) {
            throw new Error("There was a problem creating your account.")
        }
    }

    if (_action === "createBudget") {
        try {
            // create budget
            createBudget({
                name: values.newBudget,
                amount: values.newBudgetAmount,
            })
            return toast.success(`Budget created successfully`)
        } catch (e) {
            throw new Error("There was a problem creating your budget.")
        }
    }

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

// Dashboard content
const Dashboard = () => {
    //useLoaderData is a Hook that will allow us to access whatever is in the dashboardLoader()
    const { userName, budgets, expenses } = useLoaderData()

    return (
        <>
            { userName ? (
                <div className="dashboard">
                    <h1>Welcome, <span className="accent">{ userName }</span></h1>
                    <div className="grid-sm">
                        {
                            budgets && budgets.length > 0 ? (// pass down budgets to AddExpenseForm so we know how many budgets to display
                                <div className="grid-lg">
                                    <div>
                                        <AddBudgetForm />
                                        <AddExpenseForm budgets={budgets} /> 
                                    </div>
                                    <h2>Existing Budgets</h2>
                                    <div className="budgets">
                                        {
                                            budgets.map((budget) => (
                                            <BudgetItem key={budget.id} budget={budget} />
                                            ))
                                        }
                                    </div>
                                    {
                                        expenses && expenses.length > 0 && (
                                            <div className="grid-md">
                                                <h2>Recent Expenses</h2>
                                                <Table expenses={
                                                    expenses
                                                        .sort((a, b) => b.createdAt - a.createdAt)
                                                        .slice(0,8)} //shows the most recent  8
                                                />
                                                {expenses.length > 8 && (
                                                    <Link to="expenses" className="btn btn--dark">
                                                        View all expenses
                                                    </Link>
                                                )}
                                            </div>
                                        )
                                    }
                                </div>
                            )
                            : (
                                <div className="grid-sm">
                                    <p>Personal budgeting is the secret to financial freedom.</p>
                                    <p>Create a budget to get started</p>
                                    <AddBudgetForm />
                                </div>
                            )
                        }
                    </div>
                </div>
                ) : <Intro />}
        </>
    )
}
export default Dashboard
