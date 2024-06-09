const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0
  return `${existingBudgetLength * 34} 65% 50%`
}

// local storage functions are found in helpers.js

// arrow function that fecthes data given 'key' in localStorage and returns it
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// get all items that match a certain key in ExpenseItem.jsx
export const getAllMatchingItems = ({ category, key, value }) => {
  const items = fetchData(category) ?? []
  return items.filter((item) => item[key] === value)
}

// create budget in Dashboard.jsx
export const createBudget = ({
  name, amount 
}) => {
    const newItem = {
      id: crypto.randomUUID(),
      name: name, 
      createdAt: Date.now(),
      amount: +amount,
      color: generateRandomColor(),
    }
    const existingBudgets = fetchData("budgets") ?? []
    return localStorage.setItem("budgets", JSON.stringify([...existingBudgets, newItem]))
}

// create expense in Dashboard.jsx
export const createExpense = ({
  name, amount, budgetId 
}) => {
    const newItem = {
      id: crypto.randomUUID(),
      name: name, 
      createdAt: Date.now(),
      amount: +amount,
      budgetId: budgetId,
    }
    const existingExpenses = fetchData("expenses") ?? []
    return localStorage.setItem("expenses", JSON.stringify([...existingExpenses, newItem]))
}

// delete item from local storage
export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key) ?? []

  if (id) { // in this case we filter in, so we keep the items that do not have the id
    const newData = existingData.filter((item) => item.id !== id)
    return localStorage.setItem(key, JSON.stringify(newData))
  }
  return localStorage.removeItem(key);
}

// total spent by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? []
  const budgetSpent = expenses.reduce((acc, expense) =>{
    if (expense.budgetId === budgetId) {
      return acc + expense.amount
    }
    return acc
  }, 0)
  return budgetSpent
  // this should do the same thing as above
  // return expenses
  //   .filter((exp) => exp.budgetId === budgetId)
  //   .reduce((acc, curr) => acc + curr.amount, 0)
}

// FORMATTING

// Format Percentage
export const formatPercentage = (amount) => {
  return amount.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  })
}

// Format currency
export const formatCurrency = (amount) => {
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "SGD",
  })
}