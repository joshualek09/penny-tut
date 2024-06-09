import { redirect } from "react-router-dom"
import { deleteItem } from "../helpers"
import { toast } from "react-toastify"

export async function logoutAction() {
    // clear local storage
    deleteItem({ key: "userName" }) // does this mean that all the user data will be deleted?
    deleteItem({ key: "budgets" }) // does this mean that all the user data will be deleted?
    deleteItem({ key: "expenses" }) // does this mean that all the user data will be deleted?
    
    toast.success("You have successfully logged out")

    // return redirect
    return redirect("/")
}