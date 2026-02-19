import { splitExpensesConfig } from '../../../config/splitExpensesConfig';

const { storageKeys } = splitExpensesConfig;

export const getStoredUsers = () => {
    try {
        const data = localStorage.getItem(storageKeys.users);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error loading users", e);
        return [];
    }
};

export const saveUsers = (users) => {
    localStorage.setItem(storageKeys.users, JSON.stringify(users));
};

export const getStoredExpenses = () => {
    try {
        const data = localStorage.getItem(storageKeys.expenses);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error loading expenses", e);
        return [];
    }
};

export const saveExpenses = (expenses) => {
    localStorage.setItem(storageKeys.expenses, JSON.stringify(expenses));
};
