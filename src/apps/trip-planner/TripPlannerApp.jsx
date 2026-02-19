import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map, Calendar, Clock, MapPin, Download, Save, Plus, Trash2, Edit2, Eye, X,
    Plane, Train, Bus, Car, Ship, Navigation, Hotel, DollarSign, FileText, User
} from 'lucide-react';
import { TRANSPORT_MODES, ACCOMMODATION_TYPES } from './config';
import { generateTravelPlanPDF } from './pdfGenerator';
import { savePlans, loadPlans, saveCurrentPlan, loadCurrentPlan, deletePlan, createNewPlan, updatePlan } from './storage';

const TripPlannerApp = () => {
    const [savedPlans, setSavedPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showSavedPlans, setShowSavedPlans] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editingType, setEditingType] = useState(null);

    // Plan form state
    const [planForm, setPlanForm] = useState({
        name: '',
        startDate: '',
        endDate: '',
        travelers: 1,
        budget: '',
        description: ''
    });

    // Load saved plans on mount
    useEffect(() => {
        const plans = loadPlans();
        setSavedPlans(plans);
        const current = loadCurrentPlan();
        if (current) {
            setCurrentPlan(current);
        }
    }, []);

    // Save current plan to localStorage whenever it changes
    useEffect(() => {
        if (currentPlan) {
            saveCurrentPlan(currentPlan);
        }
    }, [currentPlan]);

    const handleCreatePlan = () => {
        if (!planForm.name || !planForm.startDate || !planForm.endDate) {
            alert('Please fill in plan name and dates');
            return;
        }

        const newPlan = {
            ...planForm,
            places: currentPlan?.places || [],
            transports: currentPlan?.transports || [],
            accommodations: currentPlan?.accommodations || []
        };

        setCurrentPlan(newPlan);
        setShowPlanModal(false);
        setPlanForm({ name: '', startDate: '', endDate: '', travelers: 1, budget: '', description: '' });
    };

    const handleSavePlan = () => {
        if (!currentPlan) {
            alert('Please create a plan first');
            return;
        }

        if (currentPlan.id) {
            const updated = updatePlan(currentPlan.id, currentPlan);
            const plans = loadPlans();
            setSavedPlans(plans);
        } else {
            const saved = createNewPlan(currentPlan);
            setCurrentPlan(saved);
            const plans = loadPlans();
            setSavedPlans(plans);
        }

        alert('Plan saved successfully!');
    };

    const handleLoadPlan = (plan) => {
        setCurrentPlan(plan);
        setShowSavedPlans(false);
    };

    const handleDeletePlan = (planId) => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            const updated = deletePlan(planId);
            setSavedPlans(updated);
            if (currentPlan?.id === planId) {
                setCurrentPlan(null);
            }
        }
    };

    const handleAddPlace = () => {
        if (!currentPlan) {
            alert('Please create a trip plan first');
            return;
        }

        const newPlace = {
            id: Date.now().toString(),
            name: '',
            location: '',
            arrivalDate: '',
            arrivalTime: '',
            departureDate: '',
            departureTime: '',
            activities: '',
            notes: '',
            bookingReference: '',
            cost: 0
        };

        setCurrentPlan({
            ...currentPlan,
            places: [...(currentPlan.places || []), newPlace]
        });
        setEditingItem(currentPlan.places?.length || 0);
        setEditingType('places');
    };

    const handleAddTransport = () => {
        if (!currentPlan) {
            alert('Please create a trip plan first');
            return;
        }

        const newTransport = {
            id: Date.now().toString(),
            mode: 'flight',
            from: '',
            to: '',
            departureDate: '',
            departureTime: '',
            arrivalDate: '',
            arrivalTime: '',
            carrier: '',
            bookingReference: '',
            cost: 0,
            notes: ''
        };

        setCurrentPlan({
            ...currentPlan,
            transports: [...(currentPlan.transports || []), newTransport]
        });
        setEditingItem(currentPlan.transports?.length || 0);
        setEditingType('transports');
    };

    const handleAddAccommodation = () => {
        if (!currentPlan) {
            alert('Please create a trip plan first');
            return;
        }

        const newAccommodation = {
            id: Date.now().toString(),
            type: 'hotel',
            name: '',
            location: '',
            checkInDate: '',
            checkInTime: '14:00',
            checkOutDate: '',
            checkOutTime: '11:00',
            cost: 0,
            bookingReference: '',
            address: '',
            phone: '',
            notes: ''
        };

        setCurrentPlan({
            ...currentPlan,
            accommodations: [...(currentPlan.accommodations || []), newAccommodation]
        });
        setEditingItem(currentPlan.accommodations?.length || 0);
        setEditingType('accommodations');
    };

    const handleRemoveItem = (type, index) => {
        if (!currentPlan) return;

        const items = [...currentPlan[type]];
        items.splice(index, 1);
        setCurrentPlan({
            ...currentPlan,
            [type]: items
        });
    };

    const handleUpdateItem = (type, index, updates) => {
        if (!currentPlan) return;

        const items = [...currentPlan[type]];
        items[index] = { ...items[index], ...updates };
        setCurrentPlan({
            ...currentPlan,
            [type]: items
        });
        setEditingItem(null);
        setEditingType(null);
    };

    const handleDownloadPDF = () => {
        if (!currentPlan) {
            alert('Please create a plan first');
            return;
        }
        generateTravelPlanPDF(currentPlan);
    };

    const handleNewPlan = () => {
        setCurrentPlan(null);
        saveCurrentPlan(null);
        setPlanForm({ name: '', startDate: '', endDate: '', travelers: 1, budget: '', description: '' });
        setShowPlanModal(true);
    };

    const getTotalCost = () => {
        if (!currentPlan) return 0;
        const placesCost = (currentPlan.places || []).reduce((sum, p) => sum + (parseFloat(p.cost) || 0), 0);
        const transportCost = (currentPlan.transports || []).reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
        const accomCost = (currentPlan.accommodations || []).reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);
        return placesCost + transportCost + accomCost;
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column' }}>
            {/* Hero Section */}
            <section style={{
                padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem) 2rem', // Fluid padding
                background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <Map size={32} className="text-gradient" /> {/* Reduced icon size */}
                                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: '800', margin: 0 }}>
                                        <span className="text-gradient">Trip Planner</span>
                                    </h1>
                                </div>
                                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                                    Create detailed trip plans with places, transportation & accommodations
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={handleNewPlan}
                                    className="btn btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Plus size={20} />
                                    New Trip
                                </button>
                                <button
                                    onClick={() => setShowSavedPlans(true)}
                                    className="btn-ghost"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Eye size={20} />
                                    My Trips ({savedPlans.length})
                                </button>
                                {currentPlan && (
                                    <>
                                        <button
                                            onClick={handleSavePlan}
                                            className="btn-ghost"
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <Save size={20} />
                                            Save
                                        </button>
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="btn btn-primary"
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <Download size={20} />
                                            Download PDF
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Current Plan Info */}
                        {currentPlan && (
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                            {currentPlan.name}
                                        </h2>
                                        {currentPlan.description && (
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                                {currentPlan.description}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={16} />
                                                {currentPlan.startDate} to {currentPlan.endDate}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <User size={16} />
                                                {currentPlan.travelers} traveler{currentPlan.travelers !== 1 ? 's' : ''}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <MapPin size={16} />
                                                {currentPlan.places?.length || 0} place{currentPlan.places?.length !== 1 ? 's' : ''}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <DollarSign size={16} />
                                                Budget: ₹{currentPlan.budget || 'Not set'} | Spent: ₹{getTotalCost()}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setPlanForm(currentPlan);
                                            setShowPlanModal(true);
                                        }}
                                        className="btn-ghost"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section style={{ padding: 'clamp(1rem, 4vw, 2rem)', flex: 1 }}>
                <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {!currentPlan ? (
                        <EmptyState onCreatePlan={handleNewPlan} />
                    ) : (
                        <ItineraryPanel
                            plan={currentPlan}
                            onRemoveItem={handleRemoveItem}
                            onEdit={(type, index) => {
                                setEditingItem(index);
                                setEditingType(type);
                            }}
                            editingItem={editingItem}
                            editingType={editingType}
                            onUpdate={handleUpdateItem}
                            onAddPlace={handleAddPlace}
                            onAddTransport={handleAddTransport}
                            onAddAccommodation={handleAddAccommodation}
                            totalCost={getTotalCost()}
                        />
                    )}
                </div>
            </section>

            {/* Plan Creation/Edit Modal */}
            <AnimatePresence>
                {showPlanModal && (
                    <Modal onClose={() => setShowPlanModal(false)} title={currentPlan?.id ? "Edit Trip Details" : "Create New Trip"}>
                        <PlanForm
                            form={planForm}
                            onChange={setPlanForm}
                            onSubmit={handleCreatePlan}
                            isEdit={!!currentPlan?.id}
                        />
                    </Modal>
                )}
            </AnimatePresence>

            {/* Saved Plans Modal */}
            <AnimatePresence>
                {showSavedPlans && (
                    <Modal onClose={() => setShowSavedPlans(false)} title="My Trips">
                        <SavedPlansList
                            plans={savedPlans}
                            onLoad={handleLoadPlan}
                            onDelete={handleDeletePlan}
                        />
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

// Empty State Component
const EmptyState = ({ onCreatePlan }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem', // Reduced padding
            textAlign: 'center'
        }}>
            <Map size={64} style={{ color: 'var(--text-muted)', opacity: 0.3, marginBottom: '1.5rem' }} />
            <h2 style={{
                fontSize: 'clamp(1.5rem, 6vw, 2rem)', // Fluid typography
                fontWeight: '700',
                marginBottom: '1rem',
                lineHeight: 1.2
            }}>
                No Trip Plan Yet
            </h2>
            <p style={{
                fontSize: 'clamp(0.95rem, 4vw, 1.1rem)',
                color: 'var(--text-muted)',
                marginBottom: '2rem',
                maxWidth: '400px' // Reduced max-width
            }}>
                Start planning your next adventure! Create a trip plan to add places, transportation, and accommodations.
            </p>
            <button
                onClick={onCreatePlan}
                className="btn btn-primary"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    width: '100%',
                    maxWidth: '300px', // Prevent full width on large screens
                    whiteSpace: 'nowrap'
                }}
            >
                <Plus size={20} />
                Create Your First Trip
            </button>
        </div>
    );
};

