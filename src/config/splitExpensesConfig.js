export const splitExpensesConfig = {
    appTitle: "Split Expenses",
    currency: "₹",
    categories: [
        { id: "food", label: "Food" },
        { id: "travel", label: "Travel" },
        { id: "accommodation", label: "Accommodation" },
        { id: "entertainment", label: "Entertainment" },
        { id: "groceries", label: "Groceries" },
        { id: "utilities", label: "Utilities" },
        { id: "other", label: "Other" }
    ],
    storageKeys: {
        expenses: 'split_app_expenses',
        users: 'split_app_users'
    },
    texts: {
        noExpenses: "No expenses added yet. Start by adding one!",
        noUsers: "Please add at least 2 people to start splitting expenses."
    }
};
