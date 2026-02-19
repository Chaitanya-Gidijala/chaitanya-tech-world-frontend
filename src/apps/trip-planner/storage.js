// LocalStorage keys
const PLANS_KEY = 'travel-planner-plans';
const CURRENT_PLAN_KEY = 'travel-planner-current';

export const savePlans = (plans) => {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
};

export const loadPlans = () => {
    const saved = localStorage.getItem(PLANS_KEY);
    return saved ? JSON.parse(saved) : [];
};

export const saveCurrentPlan = (plan) => {
    localStorage.setItem(CURRENT_PLAN_KEY, JSON.stringify(plan));
};

export const loadCurrentPlan = () => {
    const saved = localStorage.getItem(CURRENT_PLAN_KEY);
    return saved ? JSON.parse(saved) : null;
};

export const deletePlan = (planId) => {
    const plans = loadPlans();
    const updated = plans.filter(p => p.id !== planId);
    savePlans(updated);
    return updated;
};

export const createNewPlan = (planData) => {
    const plans = loadPlans();
    const newPlan = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...planData
    };
    plans.push(newPlan);
    savePlans(plans);
    return newPlan;
};

export const updatePlan = (planId, updates) => {
    const plans = loadPlans();
    const index = plans.findIndex(p => p.id === planId);
    if (index !== -1) {
        plans[index] = { ...plans[index], ...updates, updatedAt: new Date().toISOString() };
        savePlans(plans);
        return plans[index];
    }
    return null;
};