// Plan Form Component
const PlanForm = ({ form, onChange, onSubmit, isEdit }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Trip Name *
                </label>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => onChange({ ...form, name: e.target.value })}
                    placeholder="e.g., Summer Europe Adventure"
                    style={inputStyle}
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) => onChange({ ...form, description: e.target.value })}
                    placeholder="Brief description of your trip..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Start Date *
                    </label>
                    <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => onChange({ ...form, startDate: e.target.value })}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        End Date *
                    </label>
                    <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => onChange({ ...form, endDate: e.target.value })}
                        style={inputStyle}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Number of Travelers
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={form.travelers}
                        onChange={(e) => onChange({ ...form, travelers: parseInt(e.target.value) || 1 })}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Budget (₹)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={form.budget}
                        onChange={(e) => onChange({ ...form, budget: e.target.value })}
                        placeholder="Optional"
                        style={inputStyle}
                    />
                </div>
            </div>

            <button
                onClick={onSubmit}
                className="btn btn-primary"
                style={{ width: '100%' }}
            >
                {isEdit ? 'Update Trip' : 'Create Trip'}
            </button>
        </div>
    );
};

// Saved Plans List Component
const SavedPlansList = ({ plans, onLoad, onDelete }) => {
    if (plans.length === 0) {
        return (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No saved trips yet. Create your first trip!
            </p>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
            {plans.map(plan => (
                <div
                    key={plan.id}
                    className="glass-panel"
                    style={{ padding: '1.5rem', cursor: 'pointer' }}
                    onClick={() => onLoad(plan)}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                {plan.name}
                            </h3>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                <div>{plan.startDate} to {plan.endDate}</div>
                                <div>{plan.places?.length || 0} places • {plan.travelers} traveler{plan.travelers !== 1 ? 's' : ''}</div>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(plan.id);
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-danger, #ff4d4f)',
                                cursor: 'pointer',
                                padding: '0.5rem'
                            }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Itinerary Panel Component with tabs
const ItineraryPanel = ({ plan, onRemoveItem, onEdit, editingItem, editingType, onUpdate, onAddPlace, onAddTransport, onAddAccommodation, totalCost }) => {
    const [activeTab, setActiveTab] = useState('places');

    return (
        <div>
            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                borderBottom: '2px solid var(--border-light)',
                flexWrap: 'nowrap', // Prevent wrapping to keep in one line
                overflowX: 'auto', // Enable scrolling
                paddingBottom: '0.5rem', // Space for scrollbar
                WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
            }}>
                {[
                    { id: 'places', label: 'Places to Visit', icon: MapPin },
                    { id: 'transports', label: 'Transportation', icon: Plane },
                    { id: 'accommodations', label: 'Accommodations', icon: Hotel }
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '1rem 1.5rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '3px solid var(--color-primary)' : '3px solid transparent',
                                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
                                fontWeight: activeTab === tab.id ? '700' : '500',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s ease',
                                marginBottom: '-2px',
                                whiteSpace: 'nowrap', // Prevent text wrap in tabs
                                flexShrink: 0 // Prevent shrinking
                            }}
                        >
                            <Icon size={20} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div>
                {activeTab === 'places' && (
                    <PlacesTab
                        places={plan.places || []}
                        onRemove={(index) => onRemoveItem('places', index)}
                        onEdit={(index) => onEdit('places', index)}
                        editingItem={editingType === 'places' ? editingItem : null}
                        onUpdate={(index, updates) => onUpdate('places', index, updates)}
                        onAdd={onAddPlace}
                    />
                )}

                {activeTab === 'transports' && (
                    <TransportTab
                        transports={plan.transports || []}
                        onRemove={(index) => onRemoveItem('transports', index)}
                        onEdit={(index) => onEdit('transports', index)}
                        editingItem={editingType === 'transports' ? editingItem : null}
                        onUpdate={(index, updates) => onUpdate('transports', index, updates)}
                        onAdd={onAddTransport}
                    />
                )}

                {activeTab === 'accommodations' && (
                    <AccommodationTab
                        accommodations={plan.accommodations || []}
                        onRemove={(index) => onRemoveItem('accommodations', index)}
                        onEdit={(index) => onEdit('accommodations', index)}
                        editingItem={editingType === 'accommodations' ? editingItem : null}
                        onUpdate={(index, updates) => onUpdate('accommodations', index, updates)}
                        onAdd={onAddAccommodation}
                    />
                )}
            </div>

            {/* Total Cost Summary */}
            <div className="glass-panel" style={{
                marginTop: '2rem',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)'
            }}>
                <span>Total Trip Cost</span>
                <span style={{ color: 'var(--color-primary)' }}>₹{totalCost}</span>
            </div>
        </div>
    );
};

// Places Tab
const PlacesTab = ({ places, onRemove, onEdit, editingItem, onUpdate, onAdd }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={onAdd} className="btn btn-primary" style={{ width: '100%', maxWidth: '300px' }}>
                <Plus size={16} /> Add Place to Visit
            </button>

            {places.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    <MapPin size={60} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.1rem' }}>No places added yet.</p>
                    <p style={{ fontSize: '0.95rem' }}>Add places you want to visit during your trip!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {places.map((place, index) => (
                            <PlaceItem
                                key={place.id}
                                place={place}
                                index={index}
                                isEditing={editingItem === index}
                                onEdit={() => onEdit(index)}
                                onRemove={() => onRemove(index)}
                                onUpdate={(updates) => onUpdate(index, updates)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

// Transport Tab - reuse from previous implementation
const TransportTab = ({ transports, onRemove, onEdit, editingItem, onUpdate, onAdd }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={onAdd} className="btn btn-primary" style={{ width: '100%', maxWidth: '300px' }}>
                <Plus size={16} /> Add Transportation
            </button>

            {transports.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    <Plane size={60} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.1rem' }}>No transportation added yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {transports.map((transport, index) => (
                            <TransportItem
                                key={transport.id}
                                transport={transport}
                                index={index}
                                isEditing={editingItem === index}
                                onEdit={() => onEdit(index)}
                                onRemove={() => onRemove(index)}
                                onUpdate={(updates) => onUpdate(index, updates)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

// Accommodation Tab - reuse from previous implementation
const AccommodationTab = ({ accommodations, onRemove, onEdit, editingItem, onUpdate, onAdd }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={onAdd} className="btn btn-primary" style={{ width: '100%', maxWidth: '300px' }}>
                <Plus size={16} /> Add Accommodation
            </button>

            {accommodations.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                    <Hotel size={60} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p style={{ fontSize: '1.1rem' }}>No accommodations added yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {accommodations.map((accommodation, index) => (
                            <AccommodationItem
                                key={accommodation.id}
                                accommodation={accommodation}
                                index={index}
                                isEditing={editingItem === index}
                                onEdit={() => onEdit(index)}
                                onRemove={() => onRemove(index)}
                                onUpdate={(updates) => onUpdate(index, updates)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

// Place Item Component
const PlaceItem = ({ place, index, isEditing, onEdit, onRemove, onUpdate }) => {
    const [form, setForm] = useState(place);

    useEffect(() => {
        if (isEditing) setForm(place);
    }, [isEditing, place]);

    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel"
                style={{ padding: '1.5rem', background: 'var(--bg-main)' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Place Name *"
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        value={form.location || ''}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="Location/City *"
                        style={inputStyle}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input
                            type="date"
                            value={form.arrivalDate || ''}
                            onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
                            placeholder="Arrival Date"
                            style={inputStyle}
                        />
                        <input
                            type="time"
                            value={form.arrivalTime || ''}
                            onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="date"
                            value={form.departureDate || ''}
                            onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                            placeholder="Departure Date"
                            style={inputStyle}
                        />
                        <input
                            type="time"
                            value={form.departureTime || ''}
                            onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <textarea
                        value={form.activities || ''}
                        onChange={(e) => setForm({ ...form, activities: e.target.value })}
                        placeholder="Activities (e.g., Museum visit, Hiking, etc.)"
                        rows={2}
                        style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                    />
                    <input
                        type="text"
                        value={form.bookingReference || ''}
                        onChange={(e) => setForm({ ...form, bookingReference: e.target.value })}
                        placeholder="Booking Reference (Optional)"
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        value={form.cost || ''}
                        onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                        placeholder="Cost (₹)"
                        style={inputStyle}
                    />
                    <textarea
                        value={form.notes || ''}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Notes..."
                        rows={2}
                        style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                    />
                    <button
                        onClick={() => onUpdate(form)}
                        className="btn btn-primary"
                        style={{ padding: '0.75rem' }}
                    >
                        Save Place
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel"
            style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '700', fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                        {place.name || 'Unnamed Place'}
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        📍 {place.location || 'No location'}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={onEdit} style={iconButtonStyle}>
                        <Edit2 size={16} />
                    </button>
                    <button onClick={onRemove} style={{ ...iconButtonStyle, color: 'var(--color-danger, #ff4d4f)' }}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div style={{ flex: 1 }}>
                {place.arrivalDate && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                        <div>📅 Arrival: {place.arrivalDate} {place.arrivalTime && `at ₹{place.arrivalTime}`}</div>
                        {place.departureDate && (
                            <div>📅 Departure: {place.departureDate} {place.departureTime && `at ₹{place.departureTime}`}</div>
                        )}
                    </div>
                )}

                {place.activities && (
                    <div style={{ fontSize: '0.85rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
                        <strong>Activities:</strong> {place.activities}
                    </div>
                )}

                {place.bookingReference && (
                    <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                        Ref: {place.bookingReference}
                    </div>
                )}

                {place.notes && (
                    <div style={{ fontSize: '0.85rem', marginTop: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                        {place.notes}
                    </div>
                )}
            </div>

            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                ₹{place.cost || 0}
            </div>
        </motion.div>
    );
};

// Transport and Accommodation Items - simplified versions from previous code
const TransportItem = ({ transport, index, isEditing, onEdit, onRemove, onUpdate }) => {
    const [form, setForm] = useState(transport);

    useEffect(() => {
        if (isEditing) setForm(transport);
    }, [isEditing, transport]);

    const getTransportIcon = (mode) => {
        const icons = {
            flight: '✈️',
            train: '🚆',
            bus: '🚌',
            car: '🚗',
            ferry: '🚢',
            walk: '🚶'
        };
        return icons[mode] || '🚗';
    };

    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel"
                style={{ padding: '1.5rem', background: 'var(--bg-main)' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <select
                        value={form.mode}
                        onChange={(e) => setForm({ ...form, mode: e.target.value })}
                        style={inputStyle}
                    >
                        {TRANSPORT_MODES.map(mode => (
                            <option key={mode.value} value={mode.value}>{mode.label}</option>
                        ))}
                    </select>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input
                            type="text"
                            value={form.from || ''}
                            onChange={(e) => setForm({ ...form, from: e.target.value })}
                            placeholder="From *"
                            style={inputStyle}
                        />
                        <input
                            type="text"
                            value={form.to || ''}
                            onChange={(e) => setForm({ ...form, to: e.target.value })}
                            placeholder="To *"
                            style={inputStyle}
                        />
                        <input
                            type="date"
                            value={form.departureDate || ''}
                            onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="time"
                            value={form.departureTime || ''}
                            onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="date"
                            value={form.arrivalDate || ''}
                            onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="time"
                            value={form.arrivalTime || ''}
                            onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <input
                        type="text"
                        value={form.carrier || ''}
                        onChange={(e) => setForm({ ...form, carrier: e.target.value })}
                        placeholder="Carrier/Company"
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        value={form.bookingReference || ''}
                        onChange={(e) => setForm({ ...form, bookingReference: e.target.value })}
                        placeholder="Booking Reference"
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        value={form.cost || ''}
                        onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                        placeholder="Cost (₹)"
                        style={inputStyle}
                    />
                    <textarea
                        value={form.notes || ''}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Notes..."
                        rows={2}
                        style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                    />
                    <button
                        onClick={() => onUpdate(form)}
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel"
            style={{ padding: '1.5rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>{getTransportIcon(transport.mode)}</span>
                        {transport.from} → {transport.to}
                    </div>
                    {transport.carrier && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{transport.carrier}</div>
                    )}
                    {transport.departureDate && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginTop: '0.75rem' }}>
                            <div>🛫 Depart: {transport.departureDate} {transport.departureTime && `at ₹{transport.departureTime}`}</div>
                            {transport.arrivalDate && (
                                <div>🛬 Arrive: {transport.arrivalDate} {transport.arrivalTime && `at ₹{transport.arrivalTime}`}</div>
                            )}
                        </div>
                    )}
                    {transport.bookingReference && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                            Ref: {transport.bookingReference}
                        </div>
                    )}
                    {transport.notes && (
                        <div style={{ fontSize: '0.85rem', marginTop: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                            {transport.notes}
                        </div>
                    )}
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)', marginTop: '1rem' }}>
                        ₹{transport.cost || 0}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={onEdit} style={iconButtonStyle}>
                        <Edit2 size={16} />
                    </button>
                    <button onClick={onRemove} style={{ ...iconButtonStyle, color: 'var(--color-danger, #ff4d4f)' }}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const AccommodationItem = ({ accommodation, index, isEditing, onEdit, onRemove, onUpdate }) => {
    const [form, setForm] = useState(accommodation);

    useEffect(() => {
        if (isEditing) setForm(accommodation);
    }, [isEditing, accommodation]);

    if (isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel"
                style={{ padding: '1.5rem', background: 'var(--bg-main)' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        style={inputStyle}
                    >
                        {ACCOMMODATION_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Hotel/Property Name *"
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        value={form.location || ''}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="Location/City *"
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        value={form.address || ''}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Address"
                        style={inputStyle}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input
                            type="date"
                            value={form.checkInDate || ''}
                            onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="time"
                            value={form.checkInTime || ''}
                            onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="date"
                            value={form.checkOutDate || ''}
                            onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
                            style={inputStyle}
                        />
                        <input
                            type="time"
                            value={form.checkOutTime || ''}
                            onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                            style={inputStyle}
                        />
                    </div>
                    <input
                        type="tel"
                        value={form.phone || ''}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Phone Number"
                        style={inputStyle}
                    />
                    <input
                        type="text"
                        value={form.bookingReference || ''}
                        onChange={(e) => setForm({ ...form, bookingReference: e.target.value })}
                        placeholder="Booking Reference"
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        value={form.cost || ''}
                        onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                        placeholder="Cost (₹)"
                        style={inputStyle}
                    />
                    <textarea
                        value={form.notes || ''}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Notes..."
                        rows={2}
                        style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                    />
                    <button
                        onClick={() => onUpdate(form)}
                        className="btn btn-primary"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-panel"
            style={{ padding: '1.5rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                        {accommodation.name || 'Unnamed Accommodation'}
                    </h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {ACCOMMODATION_TYPES.find(t => t.value === accommodation.type)?.label || accommodation.type} • {accommodation.location}
                    </div>
                    {accommodation.address && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            📍 {accommodation.address}
                        </div>
                    )}
                    {accommodation.checkInDate && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginTop: '0.75rem' }}>
                            <div>✅ Check-in: {accommodation.checkInDate} at {accommodation.checkInTime || '14:00'}</div>
                            {accommodation.checkOutDate && (
                                <div>🚪 Check-out: {accommodation.checkOutDate} at {accommodation.checkOutTime || '11:00'}</div>
                            )}
                        </div>
                    )}
                    {accommodation.phone && (
                        <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                            📞 {accommodation.phone}
                        </div>
                    )}
                    {accommodation.bookingReference && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                            Ref: {accommodation.bookingReference}
                        </div>
                    )}
                    {accommodation.notes && (
                        <div style={{ fontSize: '0.85rem', marginTop: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                            {accommodation.notes}
                        </div>
                    )}
                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-primary)', marginTop: '1rem' }}>
                        ₹{accommodation.cost || 0}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={onEdit} style={iconButtonStyle}>
                        <Edit2 size={16} />
                    </button>
                    <button onClick={onRemove} style={{ ...iconButtonStyle, color: 'var(--color-danger, #ff4d4f)' }}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Modal Component
const Modal = ({ children, onClose, title }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 'clamp(1rem, 5vw, 2rem)' // Fluid padding
            }}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '700px',
                    maxHeight: '85vh',
                    overflow: 'auto',
                    padding: 'clamp(1rem, 5vw, 2rem)' // Fluid padding
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            color: 'var(--text-main)'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>
                {children}
            </motion.div>
        </motion.div>
    );
};

// Styles
const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    background: 'var(--bg-main)',
    border: '1px solid var(--border-light)',
    color: 'var(--text-main)',
    fontSize: '1rem'
};

const iconButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    padding: '4px'
};

export default TripPlannerApp;

