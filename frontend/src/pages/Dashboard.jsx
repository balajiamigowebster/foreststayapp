import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as Icons from 'lucide-react';
import { 
  Calendar, User, Shield, MapPin, DollarSign, PlusCircle, 
  Trash2, Users, CheckCircle, Ban, Bell, ShieldCheck, 
  Utensils, Compass, Layers, Coffee, Ticket, Flame, 
  ChevronRight, AlertTriangle, Sparkles, UserCheck, RefreshCw, BarChart2, Settings, Trees, X
} from 'lucide-react';

const Dashboard = () => {
  const { token, user, logout, API_BASE, viewMode } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active operations stats
  const [stats, setStats] = useState({
    todayIncome: 0,
    breakdown: { stay: 0, cafe: 0, passes: 0, treks: 0 },
    occupancy: { percentage: 0, occupiedUnits: 0, totalUnits: 30, guests: 0 },
    arrivals: 0,
    departures: 0,
    stockStatus: 'All Stock OK',
    alerts: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Active Modals state
  const [activeModal, setActiveModal] = useState(null); // 'stays', 'cafe', 'passes', 'treks', 'staff', 'inventory', 'profit', 'settings', 'alerts'

  // Module dynamic data
  const [myBookings, setMyBookings] = useState([]);
  const [myTreks, setMyTreks] = useState([]);
  const [allStays, setAllStays] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [treksCatalog, setTreksCatalog] = useState([]);

  // Backoffice Control Deck & Forest AI States
  const [deckSubTab, setDeckSubTab] = useState('forest_ai'); // 'forest_ai' | 'guests' | 'ledger' | 'updates' | 'share' | 'settings'
  const [aiResponseText, setAiResponseText] = useState('');
  const [searchGuestQuery, setSearchGuestQuery] = useState('');
  
  // Staff Roster & Payroll System States
  const [searchStaffQuery, setSearchStaffQuery] = useState('');
  const [filterStaffType, setFilterStaffType] = useState('All');
  const [filterStaffAttendance, setFilterStaffAttendance] = useState('All');
  const [staffTabMode, setStaffTabMode] = useState('roster'); // 'roster' | 'calendar'

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffFormId, setStaffFormId] = useState(null);
  const [staffFormName, setStaffFormName] = useState('');
  const [staffFormRole, setStaffFormRole] = useState('');
  const [staffFormType, setStaffFormType] = useState('Permanent');
  const [staffFormPhone, setStaffFormPhone] = useState('');
  const [staffFormEmail, setStaffFormEmail] = useState('');
  const [staffFormRating, setStaffFormRating] = useState('Good');
  const [staffFormAssignedTasks, setStaffFormAssignedTasks] = useState('');
  const [staffFormMonthlyBase, setStaffFormMonthlyBase] = useState('20000');
  const [staffFormDailyRate, setStaffFormDailyRate] = useState('0');
  const [staffFormShift, setStaffFormShift] = useState('Morning Shift');
  const [staffFormStatus, setStaffFormStatus] = useState('Active');

  const [payrollSlipModalOpen, setPayrollSlipModalOpen] = useState(false);
  const [selectedPayrollStaff, setSelectedPayrollStaff] = useState(null);
  const [payrollBonus, setPayrollBonus] = useState('0');
  const [payrollDeductions, setPayrollDeductions] = useState('0');

  // Trekking View Filters & Form States
  const [searchTrekQuery, setSearchTrekQuery] = useState('');
  const [selectedTrekDifficulty, setSelectedTrekDifficulty] = useState('All');
  
  const [trekModalOpen, setTrekModalOpen] = useState(false);
  const [trekFormId, setTrekFormId] = useState(null);
  const [trekFormTitle, setTrekFormTitle] = useState('');
  const [trekFormCategory, setTrekFormCategory] = useState('Sunrise Trek');
  const [trekFormPrice, setTrekFormPrice] = useState('');
  const [trekFormDuration, setTrekFormDuration] = useState('');
  const [trekFormDifficulty, setTrekFormDifficulty] = useState('Easy');
  const [trekFormMaxGroup, setTrekFormMaxGroup] = useState('15');
  const [trekFormDescription, setTrekFormDescription] = useState('');
  const [trekFormGuideIncluded, setTrekFormGuideIncluded] = useState(true);
  const [trekFormGuideName, setTrekFormGuideName] = useState('Arun Kumar');
  const [trekFormStatus, setTrekFormStatus] = useState('Active');

  // Form State: Cafe POS
  const [cafeCart, setCafeCart] = useState([]); // { id, name, price, qty }

  // Form State: Visitor Passes
  const [passName, setPassName] = useState('');
  const [passType, setPassType] = useState('adult');
  const [passQty, setPassQty] = useState(1);
  const passPrices = { adult: 150, child: 75, foreigner: 500 };

  // Form State: Trek Booking
  const [selectedTrek, setSelectedTrek] = useState('1');
  const [trekDate, setTrekDate] = useState('');
  const [trekGuests, setTrekGuests] = useState(1);

  // Form State: Add Cabin (Stays Module)
  const [cabinForm, setCabinForm] = useState({
    name: '',
    description: '',
    price_per_night: '',
    max_guests: '2',
    location: '',
    image_url: '',
    amenities: []
  });

  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Expanded Cafe POS page states
  const [currentView, setCurrentView] = useState('hub'); // 'hub', 'cafe'
  const [cafeCategory, setCafeCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceType, setServiceType] = useState('dine-in');
  const [tableNo, setTableNo] = useState('');
  const [discount, setDiscount] = useState(0);
 
  const initialMenuItems = [
    { id: 1, name: 'Fluffy Pancakes with Maple Syrup', price: 180, category: 'breakfast', stock: 25 },
    { id: 2, name: 'Scrambled Eggs with Toast', price: 150, category: 'breakfast', stock: 20 },
    { id: 3, name: 'Campsite Masala Omelette', price: 120, category: 'breakfast', stock: 30 },
    { id: 4, name: 'Fresh Fruits Bowl', price: 140, category: 'breakfast', stock: 15 },
    { id: 5, name: 'Woodfired Pizza', price: 450, category: 'lunch', stock: 10 },
    { id: 6, name: 'Forest Salad', price: 280, category: 'lunch', stock: 18 },
    { id: 7, name: 'Paneer Butter Masala', price: 320, category: 'lunch', stock: 12 },
    { id: 8, name: 'Jeera Rice & Dal', price: 220, category: 'lunch', stock: 20 },
    { id: 9, name: 'Campfire Smoked Chicken', price: 550, category: 'dinner', stock: 8 },
    { id: 10, name: 'Creamy Pasta Alfred', price: 380, category: 'dinner', stock: 15 },
    { id: 11, name: 'Mushroom Cottage Stew', price: 340, category: 'dinner', stock: 14 },
    { id: 12, name: 'Garlic Naan & Kadhai Veg', price: 290, category: 'dinner', stock: 25 },
    { id: 13, name: 'BBQ Paneer Tikka', price: 350, category: 'bbq', stock: 12 },
    { id: 14, name: 'Grilled Corn on Cob', price: 120, category: 'bbq', stock: 30 },
    { id: 15, name: 'BBQ Chicken Wings', price: 480, category: 'bbq', stock: 10 },
    { id: 16, name: 'Campsite Cardamom Tea', price: 80, category: 'beverages', stock: 50 },
    { id: 17, name: 'Filter Coffee', price: 120, category: 'beverages', stock: 40 },
    { id: 18, name: 'Berry Smoothie', price: 180, category: 'beverages', stock: 25 },
    { id: 19, name: 'Fresh Lime Soda', price: 90, category: 'beverages', stock: 35 }
  ];

  const [cafeMenu, setCafeMenu] = useState(initialMenuItems);

  // Modal to add new item state
  const [addCafeItemOpen, setAddCafeItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('snacks');
  const [newItemStock, setNewItemStock] = useState('25');
  const [newItemStatus, setNewItemStatus] = useState(true);

  const handleSaveCafeItem = (e) => {
    e.preventDefault();
    console.log('handleSaveCafeItem triggered. Saving new item:', { newItemName, newItemPrice, newItemCategory, newItemStock });
    if (!newItemName || !newItemPrice) return;
    
    const newItem = {
      id: Date.now(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      category: newItemCategory.toLowerCase(),
      stock: parseInt(newItemStock) || 0
    };

    setCafeMenu([...cafeMenu, newItem]);
    setAddCafeItemOpen(false);

    // Reset form
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCategory('snacks');
    setNewItemStock('25');
    setNewItemStatus(true);
  };

  const filteredMenuItems = cafeMenu.filter(item => {
    const matchesCategory = cafeCategory === 'all' || item.category === cafeCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getCategoryCount = (cat) => {
    if (cat === 'all') return cafeMenu.length;
    return cafeMenu.filter(item => item.category === cat).length;
  };

  const decreaseCartQty = (id) => {
    const existing = cafeCart.find(c => c.id === id);
    if (existing.qty > 1) {
      setCafeCart(cafeCart.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c));
    } else {
      removeFromCart(id);
    }
  };

  // Dynamic stay calendar view states
  const [staysTab, setStaysTab] = useState('calendar'); // 'calendar', 'list', 'rooms'
  const [searchStayQuery, setSearchStayQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [calendarMonth, setCalendarMonth] = useState(6); // July (0-indexed 6)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMode, setCalendarMode] = useState('month'); // 'month', '7day'

  // Log Stay form states
  const [logStayOpen, setLogStayOpen] = useState(false);
  const [stayGuestName, setStayGuestName] = useState('');
  const [stayGuestPhone, setStayGuestPhone] = useState('');
  const [stayGuestEmail, setStayGuestEmail] = useState('');
  const [stayGuestCity, setStayGuestCity] = useState('');
  const [stayCabinId, setStayCabinId] = useState('1'); // 1=Standard Tent, 2=Premium Cottage, 3=Fabricated Dome
  const [stayUnitsQty, setStayUnitsQty] = useState(1);
  const [stayCoupon, setStayCoupon] = useState('none');
  const [stayCheckIn, setStayCheckIn] = useState('2026-07-20');
  const [stayCheckOut, setStayCheckOut] = useState('2026-07-22');
  const [stayAdults, setStayAdults] = useState(2);
  const [stayChildren, setStayChildren] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [advancePaid, setAdvancePaid] = useState(0);
  const [stayNotes, setStayNotes] = useState('');

  const addonsCatalog = [
    { id: 'sunrise_trek', label: 'Sunrise Trek to Peak (+₹400)', price: 400 },
    { id: 'sunset_trek', label: 'Sunset Nature Trail Trek (+₹300)', price: 300 },
    { id: 'forest_walk', label: 'Guided Forest Walk (+₹200)', price: 200 },
    { id: 'campfire', label: 'Private Campfire Setup (+₹600)', price: 600 },
    { id: 'bbq', label: 'Premium BBQ Experience (+₹800)', price: 800 },
    { id: 'zipline', label: 'Zipline & Adventure Games (+₹500)', price: 500 },
    { id: 'sightseeing', label: 'Sightseeing Pass (+₹250)', price: 250 },
    { id: 'breakfast', label: 'Campers Buffet Breakfast (+₹250)', price: 250 },
    { id: 'dinner', label: 'Buffet Campfire Dinner (+₹450)', price: 450 }
  ];

  const localBookingsSeed = [
    { id: 101, user_name: 'Ananya Sharma', cabin_name: 'Premium Cottage', cabin_type: 'premium', check_in: '2026-07-15', check_out: '2026-07-18', status: 'confirmed' },
    { id: 102, user_name: 'Kabir Malhotra', cabin_name: 'Fabricated Dome', cabin_type: 'fabricated', check_in: '2026-07-18', check_out: '2026-07-21', status: 'checked-in' },
    { id: 103, user_name: 'Riya Sen', cabin_name: 'Standard Tent', cabin_type: 'tent', check_in: '2026-07-18', check_out: '2026-07-19', status: 'checked-in' },
    { id: 104, user_name: 'Priyanka Patel', cabin_name: 'Standard Tent', cabin_type: 'tent', check_in: '2026-07-19', check_out: '2026-07-22', status: 'checked-in' },
    { id: 105, user_name: 'Siddharth Rao', cabin_name: 'Fabricated Dome', cabin_type: 'fabricated', check_in: '2026-07-24', check_out: '2026-07-26', status: 'confirmed' }
  ];

  const [localBookings, setLocalBookings] = useState(localBookingsSeed);

  const toggleAddon = (id) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const getCabinPrice = (id) => {
    if (id === '1') return 1500;
    if (id === '2') return 4500;
    if (id === '3') return 3000;
    return 1500;
  };

  const getCabinName = (id) => {
    if (id === '1') return 'Standard Tent';
    if (id === '2') return 'Premium Cottage';
    if (id === '3') return 'Fabricated Dome';
    return 'Standard Tent';
  };

  const handleSaveStay = (e) => {
    e.preventDefault();
    if (!stayGuestName || !stayGuestPhone) return;

    const nights = Math.max(1, Math.round((new Date(stayCheckOut) - new Date(stayCheckIn)) / (1000 * 60 * 60 * 24)));
    const baseAccommodation = getCabinPrice(stayCabinId) * stayUnitsQty * nights;
    const addonsTotal = selectedAddons.reduce((sum, id) => sum + (addonsCatalog.find(a => a.id === id)?.price || 0), 0);
    const totalAmountBill = (baseAccommodation + addonsTotal) * 1.18;

    const newBooking = {
      id: Date.now(),
      user_name: stayGuestName,
      cabin_name: getCabinName(stayCabinId),
      cabin_type: stayCabinId === '2' ? 'premium' : stayCabinId === '3' ? 'fabricated' : 'tent',
      check_in: stayCheckIn,
      check_out: stayCheckOut,
      status: paymentStatus === 'paid' ? 'checked-in' : 'confirmed',
      total_price: totalAmountBill
    };

    setLocalBookings([...localBookings, newBooking]);
    setLogStayOpen(false);

    // Reset fields
    setStayGuestName('');
    setStayGuestPhone('');
    setStayGuestEmail('');
    setStayGuestCity('');
    setStayCabinId('1');
    setStayUnitsQty(1);
    setStayCoupon('none');
    setStayCheckIn('2026-07-20');
    setStayCheckOut('2026-07-22');
    setStayAdults(2);
    setStayChildren(0);
    setSelectedAddons([]);
    setPaymentMethod('upi');
    setPaymentStatus('pending');
    setAdvancePaid(0);
    setStayNotes('');
  };

  // Visitors / Entry Passes states
  const [searchPassQuery, setSearchPassQuery] = useState('');
  const [filterPassCategory, setFilterPassCategory] = useState('all');
  
  // Issue pass modal states
  const [issuePassOpen, setIssuePassOpen] = useState(false);
  const [passGuestName, setPassGuestName] = useState('');
  const [passGuestPhone, setPassGuestPhone] = useState('');
  const [passAdults, setPassAdults] = useState(1);
  const [passChildren, setPassChildren] = useState(0);
  const [passCategory, setPassCategory] = useState('Adult Day Pass');
  const [passCoupon, setPassCoupon] = useState('None');

  const localPassesSeed = [
    { id: 'FSV-1001', guest_name: 'Rakesh Juneja', phone: '9898989898', adults: 1, children: 0, amount: 375, coupon: 'None', status: 'Checked In', date: '2026-07-20' },
    { id: 'FSV-1002', guest_name: 'Aditi Sharma', phone: '9765432109', adults: 2, children: 1, amount: 900, coupon: 'None', status: 'Checked In', date: '2026-07-20' },
    { id: 'FSV-1003', guest_name: 'Meera Nair', phone: '9123456789', adults: 4, children: 4, amount: 2100, coupon: 'None', status: 'Checked In', date: '2026-07-20' }
  ];

  const [localPasses, setLocalPasses] = useState(localPassesSeed);

  const handleSavePass = (e) => {
    e.preventDefault();
    if (!passGuestName || !passGuestPhone) return;

    const passAmount = (passAdults * 375) + (passChildren * 150);
    const newPass = {
      id: `FSV-${1001 + localPasses.length}`,
      guest_name: passGuestName,
      phone: passGuestPhone,
      adults: passAdults,
      children: passChildren,
      amount: passAmount,
      coupon: passCoupon,
      status: 'Checked In',
      date: new Date().toISOString().split('T')[0]
    };

    setLocalPasses([...localPasses, newPass]);
    setIssuePassOpen(false);

    // Reset fields
    setPassGuestName('');
    setPassGuestPhone('');
    setPassAdults(1);
    setPassChildren(0);
    setPassCategory('Adult Day Pass');
    setPassCoupon('None');
  };

  const [searchInventoryQuery, setSearchInventoryQuery] = useState('');
  const [selectedInventoryCategory, setSelectedInventoryCategory] = useState('All');
  const [filterInventoryStatus, setFilterInventoryStatus] = useState('all');

  // Inventory form modal states
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [inventoryFormId, setInventoryFormId] = useState(null);
  const [inventoryFormName, setInventoryFormName] = useState('');
  const [inventoryFormCategory, setInventoryFormCategory] = useState('Food');
  const [inventoryFormStock, setInventoryFormStock] = useState('');
  const [inventoryFormMaxStock, setInventoryFormMaxStock] = useState('');
  const [inventoryFormUnit, setInventoryFormUnit] = useState('kg');
  const [inventoryFormMinThreshold, setInventoryFormMinThreshold] = useState('');

  const handleOpenAddInventory = () => {
    setInventoryFormId(null);
    setInventoryFormName('');
    setInventoryFormCategory('Food');
    setInventoryFormStock('');
    setInventoryFormMaxStock('');
    setInventoryFormUnit('kg');
    setInventoryFormMinThreshold('');
    setInventoryModalOpen(true);
  };

  const handleOpenEditInventory = (item) => {
    setInventoryFormId(item.id);
    setInventoryFormName(item.name);
    setInventoryFormCategory(item.category);
    setInventoryFormStock(item.stock);
    setInventoryFormMaxStock(item.maxStock);
    setInventoryFormUnit(item.unit);
    setInventoryFormMinThreshold(item.minThreshold);
    setInventoryModalOpen(true);
  };

  const handleDeleteInventory = async (id) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        const res = await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchModuleData();
        }
      } catch (err) {
        console.error('Error deleting inventory:', err);
      }
    }
  };

  const handleAdjustStock = async (item) => {
    const newQty = window.prompt(`Adjust stock quantity for ${item.name} (${item.unit}):`, item.stock);
    if (newQty === null) return;
    const stockVal = parseFloat(newQty);
    if (isNaN(stockVal) || stockVal < 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/inventory/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: item.name,
          category: item.category,
          stock: stockVal,
          maxStock: item.maxStock,
          unit: item.unit,
          minThreshold: item.minThreshold
        })
      });
      if (res.ok) {
        fetchModuleData();
      }
    } catch (err) {
      console.error('Error adjusting stock:', err);
    }
  };

  const handleSaveInventory = async (e) => {
    e.preventDefault();
    if (!inventoryFormName) return;

    const stockVal = parseFloat(inventoryFormStock) || 0;
    const minVal = parseFloat(inventoryFormMinThreshold) || 0;
    const maxVal = parseFloat(inventoryFormMaxStock) || 100;

    const payload = {
      name: inventoryFormName,
      category: inventoryFormCategory,
      stock: stockVal,
      maxStock: maxVal,
      unit: inventoryFormUnit,
      minThreshold: minVal
    };

    try {
      let res;
      if (inventoryFormId) {
        // Edit
        res = await fetch(`${API_BASE}/inventory/${inventoryFormId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Add
        res = await fetch(`${API_BASE}/inventory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        fetchModuleData();
        setInventoryModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving inventory item:', err);
    }
  };

  // Trekking CRUD Handlers
  const handleOpenAddTrek = () => {
    setTrekFormId(null);
    setTrekFormTitle('');
    setTrekFormCategory('Sunrise Trek');
    setTrekFormPrice('');
    setTrekFormDuration('');
    setTrekFormDifficulty('Easy');
    setTrekFormMaxGroup('15');
    setTrekFormDescription('');
    setTrekFormGuideIncluded(true);
    setTrekFormGuideName('Arun Kumar');
    setTrekFormStatus('Active');
    setTrekModalOpen(true);
  };

  const handleOpenEditTrek = (trek) => {
    setTrekFormId(trek.id);
    setTrekFormTitle(trek.title);
    setTrekFormCategory(trek.category || 'Forest Trail');
    setTrekFormPrice(trek.price);
    setTrekFormDuration(trek.duration);
    setTrekFormDifficulty(trek.difficulty || 'Easy');
    setTrekFormMaxGroup(trek.max_group || '15');
    setTrekFormDescription(trek.description || '');
    setTrekFormGuideIncluded(trek.guide_included === 1 || trek.guide_included === true);
    setTrekFormGuideName(trek.guide_name || 'Arun Kumar');
    setTrekFormStatus(trek.status || 'Active');
    setTrekModalOpen(true);
  };

  const handleDeleteTrek = async (id) => {
    if (window.confirm("Are you sure you want to delete this trekking package?")) {
      try {
        const res = await fetch(`${API_BASE}/treks/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchModuleData();
        }
      } catch (err) {
        console.error('Error deleting trek:', err);
      }
    }
  };

  const handleSaveTrek = async (e) => {
    e.preventDefault();
    if (!trekFormTitle) return;

    const payload = {
      title: trekFormTitle,
      category: trekFormCategory,
      price: parseFloat(trekFormPrice) || 0,
      duration: trekFormDuration || '2 Hours',
      difficulty: trekFormDifficulty,
      max_group: parseInt(trekFormMaxGroup) || 15,
      description: trekFormDescription,
      guide_included: trekFormGuideIncluded ? 1 : 0,
      guide_name: trekFormGuideName,
      status: trekFormStatus
    };

    try {
      let res;
      if (trekFormId) {
        // Update
        res = await fetch(`${API_BASE}/treks/${trekFormId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create
        res = await fetch(`${API_BASE}/treks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        fetchModuleData();
        setTrekModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving trekking package:', err);
    }
  };

  // Forest AI Assistant 1-Click Action Handler
  const handleTriggerAIAction = (actionType) => {
    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const stayInc = stats.breakdown?.stay || 0;
    const cafeInc = stats.breakdown?.cafe || 0;
    const passInc = stats.breakdown?.passes || 0;
    const trekInc = stats.breakdown?.treks || 0;
    const totalInflow = stayInc + cafeInc + passInc + trekInc;
    
    let text = '';
    
    if (actionType === 'operations') {
      text = `OPERATIONS DIGEST - ${todayStr}
===================================
Total Guests In-House: ${stats.occupancy?.guests || 8}
Occupied Units: ${stats.occupancy?.occupiedUnits || 4} / 30 units (${stats.occupancy?.percentage || 13}% Occupancy)
Active Arrivals Today: ${stats.arrivals || 1}
Active Departures Today: ${stats.departures || 1}
Roster Status: ${staffList.filter(s => s.today_attendance === 'Present').length} Staff Checked-In On Duty.

[ALERT] Hardwood BBQ Coal (i-04) inventory is down to 4 kg. Minimum required is 10 kg.
[OK] All other campsite assets and equipment indicators are functioning normally.`;
    } 
    else if (actionType === 'revenue') {
      text = `REVENUE INSIGHTS REPORT - ${todayStr}
=======================================
Consolidated Inflow Today: ₹${Math.round(totalInflow).toLocaleString()}
- Campground Stay Reservations: ₹${Math.round(stayInc).toLocaleString()} (${totalInflow > 0 ? Math.round((stayInc/totalInflow)*100) : 95}%)
- Woodland Cafe POS Sales: ₹${Math.round(cafeInc).toLocaleString()} (${totalInflow > 0 ? Math.round((cafeInc/totalInflow)*100) : 1}%)
- Day Visitor Entrance Passes: ₹${Math.round(passInc).toLocaleString()} (${totalInflow > 0 ? Math.round((passInc/totalInflow)*100) : 4}%)
- Trekking Expeditions: ₹${Math.round(trekInc).toLocaleString()}

Avg Ticket Value (Stay): ₹${Math.round(stayInc / Math.max(1, stats.occupancy?.occupiedUnits || 4)).toLocaleString()} / unit.
High Inflow Driver: Stay bookings continue to command 95% of campsite revenue contribution share.`;
    }
    else if (actionType === 'stock') {
      text = `INVENTORY STOCK & REORDER ALERT
===================================
[ALERT] Hardwood BBQ Coal (i-04) quantity: 4 kg (Min threshold: 10 kg). Recommended replenishment: 50 kg.
[OK] Premium Coffee Beans: 12 kg / 25 kg (Min threshold: 5 kg)
[OK] Organic Tea Leaves: 8 kg / 15 kg (Min threshold: 3 kg)
[OK] Campsite Basmati Rice: 25 kg / 50 kg (Min threshold: 10 kg)
[OK] LPG Camping Gas Cylinder: Healthy stock.

No other materials require critical reordering. Procurement orders drafted.`;
    }
    else if (actionType === 'guests') {
      text = `GUEST OCCUPANCY STATUS
======================
Currently Occupied Units: ${stats.occupancy?.occupiedUnits || 4}
Total In-House Guests: ${stats.occupancy?.guests || 8}

Active Cabin Stays List:
1. Kabir Malhotra (Delhi) - Cottage A [FSB-2026-001]
2. Priyanka Patel (Ahmedabad) - Cottage B [FSB-2026-002]
3. Riya Sen (Kolkata) - Tent [FSB-2026-005]
4. Siddharth Rao (Hyderabad) - Cottage C [FSB-2026-006]

Check-in details matching visitor logs are verified.`;
    }
    else if (actionType === 'profit') {
      text = `MONTHLY PROFIT COMPARISON (JUNE VS JULY)
===========================================
June 2026 (Audited Ledger):
- Total Inflows: ₹78,900
- Operational Outflows: ₹92,400
- Net Margin: -₹13,500 (-17%)

July 2026 (Live Forecast):
- Total Inflows: ₹85,637
- Operational Outflows: ₹1,02,900
- Net Margin: -₹17,263 (-20% profitability)

Monsoon forecast remains stable. Next auditScheduled for August 31.`;
    }
    else if (actionType === 'forecast') {
      text = `WEEKEND OCCUPANCY FORECAST
==========================
Date Range: August 21 - August 23, 2026
Projected Occupancy: 86% (26 / 30 Units Booked)
Yield Index: 1.18x (Peak season tariff markup applied)

Demand Drivers:
- High local holiday leisure trekking booking inquiries (+28%).
- Guided Deep Forest walk bookings are fully sold out.`;
    }
    else if (actionType === 'instagram') {
      text = `📸 CAMPSITE INSTAGRAM MARKETING WRITE
======================================
🌲 Escape the city rush and wake up to the pine trees! Forest Stay Campsite is calling. 🏕️✨

Whether you want to trek the Sunrise Peak, sip premium fresh coffee at Woodland Cafe, or roast campfire marshmallows, we've got you covered! 🔥🪵

👉 1-click booking link in bio!
#foreststay #pineforest #campsitegetaway #natureadventure #exploreindia #campinglife`;
    }
    else if (actionType === 'reminders') {
      text = `PENDING BALANCE PAYMENT REMINDERS
=====================================
1. Booking FSB-2026-004: Amit Verma (Ahmedabad) - Balance ₹2,800 is pending. Check-in is scheduled for today.
2. Booking FSB-2026-006: Siddharth Rao (Hyderabad) - Balance ₹0.00 (Fully Paid).

Total outstanding receivables: ₹2,800. Automated SMS alert dispatched.`;
    }

    setAiResponseText(text);
  };

  // CSV Exporter Helpers for BI Module
  const downloadCSV = (filename, headers, rows) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(",")].concat(rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`))).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadStayCSV = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings`);
      if (res.ok) {
        const data = await res.json();
        const headers = ['Booking ID', 'Guest Name', 'Email', 'Phone', 'Check In', 'Check Out', 'Cabin Category', 'Guests', 'Total Price', 'Status'];
        const rows = data.map(b => [
          b.id, b.guest_name, b.guest_email, b.guest_phone, b.check_in, b.check_out, b.cabin_category, b.guests_count, b.total_price, b.status
        ]);
        downloadCSV('stay_bookings.csv', headers, rows);
      }
    } catch (err) {
      console.error('Error downloading stays CSV:', err);
    }
  };

  const handleDownloadCafeCSV = async () => {
    try {
      const res = await fetch(`${API_BASE}/pos/orders`);
      if (res.ok) {
        const data = await res.json();
        const headers = ['Order ID', 'Table Number', 'Order Date', 'Subtotal', 'Tax', 'Discount', 'Total Amount', 'Status'];
        const rows = data.map(o => [
          o.id, o.table_number, o.created_at, o.subtotal, o.gst, o.discount, o.total_amount, o.status
        ]);
        downloadCSV('cafe_sales.csv', headers, rows);
      }
    } catch (err) {
      console.error('Error downloading cafe CSV:', err);
    }
  };

  const handleDownloadLedgerCSV = async () => {
    try {
      const headers = ['Date', 'Category', 'Transaction Type', 'Description', 'Amount (₹)'];
      const rows = [];
      
      // 1. Stays
      try {
        const bRes = await fetch(`${API_BASE}/bookings`);
        if (bRes.ok) {
          const bookings = await bRes.json();
          bookings.forEach(b => {
            rows.push([b.check_in, 'Campground Stay', 'Inflow', `Stay Booking #${b.id} - ${b.guest_name}`, b.total_price]);
          });
        }
      } catch(e){}

      // 2. Cafe
      try {
        const cRes = await fetch(`${API_BASE}/pos/orders`);
        if (cRes.ok) {
          const orders = await cRes.json();
          orders.forEach(o => {
            rows.push([o.created_at.split('T')[0], 'Woodland Cafe', 'Inflow', `Cafe Order #${o.id}`, o.total_amount]);
          });
        }
      } catch(e){}

      // 3. Passes
      try {
        const pRes = await fetch(`${API_BASE}/passes`);
        if (pRes.ok) {
          const passes = await pRes.json();
          passes.forEach(p => {
            rows.push([p.created_at ? p.created_at.split('T')[0] : '2026-08-15', 'Entrance Pass', 'Inflow', `Pass #${p.id} - ${p.name}`, p.price]);
          });
        }
      } catch(e){}

      // 4. Staff Outflow
      staffList.forEach(st => {
        const breakdown = getStaffPayableBreakdown(st);
        rows.push(['2026-08-15', 'Staff Wages', 'Outflow', `Salary Slip - ${st.name} (${st.role})`, breakdown.netPayable]);
      });

      downloadCSV('financial_ledger.csv', headers, rows);
    } catch (err) {
      console.error('Error downloading ledger CSV:', err);
    }
  };

  // Staff Event & CRUD Handlers
  const handleOpenAddStaff = (typeVal = 'Permanent') => {
    setStaffFormId(null);
    setStaffFormName('');
    setStaffFormRole('');
    setStaffFormType(typeVal);
    setStaffFormPhone('');
    setStaffFormEmail('');
    setStaffFormRating('Good');
    setStaffFormAssignedTasks('');
    setStaffFormMonthlyBase(typeVal === 'Permanent' ? '20000' : '0');
    setStaffFormDailyRate(typeVal === 'Permanent' ? '0' : '500');
    setStaffFormShift('Morning Shift');
    setStaffFormStatus('Active');
    setStaffModalOpen(true);
  };

  const handleOpenEditStaff = (st) => {
    setStaffFormId(st.id);
    setStaffFormName(st.name);
    setStaffFormRole(st.role);
    setStaffFormType(st.type || 'Permanent');
    setStaffFormPhone(st.phone || '');
    setStaffFormEmail(st.email || '');
    setStaffFormRating(st.rating || 'Good');
    setStaffFormAssignedTasks(st.assigned_tasks || '');
    setStaffFormMonthlyBase(st.monthly_base);
    setStaffFormDailyRate(st.daily_rate);
    setStaffFormShift(st.shift || 'Morning Shift');
    setStaffFormStatus(st.status || 'Active');
    setStaffModalOpen(true);
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        const res = await fetch(`${API_BASE}/staff/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchModuleData();
        }
      } catch (err) {
        console.error('Error deleting staff:', err);
      }
    }
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!staffFormName || !staffFormRole) return;

    const payload = {
      name: staffFormName,
      role: staffFormRole,
      type: staffFormType,
      phone: staffFormPhone,
      email: staffFormEmail,
      rating: staffFormRating,
      assigned_tasks: staffFormAssignedTasks,
      monthly_base: parseFloat(staffFormMonthlyBase) || 0,
      daily_rate: parseFloat(staffFormDailyRate) || 0,
      shift: staffFormShift,
      status: staffFormStatus
    };

    try {
      let res;
      if (staffFormId) {
        res = await fetch(`${API_BASE}/staff/${staffFormId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/staff`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        fetchModuleData();
        setStaffModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving staff:', err);
    }
  };

  const handleUpdateStaffAttendance = async (st, attendanceVal) => {
    try {
      const res = await fetch(`${API_BASE}/staff/${st.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...st,
          today_attendance: attendanceVal
        })
      });
      if (res.ok) {
        fetchModuleData();
      }
    } catch (err) {
      console.error('Error updating staff attendance:', err);
    }
  };

  const handleUpdateStaffDaysWorked = async (st, delta) => {
    const newDays = Math.max(0, (st.days_worked || 0) + delta);
    try {
      const res = await fetch(`${API_BASE}/staff/${st.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...st,
          days_worked: newDays
        })
      });
      if (res.ok) {
        fetchModuleData();
      }
    } catch (err) {
      console.error('Error updating staff days worked:', err);
    }
  };

  const handleUpdateStaffHalfDays = async (st, delta) => {
    const newHalfDays = Math.max(0, (st.half_days || 0) + delta);
    try {
      const res = await fetch(`${API_BASE}/staff/${st.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...st,
          half_days: newHalfDays
        })
      });
      if (res.ok) {
        fetchModuleData();
      }
    } catch (err) {
      console.error('Error updating staff half days:', err);
    }
  };

  const handleOpenSlipModal = (st) => {
    setSelectedPayrollStaff(st);
    setPayrollBonus(st.bonus || '0');
    setPayrollDeductions(st.deductions || '0');
    setPayrollSlipModalOpen(true);
  };

  const handleSaveSalarySlipExpense = async () => {
    if (!selectedPayrollStaff) return;
    
    const bonusVal = parseFloat(payrollBonus) || 0;
    const deductionsVal = parseFloat(payrollDeductions) || 0;
    
    try {
      const res = await fetch(`${API_BASE}/staff/${selectedPayrollStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...selectedPayrollStaff,
          bonus: bonusVal,
          deductions: deductionsVal
        })
      });
      if (res.ok) {
        alert(`Salary slip successfully logged for ${selectedPayrollStaff.name}!`);
        fetchModuleData();
        setPayrollSlipModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving salary slip:', err);
    }
  };

  const getStaffPayableBreakdown = (st) => {
    const isPermanent = st.type === 'Permanent';
    const dailyRate = isPermanent ? Math.round(st.monthly_base / 26) : (st.daily_rate || 500);
    const daysPay = dailyRate * (st.days_worked || 0);
    const halfPay = Math.round(dailyRate / 2) * (st.half_days || 0);
    const bonus = parseFloat(st.bonus) || 0;
    const deductions = parseFloat(st.deductions) || 0;
    const netPayable = daysPay + halfPay + bonus - deductions;
    
    return {
      dailyRate,
      daysPay,
      halfPay,
      bonus,
      deductions,
      netPayable
    };
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchStats();
    fetchMyBookings();
    fetchMyTrekBookings();
    fetchModuleData();
  }, [token, viewMode]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMyBookings(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyTrekBookings = async () => {
    try {
      // Mock trek bookings retrieval or basic query
      const res = await fetch(`${API_BASE}/auth/profile`, { // check user
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        // Just mock some bookings for display in Travel Ledger
        setMyTreks([
          { id: 1, title: 'Pine Canopy Guided Walk', date: '2026-08-15', participants: 2, total: 800, guide: 'Arun Kumar' }
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModuleData = async () => {
    try {
      // Get all cabins
      const cabRes = await fetch(`${API_BASE}/cabins`);
      if (cabRes.ok) {
        const cabData = await cabRes.json();
        setAllStays(cabData);
      }

      // Get all bookings (admin)
      const bookRes = await fetch(`${API_BASE}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookRes.ok) {
        const bookData = await bookRes.json();
        setAllBookings(bookData);
      }

      // Get inventory
      const invRes = await fetch(`${API_BASE}/inventory`);
      if (invRes.ok) {
        const invData = await invRes.json();
        const mappedData = invData.map(item => {
          const stockVal = parseFloat(item.quantity) || 0;
          const minVal = parseFloat(item.min_required) || 0;
          const maxVal = parseFloat(item.max_capacity) || (minVal * 2.5) || 50;
          
          let statusVal = 'Healthy';
          if (stockVal === 0) statusVal = 'Out of Stock';
          else if (stockVal <= minVal) statusVal = 'Low Stock';

          return {
            id: item.id,
            name: item.item_name,
            category: item.category || 'Food',
            stock: stockVal,
            maxStock: maxVal,
            unit: item.unit || 'units',
            minThreshold: minVal,
            status: statusVal
          };
        });
        setInventoryList(mappedData);
      }

      // Load static/mock guides and staff
      // Get staff from database
      const staffRes = await fetch(`${API_BASE}/staff`);
      if (staffRes.ok) {
        const staffData = await staffRes.json();
        setStaffList(staffData);
      }

      // Get treks from database
      const treksRes = await fetch(`${API_BASE}/treks`);
      if (treksRes.ok) {
        const treksData = await treksRes.json();
        setTreksCatalog(treksData);
      }

    } catch (err) {
      console.error('Error fetching module data:', err);
    }
  };

  // Actions
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchMyBookings();
        fetchStats();
        fetchModuleData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // POS CART ACTIONS
  const addToCart = (item) => {
    console.log('addToCart triggered with item:', item);
    const existing = cafeCart.find(c => c.id === item.id);
    if (existing) {
      setCafeCart(cafeCart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCafeCart([...cafeCart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCafeCart(cafeCart.filter(c => c.id !== id));
  };

  const getCartTotal = () => {
    return cafeCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  };

  const subtotal = getCartTotal();
  const gst = Math.max(0, (subtotal - discount) * 0.18);
  const totalAmount = Math.max(0, (subtotal - discount) * 1.18);

  const handleCheckoutPOS = async () => {
    const total = getCartTotal();
    if (total === 0) return;

    try {
      const res = await fetch(`${API_BASE}/pos/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cafeCart,
          total_amount: total
        })
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Bill generated! Total: ₹${total} added to POS logs.` });
        setCafeCart([]);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // PASS BOOKING ACTIONS
  const handleBuyPass = async (e) => {
    e.preventDefault();
    if (!passName) return;

    const totalPrice = passPrices[passType] * passQty;

    try {
      const res = await fetch(`${API_BASE}/passes/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_name: passName,
          pass_type: passType,
          quantity: passQty,
          price: totalPrice
        })
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: `Entry ticket emitted! Total cost: ₹${totalPrice}.` });
        setPassName('');
        setPassQty(1);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CUSTOMER: BOOK TREK ACTIONS
  const handleBookTrek = async (e) => {
    e.preventDefault();
    const trek = treksCatalog.find(t => t.id === parseInt(selectedTrek));
    const total = trek.price * trekGuests;

    // Simulate adding trekking slots and stats update (under trek bookings)
    setMyTreks(prev => [
      ...prev,
      { id: Date.now(), title: trek.title, date: trekDate, participants: trekGuests, total, guide: trek.guide }
    ]);
    setFeedbackMsg({ type: 'success', text: `Trek slots reserved successfully! Total cost: ₹${total}` });
    setTrekDate('');
  };

  // RESTOCK ACTION
  const handleRestockItem = async (itemId) => {
    try {
      const res = await fetch(`${API_BASE}/inventory/${itemId}/restock`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchModuleData();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ADD NEW CABIN ACTION (Admin/Stays)
  const handleAddCabin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/cabins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...cabinForm,
          price_per_night: parseFloat(cabinForm.price_per_night),
          max_guests: parseInt(cabinForm.max_guests),
          amenities: [1, 3, 6] // default seed links
        })
      });
      if (res.ok) {
        setFeedbackMsg({ type: 'success', text: 'New stay inventory created!' });
        setCabinForm({
          name: '',
          description: '',
          price_per_night: '',
          max_guests: '2',
          location: '',
          image_url: '',
          amenities: []
        });
        fetchModuleData();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutGuest = async (bookingId) => {
    if (!window.confirm('Check out this guest and release occupancy?')) return;
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchModuleData();
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate stays billing breakdown in real-time
  const checkInDate = new Date(stayCheckIn);
  const checkOutDate = new Date(stayCheckOut);
  const durationNights = Math.max(1, Math.round((new Date(stayCheckOut) - new Date(stayCheckIn)) / (1000 * 60 * 60 * 24))) || 1;
  const baseAccommodationPrice = getCabinPrice(stayCabinId) * stayUnitsQty * durationNights;
  const addonsTotal = selectedAddons.reduce((sum, id) => sum + (addonsCatalog.find(a => a.id === id)?.price || 0), 0);
  const gstSimulated = (baseAccommodationPrice + addonsTotal) * 0.18;
  const totalAmountPrice = (baseAccommodationPrice + addonsTotal) * 1.18;
  const outstandingDue = totalAmountPrice - (parseFloat(advancePaid) || 0);

  return (
    <div style={{ minHeight: '85vh' }}>
      <div className="fade-in container" style={{ paddingTop: '110px' }}>
      
      {/* -------------------- BACKOFFICE (STAFF) MODE -------------------- */}
      {viewMode === 'backoffice' && (
        currentView === 'hub' ? (
        <section>
          {/* Operations Desk Stats (Top Panel matching screenshot) */}
          <div className="operations-desk fade-in">
            {/* Cell 1: Operations Desk Logo */}
            <div className="ops-card" style={{ backgroundColor: 'var(--primary-deep)', color: 'white', flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '10px' }}>
                  <Trees size={20} style={{ color: 'var(--gold-accent)' }} />
                </div>
                <div>
                  <h3 style={{ color: 'white', fontFamily: '"Outfit", sans-serif', fontSize: '0.85rem', fontWeight: '700' }}>OPERATIONS DESK</h3>
                  <span style={{ fontSize: '0.68rem', color: '#a0c4b2' }}>{new Date().toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})} &bull; Live Campsite Radar</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '0.85rem', color: '#a0c4b2', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2ecc71', display: 'inline-block' }}></span> Radar Active
                </span>
                <button onClick={() => setActiveModal('profit')} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.72rem', backgroundColor: '#0b251a', border: 'none', color: '#fff' }}>Full View</button>
              </div>
            </div>

            {/* Cell 2: Today's Income */}
            <div className="ops-card">
              <div className="ops-title">
                <span>Today's Income</span>
                <DollarSign size={14} style={{ color: 'var(--gold-accent)' }} />
              </div>
              <div className="ops-value">₹{stats.todayIncome.toLocaleString()}</div>
              <div className="ops-subtitle" style={{ color: '#27ae60', fontWeight: '600' }}>
                Stays ₹{stats.breakdown.stay.toLocaleString()} - Cafe ₹{stats.breakdown.cafe.toLocaleString()}
              </div>
            </div>

            {/* Cell 3: Occupancy */}
            <div className="ops-card">
              <div className="ops-title">
                <span>Occupancy</span>
                <Layers size={14} style={{ color: 'var(--primary-medium)' }} />
              </div>
              <div className="ops-value">{stats.occupancy.percentage}%</div>
              <div className="ops-subtitle">
                {stats.occupancy.occupiedUnits}/{stats.occupancy.totalUnits} Units ({stats.occupancy.guests} Guests In-House)
              </div>
            </div>

            {/* Cell 4: Check-ins / Outs */}
            <div className="ops-card">
              <div className="ops-title">
                <span>Check-ins / Outs</span>
                <Users size={14} style={{ color: 'var(--primary-medium)' }} />
              </div>
              <div className="ops-value">{stats.arrivals} In / {stats.departures} Out</div>
              <div className="ops-subtitle" style={{ color: 'var(--primary-light)' }}>Active arrivals today</div>
            </div>

            {/* Cell 5: Stock Status */}
            <div className="ops-card">
              <div className="ops-title">
                <span>Stock Status</span>
                <AlertTriangle size={14} style={{ color: 'var(--gold-accent)' }} />
              </div>
              <div className="ops-value" style={{ color: stats.stockStatus === 'All Stock OK' ? 'var(--success)' : 'var(--error)' }}>
                {stats.stockStatus}
              </div>
              <div className="ops-subtitle">Inventory levels scanner</div>
            </div>
          </div>

          {/* Operational Updates Banner (Low Stock Coal Alerts matching screenshot) */}
          <div className="operational-updates-banner fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: 'var(--primary-medium)', padding: '6px', borderRadius: '50%', color: 'white' }}>
                <Bell size={18} />
              </div>
              <div>
                <h3 style={{ color: 'var(--primary-deep)', fontSize: '0.9rem', marginBottom: '2px' }}>Operational Updates ({stats.alerts.length})</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--light-text)' }}>
                  {stats.alerts.length > 0 ? stats.alerts[0] : 'All campsite operational systems are stable.'}
                </p>
              </div>
            </div>
            <button onClick={() => setActiveModal('alerts')} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '15px' }}>
              View Alerts
            </button>
          </div>

          {/* Backoffice Grid Modules (8 tiles) */}
          <div className="backoffice-grid container">
            
            {/* Tile 1: Stay Bookings */}
            <div className="module-card" onClick={() => setCurrentView('stays')}>
              <div className="module-icon-wrapper" style={{ backgroundColor: '#e2f0d9' }}>
                <Layers size={22} style={{ color: '#385723' }} />
              </div>
              <div className="module-info">
                <h3>Stay Bookings</h3>
                <p>Tents, Cottages & Reservations</p>
                <span className="module-badge" style={{ backgroundColor: '#e2f0d9', color: '#385723' }}>
                  {stats.arrivals} Check-ins &bull; {stats.occupancy.percentage}% Occupied
                </span>
              </div>
            </div>

            {/* Tile 2: Cafe POS */}
            <div className="module-card" onClick={() => setCurrentView('cafe')}>
              <div className="module-icon-wrapper" style={{ backgroundColor: '#fce4d6' }}>
                <Coffee size={22} style={{ color: '#c65911' }} />
              </div>
              <div className="module-info">
                <h3>Cafe POS</h3>
                <p>Food, Drinks & Counter Orders</p>
                <span className="module-badge" style={{ backgroundColor: '#fce4d6', color: '#c65911' }}>
                  ₹{stats.breakdown.cafe.toLocaleString()} Today &bull; Quick Billing
                </span>
              </div>
            </div>

            {/* Tile 3: Visitor Entry Passes */}
            <div className="module-card" onClick={() => setCurrentView('visitors')}>
              <div className="module-icon-wrapper" style={{ backgroundColor: '#f2eefb' }}>
                <Ticket size={22} style={{ color: '#7030a0' }} />
              </div>
              <div className="module-info">
                <h3>Visitor Entry Passes</h3>
                <p>Day Passes & Park Visitor Counter</p>
                <span className="module-badge" style={{ backgroundColor: '#f2eefb', color: '#7030a0' }}>
                  ₹{stats.breakdown.passes.toLocaleString()} Passes &bull; Gate Live
                </span>
              </div>
            </div>

            {/* Tile 4: Trekkings & Trails */}
            <div className="module-card" onClick={() => { setCurrentView('treks'); setFeedbackMsg(null); }}>
              <div className="module-icon-wrapper" style={{ backgroundColor: '#eef6f6' }}>
                <Compass size={22} style={{ color: '#008080' }} />
              </div>
              <div className="module-info">
                <h3>Trekkings & Trails</h3>
                <p>Guided Nature Treks & Expeditions</p>
                <span className="module-badge" style={{ backgroundColor: '#eef6f6', color: '#008080' }}>
                  Active Forest Guides & Treks
                </span>
              </div>
            </div>

            {/* Tile 5: Staff Roster */}
            <div className="module-card" onClick={() => { setCurrentView('staff'); setFeedbackMsg(null); }}>
              <div className="module-icon-wrapper" style={{ backgroundColor: '#e6f0fa' }}>
                <UserCheck size={22} style={{ color: '#1f4e79' }} />
              </div>
              <div className="module-info">
                <h3>Staff Roster</h3>
                <p>Staff Attendance & Duty Shifts</p>
                <span className="module-badge" style={{ backgroundColor: '#e6f0fa', color: '#1f4e79' }}>
                  {staffList.filter(s => s.status === 'active').length} Staff Members Active
                </span>
              </div>
            </div>

            {/* Tile 6: Inventory Stock */}
            <div className="module-card" onClick={() => setCurrentView('inventory')}>
              <div className="module-icon-wrapper" style={{ backgroundColor: '#fff2cc' }}>
                <Flame size={22} style={{ color: '#b2a100' }} />
              </div>
              <div className="module-info">
                <h3>Inventory Stock</h3>
                <p>Campsite Supplies & Materials</p>
                <span className="module-badge" style={{ 
                  backgroundColor: stats.alerts.length > 0 ? '#fce4d6' : '#e2f0d9', 
                  color: stats.alerts.length > 0 ? 'var(--error)' : 'var(--success)'
                }}>
                  {stats.alerts.length > 0 ? `${stats.alerts.length} Restocks Low` : 'Supply Levels OK'}
                </span>
              </div>
            </div>

            {/* Tile 7: Profitability Index */}
            <div className="module-card" onClick={() => { setCurrentView('finance'); setFeedbackMsg(null); }}>
              <div className="module-icon-wrapper" style={{ backgroundColor: '#e2f0d9' }}>
                <BarChart2 size={22} style={{ color: '#385723' }} />
              </div>
              <div className="module-info">
                <h3>Profitability Index</h3>
                <p>Campsite Financial Performance</p>
                <span className="module-badge" style={{ backgroundColor: '#e2f0d9', color: '#385723' }}>
                  Auditing Income & Stays
                </span>
              </div>
            </div>

            {/* Tile 8: Settings */}
            <div className="module-card" onClick={() => { setCurrentView('control_deck'); setFeedbackMsg(null); }}>
              <div className="module-icon-wrapper" style={{ backgroundColor: '#f2f2f2' }}>
                <Settings size={22} style={{ color: '#595959' }} />
              </div>
              <div className="module-info">
                <h3>Config Settings</h3>
                <p>Backoffice Operations Rules</p>
                <span className="module-badge" style={{ backgroundColor: '#f2f2f2', color: '#595959' }}>
                  System Properties & Toggle
                </span>
              </div>
            </div>

          </div>
        </section>
        ) : currentView === 'cafe' ? (
          <section className="fade-in">
            {/* Header: Back to Icon Hub and Module: Cafe */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <button 
                type="button"
                onClick={() => { setCurrentView('hub'); setFeedbackMsg(null); }} 
                className="btn" 
                style={{ 
                  padding: '8px 18px', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem', 
                  color: 'var(--primary-medium)', 
                  border: '1px solid var(--primary-light)',
                  backgroundColor: '#f1f8f5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                &larr; Back to Icon Hub
              </button>
              <span style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--primary-medium)', letterSpacing: '1px' }}>
                MODULE: CAFE
              </span>
            </div>

            {/* Cafe POS Header Banner (Responsive with Cart Shortcut) */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 24px', 
              backgroundColor: 'var(--primary-deep)', 
              borderRadius: '16px', 
              color: 'white', 
              marginBottom: '25px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icons.Coffee size={24} style={{ color: 'var(--gold-accent)' }} />
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white', margin: 0, fontFamily: '"Outfit", sans-serif' }}>Forest Stay Cafe POS</h2>
                  <span style={{ fontSize: '0.72rem', color: '#a0c4b2' }}>Direct billing console & menu manager</span>
                </div>
              </div>

              {/* Cart shortcut for mobile */}
              <a 
                href="#active-cart" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  border: '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer'
                }}
              >
                <Icons.ShoppingCart size={16} style={{ color: 'var(--gold-accent)' }} />
                <span>Cart ({cafeCart.reduce((sum, item) => sum + item.qty, 0)})</span>
              </a>
            </div>

            {/* Three Stats Cards - now responsive auto-fit grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              {/* Today's Cafe Bills */}
              <div className="ops-card">
                <div className="ops-title">
                  <span>Today's Cafe Bills</span>
                  <div style={{ backgroundColor: '#e2f0d9', padding: '6px', borderRadius: '50%', color: 'green', display: 'flex' }}>
                    <Icons.TrendingUp size={16} />
                  </div>
                </div>
                <div className="ops-value" style={{ fontSize: '1.8rem' }}>₹{stats.breakdown.cafe.toLocaleString()}</div>
              </div>

              {/* Served Orders Today */}
              <div className="ops-card">
                <div className="ops-title">
                  <span>Served Orders Today</span>
                  <div style={{ backgroundColor: '#fce4d6', padding: '6px', borderRadius: '50%', color: '#c65911', display: 'flex' }}>
                    <Icons.UtensilsCrossed size={16} />
                  </div>
                </div>
                <div className="ops-value" style={{ fontSize: '1.8rem' }}>
                  {allBookings.length > 0 ? `${Math.round(stats.breakdown.cafe / 350) + 1} Completed` : '3 Completed'}
                </div>
              </div>

              {/* Best Selling Food */}
              <div className="ops-card">
                <div className="ops-title">
                  <span>Best Selling Food</span>
                  <div style={{ backgroundColor: '#e6f0fa', padding: '6px', borderRadius: '50%', color: '#1f4e79', display: 'flex' }}>
                    <Icons.ChefHat size={16} />
                  </div>
                </div>
                <div className="ops-value" style={{ fontSize: '1.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Campsite Masala Omelette
                </div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="cafe-pos-layout grid-2" style={{ gap: '30px', alignItems: 'flex-start' }}>
              
              {/* Left Panel: Menu Catalog */}
              <div className="glass-panel" style={{ padding: '30px' }}>
                
                {/* Search & Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontFamily: '"Outfit", sans-serif', fontWeight: '800', color: 'var(--primary-deep)' }}>Menu Catalog</h3>
                    <span style={{ backgroundColor: '#e2f0d9', color: '#385723', fontSize: '0.8rem', fontWeight: '700', padding: '3px 8px', borderRadius: '10px' }}>
                      {cafeMenu.length} items
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Search Input */}
                    <div style={{ position: 'relative' }}>
                      <Icons.Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--light-text)' }} />
                      <input 
                        type="text" 
                        placeholder="Search item..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="filter-input"
                        style={{ paddingLeft: '35px', paddingRight: '12px', fontSize: '0.85rem', width: '130px', height: '38px' }}
                      />
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setAddCafeItemOpen(true)}
                      style={{ 
                        padding: '8px 14px', 
                        fontSize: '0.8rem', 
                        borderRadius: '8px', 
                        height: '38px',
                        backgroundColor: 'var(--primary-deep)',
                        color: 'white',
                        border: 'none',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Icons.Plus size={14} /> Add Item
                    </button>
                    <button 
                      type="button" 
                      style={{ 
                        padding: '8px 12px', 
                        fontSize: '0.8rem', 
                        borderRadius: '8px', 
                        height: '38px',
                        backgroundColor: '#f1f8f5',
                        color: 'var(--primary-medium)',
                        border: '1px solid var(--primary-light)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Icons.Tag size={13} /> Categories
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCurrentView('inventory')}
                      style={{ 
                        padding: '8px 12px', 
                        fontSize: '0.8rem', 
                        borderRadius: '8px', 
                        height: '38px',
                        backgroundColor: '#fff2cc',
                        color: '#b2a100',
                        border: '1px solid #ffeeba',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Icons.Layers size={13} /> Stocks
                    </button>
                  </div>
                </div>

                {/* Categories horizontal bar */}
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '15px', marginBottom: '25px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  {['all', 'breakfast', 'lunch', 'dinner', 'bbq', 'beverages'].map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCafeCategory(cat)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        backgroundColor: cafeCategory === cat ? 'var(--primary-medium)' : 'var(--sage-mist)',
                        color: cafeCategory === cat ? 'white' : 'var(--primary-deep)',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {cat} ({getCategoryCount(cat)})
                    </button>
                  ))}
                </div>

                 {/* Menu items Grid - now spaced with auto-fit 320px columns */}
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                   {filteredMenuItems.map(item => (
                     <div key={item.id} style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '16px', background: 'var(--cream-base)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '100px' }}>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '70%' }}>
                         {/* Title and Stock badge row */}
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                           <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--primary-deep)', lineHeight: '1.2', margin: 0 }}>{item.name}</h4>
                           <span style={{ backgroundColor: '#e2f0d9', color: '#385723', fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                             {item.stock} in stock
                           </span>
                         </div>
                         {/* Price and category */}
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                           <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#385723' }}>₹{item.price}</span>
                           <span style={{ fontSize: '0.68rem', color: 'var(--light-text)', textTransform: 'capitalize' }}>({item.category})</span>
                         </div>
                       </div>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <button 
                           type="button" 
                           style={{ 
                             border: 'none', 
                             backgroundColor: '#f2f2f2', 
                             borderRadius: '8px', 
                             padding: '6px 10px', 
                             cursor: 'pointer', 
                             display: 'flex', 
                             alignItems: 'center', 
                             justifyContent: 'center',
                             color: 'var(--light-text)'
                           }}
                         >
                           <Icons.Pencil size={14} />
                         </button>
                         <button 
                           type="button"
                           onClick={() => addToCart(item)}
                           style={{ 
                             width: '32px', 
                             height: '32px', 
                             borderRadius: '50%', 
                             border: '1px solid rgba(0,0,0,0.08)', 
                             backgroundColor: 'white', 
                             color: '#385723', 
                             fontWeight: '700', 
                             fontSize: '1.2rem', 
                             cursor: 'pointer',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                           }}
                         >
                           +
                         </button>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Right Panel: Active Order Cart */}
              <div id="active-cart" className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icons.CreditCard size={18} style={{ color: 'var(--primary-medium)' }} /> Active Order Cart
                </h3>

                {/* Service Type Tab Selector */}
                <div style={{ display: 'flex', backgroundColor: 'var(--sage-mist)', padding: '4px', borderRadius: '8px' }}>
                  {['dine-in', 'takeaway', 'room'].map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setServiceType(type)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: serviceType === type ? 'white' : 'transparent',
                        color: serviceType === type ? 'var(--primary-deep)' : 'var(--light-text)',
                        boxShadow: serviceType === type ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {type === 'room' ? 'Room Delivery' : type}
                    </button>
                  ))}
                </div>

                {/* Table No Input */}
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Table No:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. T-04" 
                    value={tableNo} 
                    onChange={(e) => setTableNo(e.target.value)} 
                    className="form-input"
                    style={{ padding: '10px 12px', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Cart Items List */}
                <div style={{ minHeight: '180px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '15px' }}>
                  {cafeCart.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', color: 'var(--light-text)', fontSize: '0.85rem', textAlign: 'center' }}>
                      Order cart is empty. Click items on the left menu catalog to add.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                      {cafeCart.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ fontWeight: '500', width: '45%' }}>{item.name}</span>
                          
                          {/* Quantity Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button 
                              type="button"
                              onClick={() => decreaseCartQty(item.id)}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              -
                            </button>
                            <span style={{ width: '20px', textAlign: 'center', fontWeight: '600' }}>{item.qty}</span>
                            <button 
                              type="button"
                              onClick={() => addToCart(item)}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>

                          <span style={{ fontWeight: '600', width: '25%', textAlign: 'right' }}>
                            ₹{item.price * item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Calculations Block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                  {feedbackMsg && <div className="alert alert-success" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>{feedbackMsg.text}</div>}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Discount (₹)</span>
                    <input 
                      type="number" 
                      value={discount} 
                      onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))} 
                      className="form-input"
                      style={{ padding: '6px 8px', fontSize: '0.85rem', width: '80px', height: '30px', textAlign: 'right' }}
                      min="0"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (18%)</span>
                    <span>₹{Math.round(gst).toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.15rem', borderTop: '2px solid rgba(14, 47, 34, 0.1)', paddingTop: '10px', color: 'var(--primary-medium)' }}>
                    <span>Total Amount</span>
                    <span>₹{Math.round(totalAmount).toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleCheckoutPOS}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem', marginTop: '10px' }}
                  disabled={cafeCart.length === 0}
                >
                  Generate Bill & Check Out
                </button>
              </div>

            </div>
          </section>
        ) : currentView === 'stays' ? (
          <section className="fade-in">
            {/* Header: Back to Icon Hub and Page title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  type="button"
                  onClick={() => { setCurrentView('hub'); setFeedbackMsg(null); }} 
                  className="btn btn-secondary" 
                  style={{ 
                    padding: '8px 18px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem', 
                    color: 'var(--primary-medium)', 
                    border: '1px solid var(--primary-light)',
                    backgroundColor: '#f1f8f5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  &larr; Back to Icon Hub
                </button>
                <div>
                  <h2 style={{ fontSize: '1.45rem', color: 'var(--primary-deep)', fontWeight: '800', margin: 0, fontFamily: '"Outfit", sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Stay & Reservations Calendar 🏕️
                  </h2>
                  <span style={{ fontSize: '0.78rem', color: 'var(--light-text)' }}>
                    View monthwise stays, approve/reject requests & block rooms directly on dates
                  </span>
                </div>
              </div>

              {/* Sub-view switcher controls */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  type="button"
                  onClick={() => setStaysTab('calendar')} 
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.82rem', 
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    backgroundColor: staysTab === 'calendar' ? 'var(--primary-medium)' : '#fff',
                    color: staysTab === 'calendar' ? '#fff' : 'var(--primary-deep)',
                    border: '1px solid var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '600'
                  }}
                >
                  <Icons.Calendar size={14} /> Calendar View
                </button>
                <button 
                  type="button"
                  onClick={() => setStaysTab('list')} 
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.82rem', 
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    backgroundColor: staysTab === 'list' ? 'var(--primary-medium)' : '#fff',
                    color: staysTab === 'list' ? '#fff' : 'var(--primary-deep)',
                    border: '1px solid var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '600'
                  }}
                >
                  <Icons.List size={14} /> All Reservations List
                </button>
                <button 
                  type="button"
                  onClick={() => setStaysTab('rooms')} 
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.82rem', 
                    borderRadius: '20px', 
                    cursor: 'pointer',
                    backgroundColor: staysTab === 'rooms' ? 'var(--primary-medium)' : '#fff',
                    color: staysTab === 'rooms' ? '#fff' : 'var(--primary-deep)',
                    border: '1px solid var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '600'
                  }}
                >
                  <Icons.Layers size={14} /> Manage Rooms & Tents
                </button>
                <button 
                  type="button"
                  onClick={() => setLogStayOpen(true)} 
                  style={{ 
                    padding: '8px 18px', 
                    fontSize: '0.82rem', 
                    borderRadius: '20px', 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--primary-deep)',
                    color: 'white',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <PlusCircle size={14} /> + Log New Stay
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '25px', borderRadius: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '250px' }}>
                <Icons.Search size={16} style={{ color: 'var(--light-text)' }} />
                <input 
                  type="text" 
                  placeholder="Search by name, phone, stay ID..." 
                  value={searchStayQuery} 
                  onChange={(e) => setSearchStayQuery(e.target.value)}
                  className="filter-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: '36px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--light-text)', fontWeight: '600' }}>Filter:</span>
                
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-input"
                  style={{ width: '130px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked In</option>
                  <option value="pending">Pending</option>
                </select>

                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                  style={{ width: '130px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                >
                  <option value="all">All Stay Types</option>
                  <option value="tent">Standard Tent</option>
                  <option value="premium">Premium Cottage</option>
                  <option value="fabricated">Fabricated Dome</option>
                </select>

                <input 
                  type="date"
                  className="form-input"
                  style={{ width: '140px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                />
              </div>
            </div>

            {/* Calendar View Mode & Month Navigation */}
            {staysTab === 'calendar' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'rgba(0, 0, 0, 0.03)', padding: '4px', borderRadius: '30px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', paddingLeft: '10px', marginRight: '5px' }}>Calendar Mode:</span>
                  <button 
                    type="button"
                    onClick={() => setCalendarMode('month')} 
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backgroundColor: calendarMode === 'month' ? 'var(--primary-deep)' : 'transparent',
                      color: calendarMode === 'month' ? '#fff' : 'var(--light-text)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Monthwise View
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCalendarMode('7day')} 
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backgroundColor: calendarMode === '7day' ? 'var(--primary-deep)' : 'transparent',
                      color: calendarMode === '7day' ? '#fff' : 'var(--light-text)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    7-Day Room Timeline
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setCalendarMonth(prev => prev === 0 ? 11 : prev - 1)}
                    className="btn" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', borderRadius: '6px' }}
                  >
                    &lt; Prev
                  </button>
                  <select 
                    value={calendarMonth} 
                    onChange={(e) => setCalendarMonth(parseInt(e.target.value))}
                    className="form-input"
                    style={{ width: '110px', height: '32px', padding: '0 8px', fontSize: '0.82rem', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px' }}
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, idx) => (
                      <option key={idx} value={idx}>{m}</option>
                    ))}
                  </select>
                  <select 
                    value={calendarYear} 
                    onChange={(e) => setCalendarYear(parseInt(e.target.value))}
                    className="form-input"
                    style={{ width: '80px', height: '32px', padding: '0 8px', fontSize: '0.82rem', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px' }}
                  >
                    {[2024, 2025, 2026, 2027].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={() => setCalendarMonth(prev => prev === 11 ? 0 : prev + 1)}
                    className="btn" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', borderRadius: '6px' }}
                  >
                    Next &gt;
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setCalendarMonth(6); setCalendarYear(2026); }}
                    className="btn" 
                    style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#e2f0d9', color: '#385723', border: 'none', fontWeight: '700', borderRadius: '15px', cursor: 'pointer' }}
                  >
                    July 2026 (Today)
                  </button>
                </div>
              </div>
            )}

            {/* Sub-view: Calendar */}
            {staysTab === 'calendar' && (
              <div className="glass-panel" style={{ padding: '25px', borderRadius: '18px' }}>
                {/* Legend & Month Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '15px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary-deep)' }}>
                    July 2026 <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: 'normal' }}>| Click any date box to view/approve/reject bookings or block/add rooms</span>
                  </span>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '0.75rem', fontWeight: '600' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'blue' }}></span> Confirmed</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'green' }}></span> Checked In</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'red' }}></span> Blocked Room</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'orange' }}></span> Pending</span>
                  </div>
                </div>

                {/* Days of Week Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontWeight: '700', fontSize: '0.8rem', color: 'var(--primary-medium)', marginBottom: '10px' }}>
                  <div style={{ color: 'red' }}>SUN</div>
                  <div>MON</div>
                  <div>TUE</div>
                  <div>WED</div>
                  <div>THU</div>
                  <div>FRI</div>
                  <div style={{ color: 'blue' }}>SAT</div>
                </div>

                {/* Calendar Days Cells Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {/* June padding */}
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const dayNum = 28 + idx;
                    return (
                      <div key={`prev-${idx}`} style={{ minHeight: '110px', background: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.02)', borderRadius: '10px', padding: '8px', opacity: '0.4' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--light-text)' }}>{dayNum}</span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--light-text)', marginTop: '8px' }}>Available</div>
                      </div>
                    );
                  })}

                  {/* July days: 1 to 31 */}
                  {Array.from({ length: 31 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const dateStr = `2026-07-${dayNum.toString().padStart(2, '0')}`;
                    const isToday = dayNum === 20;

                    // Filter bookings overlapping with this date
                    const dayBookings = localBookings.filter(b => {
                      const d = new Date(dateStr);
                      const start = new Date(b.check_in);
                      const end = new Date(b.check_out);
                      return d >= start && d < end;
                    });

                    return (
                      <div 
                        key={`day-${dayNum}`} 
                        style={{ 
                          minHeight: '110px', 
                          background: '#fff', 
                          border: isToday ? '2px solid #2ecc71' : '1px solid rgba(0,0,0,0.05)', 
                          borderRadius: '10px', 
                          padding: '8px',
                          boxShadow: isToday ? '0 0 10px rgba(46, 204, 113, 0.15)' : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary-deep)' }}>{dayNum}</span>
                          {isToday && (
                            <span style={{ fontSize: '0.62rem', backgroundColor: '#e2f0d9', color: '#385723', padding: '1px 4px', borderRadius: '3px', fontWeight: '800' }}>TODAY</span>
                          )}
                        </div>

                        {/* Overlapping Stays Badges */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '6px 0' }}>
                          {dayBookings.slice(0, 2).map((b, bIdx) => {
                            const statusColor = b.status === 'checked-in' ? '#2ecc71' : b.status === 'pending' ? '#f1c40f' : 'blue';
                            const badgeBg = b.status === 'checked-in' ? '#e2f0d9' : b.status === 'pending' ? '#fff2cc' : '#e6f0fa';
                            const fontColor = b.status === 'checked-in' ? '#385723' : b.status === 'pending' ? '#b2a100' : '#1f4e79';
                            return (
                              <div 
                                key={b.id} 
                                style={{ 
                                  fontSize: '0.65rem', 
                                  backgroundColor: badgeBg, 
                                  color: fontColor, 
                                  padding: '2px 6px', 
                                  borderRadius: '4px', 
                                  fontWeight: '600',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  borderLeft: `3px solid ${statusColor}`
                                }}
                              >
                                {b.user_name} &bull; {b.cabin_type === 'premium' ? 'Premium' : b.cabin_type === 'fabricated' ? 'Fabricated' : 'Tent'}
                              </div>
                            );
                          })}

                          {dayBookings.length > 2 && (
                            <button 
                              type="button"
                              style={{ 
                                background: 'rgba(0,0,0,0.03)', 
                                border: 'none', 
                                padding: '2px 4px', 
                                borderRadius: '4px', 
                                fontSize: '0.6rem', 
                                color: 'var(--light-text)', 
                                fontWeight: '700',
                                cursor: 'pointer',
                                textAlign: 'left'
                              }}
                            >
                              +{dayBookings.length - 2} more stay(s)
                            </button>
                          )}
                        </div>

                        <div style={{ fontSize: '0.68rem', color: dayBookings.length > 0 ? 'var(--light-text)' : 'green', fontWeight: '500' }}>
                          {dayBookings.length > 0 ? `${dayBookings.length} Record(s)` : 'Available'}
                        </div>
                      </div>
                    );
                  })}

                  {/* August padding */}
                  <div style={{ minHeight: '110px', background: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.02)', borderRadius: '10px', padding: '8px', opacity: '0.4' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--light-text)' }}>1</span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--light-text)', marginTop: '8px' }}>Available</div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view: All Reservations List */}
            {staysTab === 'list' && (
              <div className="glass-panel" style={{ padding: '25px', borderRadius: '18px' }}>
                <h3 style={{ marginBottom: '15px' }}>Reservations Ledger</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)', fontSize: '0.9rem', color: 'var(--primary-medium)' }}>
                        <th style={{ padding: '12px' }}>Guest Name</th>
                        <th style={{ padding: '12px' }}>Stay Unit</th>
                        <th style={{ padding: '12px' }}>Check In</th>
                        <th style={{ padding: '12px' }}>Check Out</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localBookings.map(b => (
                        <tr key={b.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.88rem' }}>
                          <td style={{ padding: '12px', fontWeight: '600' }}>{b.user_name}</td>
                          <td style={{ padding: '12px' }}>{b.cabin_name}</td>
                          <td style={{ padding: '12px' }}>{b.check_in}</td>
                          <td style={{ padding: '12px' }}>{b.check_out}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              backgroundColor: b.status === 'checked-in' ? '#e2f0d9' : '#e6f0fa',
                              color: b.status === 'checked-in' ? '#385723' : '#1f4e79'
                            }}>
                              {b.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700' }}>₹{b.total_price ? Math.round(b.total_price).toLocaleString() : '1,500'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-view: Manage Rooms & Tents */}
            {staysTab === 'rooms' && (
              <div className="glass-panel" style={{ padding: '25px', borderRadius: '18px' }}>
                <h3 style={{ marginBottom: '20px' }}>Accommodation Inventory</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', background: 'var(--cream-base)' }}>
                    <h4>Standard Tents</h4>
                    <p style={{ color: 'var(--light-text)', fontSize: '0.85rem' }}>Campsite forest clearing tents</p>
                    <div style={{ marginTop: '15px', fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary-medium)' }}>₹1,500 / night</div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#e2f0d9', color: '#385723', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>15 Units Available</span>
                  </div>
                  <div style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', background: 'var(--cream-base)' }}>
                    <h4>Premium Cottages</h4>
                    <p style={{ color: 'var(--light-text)', fontSize: '0.85rem' }}>Brick cottages with private patio</p>
                    <div style={{ marginTop: '15px', fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary-medium)' }}>₹4,500 / night</div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#e2f0d9', color: '#385723', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>10 Units Available</span>
                  </div>
                  <div style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', background: 'var(--cream-base)' }}>
                    <h4>Fabricated Domes</h4>
                    <p style={{ color: 'var(--light-text)', fontSize: '0.85rem' }}>Glamping geodesic bubble domes</p>
                    <div style={{ marginTop: '15px', fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary-medium)' }}>₹3,000 / night</div>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#e2f0d9', color: '#385723', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '10px' }}>5 Units Available</span>
                  </div>
                </div>
              </div>
            )}

          </section>
        ) : currentView === 'visitors' ? (
          <section className="fade-in" style={{ paddingBottom: '40px' }}>
            {/* Header: Back to Icon Hub and Page title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  type="button"
                  onClick={() => { setCurrentView('hub'); setFeedbackMsg(null); }} 
                  className="btn" 
                  style={{ 
                    padding: '8px 18px', 
                    borderRadius: '20px', 
                    fontSize: '0.85rem', 
                    color: 'var(--primary-medium)', 
                    border: '1px solid var(--primary-light)',
                    backgroundColor: '#f1f8f5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  &larr; Back to Icon Hub
                </button>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-medium)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  MODULE: VISITORS
                </span>
              </div>
            </div>

            {/* Stats Row (Responsive grid layout - stacks on mobile) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              {/* Card 1: Revenue */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ENTRY PASS REVENUE TODAY</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-deep)', margin: '8px 0 0 0', fontFamily: '"Outfit", sans-serif' }}>
                    ₹{localPasses.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                  </h3>
                </div>
                <div style={{ backgroundColor: '#e2f0d9', color: '#385723', padding: '12px', borderRadius: '50%', display: 'flex', width: '48px', height: '48px', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.DollarSign size={24} />
                </div>
              </div>

              {/* Card 2: Inside Today */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>VISITORS INSIDE TODAY</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-deep)', margin: '8px 0 0 0', fontFamily: '"Outfit", sans-serif' }}>
                    {localPasses.filter(p => p.status === 'Inside').reduce((sum, p) => sum + p.adults + p.children, 0)} Pax In-Site
                  </h3>
                </div>
                <div style={{ backgroundColor: '#f3eefc', color: '#7030a0', padding: '12px', borderRadius: '50%', display: 'flex', width: '48px', height: '48px', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Users size={24} />
                </div>
              </div>

              {/* Card 3: Passes Issued */}
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ENTRY PASSES ISSUED</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-deep)', margin: '8px 0 0 0', fontFamily: '"Outfit", sans-serif' }}>
                    {localPasses.length} Passes Issued
                  </h3>
                </div>
                <div style={{ backgroundColor: '#e6f0fa', color: '#1f4e79', padding: '12px', borderRadius: '50%', display: 'flex', width: '48px', height: '48px', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Ticket size={24} />
                </div>
              </div>
            </div>

            {/* Description & Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-deep)', fontWeight: '800', margin: 0, fontFamily: '"Outfit", sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Entry Pass 🎟️
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>
                  Issue entry passes, customize & delete pass categories, edit pricing, and track visitor metrics
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  type="button"
                  style={{ 
                    padding: '8px 18px', 
                    fontSize: '0.82rem', 
                    borderRadius: '20px', 
                    backgroundColor: '#fff',
                    color: 'var(--primary-deep)',
                    border: '1px solid var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Icons.Tag size={14} /> Manage Categories
                </button>
                <button 
                  type="button"
                  onClick={() => setIssuePassOpen(true)}
                  style={{ 
                    padding: '8px 18px', 
                    fontSize: '0.82rem', 
                    borderRadius: '20px', 
                    backgroundColor: 'var(--primary-deep)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  <PlusCircle size={14} /> + Issue Entry Pass
                </button>
              </div>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="glass-panel" style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '25px', borderRadius: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '250px' }}>
                <Icons.Search size={16} style={{ color: 'var(--light-text)' }} />
                <input 
                  type="text" 
                  placeholder="Search entry passes by name, phone, category..." 
                  value={searchPassQuery} 
                  onChange={(e) => setSearchPassQuery(e.target.value)}
                  className="filter-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: '36px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                />
              </div>

              <div>
                <select 
                  value={filterPassCategory}
                  onChange={(e) => setFilterPassCategory(e.target.value)}
                  className="form-input"
                  style={{ width: '220px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                >
                  <option value="all">All Entry Pass Categories</option>
                  <option value="adult">Adult Day Pass</option>
                  <option value="child">Child Day Pass</option>
                </select>
              </div>
            </div>

            {/* Passes Table Ledger (Scrollable container to maintain mobile responsiveness) */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)', fontSize: '0.85rem', color: 'var(--primary-medium)' }}>
                      <th style={{ padding: '12px 16px', fontWeight: '700' }}>Pass ID / Entry Category</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700' }}>Visitor Details</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700' }}>Head Count</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700' }}>Pass Amount</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700' }}>Cafe Coupon</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700' }}>Status</th>
                      <th style={{ padding: '12px 16px', fontWeight: '700', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localPasses
                      .filter(p => {
                        const matchesQuery = p.guest_name.toLowerCase().includes(searchPassQuery.toLowerCase()) || p.phone.includes(searchPassQuery);
                        return matchesQuery;
                      })
                      .map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.88rem' }}>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: '700', color: 'var(--primary-deep)' }}>Entry Pass</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--light-text)', marginTop: '2px' }}>{p.id}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--light-text)' }}>Issued: {p.date}</div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: '700', color: 'var(--primary-deep)' }}>{p.guest_name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--light-text)', marginTop: '2px' }}>{p.phone}</div>
                          </td>
                          <td style={{ padding: '16px', fontWeight: '600' }}>
                            {p.adults} Adult, {p.children} Child
                          </td>
                          <td style={{ padding: '16px', fontWeight: '800', color: '#2ecc71', fontSize: '1rem' }}>
                            ₹{p.amount}
                          </td>
                          <td style={{ padding: '16px', color: 'var(--light-text)', fontSize: '0.78rem' }}>
                            {p.coupon}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: '20px', 
                              fontSize: '0.75rem', 
                              fontWeight: '700', 
                              backgroundColor: p.status === 'Checked In' ? '#e2f0d9' : '#f2f2f2',
                              color: p.status === 'Checked In' ? '#385723' : '#595959',
                              display: 'inline-block'
                            }}>
                              {p.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button type="button" style={{ border: '1px solid #ccc', background: 'white', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icons.Pencil size={13} style={{ color: 'var(--light-text)' }} />
                              </button>
                              <button type="button" style={{ border: '1px solid #ccc', background: 'white', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icons.QrCode size={13} style={{ color: 'var(--light-text)' }} />
                              </button>
                              <button type="button" style={{ border: '1px solid #ccc', background: 'white', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icons.Trash size={13} style={{ color: 'var(--light-text)' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </section>
        ) : currentView === 'treks' ? (
          <section className="fade-in" style={{ paddingBottom: '40px' }}>
            {/* Header Banner */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px 30px', 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
              marginBottom: '25px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icons.Compass size={24} style={{ color: '#27ae60' }} />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-deep)', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                    Trekkings & Backoffice Bookings Check
                  </h2>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>
                  Add, edit or delete trail packages and instantly verify reservations
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  className="btn"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.82rem', 
                    borderRadius: '20px', 
                    backgroundColor: 'var(--primary-deep)', 
                    color: 'white', 
                    border: 'none', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Icons.Compass size={14} /> Trekkings Directory ({treksCatalog.length})
                </button>
                <button 
                  type="button" 
                  className="btn"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.82rem', 
                    borderRadius: '20px', 
                    backgroundColor: 'white', 
                    color: 'var(--primary-medium)', 
                    border: '1px solid var(--primary-light)', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Icons.Search size={14} /> Check Booking on Backoffice
                </button>
              </div>
            </div>

            {/* Filter & Action Row */}
            <div className="glass-panel" style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '25px', borderRadius: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '250px' }}>
                <Icons.Search size={16} style={{ color: 'var(--light-text)' }} />
                <input 
                  type="text" 
                  placeholder="Search trek name, description, difficulty..." 
                  value={searchTrekQuery} 
                  onChange={(e) => setSearchTrekQuery(e.target.value)}
                  className="filter-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: '36px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--light-text)', fontWeight: '600' }}>Difficulty:</span>
                  <select 
                    value={selectedTrekDifficulty}
                    onChange={(e) => setSelectedTrekDifficulty(e.target.value)}
                    className="form-input"
                    style={{ width: '180px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                  >
                    <option value="All">All Difficulty Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <button 
                  type="button" 
                  onClick={handleOpenAddTrek}
                  style={{ 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--primary-deep)', 
                    color: 'white', 
                    border: 'none', 
                    fontSize: '0.85rem', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icons.Plus size={14} /> Add New Trekking
                </button>
              </div>
            </div>

            {/* Trek Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
              {treksCatalog
                .filter(t => {
                  const matchesSearch = t.title.toLowerCase().includes(searchTrekQuery.toLowerCase()) || 
                    (t.description && t.description.toLowerCase().includes(searchTrekQuery.toLowerCase())) ||
                    (t.difficulty && t.difficulty.toLowerCase().includes(searchTrekQuery.toLowerCase()));
                  const matchesDifficulty = selectedTrekDifficulty === 'All' || t.difficulty === selectedTrekDifficulty;
                  return matchesSearch && matchesDifficulty;
                })
                .map(t => {
                  const diffColorMap = {
                    'Easy': { bg: '#e2f0d9', text: '#385723' },
                    'Moderate': { bg: '#fff2cc', text: '#b2a100' },
                    'Hard': { bg: '#fce4d6', text: '#c65911' }
                  };
                  const diffStyles = diffColorMap[t.difficulty] || { bg: '#f2f2f2', text: '#595959' };
                  
                  return (
                    <div key={t.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '20px', minHeight: '230px' }}>
                      <div>
                        {/* Header details */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{ 
                            backgroundColor: '#eef6f6', 
                            color: '#008080', 
                            fontSize: '0.68rem', 
                            fontWeight: '800', 
                            padding: '3px 8px', 
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {t.category || 'Forest Trail'}
                          </span>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary-deep)' }}>₹{Math.round(t.price)}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--light-text)' }}>/person</div>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-deep)', margin: '0 0 8px 0', fontFamily: '"Outfit", sans-serif' }}>
                          {t.title}
                        </h4>

                        {/* Description */}
                        <p style={{ fontSize: '0.82rem', color: 'var(--light-text)', margin: '0 0 15px 0', lineHeight: '1.4' }}>
                          {t.description || 'No description provided.'}
                        </p>
                      </div>

                      <div>
                        {/* Tags Indicators */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                          <span style={{ fontSize: '0.72rem', backgroundColor: '#f2f2f2', color: '#595959', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            <Icons.Clock size={11} /> {t.duration}
                          </span>
                          <span style={{ fontSize: '0.72rem', backgroundColor: diffStyles.bg, color: diffStyles.text, padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            {t.difficulty}
                          </span>
                          <span style={{ fontSize: '0.72rem', backgroundColor: '#f2f2f2', color: '#595959', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                            <Icons.Users size={11} /> Max {t.max_group}
                          </span>
                          {(t.guide_included === 1 || t.guide_included === true) && (
                            <span style={{ fontSize: '0.72rem', backgroundColor: '#e2f0d9', color: '#385723', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                              <Icons.ShieldCheck size={11} /> Guide Included
                            </span>
                          )}
                        </div>

                        {/* Status and Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: t.status === 'Active' ? '#27ae60' : 'var(--light-text)' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: t.status === 'Active' ? '#27ae60' : '#bdc3c7', display: 'inline-block' }}></span>
                            {t.status || 'Active'}
                          </span>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              type="button" 
                              onClick={() => handleOpenEditTrek(t)}
                              style={{ border: '1px solid rgba(0,0,0,0.08)', background: 'white', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--light-text)' }}
                            >
                              <Icons.Pencil size={13} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleDeleteTrek(t.id)}
                              style={{ border: '1px solid rgba(0,0,0,0.08)', background: 'white', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'red' }}
                            >
                              <Icons.Trash size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        ) : currentView === 'inventory' ? (
          <section className="fade-in" style={{ paddingBottom: '40px' }}>
            {/* Header Banner */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px 30px', 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
              marginBottom: '25px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icons.Layers size={24} style={{ color: '#27ae60' }} />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-deep)', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                    Campsite & Cafe Inventory Stock
                  </h2>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>
                  Track and manage charcoal, firewood, LPG gas, beverages, and campsite gear
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  style={{ 
                    padding: '10px 18px', 
                    borderRadius: '8px', 
                    backgroundColor: '#f2f2f2', 
                    color: 'var(--primary-medium)', 
                    border: 'none', 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icons.Tag size={14} /> Categories
                </button>
                <button 
                  type="button" 
                  onClick={handleOpenAddInventory}
                  style={{ 
                    padding: '10px 18px', 
                    borderRadius: '8px', 
                    backgroundColor: 'var(--primary-deep)', 
                    color: 'white', 
                    border: 'none', 
                    fontSize: '0.85rem', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Icons.Plus size={14} /> Add New Stock
                </button>
              </div>
            </div>

            {/* Metrics cards row (4 styled metrics matching mockup) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', borderLeft: '5px solid #27ae60' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase' }}>Total Items</span>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '5px', color: 'var(--primary-deep)' }}>{inventoryList.length}</div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', borderLeft: '5px solid #fff2cc', position: 'relative' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase' }}>Low Stock Alerts</span>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#b2a100', marginTop: '5px' }}>
                  {inventoryList.filter(i => i.stock <= i.minThreshold && i.stock > 0).length}
                </div>
                <Icons.AlertTriangle size={18} style={{ position: 'absolute', right: '20px', top: '20px', color: '#b2a100' }} />
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', borderLeft: '5px solid #fce4d6', position: 'relative' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase' }}>Out of Stock</span>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'red', marginTop: '5px' }}>
                  {inventoryList.filter(i => i.stock === 0).length}
                </div>
                <Icons.ShieldAlert size={18} style={{ position: 'absolute', right: '20px', top: '20px', color: 'red' }} />
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px', borderLeft: '5px solid #e2f0d9' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase' }}>Healthy Stock</span>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'green', marginTop: '5px' }}>
                  {inventoryList.filter(i => i.stock > i.minThreshold).length}
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '20px', borderRadius: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '250px' }}>
                <Icons.Search size={16} style={{ color: 'var(--light-text)' }} />
                <input 
                  type="text" 
                  placeholder="Search stock item by name or category..." 
                  value={searchInventoryQuery} 
                  onChange={(e) => setSearchInventoryQuery(e.target.value)}
                  className="filter-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: '36px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <select 
                  value={selectedInventoryCategory}
                  onChange={(e) => setSelectedInventoryCategory(e.target.value)}
                  className="form-input"
                  style={{ width: '180px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                >
                  <option value="All">All Categories ({inventoryList.length})</option>
                  <option value="Food">Food</option>
                  <option value="Beverages">Beverages</option>
                  <option value="BBQ Stock">BBQ Stock</option>
                  <option value="Camping Equipment">Camping Equipment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>

                <select 
                  value={filterInventoryStatus}
                  onChange={(e) => setFilterInventoryStatus(e.target.value)}
                  className="form-input"
                  style={{ width: '180px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                >
                  <option value="all">All Status</option>
                  <option value="healthy">Healthy Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Horizontal Pill Category Tabs (Mockup match) */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '25px' }}>
              {['All', 'Food', 'Beverages', 'BBQ Stock', 'Camping Equipment', 'Utilities', 'Cleaning', 'Maintenance'].map(cat => {
                const isSelected = selectedInventoryCategory === cat;
                const count = cat === 'All' ? inventoryList.length : inventoryList.filter(i => i.category === cat).length;
                
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedInventoryCategory(cat)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '20px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      backgroundColor: isSelected ? 'var(--primary-medium)' : '#fafafa',
                      color: isSelected ? 'white' : 'var(--primary-deep)',
                      border: isSelected ? 'none' : '1px solid rgba(0,0,0,0.06)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>{cat}</span>
                    <span style={{ 
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', 
                      padding: '1px 6px', 
                      borderRadius: '10px',
                      fontSize: '0.72rem'
                    }}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Inventory Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
              {inventoryList
                .filter(i => {
                  const matchesSearch = i.name.toLowerCase().includes(searchInventoryQuery.toLowerCase());
                  const matchesCategory = selectedInventoryCategory === 'All' || i.category === selectedInventoryCategory;
                  
                  let matchesStatus = true;
                  if (filterInventoryStatus === 'healthy') matchesStatus = i.stock > i.minThreshold;
                  else if (filterInventoryStatus === 'low') matchesStatus = i.stock <= i.minThreshold && i.stock > 0;
                  else if (filterInventoryStatus === 'out') matchesStatus = i.stock === 0;

                  return matchesSearch && matchesCategory && matchesStatus;
                })
                .map(item => {
                  const isLow = item.stock <= item.minThreshold && item.stock > 0;
                  const isOut = item.stock === 0;
                  const pct = Math.min(100, Math.round((item.stock / item.maxStock) * 100));
                  
                  let statusBg = '#e2f0d9';
                  let statusColor = '#385723';
                  let statusText = 'Healthy';
                  if (isOut) {
                    statusBg = '#fce4d6';
                    statusColor = '#c65911';
                    statusText = 'Out of Stock';
                  } else if (isLow) {
                    statusBg = '#fff2cc';
                    statusColor = '#b2a100';
                    statusText = 'Low Stock';
                  }

                  return (
                    <div key={item.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px', border: isLow ? '1px solid #ffeeba' : isOut ? '1px solid #f5c6cb' : '1px solid rgba(0,0,0,0.03)', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-deep)', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                            {item.name}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: 'var(--light-text)' }}>Category: {item.category}</span>
                        </div>
                        <span style={{ backgroundColor: statusBg, color: statusColor, fontSize: '0.68rem', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          {isOut ? '✗' : isLow ? '⚠️' : '✓'} {statusText}
                        </span>
                      </div>

                      {/* Stock capacity bar */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px', fontWeight: '600' }}>
                          <span>Stock Level</span>
                          <span>{item.stock} / {item.maxStock} {item.unit} ({pct}%)</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: isOut ? 'red' : isLow ? 'orange' : 'green', transition: 'width 0.4s ease' }}></div>
                        </div>
                      </div>

                      {/* Controls and adjustments */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '12px', marginTop: '5px' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--light-text)', display: 'block' }}>Min Threshold</span>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--primary-deep)' }}>{item.minThreshold} {item.unit}</strong>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button 
                            type="button" 
                            onClick={() => handleAdjustStock(item)}
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '0.78rem', 
                              borderRadius: '6px', 
                              backgroundColor: 'white', 
                              border: '1px solid rgba(0,0,0,0.12)', 
                              color: 'var(--primary-medium)', 
                              fontWeight: '700', 
                              cursor: 'pointer' 
                            }}
                          >
                            Adjust
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleOpenEditInventory(item)}
                            style={{ border: '1px solid rgba(0,0,0,0.08)', background: 'white', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--light-text)' }}
                          >
                            <Icons.Pencil size={13} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteInventory(item.id)}
                            style={{ border: '1px solid rgba(0,0,0,0.08)', background: 'white', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'red' }}
                          >
                            <Icons.Trash size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        ) : currentView === 'staff' ? (
          <section className="fade-in" style={{ paddingBottom: '40px' }}>
            {/* Header Banner */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px 30px', 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
              marginBottom: '25px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icons.Users size={24} style={{ color: 'var(--primary-medium)' }} />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-deep)', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                    Staff Attendance & Payroll System
                  </h2>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>
                  Manage permanent & temporary casual staff, log daily attendance in an interactive monthly calendar, and compute prorated payouts.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                {/* Roster / Calendar Switcher */}
                <div style={{ display: 'flex', backgroundColor: '#f2f2f2', padding: '4px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <button 
                    type="button" 
                    onClick={() => setStaffTabMode('roster')}
                    style={{ 
                      padding: '6px 14px', 
                      fontSize: '0.8rem', 
                      borderRadius: '16px', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      backgroundColor: staffTabMode === 'roster' ? 'white' : 'transparent',
                      color: 'var(--primary-deep)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Icons.ListCollapse size={13} /> Roster View
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStaffTabMode('calendar')}
                    style={{ 
                      padding: '6px 14px', 
                      fontSize: '0.8rem', 
                      borderRadius: '16px', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontWeight: '600',
                      backgroundColor: staffTabMode === 'calendar' ? 'white' : 'transparent',
                      color: 'var(--primary-deep)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Icons.Calendar size={13} /> Monthly Calendar
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => handleOpenAddStaff('Temporary/Daily Wage')}
                    style={{ 
                      padding: '8px 14px', 
                      fontSize: '0.8rem', 
                      borderRadius: '8px', 
                      backgroundColor: '#fffcf0', 
                      color: '#b2a100', 
                      border: '1px solid #ffeeba', 
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Icons.Zap size={13} /> + Temp Casual Staff
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleOpenAddStaff('Permanent')}
                    style={{ 
                      padding: '8px 14px', 
                      fontSize: '0.8rem', 
                      borderRadius: '8px', 
                      backgroundColor: '#e2f0d9', 
                      color: '#385723', 
                      border: '1px solid #c3e6cb', 
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Icons.UserPlus size={13} /> + Permanent Staff
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics cards row (5 metrics + Large green month payroll card) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '25px' }}>
              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '600', textTransform: 'uppercase' }}>Total Staff</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '5px' }}>{staffList.length}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--light-text)', marginTop: '2px' }}>
                  {staffList.filter(s => s.type === 'Permanent').length} Permanent, {staffList.filter(s => s.type !== 'Permanent').length} Temp
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '600', textTransform: 'uppercase' }}>Temp Staff</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'orange', marginTop: '5px' }}>
                  {staffList.filter(s => s.type !== 'Permanent').length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--light-text)', marginTop: '2px' }}>Casual / Daily Wage</div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '600', textTransform: 'uppercase' }}>Present Today</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'green', marginTop: '5px' }}>
                  {staffList.filter(s => s.today_attendance === 'Present').length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--light-text)', marginTop: '2px' }}>On Duty Today</div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '600', textTransform: 'uppercase' }}>Half Day / Leave</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b2a100', marginTop: '5px' }}>
                  {staffList.filter(s => s.today_attendance === 'Half' || s.today_attendance === 'Leave').length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--light-text)', marginTop: '2px' }}>
                  {staffList.filter(s => s.today_attendance === 'Half').length} Half, {staffList.filter(s => s.today_attendance === 'Leave').length} Leave
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', borderRadius: '15px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '600', textTransform: 'uppercase' }}>Absent Today</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'red', marginTop: '5px' }}>
                  {staffList.filter(s => s.today_attendance === 'Absent').length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--light-text)', marginTop: '2px' }}>Not Checked In</div>
              </div>

              {/* MONTH PAYROLL - Large green card */}
              <div style={{ 
                padding: '20px', 
                borderRadius: '15px', 
                backgroundColor: 'var(--primary-deep)', 
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '0.78rem', color: '#a0c4b2', fontWeight: '600', textTransform: 'uppercase' }}>Month Payroll</span>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', marginTop: '5px' }}>
                  ₹{staffList.reduce((sum, st) => sum + getStaffPayableBreakdown(st).netPayable, 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#a0c4b2', marginTop: '2px' }}>Prorated Payable</div>
              </div>
            </div>

            {staffTabMode === 'calendar' ? (
              /* MONTHLY CALENDAR VIEW */
              <div className="glass-panel" style={{ padding: '30px', borderRadius: '18px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icons.Calendar size={18} style={{ color: 'var(--primary-medium)' }} /> Interactive Calendar: August 2026
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                  {/* Calendar Header */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontWeight: '700', fontSize: '0.8rem', padding: '6px', color: 'var(--primary-medium)' }}>{d}</div>
                  ))}
                  {/* Calendar Days */}
                  {Array.from({ length: 31 }).map((_, idx) => {
                    const dayNo = idx + 1;
                    return (
                      <div key={dayNo} style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', padding: '8px', minHeight: '80px', backgroundColor: '#fafafa' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.82rem', marginBottom: '5px' }}>{dayNo}</div>
                        <div style={{ fontSize: '0.62rem', color: 'green', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'green', display: 'inline-block' }}></span>
                          {staffList.filter(s => s.today_attendance === 'Present').length} Present
                        </div>
                        <div style={{ fontSize: '0.62rem', color: 'orange', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'orange', display: 'inline-block' }}></span>
                          {staffList.filter(s => s.today_attendance === 'Half').length} Half Day
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ROSTER LIST VIEW */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Search & Filter Bar */}
                <div className="glass-panel" style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', borderRadius: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '250px' }}>
                    <Icons.Search size={16} style={{ color: 'var(--light-text)' }} />
                    <input 
                      type="text" 
                      placeholder="Search staff name, info, role..." 
                      value={searchStaffQuery} 
                      onChange={(e) => setSearchStaffQuery(e.target.value)}
                      className="filter-input"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', height: '36px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <select 
                      value={filterStaffType}
                      onChange={(e) => setFilterStaffType(e.target.value)}
                      className="form-input"
                      style={{ width: '180px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                    >
                      <option value="All">All Staff Types</option>
                      <option value="Permanent">Permanent Staff</option>
                      <option value="Temporary/Daily Wage">Temporary Casual Staff</option>
                    </select>

                    <select 
                      value={filterStaffAttendance}
                      onChange={(e) => setFilterStaffAttendance(e.target.value)}
                      className="form-input"
                      style={{ width: '180px', height: '36px', padding: '6px 10px', fontSize: '0.85rem', background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Present">Present Today</option>
                      <option value="Half">Half Day</option>
                      <option value="Absent">Absent Today</option>
                      <option value="Leave">On Leave</option>
                    </select>
                  </div>
                </div>

                {/* Staff Roster Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {staffList
                    .filter(st => {
                      const matchesSearch = st.name.toLowerCase().includes(searchStaffQuery.toLowerCase()) || 
                        st.role.toLowerCase().includes(searchStaffQuery.toLowerCase());
                      const matchesType = filterStaffType === 'All' || st.type === filterStaffType;
                      const matchesAttendance = filterStaffAttendance === 'All' || st.today_attendance === filterStaffAttendance;
                      return matchesSearch && matchesType && matchesAttendance;
                    })
                    .map(st => {
                      const breakdown = getStaffPayableBreakdown(st);
                      const isPermanent = st.type === 'Permanent';
                      
                      return (
                        <div key={st.id} className="glass-panel staff-card-grid" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1fr', gap: '25px', alignItems: 'center', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '18px' }}>
                          {/* Left Panel: Profile */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-deep)', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                                {st.name}
                              </h4>
                              <span style={{ 
                                backgroundColor: isPermanent ? '#e2f0d9' : '#fffcf0', 
                                color: isPermanent ? '#385723' : '#b2a100', 
                                fontSize: '0.68rem', 
                                fontWeight: '800', 
                                padding: '2px 8px', 
                                borderRadius: '4px',
                                border: isPermanent ? '1px solid #c3e6cb' : '1px solid #ffeeba'
                              }}>
                                {st.type}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--light-text)', fontWeight: '600' }}>{st.role}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--light-text)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Icons.Clock size={12} /> {st.shift || 'Morning Shift'}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Icons.Phone size={12} /> {st.phone || 'N/A'}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Icons.Mail size={12} /> {st.email || 'N/A'}
                              </span>
                              <span>Rating: <strong style={{ color: st.rating === 'Excellent' ? 'green' : 'orange' }}>{st.rating}</strong></span>
                            </div>

                            <div style={{ fontSize: '0.78rem', backgroundColor: 'var(--cream-base)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)' }}>
                              <strong>Assigned Tasks:</strong> {st.assigned_tasks || 'No active tasks.'}
                            </div>
                          </div>

                          {/* Middle Panel: Attendance */}
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-medium)', marginBottom: '8px' }}>TODAY'S ATTENDANCE</div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              {['Present', 'Half', 'Absent', 'Leave'].map(att => {
                                const isSelected = st.today_attendance === att;
                                
                                let btnColor = '#f2f2f2';
                                let textColor = '#595959';
                                if (isSelected) {
                                  if (att === 'Present') { btnColor = '#e2f0d9'; textColor = '#385723'; }
                                  else if (att === 'Half') { btnColor = '#fff2cc'; textColor = '#b2a100'; }
                                  else if (att === 'Absent') { btnColor = '#fce4d6'; textColor = '#c65911'; }
                                  else if (att === 'Leave') { btnColor = '#eae6ff'; textColor = '#5f27cd'; }
                                }

                                return (
                                  <button 
                                    key={att}
                                    type="button" 
                                    onClick={() => handleUpdateStaffAttendance(st, att)}
                                    style={{ 
                                      padding: '6px 12px', 
                                      fontSize: '0.75rem', 
                                      borderRadius: '6px', 
                                      border: isSelected ? '1px solid currentColor' : '1px solid rgba(0,0,0,0.08)',
                                      backgroundColor: isSelected ? btnColor : 'white',
                                      color: textColor,
                                      fontWeight: '700',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {att === 'Present' ? '✓ Present' : att === 'Half' ? '½ Half' : att === 'Absent' ? '✗ Absent' : 'Leave'}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Right Panel: Compensation */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <div style={{ fontSize: '0.82rem', color: 'var(--light-text)', fontWeight: '600' }}>
                              {isPermanent ? `Monthly Base: ₹${Math.round(st.monthly_base).toLocaleString()}` : `Daily Wage: ₹${Math.round(st.daily_rate)}/day`}
                            </div>
                            
                            {/* Days Worked */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                              <span>Days Worked:</span>
                              <button type="button" onClick={() => handleUpdateStaffDaysWorked(st, -1)} style={{ width: '22px', height: '22px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>-</button>
                              <span>{st.days_worked}d</span>
                              <button type="button" onClick={() => handleUpdateStaffDaysWorked(st, 1)} style={{ width: '22px', height: '22px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>+</button>
                            </div>

                            {/* Half Days */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                              <span>Half Days:</span>
                              <button type="button" onClick={() => handleUpdateStaffHalfDays(st, -1)} style={{ width: '22px', height: '22px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>-</button>
                              <span>{st.half_days} half</span>
                              <button type="button" onClick={() => handleUpdateStaffHalfDays(st, 1)} style={{ width: '22px', height: '22px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: 'white' }}>+</button>
                            </div>

                            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#27ae60', marginTop: '5px' }}>
                              Net Payable: ₹{Math.round(breakdown.netPayable).toLocaleString()}
                            </div>

                            <div style={{ display: 'flex', gap: '6px', marginTop: '5px' }}>
                              <button 
                                type="button" 
                                onClick={() => handleOpenSlipModal(st)}
                                style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #27ae60', color: '#27ae60', cursor: 'pointer', background: 'white', display: 'flex', alignItems: 'center', gap: '3px' }}
                              >
                                <Icons.Ticket size={11} /> Slip
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleOpenEditStaff(st)}
                                style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #ccc', color: '#595959', cursor: 'pointer', background: 'white' }}
                              >
                                Edit
                              </button>
                              <button 
                                type="button" 
                                onClick={() => handleDeleteStaff(st.id)}
                                style={{ padding: '4px 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid red', color: 'red', cursor: 'pointer', background: 'white' }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </section>
        ) : currentView === 'finance' ? (
          <section className="fade-in" style={{ paddingBottom: '40px' }}>
            {/* Header Banner */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '20px 30px', 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
              marginBottom: '25px',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icons.TrendingUp size={24} style={{ color: 'var(--primary-medium)' }} />
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-deep)', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                    Business Intelligence & Ledger 📈
                  </h2>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>
                  Review campsite profitability charts and download CSV datasets
                </p>
              </div>

              {/* Time Range Selector */}
              <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f2f2f2', padding: '4px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <button type="button" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: 'transparent', color: 'var(--light-text)' }}>Last 7 Days</button>
                <button type="button" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: '700', backgroundColor: 'white', color: 'var(--primary-deep)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>Last 30 Days</button>
                <button type="button" style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: 'transparent', color: 'var(--light-text)' }}>Year to Date</button>
              </div>
            </div>

            {/* Calculations & Metrics */}
            {(() => {
              const stayInc = stats.breakdown?.stay || 0;
              const cafeInc = stats.breakdown?.cafe || 0;
              const passInc = stats.breakdown?.passes || 0;
              const trekInc = stats.breakdown?.treks || 0;
              
              const totalInflow = stayInc + cafeInc + passInc + trekInc;
              
              const staffWages = staffList.reduce((sum, st) => sum + getStaffPayableBreakdown(st).netPayable, 0);
              const foodExpense = 8900;
              const upkeepExpense = 5500;
              const totalOutflow = staffWages + foodExpense + upkeepExpense;
              const netProfit = totalInflow - totalOutflow;
              
              const margin = totalInflow > 0 ? Math.round((netProfit / totalInflow) * 100) : 0;
              const projectedMargin = (netProfit * 1.15);

              // Donut calculations
              const stayPct = totalInflow > 0 ? Math.round((stayInc / totalInflow) * 100) : 0;
              const cafePct = totalInflow > 0 ? Math.round((cafeInc / totalInflow) * 100) : 0;
              const passPct = totalInflow > 0 ? Math.round((passInc / totalInflow) * 100) : 0;
              const trekPct = totalInflow > 0 ? Math.round((trekInc / totalInflow) * 100) : 0;

              return (
                <>
                  {/* Financial Overview Cards Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CONSOLIDATED INFLOW</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '5px', color: 'var(--primary-deep)' }}>₹{Math.round(totalInflow).toLocaleString()}</div>
                      <span style={{ display: 'inline-block', backgroundColor: '#e2f0d9', color: '#385723', fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', marginTop: '8px' }}>
                        ↗ +14.2% Month-over-Month
                      </span>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>OUTFLOW EXPENDITURE</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '5px', color: 'var(--primary-deep)' }}>₹{Math.round(totalOutflow).toLocaleString()}</div>
                      <span style={{ display: 'inline-block', color: 'var(--light-text)', fontSize: '0.72rem', fontWeight: '600', marginTop: '8px' }}>
                        Within monthly budget logs
                      </span>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>NET OPERATIVE PROFIT</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '5px', color: netProfit >= 0 ? '#27ae60' : 'red' }}>
                        {netProfit < 0 ? '-' : ''}₹{Math.abs(Math.round(netProfit)).toLocaleString()}
                      </div>
                      <span style={{ display: 'inline-block', backgroundColor: netProfit >= 0 ? '#e2f0d9' : '#fce4d6', color: netProfit >= 0 ? '#385723' : '#c65911', fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', marginTop: '8px' }}>
                        Margin: {margin}% profitable
                      </span>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>PROJECTED PROFIT MARGIN</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '5px', color: projectedMargin >= 0 ? '#27ae60' : 'red' }}>
                        {projectedMargin < 0 ? '-' : ''}₹{Math.abs(Math.round(projectedMargin)).toLocaleString()}
                      </div>
                      <span style={{ display: 'inline-block', backgroundColor: '#eae6ff', color: '#5f27cd', fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', marginTop: '8px' }}>
                        ⚡ +15% Peak Monsoon forecast
                      </span>
                    </div>
                  </div>

                  {/* Revenue share donut chart and Ledger Expenses */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px', marginBottom: '25px' }}>
                    {/* Donut Chart */}
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '18px' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-deep)', margin: '0 0 5px 0' }}>Campsite Segment Revenue Share</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '0 0 25px 0' }}>Contribution analysis of Stay bookings vs. Cafe POS vs. Entrance passes</p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                        {/* SVG Circular Donut Chart */}
                        <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                          <svg width="150" height="150" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#d3d3d3" strokeWidth="3"></circle>
                            {/* Segment 1: Stays */}
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#27ae60" strokeWidth="4" strokeDasharray={`${stayPct} ${100 - stayPct}`} strokeDashoffset="0"></circle>
                            {/* Segment 2: Cafe (stacked offset) */}
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2ecc71" strokeWidth="4" strokeDasharray={`${cafePct} ${100 - cafePct}`} strokeDashoffset={`-${stayPct}`}></circle>
                            {/* Segment 3: Passes (stacked offset) */}
                            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#a0522d" strokeWidth="4" strokeDasharray={`${passPct} ${100 - passPct}`} strokeDashoffset={`-${stayPct + cafePct}`}></circle>
                          </svg>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.62rem', color: 'var(--light-text)', fontWeight: '700', textTransform: 'uppercase' }}>TOTAL REVENUE</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-deep)', marginTop: '2px' }}>₹{Math.round(totalInflow).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Legend breakdown list */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#27ae60', display: 'inline-block' }}></span>
                              <span>Campground Stay Reservations</span>
                            </div>
                            <span style={{ fontWeight: '700' }}>₹{Math.round(stayInc).toLocaleString()} ({stayPct}%)</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#2ecc71', display: 'inline-block' }}></span>
                              <span>Woodland Cafe Sales</span>
                            </div>
                            <span style={{ fontWeight: '700' }}>₹{Math.round(cafeInc).toLocaleString()} ({cafePct}%)</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#a0522d', display: 'inline-block' }}></span>
                              <span>Day Visitor Entrance Passes</span>
                            </div>
                            <span style={{ fontWeight: '700' }}>₹{Math.round(passInc).toLocaleString()} ({passPct}%)</span>
                          </div>

                          {trekInc > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f39c12', display: 'inline-block' }}></span>
                                <span>Trekking Package Bookings</span>
                              </div>
                              <span style={{ fontWeight: '700' }}>₹{Math.round(trekInc).toLocaleString()} ({trekPct}%)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Ledger Expense Breakdown */}
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-deep)', margin: '0 0 5px 0' }}>Ledger Expense Breakdown</h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '0 0 25px 0' }}>Comparison of operations cost: Staff wages vs. Food Stock inventory vs. General Maintenance</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: '600' }}>
                              <span>Staff Salaries & Allowances</span>
                              <span>₹{Math.round(staffWages).toLocaleString()}</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: '60%', height: '100%', backgroundColor: 'red' }}></div>
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: '600' }}>
                              <span>Food & Kitchen Raw Inventory Reorder</span>
                              <span>₹{Math.round(foodExpense).toLocaleString()}</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: '40%', height: '100%', backgroundColor: 'orange' }}></div>
                            </div>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px', fontWeight: '600' }}>
                              <span>Campground Upkeep & Fuel Electricity</span>
                              <span>₹{Math.round(upkeepExpense).toLocaleString()}</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: '25%', height: '100%', backgroundColor: '#a0522d' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Warnings / Insights Box */}
                      <div style={{ backgroundColor: '#fff5f5', border: '1px solid #ffe3e3', padding: '12px 18px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '15px' }}>
                        <Icons.TrendingUp size={16} style={{ color: 'red', marginTop: '2px' }} />
                        <div style={{ fontSize: '0.78rem', color: '#c53030', lineHeight: '1.4' }}>
                          <strong>Expenditure Insight:</strong> Raw food reordering costs rose <strong>4%</strong> this week due to premium organic syrup imports. Maintain strict POS pricing limits to protect cafe profitability margins.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Centralized CSV download block */}
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-deep)', margin: '15px 0' }}>Download Centralized CSV Datasets</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Card 1 */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: '800', color: 'var(--primary-deep)' }}>Stay Bookings CSV</h4>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.82rem', color: 'var(--light-text)' }}>Guests details, nights, stay totals, and check-in statuses.</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleDownloadStayCSV}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: '1px solid #27ae60', 
                    color: '#27ae60', 
                    backgroundColor: '#fff', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.82rem'
                  }}
                >
                  <Icons.ArrowDownToLine size={13} /> Download Stay Dataset
                </button>
              </div>

              {/* Card 2 */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: '800', color: 'var(--primary-deep)' }}>Cafe POS Bills CSV</h4>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.82rem', color: 'var(--light-text)' }}>Fulfillments, raw subtotals, item aggregates, and payment methods.</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleDownloadCafeCSV}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: '1px solid #27ae60', 
                    color: '#27ae60', 
                    backgroundColor: '#fff', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.82rem'
                  }}
                >
                  <Icons.ArrowDownToLine size={13} /> Download Cafe Sales
                </button>
              </div>

              {/* Card 3 */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: '800', color: 'var(--primary-deep)' }}>Financial Ledger CSV</h4>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.82rem', color: 'var(--light-text)' }}>Chronological ledger entries, categories, totals, and descriptions.</p>
                </div>
                <button 
                  type="button" 
                  onClick={handleDownloadLedgerCSV}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: '8px', 
                    border: '1px solid #27ae60', 
                    color: '#27ae60', 
                    backgroundColor: '#fff', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.82rem'
                  }}
                >
                  <Icons.ArrowDownToLine size={13} /> Download Ledger CSV
                </button>
              </div>
            </div>
          </section>
        ) : currentView === 'control_deck' ? (
          <section className="fade-in" style={{ paddingBottom: '40px' }}>
            <div className="control-deck-wrapper" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '30px', alignItems: 'start' }}>
              
              {/* SIDEBAR NAVIGATION PANEL */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ paddingBottom: '15px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--light-text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>BACKOFFICE CONTROL DECK</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'forest_ai', label: 'Forest AI', icon: Icons.Compass },
                    { id: 'guests', label: 'Guest Directory', icon: Icons.Users },
                    { id: 'ledger', label: 'Finance Ledger', icon: Icons.BookOpen },
                    { id: 'updates', label: 'System Updates', icon: Icons.Bell, badge: 2 },
                    { id: 'share', label: 'Share & QR Codes', icon: Icons.QrCode },
                    { id: 'settings', label: 'General Settings', icon: Icons.Settings }
                  ].map(tab => {
                    const isSelected = deckSubTab === tab.id;
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setDeckSubTab(tab.id);
                          if (tab.id === 'forest_ai') setAiResponseText('');
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 18px',
                          borderRadius: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          fontWeight: isSelected ? '700' : '600',
                          backgroundColor: isSelected ? 'var(--primary-medium)' : 'transparent',
                          color: isSelected ? 'white' : 'var(--primary-deep)',
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <TabIcon size={16} />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge && (
                          <span style={{ 
                            backgroundColor: isSelected ? 'white' : 'red', 
                            color: isSelected ? 'red' : 'white', 
                            fontSize: '0.72rem', 
                            fontWeight: '800', 
                            padding: '1px 6px', 
                            borderRadius: '10px' 
                          }}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT SIDE PANEL DETAILS */}
              <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', minHeight: '520px', backgroundColor: 'white' }}>
                
                {deckSubTab === 'forest_ai' ? (
                  /* FOREST AI ASSISTANT */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-deep)' }}>Forest AI Assistant</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--light-text)' }}>1-Click campsite intelligence powered by Gemini 2.5</span>
                      </div>
                      <span style={{ backgroundColor: '#e2f0d9', color: '#385723', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                        ● Live DB Sync
                      </span>
                    </div>

                    {/* AI Grid Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                      {[
                        { id: 'operations', label: "Today's Operations Summary", desc: '1-Click Full Daily Digest', color: '#e2f0d9', text: '#385723', icon: Icons.Compass },
                        { id: 'revenue', label: "Today's Revenue Report", desc: '1-Click Income Insights', color: '#eef6f6', text: '#008080', icon: Icons.TrendingUp },
                        { id: 'stock', label: 'Low Stock & Reorder Alert', desc: '1-Click Inventory Check', color: '#fffcf0', text: '#b2a100', icon: Icons.AlertTriangle },
                        { id: 'guests', label: 'Guest Occupancy Today', desc: '1-Click Stay Status', color: '#eef6f6', text: '#008080', icon: Icons.Users },
                        { id: 'profit', label: 'Monthly Profit Comparison', desc: '1-Click June vs July Ledger', color: '#f6f0ff', text: '#5f27cd', icon: Icons.BarChart2 },
                        { id: 'forecast', label: 'Weekend Occupancy Forecast', desc: '1-Click Yield & Demand AI', color: '#eef6f6', text: '#008080', icon: Icons.Calendar },
                        { id: 'instagram', label: 'Instagram Promo Post', desc: '1-Click Marketing Writer', color: '#fff5f5', text: '#c53030', icon: Icons.Pencil },
                        { id: 'reminders', label: 'Pending Payment Reminders', desc: '1-Click Balance Check', color: '#f2f2f2', text: '#595959', icon: Icons.Mail }
                      ].map(card => {
                        const CardIcon = card.icon;
                        return (
                          <div 
                            key={card.id}
                            onClick={() => handleTriggerAIAction(card.id)}
                            style={{ 
                              padding: '16px', 
                              borderRadius: '16px', 
                              border: `1px solid ${card.color}`, 
                              cursor: 'pointer',
                              backgroundColor: 'white',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.01)',
                              transition: 'all 0.2s ease',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                              <span style={{ backgroundColor: card.color, color: card.text, padding: '4px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                                <CardIcon size={14} />
                              </span>
                              <span style={{ fontSize: '0.68rem', backgroundColor: '#f2f2f2', padding: '2px 6px', borderRadius: '4px', color: '#555', fontWeight: '700' }}>1-Click</span>
                            </div>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--primary-deep)', margin: '0 0 4px 0' }}>{card.label}</h4>
                            <span style={{ fontSize: '0.72rem', color: 'var(--light-text)' }}>{card.desc}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* AI Response Output */}
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-deep)' }}>Forest AI Response</span>
                        {aiResponseText && (
                          <button 
                            type="button" 
                            onClick={() => {
                              navigator.clipboard.writeText(aiResponseText);
                              alert('Answer copied to clipboard!');
                            }}
                            style={{ padding: '6px 12px', fontSize: '0.75rem', border: '1px solid #27ae60', color: '#27ae60', backgroundColor: 'white', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}
                          >
                            Copy Answer
                          </button>
                        )}
                      </div>
                      
                      <div style={{ 
                        width: '100%', 
                        minHeight: '140px', 
                        backgroundColor: '#fafafa', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(0,0,0,0.06)', 
                        padding: '18px',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        lineHeight: '1.5',
                        color: 'var(--primary-deep)',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {aiResponseText || '👋 Welcome to Forest AI! Click any 1-Click Action above for instant real-time campsite insights powered by Gemini.'}
                      </div>
                    </div>
                  </div>

                ) : deckSubTab === 'guests' ? (
                  /* GUEST DIRECTORY */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-deep)' }}>Campsite Guest Directory</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--light-text)' }}>Analyze user loyalty index, stay counts, and total spending records</span>
                    </div>

                    <input 
                      type="text" 
                      placeholder="Search loyal guest profiles by name or contact number..." 
                      value={searchGuestQuery} 
                      onChange={(e) => setSearchGuestQuery(e.target.value)}
                      className="filter-input"
                      style={{ padding: '10px 15px', fontSize: '0.85rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px', marginBottom: '10px' }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {[
                        { name: 'Ananya Sharma', phone: '9876543210', email: 'ananya@example.com', city: 'Mumbai', stays: 1, amount: 8400 },
                        { name: 'Kabir Malhotra', phone: '9988776655', email: 'kabir@example.com', city: 'Delhi', stays: 1, amount: 13500 },
                        { name: 'Priyanka Patel', phone: '9123456789', email: 'priyanka@example.com', city: 'Ahmedabad', stays: 1, amount: 9000 },
                        { name: 'Amit Verma', phone: '9811223344', email: 'amit.verma@example.com', city: 'Bangalore', stays: 1, amount: 2800 },
                        { name: 'Riya Sen', phone: '9566778899', email: 'riya.sen@example.com', city: 'Kolkata', stays: 1, amount: 3000 },
                        { name: 'Siddharth Rao', phone: '9345678901', email: 'sid.rao@example.com', city: 'Hyderabad', stays: 1, amount: 18000 }
                      ]
                        .filter(g => g.name.toLowerCase().includes(searchGuestQuery.toLowerCase()) || g.phone.includes(searchGuestQuery))
                        .map((g, idx) => (
                          <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '800', color: 'var(--primary-deep)' }}>{g.name}</h4>
                              <div style={{ fontSize: '0.78rem', color: 'var(--light-text)' }}>{g.phone} &bull; {g.city}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--light-text)', marginTop: '2px' }}>{g.email}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ backgroundColor: '#e2f0d9', color: '#385723', padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: '800' }}>New Camper</span>
                              <div style={{ fontSize: '0.85rem', fontWeight: '700', marginTop: '5px' }}>{g.stays} Stay(s)</div>
                              <strong style={{ fontSize: '1rem', color: 'var(--primary-deep)' }}>₹{g.amount.toLocaleString()}</strong>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                ) : deckSubTab === 'ledger' ? (
                  /* FINANCE LEDGER */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-deep)' }}>Double Entry Finance Ledger</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--light-text)' }}>Record off-site expenditures and log cafe food raw ingredient purchases</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => alert('Log entry dialog popped up!')}
                        style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: 'var(--primary-deep)', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                      >
                        + Log Entry
                      </button>
                    </div>

                    {/* Double Entry Roster list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { title: 'Monthly booking revenue (June 2026)', date: '2026-06-30', cat: 'Bookings', amount: '+ ₹48,000', color: 'green', bg: '#e2f0d9' },
                        { title: 'Monthly cafe sales (June 2026)', date: '2026-06-30', cat: 'Cafe', amount: '+ ₹18,500', color: 'green', bg: '#e2f0d9' },
                        { title: 'Monthly gate entries (June 2026)', date: '2026-06-30', cat: 'Visitor Entry', amount: '+ ₹12,400', color: 'green', bg: '#e2f0d9' }
                      ].map((led, idx) => (
                        <div key={idx} className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.03)' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ backgroundColor: led.bg, color: led.color, padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: '800' }}>Income</span>
                              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '800', color: 'var(--primary-deep)' }}>{led.title}</h4>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: 'var(--light-text)', display: 'block', marginTop: '4px' }}>{led.date} &bull; Category: {led.cat}</span>
                          </div>
                          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'green' }}>{led.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                ) : deckSubTab === 'updates' ? (
                  /* SYSTEM UPDATES */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-deep)' }}>Campsite Updates Log</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--light-text)' }}>System updates for booking check-ins and cafe order logs</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => alert('Log cleared!')}
                        style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'white', border: '1px solid #27ae60', color: '#27ae60', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        Clear All Updates
                      </button>
                    </div>

                    {/* Alerts Log List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { title: 'Hardwood BBQ Coal (i-04) is down to 4 kg. Minimum required is 10 kg.', ref: 'Ref: n-01', date: '2026-07-20 06:00', border: '1px solid #ffeeba', bg: '#fffcf0' },
                        { title: 'Riya Sen confirmed stay in Tent (FSB-2026-005)', ref: 'Ref: n-02', date: '2026-07-19', border: '1px solid rgba(0,0,0,0.04)', bg: '#fafafa' },
                        { title: 'Booking FSB-2026-004 (Amit Verma) check-in today, balance amount ₹2,800 is pending.', ref: 'Ref: n-03', date: '2026-07-20 08:00', border: '1px solid #ffeeba', bg: '#fffcf0' }
                      ].map((upd, idx) => (
                        <div key={idx} className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: upd.border, backgroundColor: upd.bg }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <span style={{ backgroundColor: 'white', padding: '6px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.06)' }}>
                              <Icons.Bell size={13} style={{ color: 'green' }} />
                            </span>
                            <div>
                              <h5 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-deep)' }}>{upd.title}</h5>
                              <span style={{ fontSize: '0.75rem', color: 'var(--light-text)' }}>{upd.ref}</span>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--light-text)' }}>{upd.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                ) : deckSubTab === 'share' ? (
                  /* SHARE & QR CODES */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-deep)' }}>Campsite Share & QR Codes</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--light-text)' }}>Printable quick response codes for easy campsite onboarding</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', textAlign: 'center' }}>
                      <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px' }}>
                        <Icons.QrCode size={48} style={{ color: 'var(--primary-medium)', margin: '0 auto 10px auto' }} />
                        <h4 style={{ margin: '0 0 5px 0' }}>Visitor Pass QR</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '0 0 15px 0' }}>Scan at the entry gate check-in point</p>
                        <button type="button" style={{ padding: '6px 12px', fontSize: '0.78rem', border: '1px solid var(--primary-light)', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>Print Label</button>
                      </div>

                      <div className="glass-panel" style={{ padding: '24px', borderRadius: '15px' }}>
                        <Icons.QrCode size={48} style={{ color: 'var(--primary-medium)', margin: '0 auto 10px auto' }} />
                        <h4 style={{ margin: '0 0 5px 0' }}>Woodland Cafe Menu</h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '0 0 15px 0' }}>Digital ordering catalog for guests</p>
                        <button type="button" style={{ padding: '6px 12px', fontSize: '0.78rem', border: '1px solid var(--primary-light)', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>Print Label</button>
                      </div>
                    </div>
                  </div>

                ) : (
                  /* GENERAL SETTINGS */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-deep)' }}>General Settings</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--light-text)' }}>Backoffice operational properties & parameters</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                        <div>
                          <strong style={{ fontSize: '0.88rem' }}>Database Automatic Backup</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--light-text)' }}>Sync schema to local backup daily</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                        <div>
                          <strong style={{ fontSize: '0.88rem' }}>Email Operational Alerts</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--light-text)' }}>Receive restock notifications on mary@foreststay.in</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </section>
        ) : null
      )}


      {/* -------------------- CUSTOMER PORTAL MODE -------------------- */}
      {viewMode === 'customer' && (
        <section className="grid-2 fade-in" style={{ alignItems: 'flex-start', marginBottom: '80px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Pass Buyer */}
            <div className="form-card">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ticket size={20} style={{ color: 'var(--gold-accent)' }} /> Buy Visitor Entry Day Pass
              </h2>
              {feedbackMsg && (
                <div className={`alert alert-${feedbackMsg.type}`} style={{ fontSize: '0.85rem' }}>
                  {feedbackMsg.text}
                </div>
              )}
              <form onSubmit={handleBuyPass} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label>Visitor Contact Name</label>
                  <input 
                    type="text" 
                    value={passName} 
                    onChange={(e) => setPassName(e.target.value)} 
                    placeholder="e.g. John Doe"
                    className="form-input" 
                    required 
                  />
                </div>
                <div className="grid-2" style={{ gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label>Pass Category</label>
                    <select 
                      value={passType} 
                      onChange={(e) => setPassType(e.target.value)} 
                      className="form-input"
                      style={{ background: '#fff' }}
                    >
                      <option value="adult">Adult (₹150)</option>
                      <option value="child">Child (₹75)</option>
                      <option value="foreigner">Foreigner (₹500)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>No. of Tickets</label>
                    <input 
                      type="number" 
                      value={passQty} 
                      onChange={(e) => setPassQty(parseInt(e.target.value))} 
                      className="form-input" 
                      min="1" 
                      required 
                    />
                  </div>
                </div>
                <div style={{ padding: '10px', backgroundColor: 'var(--sage-mist)', borderRadius: '8px', textAlign: 'center', fontWeight: '700' }}>
                  Total Bill: ₹{passPrices[passType] * passQty}
                </div>
                <button type="submit" className="btn btn-primary">Generate Entry Pass</button>
              </form>
            </div>

            {/* Trek Booking Form */}
            <div className="form-card">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} style={{ color: 'teal' }} /> Book Guided Nature Trek
              </h2>
              <form onSubmit={handleBookTrek} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                  <label>Select Expedition</label>
                  <select 
                    value={selectedTrek} 
                    onChange={(e) => setSelectedTrek(e.target.value)} 
                    className="form-input"
                    style={{ background: '#fff' }}
                  >
                    {treksCatalog.map(t => (
                      <option key={t.id} value={t.id}>{t.title} (${t.price}/person)</option>
                    ))}
                  </select>
                </div>
                <div className="grid-2" style={{ gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label>Expedition Date</label>
                    <input 
                      type="date" 
                      value={trekDate} 
                      onChange={(e) => setTrekDate(e.target.value)} 
                      className="form-input" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Participants</label>
                    <input 
                      type="number" 
                      value={trekGuests} 
                      onChange={(e) => setTrekGuests(parseInt(e.target.value))} 
                      className="form-input" 
                      min="1" 
                      required 
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'teal', color: 'white' }}>Book Guide & Slot</button>
              </form>
            </div>

          </div>

          {/* User Travel Ledger (Stays and Treks summaries) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div className="glass-panel" style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>My Stays Ledger</h2>
              {myBookings.length === 0 ? (
                <p style={{ color: 'var(--light-text)' }}>No stays reserved yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {myBookings.map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
                      <div>
                        <h4 style={{ fontWeight: '600' }}>{b.cabin_name}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--light-text)' }}>{new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary-medium)' }}>₹{parseFloat(b.total_price).toFixed(2)}</span>
                        {b.status === 'confirmed' && (
                          <button onClick={() => handleCancelBooking(b.id)} style={{ display: 'block', fontSize: '0.7rem', color: 'red', background: 'none', border: 'none', cursor: 'pointer', marginTop: '3px' }}>Cancel</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>My Trekking Bookings</h2>
              {myTreks.length === 0 ? (
                <p style={{ color: 'var(--light-text)' }}>No treks booked yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {myTreks.map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
                      <div>
                        <h4 style={{ fontWeight: '600' }}>{t.title}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--light-text)' }}>Date: {new Date(t.date).toLocaleDateString()} &bull; Guide: {t.guide}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: '700', color: 'var(--primary-medium)' }}>₹{t.total}</span>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'green', fontWeight: '600' }}>Confirmed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </section>
      )}
      </div> {/* Close container */}


      {/* -------------------- BACKOFFICE OVERLAY MODALS -------------------- */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => { setActiveModal(null); setFeedbackMsg(null); }}>
          
          {/* MODAL 1: STAY BOOKINGS MANAGER */}
          {activeModal === 'stays' && (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Stay Bookings & Occupancy Manager</h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <h4 style={{ marginBottom: '15px' }}>Active Registrations</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  {allBookings.map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--cream-base)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.04)' }}>
                      <div>
                        <h5 style={{ fontSize: '0.95rem', fontWeight: '600' }}>{b.cabin_name}</h5>
                        <p style={{ fontSize: '0.78rem', color: 'var(--light-text)' }}>Guest: {b.user_name} &bull; Dates: {new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}</p>
                      </div>
                      <div>
                        {b.status === 'confirmed' ? (
                          <button onClick={() => handleCheckoutGuest(b.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Check Out</button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--light-text)' }}>Cancelled</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
                  <h4 style={{ marginBottom: '15px' }}>Add Stay Inventory Unit</h4>
                  {feedbackMsg && <div className="alert alert-success">{feedbackMsg.text}</div>}
                  <form onSubmit={handleAddCabin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" placeholder="Cabin/Tent Name" value={cabinForm.name} onChange={(e) => setCabinForm({ ...cabinForm, name: e.target.value })} className="form-input" required />
                    <input type="text" placeholder="Location" value={cabinForm.location} onChange={(e) => setCabinForm({ ...cabinForm, location: e.target.value })} className="form-input" required />
                    <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input type="number" placeholder="Price/night" value={cabinForm.price_per_night} onChange={(e) => setCabinForm({ ...cabinForm, price_per_night: e.target.value })} className="form-input" required />
                      <input type="number" placeholder="Max Guests" value={cabinForm.max_guests} onChange={(e) => setCabinForm({ ...cabinForm, max_guests: e.target.value })} className="form-input" required />
                    </div>
                    <input type="url" placeholder="Image URL" value={cabinForm.image_url} onChange={(e) => setCabinForm({ ...cabinForm, image_url: e.target.value })} className="form-input" required />
                    <textarea placeholder="Description" value={cabinForm.description} onChange={(e) => setCabinForm({ ...cabinForm, description: e.target.value })} className="form-input" rows="2" required></textarea>
                    <button type="submit" className="btn btn-primary">Create Unit</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* MODAL 2: CAFE POS QUICK BILLING */}
          {activeModal === 'cafe' && (
            <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Cafe Point-Of-Sale Terminal</h3>
                <button onClick={() => { setActiveModal(null); setFeedbackMsg(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body grid-2" style={{ gap: '20px' }}>
                {/* Menu list */}
                <div>
                  <h4 style={{ marginBottom: '15px' }}>Food & Beverage Menu</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {cafeMenu.map(menu => (
                      <div key={menu.id} onClick={() => addToCart(menu)} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9f9f9', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer', transition: '0.2s ease' }} className="menu-item-tile">
                        <span style={{ fontWeight: '500' }}>{menu.name}</span>
                        <span style={{ color: 'var(--primary-medium)', fontWeight: '600' }}>₹{menu.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Cart */}
                <div style={{ borderLeft: '1px solid rgba(0,0,0,0.06)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '350px' }}>
                  <div>
                    <h4 style={{ marginBottom: '15px' }}>Billing Cart</h4>
                    {feedbackMsg && <div className="alert alert-success" style={{ fontSize: '0.8rem' }}>{feedbackMsg.text}</div>}
                    {cafeCart.length === 0 ? (
                      <p style={{ color: 'var(--light-text)', fontSize: '0.9rem' }}>Click items on the left to add to bill.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                        {cafeCart.map(cart => (
                          <div key={cart.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span>{cart.name} x {cart.qty}</span>
                            <span>
                              ₹{cart.price * cart.qty}{' '}
                              <button onClick={() => removeFromCart(cart.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '5px' }}>&times;</button>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px', marginTop: '15px' }}>
                      <span>Subtotal</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                    <button onClick={handleCheckoutPOS} className="btn btn-primary" style={{ width: '100%', marginTop: '15px', borderRadius: '8px' }} disabled={cafeCart.length === 0}>Generate Bill</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODAL 3: VISITOR DAY PASS TICKETS */}
          {activeModal === 'passes' && (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Visitor Day Pass Registry</h3>
                <button onClick={() => { setActiveModal(null); setFeedbackMsg(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body">
                {feedbackMsg && <div className="alert alert-success">{feedbackMsg.text}</div>}
                <form onSubmit={handleBuyPass} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group">
                    <label>Visitor Contact Name</label>
                    <input type="text" value={passName} onChange={(e) => setPassName(e.target.value)} placeholder="e.g. John Doe" className="form-input" required />
                  </div>
                  <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label>Pass Category</label>
                      <select value={passType} onChange={(e) => setPassType(e.target.value)} className="form-input" style={{ background: '#fff' }}>
                        <option value="adult">Adult (₹150)</option>
                        <option value="child">Child (₹75)</option>
                        <option value="foreigner">Foreigner (₹500)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input type="number" value={passQty} onChange={(e) => setPassQty(parseInt(e.target.value))} className="form-input" min="1" required />
                    </div>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: 'var(--sage-mist)', borderRadius: '8px', textAlign: 'center', fontWeight: '700' }}>
                    Total Bill: ₹{passPrices[passType] * passQty}
                  </div>
                  <button type="submit" className="btn btn-primary">Generate Pass</button>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 4: TREKKINGS & GUIDES */}
          {activeModal === 'treks' && (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Trekkings, Trails & Guides Registry</h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <h4 style={{ marginBottom: '15px' }}>Active Expeditions Catalog</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {treksCatalog.map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#f9f9f9', borderRadius: '8px' }}>
                      <div>
                        <h5 style={{ fontWeight: '600' }}>{t.title}</h5>
                        <p style={{ fontSize: '0.78rem', color: 'var(--light-text)' }}>Duration: {t.duration} &bull; Guide: {t.guide}</p>
                      </div>
                      <span style={{ fontWeight: '700', color: 'teal' }}>₹{t.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODAL 5: STAFF DUTY ROSTER */}
          {activeModal === 'staff' && (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Staff Attendance & Duty Shifts</h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--sage-mist)', borderBottom: '1px solid #ccc' }}>
                      <th style={{ padding: '12px' }}>Staff Name</th>
                      <th style={{ padding: '12px' }}>Role</th>
                      <th style={{ padding: '12px' }}>Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(st => (
                      <tr key={st.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontWeight: '500' }}>{st.name}</td>
                        <td style={{ padding: '12px' }}>{st.role}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: st.status === 'active' ? '#e2f0d9' : '#f2f2f2',
                            color: st.status === 'active' ? 'green' : '#777'
                          }}>{st.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODAL 6: INVENTORY STOCK CONTROL */}
          {activeModal === 'inventory' && (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Campsite supplies & Material Stock Levels</h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {inventoryList.map(inv => {
                    const isLow = parseFloat(inv.quantity) < parseFloat(inv.min_required);
                    const pct = Math.min(100, Math.round((parseFloat(inv.quantity) / (parseFloat(inv.min_required) * 2.5)) * 100));
                    return (
                      <div key={inv.id} style={{ padding: '15px', background: '#f9f9f9', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: isLow ? 'var(--error)' : 'var(--primary-deep)' }}>
                              {inv.item_name} ({inv.code})
                            </h4>
                            <span style={{ fontSize: '0.78rem', color: 'var(--light-text)' }}>
                              Current: {parseFloat(inv.quantity)}{inv.unit} (Min limit: {parseFloat(inv.min_required)}{inv.unit})
                            </span>
                          </div>
                          {isLow && (
                            <button onClick={() => handleRestockItem(inv.id)} className="btn btn-accent" style={{ padding: '5px 12px', fontSize: '0.75rem', borderRadius: '4px' }}>
                              Restock Supplies
                            </button>
                          )}
                        </div>
                        {/* Progress Bar visual representation of stock levels */}
                        <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: isLow ? 'red' : 'green', transition: 'width 0.5s ease' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODAL 7: PROFITABILITY INDEX */}
          {activeModal === 'profit' && (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Campsite Financial Performance</h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <h4 style={{ marginBottom: '15px' }}>Revenue Splits Dashboard</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                      <span>Stay Bookings Revenue (Campsites)</span>
                      <strong>₹{stats.breakdown.stay.toLocaleString()}</strong>
                    </div>
                    <div style={{ height: '12px', background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.todayIncome > 0 ? (stats.breakdown.stay / stats.todayIncome) * 100 : 0}%`, height: '100%', backgroundColor: '#385723' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                      <span>Cafe POS Billing Sales</span>
                      <strong>₹{stats.breakdown.cafe.toLocaleString()}</strong>
                    </div>
                    <div style={{ height: '12px', background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.todayIncome > 0 ? (stats.breakdown.cafe / stats.todayIncome) * 100 : 0}%`, height: '100%', backgroundColor: '#c65911' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                      <span>Visitor Entry Passes</span>
                      <strong>₹{stats.breakdown.passes.toLocaleString()}</strong>
                    </div>
                    <div style={{ height: '12px', background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.todayIncome > 0 ? (stats.breakdown.passes / stats.todayIncome) * 100 : 0}%`, height: '100%', backgroundColor: '#7030a0' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                      <span>Trek bookings</span>
                      <strong>₹{stats.breakdown.treks.toLocaleString()}</strong>
                    </div>
                    <div style={{ height: '12px', background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.todayIncome > 0 ? (stats.breakdown.treks / stats.todayIncome) * 100 : 0}%`, height: '100%', backgroundColor: 'teal' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODAL 8: SETTINGS CONFIGS */}
          {activeModal === 'settings' && (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Backoffice Configuration Settings</h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-deep)' }} />
                    <span>Enable live operations notifications radar sound warnings</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--primary-deep)' }} />
                    <span>Auto-alert inventory shortages below threshold metrics</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                    <input type="checkbox" style={{ accentColor: 'var(--primary-deep)' }} />
                    <span>Sync financials with master bank gateway portal logs</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* MODAL 9: VIEW ALL OPERATIONAL ALERTS */}
          {activeModal === 'alerts' && (
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Active Operations Desk alerts ({stats.alerts.length})</h3>
                <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div className="modal-body">
                {stats.alerts.length === 0 ? (
                  <p style={{ color: 'var(--light-text)' }}>All systems normal. No pending warnings.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stats.alerts.map((al, idx) => (
                      <div key={idx} style={{ padding: '12px 16px', backgroundColor: '#fff9f6', border: '1px solid #ffd8c4', color: '#c65911', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={18} /> <span>{al}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ADD NEW CAFE ITEM MODAL */}
      {addCafeItemOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setAddCafeItemOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '24px', padding: '30px', backgroundColor: 'white', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: '#e2f0d9', color: '#385723', padding: '10px', borderRadius: '50%', display: 'flex' }}>
                  <PlusCircle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-deep)', margin: 0, fontWeight: '700' }}>Add New Cafe Item</h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>Create new food, beverage, or dessert listing for POS</p>
                </div>
              </div>
              <button onClick={() => setAddCafeItemOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCafeItem} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-deep)' }}>Item Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Woodland Herbal Tea" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="form-input"
                  style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-deep)' }}>Price (₹) *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 120" 
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="form-input"
                    style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', fontSize: '0.9rem' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-deep)' }}>Category *</label>
                    <span style={{ fontSize: '0.72rem', color: '#27ae60', cursor: 'pointer', fontWeight: '700' }}>+ Custom Category</span>
                  </div>
                  <select 
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="form-input"
                    style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', fontSize: '0.9rem', background: 'white' }}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="bbq">BBQ</option>
                    <option value="beverages">Beverages</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-deep)' }}>Initial Stock (Qty) *</label>
                  <input 
                    type="number" 
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(e.target.value)}
                    className="form-input"
                    style={{ padding: '12px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', fontSize: '0.9rem' }}
                    required
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary-deep)' }}>Status</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500' }}>
                    <input 
                      type="checkbox" 
                      checked={newItemStatus}
                      onChange={(e) => setNewItemStatus(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#385723' }}
                    />
                    Available in Menu
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setAddCafeItemOpen(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#f2f2f2', border: 'none', color: '#595959', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer', backgroundColor: 'var(--primary-deep)', border: 'none', color: 'white' }}
                >
                  <Icons.Save size={16} /> Save Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      {logStayOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setLogStayOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '750px', borderRadius: '24px', padding: '30px', backgroundColor: 'white', border: 'none', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', margin: 0, fontWeight: '700' }}>Log New Backoffice Stay Booking</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>Create campground or room reservations on behalf of guest</p>
              </div>
              <button onClick={() => setLogStayOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStay} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Part 1: Guest Demographics */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-medium)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '6px', marginBottom: '12px' }}>Guest Demographics</h4>
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Full Guest Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Sen" 
                      value={stayGuestName} 
                      onChange={(e) => setStayGuestName(e.target.value)}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Contact Phone Number *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 9876543210" 
                      value={stayGuestPhone} 
                      onChange={(e) => setStayGuestPhone(e.target.value)}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                      required 
                    />
                  </div>
                </div>
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '12px' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. rahul@example.com" 
                      value={stayGuestEmail} 
                      onChange={(e) => setStayGuestEmail(e.target.value)}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>City of Origin</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mumbai" 
                      value={stayGuestCity} 
                      onChange={(e) => setStayGuestCity(e.target.value)}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Stay Unit & Schedule */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-medium)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '6px', marginBottom: '12px' }}>Stay Unit & Schedule</h4>
                <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '15px' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Stay Unit / Type</label>
                    <select 
                      value={stayCabinId} 
                      onChange={(e) => setStayCabinId(e.target.value)} 
                      className="form-input"
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: 'white' }}
                    >
                      <option value="1">Standard Tent (₹1,500/night)</option>
                      <option value="2">Premium Cottage (₹4,500/night)</option>
                      <option value="3">Fabricated Dome (₹3,000/night)</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Quantity of Units</label>
                    <input 
                      type="number" 
                      value={stayUnitsQty} 
                      onChange={(e) => setStayUnitsQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                      min="1" 
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Package Coupon</label>
                    <select 
                      value={stayCoupon} 
                      onChange={(e) => setStayCoupon(e.target.value)} 
                      className="form-input"
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: 'white' }}
                    >
                      <option value="none">None</option>
                      <option value="promo10">PROMO10 (10% off)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '12px', alignItems: 'center' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Check-in Date</label>
                    <input 
                      type="date" 
                      value={stayCheckIn} 
                      onChange={(e) => setStayCheckIn(e.target.value)}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Check-out Date</label>
                    <input 
                      type="date" 
                      value={stayCheckOut} 
                      onChange={(e) => setStayCheckOut(e.target.value)}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                      required
                    />
                  </div>
                  <div style={{ marginTop: '22px' }}>
                    <div style={{ padding: '10px 15px', backgroundColor: '#e2f0d9', color: '#385723', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', textAlign: 'center' }}>
                      COMPUTED DURATION: {durationNights} Night(s)
                    </div>
                  </div>
                </div>

                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '12px' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Adults Count</label>
                    <input 
                      type="number" 
                      value={stayAdults} 
                      onChange={(e) => setStayAdults(parseInt(e.target.value) || 2)}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                      min="1" 
                    />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Children Count</label>
                    <input 
                      type="number" 
                      value={stayChildren} 
                      onChange={(e) => setStayChildren(parseInt(e.target.value) || 0)}
                      className="form-input" 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                      min="0" 
                    />
                  </div>
                </div>
              </div>

              {/* Part 3: Adventure & Experience Add-ons */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-medium)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '6px', marginBottom: '12px' }}>Adventure & Experience Add-ons</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto', padding: '5px' }}>
                  {addonsCatalog.map(addon => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '15px',
                          border: isSelected ? '1px solid var(--primary-medium)' : '1px solid rgba(0,0,0,0.08)',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--primary-medium)' : 'transparent',
                          color: isSelected ? 'white' : 'var(--light-text)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {addon.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Part 4: Financial Log */}
              <div style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', background: 'var(--cream-base)' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary-medium)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '6px', marginBottom: '12px' }}>Financial Log</h4>
                
                <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '600' }}>Payment Method</label>
                    <select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                      className="form-input"
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}
                    >
                      <option value="upi">UPI QR code</option>
                      <option value="cash">Cash Payment</option>
                      <option value="card">Card swipe</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '600' }}>Log Payment Status</label>
                    <select 
                      value={paymentStatus} 
                      onChange={(e) => setPaymentStatus(e.target.value)} 
                      className="form-input"
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '600' }}>Advance Amount Paid (₹)</label>
                    <input 
                      type="number" 
                      value={advancePaid} 
                      onChange={(e) => setAdvancePaid(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="form-input" 
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }}
                    />
                  </div>
                </div>

                {/* Billing details breakdown list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--primary-deep)', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Base Accommodation ({getCabinName(stayCabinId)} x {stayUnitsQty} x {durationNights} nights)</span>
                    <span>₹{baseAccommodationPrice.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Add-ons / Activities Addons</span>
                    <span>₹{addonsTotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>GST (Simulated Tax 18%)</span>
                    <span>₹{Math.round(gstSimulated).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '6px', marginTop: '4px' }}>
                    <span>Total Billable Amount</span>
                    <span>₹{Math.round(totalAmountPrice).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem', color: 'red' }}>
                    <span>Outstanding Balance Due</span>
                    <span>₹{Math.round(outstandingDue).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Part 5: Notes & Proof */}
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Notes / Internal Comments</label>
                  <textarea 
                    placeholder="Provide guest requests/internal directions..." 
                    value={stayNotes}
                    onChange={(e) => setStayNotes(e.target.value)}
                    className="form-input"
                    style={{ padding: '10px', height: '90px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Upload ID Identification Proof (Simulated)</label>
                  <div style={{ border: '2px dashed rgba(0,0,0,0.08)', borderRadius: '8px', padding: '15px', textAlign: 'center', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fafafa', cursor: 'pointer' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--light-text)', fontWeight: '600' }}>Click to upload Passport / Aadhaar / DL</span>
                    <span style={{ fontSize: '0.62rem', color: 'var(--light-text)', marginTop: '4px' }}>Accepts PNG, JPG, PDF up to 4MB</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setLogStayOpen(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#f2f2f2', border: 'none', color: '#595959', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer', backgroundColor: 'var(--primary-deep)', border: 'none', color: 'white' }}
                >
                  <Icons.Save size={16} /> Save Booking
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ISSUE ENTRY PASS MODAL */}
      {issuePassOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setIssuePassOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '24px', padding: '30px', backgroundColor: 'white', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', margin: 0, fontWeight: '700' }}>Issue New Visitor Entry Pass</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>Issue day passes and calculate rates for walk-in guest entries</p>
              </div>
              <button onClick={() => setIssuePassOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePass} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Guest Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Rakesh Juneja" 
                  value={passGuestName} 
                  onChange={(e) => setPassGuestName(e.target.value)}
                  className="form-input" 
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                  required 
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Phone Number *</label>
                <input 
                  type="text" 
                  placeholder="e.g. 9898989898" 
                  value={passGuestPhone} 
                  onChange={(e) => setPassGuestPhone(e.target.value)}
                  className="form-input" 
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                  required 
                />
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Adults Count *</label>
                  <input 
                    type="number" 
                    value={passAdults} 
                    onChange={(e) => setPassAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-input" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                    min="1" 
                    required
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Children Count *</label>
                  <input 
                    type="number" 
                    value={passChildren} 
                    onChange={(e) => setPassChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    className="form-input" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                    min="0" 
                    required
                  />
                </div>
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Pass Category</label>
                  <select 
                    value={passCategory} 
                    onChange={(e) => setPassCategory(e.target.value)} 
                    className="form-input"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}
                  >
                    <option value="Adult Day Pass">Adult Day Pass (₹375)</option>
                    <option value="Child Day Pass">Child Day Pass (₹150)</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Cafe Coupon Code</label>
                  <select 
                    value={passCoupon} 
                    onChange={(e) => setPassCoupon(e.target.value)} 
                    className="form-input"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}
                  >
                    <option value="None">None</option>
                    <option value="CAFEMIN10">CAFEMIN10 (10% off Cafe)</option>
                  </select>
                </div>
              </div>

              {/* Price Calculation display box */}
              <div style={{ padding: '15px', borderRadius: '8px', backgroundColor: 'var(--cream-base)', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Adult Tickets ({passAdults} x ₹375)</span>
                  <span style={{ fontWeight: '600' }}>₹{passAdults * 375}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Child Tickets ({passChildren} x ₹150)</span>
                  <span style={{ fontWeight: '600' }}>₹{passChildren * 150}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.9rem', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '6px', marginTop: '6px', color: 'var(--primary-deep)' }}>
                  <span>Total Amount Due</span>
                  <span>₹{(passAdults * 375) + (passChildren * 150)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setIssuePassOpen(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#f2f2f2', border: 'none', color: '#595959', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer', backgroundColor: 'var(--primary-deep)', border: 'none', color: 'white' }}
                >
                  <Icons.Save size={16} /> Save Pass
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* INVENTORY ADD/EDIT MODAL */}
      {inventoryModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setInventoryModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px', borderRadius: '24px', padding: '30px', backgroundColor: 'white', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', margin: 0, fontWeight: '700' }}>
                  {inventoryFormId ? 'Edit Stock Item' : 'Add New Inventory Stock'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>
                  Update stock status, categories, units, and warning thresholds
                </p>
              </div>
              <button onClick={() => setInventoryModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveInventory} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Item Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Premium Coffee Beans" 
                  value={inventoryFormName} 
                  onChange={(e) => setInventoryFormName(e.target.value)}
                  className="form-input" 
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                  required 
                />
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Category</label>
                  <select 
                    value={inventoryFormCategory} 
                    onChange={(e) => setInventoryFormCategory(e.target.value)} 
                    className="form-input"
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}
                  >
                    <option value="Food">Food</option>
                    <option value="Beverages">Beverages</option>
                    <option value="BBQ Stock">BBQ Stock</option>
                    <option value="Camping Equipment">Camping Equipment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Measurement Unit</label>
                  <input 
                    type="text" 
                    placeholder="e.g. kg, units, liters" 
                    value={inventoryFormUnit} 
                    onChange={(e) => setInventoryFormUnit(e.target.value)}
                    className="form-input" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                    required 
                  />
                </div>
              </div>

              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Current Stock *</label>
                  <input 
                    type="number" 
                    value={inventoryFormStock} 
                    onChange={(e) => setInventoryFormStock(e.target.value)}
                    className="form-input" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                    min="0" 
                    step="any"
                    required
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Max Capacity *</label>
                  <input 
                    type="number" 
                    value={inventoryFormMaxStock} 
                    onChange={(e) => setInventoryFormMaxStock(e.target.value)}
                    className="form-input" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                    min="0.1" 
                    step="any"
                    required
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: '600' }}>Min Warn Limit *</label>
                  <input 
                    type="number" 
                    value={inventoryFormMinThreshold} 
                    onChange={(e) => setInventoryFormMinThreshold(e.target.value)}
                    className="form-input" 
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                    min="0" 
                    step="any"
                    required
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setInventoryModalOpen(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: '#f2f2f2', border: 'none', color: '#595959', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer', backgroundColor: 'var(--primary-deep)', border: 'none', color: 'white' }}
                >
                  <Icons.Save size={16} /> Save Stock Item
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT TREKKING PACKAGE MODAL */}
      {trekModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setTrekModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '24px', padding: '30px', backgroundColor: 'white', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', margin: 0, fontWeight: '700' }}>
                  {trekFormId ? 'Edit Trekking Package' : 'Add New Trekking Package'}
                </h3>
              </div>
              <button onClick={() => setTrekModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}>
                <Icons.X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTrek} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>TREK NAME *</label>
                <input 
                  type="text" 
                  value={trekFormTitle} 
                  onChange={(e) => setTrekFormTitle(e.target.value)} 
                  placeholder="e.g. Sunrise Peak Trail Trek"
                  className="form-input" 
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>CATEGORY</label>
                  <select 
                    value={trekFormCategory} 
                    onChange={(e) => setTrekFormCategory(e.target.value)}
                    className="form-input"
                    style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <option value="Sunrise Trek">Sunrise Trek</option>
                    <option value="Sunset Trek">Sunset Trek</option>
                    <option value="Forest Trail">Forest Trail</option>
                    <option value="Night Trek">Night Trek</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>PRICE PER PERSON (₹) *</label>
                  <input 
                    type="number" 
                    value={trekFormPrice} 
                    onChange={(e) => setTrekFormPrice(e.target.value)} 
                    placeholder="400"
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>DURATION</label>
                  <input 
                    type="text" 
                    value={trekFormDuration} 
                    onChange={(e) => setTrekFormDuration(e.target.value)} 
                    placeholder="e.g. 2 Hours"
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>DIFFICULTY</label>
                  <select 
                    value={trekFormDifficulty} 
                    onChange={(e) => setTrekFormDifficulty(e.target.value)}
                    className="form-input"
                    style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>MAX GROUP</label>
                  <input 
                    type="number" 
                    value={trekFormMaxGroup} 
                    onChange={(e) => setTrekFormMaxGroup(e.target.value)} 
                    placeholder="15"
                    className="form-input" 
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>DESCRIPTION</label>
                <textarea 
                  value={trekFormDescription} 
                  onChange={(e) => setTrekFormDescription(e.target.value)} 
                  placeholder="Details on trail highlights, safety equipment, meeting points..."
                  className="form-input"
                  style={{ height: '70px', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                <input 
                  type="checkbox" 
                  id="guideIncluded" 
                  checked={trekFormGuideIncluded} 
                  onChange={(e) => setTrekFormGuideIncluded(e.target.checked)} 
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="guideIncluded" style={{ fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  Certified Forest Guide Included in Package
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>ASSIGNED GUIDE</label>
                  <select 
                    value={trekFormGuideName} 
                    onChange={(e) => setTrekFormGuideName(e.target.value)}
                    className="form-input"
                    style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <option value="Arun Kumar">Arun Kumar</option>
                    <option value="Vijay Singh">Vijay Singh</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>STATUS</label>
                  <select 
                    value={trekFormStatus} 
                    onChange={(e) => setTrekFormStatus(e.target.value)}
                    className="form-input"
                    style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setTrekModalOpen(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#f2f2f2', border: 'none', color: '#595959', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: 'var(--primary-deep)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                >
                  {trekFormId ? 'Save Changes' : 'Create Trekking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT STAFF MEMBER MODAL */}
      {staffModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setStaffModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '24px', padding: '30px', backgroundColor: 'white', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', margin: 0, fontWeight: '700' }}>
                  {staffFormId ? 'Edit Staff Member' : 'Register New Staff Member'}
                </h3>
              </div>
              <button onClick={() => setStaffModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}>
                <Icons.X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>STAFF FULL NAME *</label>
                <input 
                  type="text" 
                  value={staffFormName} 
                  onChange={(e) => setStaffFormName(e.target.value)} 
                  placeholder="e.g. Arjun Mehta"
                  className="form-input" 
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>ROLE / DESIGNATION *</label>
                  <input 
                    type="text" 
                    value={staffFormRole} 
                    onChange={(e) => setStaffFormRole(e.target.value)} 
                    placeholder="e.g. Manager"
                    className="form-input" 
                    required
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>EMPLOYMENT TYPE</label>
                  <select 
                    value={staffFormType} 
                    onChange={(e) => setStaffFormType(e.target.value)}
                    className="form-input"
                    style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Temporary/Daily Wage">Temporary / Daily Wage</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>CONTACT PHONE</label>
                  <input 
                    type="text" 
                    value={staffFormPhone} 
                    onChange={(e) => setStaffFormPhone(e.target.value)} 
                    placeholder="9876543210"
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>CONTACT EMAIL</label>
                  <input 
                    type="email" 
                    value={staffFormEmail} 
                    onChange={(e) => setStaffFormEmail(e.target.value)} 
                    placeholder="name@foreststay.in"
                    className="form-input" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>RATING</label>
                  <select 
                    value={staffFormRating} 
                    onChange={(e) => setStaffFormRating(e.target.value)}
                    className="form-input"
                    style={{ background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Satisfactory">Satisfactory</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>SHIFT SHIFT</label>
                  <input 
                    type="text" 
                    value={staffFormShift} 
                    onChange={(e) => setStaffFormShift(e.target.value)} 
                    placeholder="e.g. Morning Shift"
                    className="form-input" 
                  />
                </div>
              </div>

              {staffFormType === 'Permanent' ? (
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>BASE MONTHLY SALARY (₹) *</label>
                  <input 
                    type="number" 
                    value={staffFormMonthlyBase} 
                    onChange={(e) => setStaffFormMonthlyBase(e.target.value)} 
                    className="form-input" 
                    required
                  />
                </div>
              ) : (
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>DAILY WAGE RATE (₹) *</label>
                  <input 
                    type="number" 
                    value={staffFormDailyRate} 
                    onChange={(e) => setStaffFormDailyRate(e.target.value)} 
                    className="form-input" 
                    required
                  />
                </div>
              )}

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>ASSIGNED OPERATIONAL TASKS</label>
                <textarea 
                  value={staffFormAssignedTasks} 
                  onChange={(e) => setStaffFormAssignedTasks(e.target.value)} 
                  placeholder="Scan entry pass codes / Guide trails..."
                  className="form-input"
                  style={{ height: '60px', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setStaffModalOpen(false)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#f2f2f2', border: 'none', color: '#595959', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn" 
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: 'var(--primary-deep)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                >
                  {staffFormId ? 'Save Changes' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SALARY SLIP & PAYROLL BREAKDOWN MODAL */}
      {payrollSlipModalOpen && selectedPayrollStaff && (() => {
        const breakdown = getStaffPayableBreakdown(selectedPayrollStaff);
        const isPermanent = selectedPayrollStaff.type === 'Permanent';
        const rateLabel = isPermanent ? 'Base Monthly Salary:' : 'Daily Wage Rate:';
        const rateValue = isPermanent ? selectedPayrollStaff.monthly_base : selectedPayrollStaff.daily_rate;
        
        // Dynamic calculations for preview
        const dailyRate = breakdown.dailyRate;
        const daysWorked = selectedPayrollStaff.days_worked || 0;
        const halfDays = selectedPayrollStaff.half_days || 0;
        const daysPay = dailyRate * daysWorked;
        const halfPay = Math.round(dailyRate / 2) * halfDays;
        const bonusVal = parseFloat(payrollBonus) || 0;
        const dedsVal = parseFloat(payrollDeductions) || 0;
        const computedPayable = daysPay + halfPay + bonusVal - dedsVal;

        return (
          <div className="modal-overlay" style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setPayrollSlipModalOpen(false)}>
            <div className="modal-content" style={{ maxWidth: '520px', borderRadius: '24px', padding: '30px', backgroundColor: 'white', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-deep)', margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icons.Ticket size={20} /> Salary Slip & Payroll Breakdown
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--light-text)', margin: '4px 0 0 0' }}>Forest Stay Campsite Staff Compensation</p>
                </div>
                <button onClick={() => setPayrollSlipModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--light-text)' }}>
                  <Icons.X size={20} />
                </button>
              </div>

              {/* Staff details row */}
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-deep)' }}>{selectedPayrollStaff.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--light-text)' }}>{selectedPayrollStaff.role} &bull; {selectedPayrollStaff.type}</span>
                </div>
                <span style={{ backgroundColor: '#e2f0d9', color: '#385723', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {selectedPayrollStaff.today_attendance || 'Present'}
                </span>
              </div>

              {/* Breakdown lists */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--light-text)' }}>{rateLabel}</span>
                  <span style={{ fontWeight: '700' }}>₹{Math.round(rateValue).toLocaleString()}</span>
                </div>
                {isPermanent && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--light-text)' }}>Daily Wage Rate (26 days/mo):</span>
                    <span style={{ fontWeight: '600' }}>₹{dailyRate}/day</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--light-text)' }}>Days Worked ({daysWorked} days):</span>
                  <span style={{ fontWeight: '700', color: '#27ae60' }}>+₹{daysPay.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--light-text)' }}>Half Days Worked ({halfDays} half days):</span>
                  <span style={{ fontWeight: '700', color: '#27ae60' }}>+₹{halfPay.toLocaleString()}</span>
                </div>

                {/* Adjustment Input rows */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                  <span style={{ color: 'var(--light-text)' }}>Bonus (₹):</span>
                  <input 
                    type="number" 
                    value={payrollBonus} 
                    onChange={(e) => setPayrollBonus(e.target.value)} 
                    style={{ width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem', textAlign: 'right' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                  <span style={{ color: 'var(--light-text)' }}>Deductions (₹):</span>
                  <input 
                    type="number" 
                    value={payrollDeductions} 
                    onChange={(e) => setPayrollDeductions(e.target.value)} 
                    style={{ width: '100px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem', textAlign: 'right', color: 'red' }}
                  />
                </div>
              </div>

              {/* Total Payable output */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '1.1rem', marginBottom: '25px', color: 'var(--primary-deep)' }}>
                <span>Net Calculated Payable:</span>
                <span style={{ color: '#27ae60', fontSize: '1.25rem' }}>₹{Math.round(computedPayable).toLocaleString()}</span>
              </div>

              {/* Log Button */}
              <button 
                type="button" 
                onClick={handleSaveSalarySlipExpense}
                style={{ 
                  width: '100%', 
                  padding: '14px', 
                  backgroundColor: 'var(--primary-deep)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Icons.Coins size={16} /> Log Salary Expense in Finance
              </button>
            </div>
          </div>
        );
      })()}

      {/* Style rule injection helper to support hover tiles */}


      <style>{`
        html {
          scroll-behavior: smooth;
        }
        .menu-item-tile:hover {
          background-color: var(--sage-mist) !important;
          transform: translateY(-1px);
        }
        .cafe-pos-layout {
          grid-template-columns: 1.6fr 1fr;
        }
        @media (max-width: 900px) {
          .cafe-pos-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;