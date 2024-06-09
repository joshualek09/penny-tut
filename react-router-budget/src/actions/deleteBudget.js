import { redirect } from "react-router-dom";

// library
import { toast } from "react-toastify";

// helpers
import { deleteItem, getAllMatchingItems } from "../helpers";

export function deleteBudget({ params }) {
    try {
        deleteItem({ key: "budgets", id: params.id }); // "id" follows the parent /:id in App.jsx
        
        // when we delete the budget we need to delete all the expenses associated with it
        const associatedExpeneses = getAllMatchingItems ({
            category: "expenses",
            key: "budgetId",
            value: params.id
        })

        associatedExpeneses.forEach((expense) => {
            deleteItem({ key: "expenses", id: expense.id })
        })
        toast.success("Budget deleted successfully.")
        
    } catch (e) {
        throw new Error("There was a problem deleting your budget.")
    }

    return redirect("/");
}