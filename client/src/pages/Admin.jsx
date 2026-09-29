import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Car, Tags, Award, ShoppingBag, ShoppingCart, Users, Calendar, 
  Wrench, Users2, BatteryCharging, DollarSign, BarChart3, Megaphone, Star, 
  Bell, Image as ImageIcon, Globe, FileSpreadsheet, Settings, User, LogOut,
  ChevronLeft, ChevronRight, Search, Plus, Trash2, Edit, Check, Download,
  Filter, AlertCircle, Clock, Zap, Shield, HelpCircle, HardDrive, RefreshCw,
  Folder, Play, Info, CheckCircle2, X, PlusCircle, ArrowUpRight, Copy, Eye, Menu,
  Terminal, ShieldCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import ErrorBoundary from '../components/ErrorBoundary';

// Import real store products from client data folder
import { storeProducts as clientStoreProducts } from '../data/storeProducts';

export default function Admin() {
  const { user, token, loading, logout } = useContext(AuthContext);
  const { cars, fetchCars, addNotification } = useContext(AppContext);
  const navigate = useNavigate();

  // Collapsible Sidebar State
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Selected Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Role Switcher for Role-Based Access Control (RBAC)
  const [activeRole, setActiveRole] = useState('Admin'); // Admin, Manager, Sales Executive, Finance, Mechanic, Customer Support

  // Theme State: 'dark' (luxury matte black) or 'light' (platinum white)
  const [dashboardTheme, setDashboardTheme] = useState('dark');

  // Interactive UI States
  const [activeHoverIdx, setActiveHoverIdx] = useState(null);
  const [realLifeTime, setRealLifeTime] = useState(new Date().toLocaleTimeString('en-US'));

  // Live database updates polling
  const [bookings, setBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);

  // Live Telemetry Event Logs (Streaming real-life time console events)
  const [liveLogs, setLiveLogs] = useState([]);

  // Notification dropdown controls
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState([
    { id: 1, message: 'VIP Consultation booked by Julien Sorel', type: 'booking', time: '12 mins ago', unread: true, targetTab: 'appointments' },
    { id: 2, message: 'Premium Cast Alloy Rims stock is low', type: 'stock', time: '1 hour ago', unread: true, targetTab: 'store' },
    { id: 3, message: 'Active MongoDB synchronization complete', type: 'info', time: '6 hours ago', unread: false, targetTab: 'dashboard' }
  ]);

  // Navbar Omnisearch and Dropdown States
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Global search keyboard shortcuts
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBox = document.getElementById('global-search-vault');
        if (searchBox) searchBox.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  // Forms and Modals
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);

  // Real store products synchronized locally
  const [storeProducts, setStoreProducts] = useState(() => {
    const saved = localStorage.getItem('aetherion_admin_products');
    return saved ? JSON.parse(saved) : clientStoreProducts;
  });

  const [carForm, setCarForm] = useState({
    name: '', brand: '', category: 'Supercars', price: '', year: 2025,
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
    horsepower: '', torque: '', topSpeed: '', acceleration: '2.5s',
    fuelType: 'Gasoline', batteryRange: '0', safetyRating: '5 Star',
    features: 'Active Aerodynamics, Carbon Fiber Monocoque',
    colors: 'Black, Red, Gold, White'
  });

  // Dynamic Local Storage state setups for rich enterprise mock modules
  const [workers, setWorkers] = useState([
    { id: 1, name: 'Marco Rossi', role: 'Lead Mechanic', dept: 'Garage & Tuning', salary: 12500, shift: 'Morning', performance: '98%', status: 'Active' },
    { id: 2, name: 'Helena Vance', role: 'Sales Strategist', dept: 'VIP Sales', salary: 9800, shift: 'Morning', performance: '94%', status: 'On Leave' },
    { id: 3, name: 'Kenji Tanaka', role: 'EV Systems Architect', dept: 'EV Autonomy', salary: 14000, shift: 'Flexible', performance: '99%', status: 'Active' },
    { id: 4, name: 'Sophia Sterling', role: 'Concierge Lead', dept: 'Customer Support', salary: 7500, shift: 'Evening', performance: '91%', status: 'Active' },
    { id: 5, name: 'Pierre Dubois', role: 'Chassis Engineer', dept: 'Garage & Tuning', salary: 11000, shift: 'Morning', performance: '95%', status: 'Active' }
  ]);

  const [orders, setOrders] = useState([
    { id: 1085, customer: 'Julien Sorel', product: 'AeroCarbon Aerodynamic Wing', date: '2026-07-09', amount: 8900, payment: 'Paid', status: 'Pending', tracking: 'ATH-TRK-7456' },
    { id: 1084, customer: 'Amelie Laurent', product: 'Rotary Forged Rims (x4)', date: '2026-07-08', amount: 9800, payment: 'Paid', status: 'Shipping', tracking: 'ATH-TRK-9824' },
    { id: 1083, customer: 'Vikram Mehta', product: 'Ceramic Pro Diamond Shield', date: '2026-07-07', amount: 450, payment: 'Paid', status: 'Delivered', tracking: 'ATH-TRK-1092' },
    { id: 1082, customer: 'Sergei Voronov', product: 'Custom Interior Carbon Trim Kit', date: '2026-07-06', amount: 3200, payment: 'Refunded', status: 'Cancelled', tracking: 'ATH-TRK-0000' }
  ]);

  const [garageJobs, setGarageJobs] = useState([
    { id: 1, car: 'Acura NSX', customer: 'Lando Norris', mechanic: 'Marco Rossi', jobType: 'Active Aerodynamics Tuning', status: 'In Progress', progress: 65, details: 'Recalibrating high-speed drag angles.' },
    { id: 2, car: 'Ferrari 296 GTB', customer: 'Charles Leclerc', mechanic: 'Pierre Dubois', jobType: 'Bespoke Wrap & Coat', status: 'Pending', progress: 0, details: 'Applying custom matte gold vinyl protection.' },
    { id: 3, car: 'Porsche 911 GT3 RS', customer: 'George Russell', mechanic: 'Marco Rossi', jobType: 'Suspension Adjustment', status: 'Completed', progress: 100, details: 'Tightened track-day rebound dampers.' }
  ]);

  const [evStats, setEvStats] = useState([
    { station: 'Flagship Bay A', type: 'Supercharger (DC)', usage: '82%', cost: 0.18, temp: '34°C', health: '98%' },
    { station: 'Flagship Bay B', type: 'Supercharger (DC)', usage: '12%', cost: 0.18, temp: '28°C', health: '97%' },
    { station: 'Private Vault C', type: 'Slow AC Charger', usage: '100%', cost: 0.12, temp: '31°C', health: '100%' }
  ]);

  const [marketingCampaigns, setMarketingCampaigns] = useState([
    { id: 1, title: 'Summer Concierge Launch', medium: 'Email Campaign', audience: 'VIP Tier', ctr: '12.4%', status: 'Active' },
    { id: 2, title: 'Revuelto Carbon Release', medium: 'Homepage Hero Banner', audience: 'All visitors', ctr: '8.2%', status: 'Active' },
    { id: 3, title: 'Loyalty Bonus Rewards', medium: 'Push Notifications', audience: 'Gold & Platinum members', ctr: '18.9%', status: 'Scheduled' }
  ]);

  const [mediaItems, setMediaItems] = useState([
    { id: 1, name: 'revuelto_front_gold.jpg', size: '2.4 MB', type: 'Image', folder: 'Vault Cars' },
    { id: 2, name: 'carbon_spoke_texture.png', size: '4.8 MB', type: 'Image', folder: 'Store Components' },
    { id: 3, name: 'showroom_promo_video.mp4', size: '48.2 MB', type: 'Video', folder: 'Marketing Clips' },
    { id: 4, name: 'tax_exempt_guidelines.pdf', size: '1.2 MB', type: 'Document', folder: 'Invoices & Reports' }
  ]);

  // Dynamic Transaction Ledger States (Finances)
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Oil Change Service', category: 'Vehicle Maintenance', quantity: 1, amount: 100, date: '2026-08-01', status: 'Completed', color: '#EF4444' },
    { id: 2, name: 'Carbon Fiber Inventory Buy', category: 'Office Supplies', quantity: 50, amount: 20000, date: '2026-08-03', status: 'Pending', color: '#3B82F6' },
    { id: 3, name: 'Staff Wages - VIP Crew', category: 'Staff Salaries', quantity: 1, amount: 15000, date: '2026-08-05', status: 'Completed', color: '#1E293B' },
    { id: 4, name: 'Office High-Speed Server lease', category: 'Office Supplies', quantity: 1, amount: 1200, date: '2026-08-06', status: 'Completed', color: '#94A3B8' },
    { id: 5, name: 'Ferrari Heritage Marketing Promo', category: 'Marketing', quantity: 1, amount: 5000, date: '2026-08-07', status: 'Completed', color: '#475569' }
  ]);

  // State filtering & forms for specific tables
  const [txForm, setTxForm] = useState({ name: '', category: 'Vehicle Maintenance', quantity: 1, amount: '', date: new Date().toISOString().split('T')[0], status: 'Completed' });
  const [productForm, setProductForm] = useState({ name: '', brand: '', category: 'Forged Wheels', price: '', stock: '', sku: '' });
  const [jobForm, setJobForm] = useState({ car: '', customer: '', mechanic: 'Marco Rossi', jobType: '', details: '' });
  const [workerForm, setWorkerForm] = useState({ name: '', role: '', dept: 'Garage & Tuning', salary: '', shift: 'Morning' });
  
  // Real-Time Event logs hook (works like real-life time telemetry streaming)
  useEffect(() => {
    // Seed initial logs
    const seedLogs = [
      { time: new Date(Date.now() - 30000).toLocaleTimeString(), event: 'Aetherion Secure API Core established successfully.' },
      { time: new Date(Date.now() - 20000).toLocaleTimeString(), event: 'Active connection initialized to live MongoDB catalog.' },
      { time: new Date(Date.now() - 10000).toLocaleTimeString(), event: 'VIP Client Julien Sorel authenticated via secure Paris node.' }
    ];
    setLiveLogs(seedLogs);

    const logPool = [
      'Julien Sorel added Lamborghini Revuelto to personal wishlist.',
      'Amelie Laurent requested VIP showroom consultation for Aston Martin DB12.',
      'Database committed 1 active vehicle specification change.',
      'Enkei Premium Cast Alloy Rims stock level adjusted by Operator.',
      'Bespoke wrap consultation requested for Porsche 911 GT3 RS.',
      'Cloud storage optimizer optimized 4 media assets.',
      'Taxes ledger auditor verified transaction record #ATH-1085.',
      'System firewall cleared mechanic role login validation.'
    ];

    const logTimer = setInterval(() => {
      const randomEvent = logPool[Math.floor(Math.random() * logPool.length)];
      const newLog = {
        time: new Date().toLocaleTimeString(),
        event: randomEvent
      };
      setLiveLogs(prev => [newLog, ...prev.slice(0, 7)]);
    }, 4500);

    return () => clearInterval(logTimer);
  }, []);

  // Persist products to localStorage
  useEffect(() => {
    localStorage.setItem('aetherion_admin_products', JSON.stringify(storeProducts));
  }, [storeProducts]);

  // Auto-redirect if not logged in
  useEffect(() => {
    if (!loading) {
      if (!user) {
        addNotification('Session timed out. Re-authorizing.', 'warning');
        navigate('/login');
      }
    }
  }, [user, loading]);

  // Fetch live bookings database
  const fetchBookings = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  // Real-time updates & polling
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setRealLifeTime(new Date().toLocaleTimeString('en-US'));
    }, 1000);

    if (token) {
      fetchBookings();
      fetchCars();
    }

    return () => clearInterval(clockTimer);
  }, [token]);

  // Live database handlers for cars catalog
  const handleCarFormSubmit = async (e) => {
    e.preventDefault();

    const formattedPayload = {
      name: carForm.name,
      brand: carForm.brand,
      category: carForm.category,
      price: Number(carForm.price || 0),
      year: Number(carForm.year || 2025),
      image: carForm.image,
      specs: {
        horsepower: Number(carForm.horsepower || 0),
        torque: Number(carForm.torque || 0),
        topSpeed: Number(carForm.topSpeed || 0),
        acceleration: carForm.acceleration || '2.5s',
        fuelType: carForm.fuelType || 'Gasoline',
        batteryRange: Number(carForm.batteryRange || 0),
        safetyRating: carForm.safetyRating || '5 Star',
        features: (carForm.features || '').split(',').map(f => f.trim())
      },
      colors: (carForm.colors || '').split(',').map(c => c.trim()),
      isTrending: true
    };

    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing 
      ? `http://localhost:5000/api/cars/${editingCarId}`
      : 'http://localhost:5000/api/cars';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedPayload)
      });
      if (res.ok) {
        addNotification(isEditing ? 'Car specs updated.' : 'New vehicle added to catalog.', 'success');
        fetchCars();
        setIsCarModalOpen(false);
        resetCarForm();
      } else {
        addNotification('Form execution failed. Check values.', 'warning');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCarSelect = (car) => {
    if (!car) return;
    setIsEditing(true);
    setEditingCarId(car.id || car._id);
    setCarForm({
      name: car.name || '',
      brand: car.brand || '',
      category: car.category || 'Supercars',
      price: (car.price || '').toString(),
      year: car.year || 2025,
      image: car.image || '',
      horsepower: (car.specs?.horsepower || '').toString(),
      torque: (car.specs?.torque || '').toString(),
      topSpeed: (car.specs?.topSpeed || '').toString(),
      acceleration: car.specs?.acceleration || '2.5s',
      fuelType: car.specs?.fuelType || 'Gasoline',
      batteryRange: (car.specs?.batteryRange || '0').toString(),
      safetyRating: car.specs?.safetyRating || '5 Star',
      features: Array.isArray(car.specs?.features) ? car.specs.features.join(', ') : '',
      colors: Array.isArray(car.colors) ? car.colors.join(', ') : ''
    });
    setIsCarModalOpen(true);
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Confirm deletion of this vehicle from the vault?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/cars/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addNotification('Vehicle removed from catalog.', 'success');
        fetchCars();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetCarForm = () => {
    setIsEditing(false);
    setEditingCarId(null);
    setCarForm({
      name: '', brand: '', category: 'Supercars', price: '', year: 2025,
      image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
      horsepower: '', torque: '', topSpeed: '', acceleration: '2.5s',
      fuelType: 'Gasoline', batteryRange: '0', safetyRating: '5 Star',
      features: 'Active Aerodynamics, Carbon Fiber Monocoque',
      colors: 'Black, Red, Gold, White'
    });
  };

  // Live database updates for appointments bookings
  const handleUpdateBookingStatus = async (id, currentStatus) => {
    let nextStatus = 'confirmed';
    if (currentStatus === 'pending') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'cancelled';
    else if (currentStatus === 'cancelled') nextStatus = 'confirmed';
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        addNotification(`Booking status updated to ${nextStatus}`, 'success');
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        addNotification('Appointment booking deleted.', 'success');
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Local state operations: Store Products
  const handleProductSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      id: `p-${Date.now().toString()}`,
      name: productForm.name,
      brand: productForm.brand,
      category: productForm.category,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      sku: productForm.sku || `PROD-${Date.now().toString().slice(-6)}`,
      status: Number(productForm.stock) > 5 ? 'In Stock' : 'Low Stock'
    };
    setStoreProducts([newProduct, ...storeProducts]);
    addNotification('Product cataloged to inventory.', 'success');
    setIsProductModalOpen(false);
    setProductForm({ name: '', brand: '', category: 'Forged Wheels', price: '', stock: '', sku: '' });
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm('Remove this product from the inventory list?')) return;
    setStoreProducts(storeProducts.filter(p => p.id !== id));
    addNotification('Product removed from inventory.', 'success');
  };

  // Local state operations: Garage jobs
  const handleJobSubmit = (e) => {
    e.preventDefault();
    const newJob = {
      id: Date.now(),
      car: jobForm.car,
      customer: jobForm.customer,
      mechanic: jobForm.mechanic,
      jobType: jobForm.jobType,
      status: 'Pending',
      progress: 0,
      details: jobForm.details
    };
    setGarageJobs([newJob, ...garageJobs]);
    addNotification('Diagnostic work order submitted.', 'success');
    setIsJobModalOpen(false);
    setJobForm({ car: '', customer: '', mechanic: 'Marco Rossi', jobType: '', details: '' });
  };

  // Local state operations: Worker list
  const handleWorkerSubmit = (e) => {
    e.preventDefault();
    const newWorker = {
      id: Date.now(),
      name: workerForm.name,
      role: workerForm.role,
      dept: workerForm.dept,
      salary: Number(workerForm.salary),
      shift: workerForm.shift,
      performance: '100%',
      status: 'Active'
    };
    setWorkers([newWorker, ...workers]);
    addNotification('New crew member onboarded.', 'success');
    setIsWorkerModalOpen(false);
    setWorkerForm({ name: '', role: '', dept: 'Garage & Tuning', salary: '', shift: 'Morning' });
  };

  // Local state operations: Finance ledger
  const handleTxSubmit = (e) => {
    e.preventDefault();
    const newTx = {
      id: Date.now(),
      name: txForm.name,
      category: txForm.category,
      quantity: Number(txForm.quantity) || 1,
      amount: Number(txForm.amount),
      date: txForm.date,
      status: txForm.status,
      color: '#EF4444'
    };
    setTransactions([newTx, ...transactions]);
    addNotification('Financial transaction logged.', 'success');
    setIsTxModalOpen(false);
    setTxForm({ name: '', category: 'Vehicle Maintenance', quantity: 1, amount: '', date: new Date().toISOString().split('T')[0], status: 'Completed' });
  };

  // Report Exporters (PDF)
  const downloadPDFReport = (reportType) => {
    const doc = new jsPDF();
    doc.setFillColor(dashboardTheme === 'dark' ? 10 : 245, dashboardTheme === 'dark' ? 10 : 247, dashboardTheme === 'dark' ? 10 : 249);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(dashboardTheme === 'dark' ? 255 : 15, dashboardTheme === 'dark' ? 255 : 23, dashboardTheme === 'dark' ? 255 : 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('AETHERION MOTORS', 20, 30);
    doc.setTextColor(180, 150, 60);
    doc.setFontSize(9);
    doc.text(`ENTERPRISE SYSTEM REPORT: ${reportType.toUpperCase()}`, 20, 37);
    doc.line(20, 42, 190, 42);

    doc.setTextColor(dashboardTheme === 'dark' ? 200 : 80, dashboardTheme === 'dark' ? 200 : 80, dashboardTheme === 'dark' ? 200 : 80);
    doc.setFontSize(10);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 20, 50);
    doc.text(`Access Role Clearances: ${activeRole}`, 20, 56);

    let y = 70;
    if (reportType === 'financial') {
      doc.setFontSize(12);
      doc.text('LEDGER REVENUE & EXPENSES', 20, 65);
      transactions.forEach((tx, idx) => {
        doc.setFontSize(9);
        doc.text(`${idx + 1}. ${tx.name} (${tx.category})`, 20, y);
        doc.text(`$${tx.amount.toLocaleString()}`, 120, y);
        doc.text(`Status: ${tx.status}`, 160, y);
        y += 8;
      });
    } else {
      doc.setFontSize(12);
      doc.text('SHOWROOM VEHICLES VAULT', 20, 65);
      cars.slice(0, 15).forEach((car, idx) => {
        doc.setFontSize(9);
        doc.text(`${idx + 1}. ${car.brand} ${car.name}`, 20, y);
        doc.text(`$${(car.price || 0).toLocaleString()}`, 120, y);
        doc.text(`Category: ${car.category}`, 160, y);
        y += 8;
      });
    }

    doc.save(`aetherion_${reportType}_report.pdf`);
    addNotification('Report PDF compiled and downloaded.', 'success');
  };

  // Dynamic Brand Metrics Aggregation from real database cars
  const brandMetrics = Array.isArray(cars) ? Object.entries(
    cars.reduce((acc, car) => {
      const b = car.brand || 'Other';
      acc[b] = acc[b] || { count: 0, value: 0, bestSeller: '', bestSellerHp: 0 };
      acc[b].count += 1;
      acc[b].value += Number(car.price) || 0;
      
      const carHp = Number(car.specs?.horsepower) || 0;
      if (!acc[b].bestSeller || carHp > acc[b].bestSellerHp) {
        acc[b].bestSeller = car.name;
        acc[b].bestSellerHp = carHp;
      }
      return acc;
    }, {})
  ).map(([name, data]) => ({
    name,
    count: data.count,
    value: data.value,
    bestSeller: data.bestSeller || 'N/A'
  })) : [];

  // Math aggregates for cards
  const totalVehiclesCount = Array.isArray(cars) ? cars.length : 0;
  const supercarCount = Array.isArray(cars) ? cars.filter(c => c.category === 'Supercars').length : 0;
  const evCount = Array.isArray(cars) ? cars.filter(c => c.category === 'EV Cars').length : 0;
  const totalPortfolioValue = Array.isArray(cars) ? cars.reduce((sum, car) => sum + (Number(car.price) || 0), 0) : 0;
  const ledgerExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Dynamic Theme Definitions
  const isDark = dashboardTheme === 'dark';
  
  // Clean Glassmorphism Styling System
  const styleBgMain = isDark 
    ? 'bg-[#060606] text-[#ECECEC] bg-radial-glow' 
    : 'bg-[#F5F7FA] text-slate-800';
  
  const styleCard = isDark 
    ? 'bg-zinc-950/65 backdrop-blur-xl border border-zinc-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:border-[#D4AF37]/35 transition-all duration-300' 
    : 'bg-white border-slate-200 text-slate-700 shadow-md shadow-slate-100 hover:border-[#D4AF37]/50 transition-all duration-300';
  
  const styleBorder = isDark ? 'border-zinc-900/80' : 'border-slate-200';
  const styleTextTitle = isDark ? 'text-white font-sans font-black tracking-wide' : 'text-slate-900 font-sans font-black tracking-wide';
  const styleTextSubtitle = isDark ? 'text-zinc-500 font-medium' : 'text-slate-400 font-medium';
  
  const styleInput = isDark 
    ? 'bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-650 focus:border-[#D4AF37]/45 focus:ring-1 focus:ring-[#D4AF37]/20 transition-all' 
    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all';
  
  const styleSidebar = isDark 
    ? 'bg-[#090909]/95 border-r border-zinc-900/90 backdrop-blur-2xl' 
    : 'bg-white border-r border-slate-200 shadow-xl';
  
  const styleTableRow = isDark 
    ? 'border-zinc-900/60 hover:bg-zinc-900/20' 
    : 'border-slate-100 hover:bg-slate-50/90';
  
  const styleTableHead = isDark 
    ? 'bg-zinc-950/80 border-b border-zinc-900 text-zinc-400 font-black' 
    : 'bg-slate-50 border-b border-slate-200 text-slate-500 font-black';

  // Navigation Items list (20 specified tabs)
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory Vault', icon: Car },
    { id: 'store', label: 'Store Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders & Sales', icon: ShoppingCart },
    { id: 'customers', label: 'VIP Customers', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'services', label: 'Bespoke Services', icon: Award },
    { id: 'garage', label: 'Garage Diagnostics', icon: Wrench },
    { id: 'workers', label: 'Worker Roster', icon: Users2 },
    { id: 'ev_hub', label: 'EV Autonomy Hub', icon: BatteryCharging },
    { id: 'finance', label: 'Finance Ledger', icon: DollarSign },
    { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing Hub', icon: Megaphone },
    { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
    { id: 'notifications', label: 'System Alerts', icon: Bell },
    { id: 'media_library', label: 'Media Assets', icon: ImageIcon },
    { id: 'website_content', label: 'Web Content', icon: Globe },
    { id: 'reports', label: 'Reports Centre', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Security Profile', icon: User }
  ];

  // RBAC Access Restriction Helper
  const hasAccess = (tab) => {
    if (activeRole === 'Admin') return true;
    if (activeRole === 'Manager') {
      return ['dashboard', 'inventory', 'store', 'orders', 'customers', 'appointments', 'services', 'marketing', 'reviews', 'reports', 'settings', 'profile'].includes(tab);
    }
    if (activeRole === 'Sales Executive') {
      return ['dashboard', 'inventory', 'store', 'orders', 'customers', 'appointments', 'profile'].includes(tab);
    }
    if (activeRole === 'Finance') {
      return ['dashboard', 'orders', 'finance', 'reports', 'profile'].includes(tab);
    }
    if (activeRole === 'Mechanic') {
      return ['dashboard', 'garage', 'ev_hub', 'profile'].includes(tab);
    }
    if (activeRole === 'Customer Support') {
      return ['dashboard', 'customers', 'appointments', 'reviews', 'notifications', 'profile'].includes(tab);
    }
    return false;
  };

  // Redirect role on tab restriction
  useEffect(() => {
    if (!hasAccess(activeTab)) {
      setActiveTab('dashboard');
    }
  }, [activeRole]);

  return (
    <div className={`min-h-screen flex font-sans select-none transition-colors duration-500 ${styleBgMain}`}>
      
      {/* Backdrop overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* COLLAPSIBLE ENTERPRISE SIDEBAR */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col justify-between transition-all duration-300 ${styleSidebar} ${
          sidebarExpanded ? 'w-64 p-5' : 'w-20 py-6 px-3'
        } ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6 overflow-hidden">
          
          {/* Logo Header */}
          <div className="flex items-center justify-between">
            {sidebarExpanded ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-500/10">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className={`text-xs font-black tracking-[0.15em] block font-serif uppercase ${styleTextTitle}`}>
                    AETHERION
                  </span>
                  <span className="text-[7px] tracking-[0.25em] text-[#D4AF37] block font-black uppercase">
                    ENTERPRISE CONSOLE
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-white mx-auto shadow-lg">
                <Zap className="w-5 h-5" />
              </div>
            )}

            {/* Collapse Toggle Button */}
            {sidebarExpanded && (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setSidebarExpanded(false)}
                  className="p-1 hover:bg-zinc-800/40 rounded-lg text-zinc-500 hover:text-white transition-colors hidden md:block"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 hover:bg-zinc-800/40 rounded-lg text-zinc-500 hover:text-white transition-colors md:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items Scroll Container */}
          <nav 
            className={`space-y-1.5 max-h-[72vh] overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden ${
              sidebarExpanded ? 'pr-1' : ''
            }`} 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const allowed = hasAccess(item.id);
              
              if (!allowed) return null;

              const activeClasses = isDark
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#bca031] text-black font-black shadow-lg shadow-[#D4AF37]/10'
                : 'bg-red-500/10 text-red-500 font-black';

              const inactiveClasses = isDark
                ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/60'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100';

              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                  title={item.label}
                  className={`w-full flex items-center rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 hover:scale-[1.01] ${
                    sidebarExpanded ? 'justify-start px-4 py-3 gap-3.5' : 'justify-center p-3.5'
                  } ${
                    isActive ? activeClasses : inactiveClasses
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {sidebarExpanded && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="space-y-4 pt-4 border-t border-zinc-900/50">
          {!sidebarExpanded && (
            <button 
              onClick={() => setSidebarExpanded(true)}
              className="w-10 h-10 rounded-full hover:bg-zinc-850 text-zinc-400 hover:text-white flex items-center justify-center mx-auto transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {sidebarExpanded && (
            <>
              <div className="flex items-center justify-between text-[8px] font-mono font-bold text-zinc-500 px-2">
                <span>SYSTEM ONLINE</span>
                <span className="text-[#D4AF37] animate-ping w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </div>
              <div className="flex items-center gap-2 px-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[9px] font-mono font-bold text-zinc-455">{realLifeTime}</span>
              </div>
            </>
          )}

          <button 
            onClick={() => navigate('/')}
            title="Return to Site"
            className={`w-full flex items-center justify-center transition-all ${
              sidebarExpanded ? 'gap-2.5 py-3 px-4 rounded-xl border' : 'p-3.5 rounded-xl border-none hover:bg-zinc-900/60'
            } text-[9px] font-black uppercase tracking-widest ${
              sidebarExpanded
                ? isDark 
                  ? 'border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:text-white hover:bg-zinc-800/40' 
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                : 'text-[#D4AF37] hover:text-white'
            }`}
          >
            <Globe className="w-4.5 h-4.5 shrink-0" />
            {sidebarExpanded && <span>Return to Site</span>}
          </button>

          <button 
            onClick={logout}
            title="Logout Console"
            className={`w-full flex items-center justify-center transition-all ${
              sidebarExpanded ? 'gap-2.5 py-3 px-4 rounded-xl border' : 'p-3.5 rounded-xl border-none hover:bg-red-500/10'
            } text-[9px] font-black uppercase tracking-widest ${
              sidebarExpanded
                ? isDark 
                  ? 'border-red-950 bg-red-950/10 text-red-400 hover:bg-red-650 hover:text-white hover:border-red-500' 
                  : 'border-red-200 bg-red-50 text-red-650 hover:bg-red-500 hover:text-white'
                : 'text-red-500 hover:text-red-450'
            }`}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {sidebarExpanded && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT */}
      <main className={`flex-grow min-h-screen flex flex-col justify-between transition-all duration-300 ${
        sidebarExpanded ? 'pl-0 md:pl-64' : 'pl-0 md:pl-20'
      }`}>
              {/* TOP SYSTEM HEADER */}
        <header className={`h-20 px-8 flex items-center justify-between border-b ${styleBorder} backdrop-blur-md sticky top-0 z-10 ${
          isDark ? 'bg-[#060606]/85' : 'bg-white/85'
        }`}>
          {/* Dynamic Breadcrumbs Path Indicator */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 hover:bg-zinc-850 rounded-lg text-zinc-400 hover:text-white transition-colors md:hidden mr-1"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest">Aetherion</span>
            <span className="text-zinc-700 text-[10px] font-bold">/</span>
            <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">
              {navItems.find(n => n.id === activeTab)?.label || 'Console'}
            </span>
          </div>

          {/* Quick Search Console Command Bar */}
          <div className="relative hidden lg:block w-80">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              id="global-search-vault"
              type="text"
              placeholder="Search Vault... (Ctrl+K)"
              value={globalSearchQuery}
              onChange={e => setGlobalSearchQuery(e.target.value)}
              className={`w-full rounded-xl pl-9 pr-12 py-2 text-[10px] font-black uppercase tracking-wider focus:outline-none transition-all ${styleInput}`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">
              Ctrl+K
            </span>

            {/* Omnisearch command drop-down suggestions */}
            <AnimatePresence>
              {globalSearchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={`absolute left-0 right-0 mt-2.5 rounded-2xl border p-3.5 z-50 shadow-2xl ${
                    isDark 
                      ? 'bg-zinc-950/95 backdrop-blur-2xl border-zinc-900/90 text-white' 
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <p className="text-[7px] uppercase tracking-wider text-zinc-550 font-black mb-2">Vault Query Results</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                    {/* Filter tabs */}
                    {navItems.filter(item => item.label.toLowerCase().includes(globalSearchQuery.toLowerCase())).slice(0, 3).map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => { setActiveTab(item.id); setGlobalSearchQuery(''); }}
                        className="p-2 rounded-xl hover:bg-zinc-900/40 text-[9px] font-black uppercase tracking-wider cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <span>Workspace: {item.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </div>
                    ))}
                    {/* Filter cars */}
                    {cars.filter(car => car.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || car.brand.toLowerCase().includes(globalSearchQuery.toLowerCase())).slice(0, 5).map(car => (
                      <div 
                        key={car.id || car._id}
                        onClick={() => { setActiveTab('inventory'); setGlobalSearchQuery(''); }}
                        className="p-2 rounded-xl hover:bg-zinc-900/40 text-[9px] font-black uppercase tracking-wider cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <span>Vehicle: {car.brand} {car.name}</span>
                        <span className="text-[#D4AF37] font-mono">${(car.price || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Live Gateway Telemetry Health Indicator */}
            <div className="hidden xl:flex items-center gap-4 text-[8px] font-mono font-bold text-zinc-500 border-r border-zinc-900/60 pr-6">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>DB CORE ACTIVE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>PING: 24MS</span>
              </div>
            </div>

            {/* Custom Interactive Role Selector Popover */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsRoleSelectorOpen(!isRoleSelectorOpen)}
                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider border flex items-center gap-2 transition-all ${
                  isRoleSelectorOpen 
                    ? 'border-[#D4AF37] text-white bg-zinc-900/60' 
                    : isDark 
                      ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900' 
                      : 'border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Clearance: {activeRole}</span>
              </button>

              <AnimatePresence>
                {isRoleSelectorOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsRoleSelectorOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-3 w-56 rounded-2xl border p-3 z-50 shadow-2xl ${
                        isDark 
                          ? 'bg-zinc-950/95 backdrop-blur-2xl border-zinc-900/90 text-white' 
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <p className="text-[7px] uppercase tracking-widest text-zinc-550 font-black mb-2 px-2">Access Clearance Level</p>
                      <div className="space-y-1">
                        {['Admin', 'Manager', 'Sales Executive', 'Finance', 'Mechanic', 'Customer Support'].map(r => (
                          <button
                            key={r}
                            onClick={() => {
                              setActiveRole(r);
                              setIsRoleSelectorOpen(false);
                              addNotification(`Clearance level switched to ${r}.`, 'info');
                            }}
                            className={`w-full text-left p-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-colors ${
                              activeRole === r 
                                ? 'bg-[#D4AF37]/15 text-[#D4AF37]' 
                                : isDark 
                                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/60' 
                                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Local Theme Toggle */}
            <button 
              type="button"
              onClick={() => setDashboardTheme(dashboardTheme === 'dark' ? 'light' : 'dark')}
              className={`p-2.5 rounded-xl border transition-all hidden md:block ${
                isDark ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900' : 'border-slate-200 text-slate-650 hover:bg-slate-100'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Notification system count badge */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className={`relative p-2.5 rounded-xl border transition-all ${
                  isNotificationDropdownOpen 
                    ? 'border-[#D4AF37] text-white bg-zinc-900/60' 
                    : isDark 
                      ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900' 
                      : 'border-slate-200 text-slate-650 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-4 h-4" />
                {systemNotifications.some(n => n.unread) && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[7px] font-black flex items-center justify-center animate-pulse">
                    {systemNotifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationDropdownOpen && (
                  <>
                    {/* Backdrop cover overlay to close on click outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotificationDropdownOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-3 w-80 rounded-2xl border p-4 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.65)] ${
                        isDark 
                          ? 'bg-zinc-950/95 backdrop-blur-2xl border-zinc-900/90 text-white' 
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center border-b border-zinc-900/40 pb-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Alerts</span>
                        {systemNotifications.some(n => n.unread) && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSystemNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                              addNotification('All notifications marked as read.', 'info');
                            }}
                            className="text-[8px] font-black uppercase tracking-wider text-[#D4AF37] hover:underline"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                        {systemNotifications.length === 0 ? (
                          <p className="text-[9px] text-zinc-550 py-4 text-center font-bold uppercase">No alerts logged</p>
                        ) : (
                          systemNotifications.map(n => (
                            <div 
                              key={n.id}
                              onClick={() => {
                                // Mark as read
                                setSystemNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                                // Redirect tab
                                if (hasAccess(n.targetTab)) {
                                  setActiveTab(n.targetTab);
                                  addNotification(`Switched tab to ${n.targetTab}`, 'info');
                                } else {
                                  addNotification('Insufficient clearance to view detail tab.', 'warning');
                                }
                                setIsNotificationDropdownOpen(false);
                              }}
                              className={`p-2.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${
                                n.unread 
                                  ? isDark 
                                    ? 'bg-zinc-900/50 border-[#D4AF37]/20 hover:border-[#D4AF37]/45' 
                                    : 'bg-amber-50/40 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                                  : isDark 
                                    ? 'bg-zinc-950/40 border-transparent hover:bg-zinc-900/20' 
                                    : 'bg-slate-50/40 border-transparent hover:bg-slate-100/50'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {n.type === 'booking' && <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />}
                                {n.type === 'stock' && <ShoppingBag className="w-3.5 h-3.5 text-red-400" />}
                                {n.type === 'info' && <Zap className="w-3.5 h-3.5 text-blue-400" />}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="text-[9px] font-bold leading-normal text-zinc-300 truncate">{n.message}</p>
                                <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-wider block mt-0.5">{n.time}</span>
                              </div>
                              {n.unread && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="border-t border-zinc-900/40 pt-2 mt-2">
                        <button 
                          onClick={() => {
                            if (hasAccess('notifications')) {
                              setActiveTab('notifications');
                            }
                            setIsNotificationDropdownOpen(false);
                          }}
                          className="w-full py-2 bg-zinc-900 hover:bg-[#D4AF37] hover:text-black border border-zinc-800 hover:border-transparent text-zinc-400 text-center rounded-xl text-[8px] font-black uppercase tracking-widest transition-all"
                        >
                          View All Alerts
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive User Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-3 border-l border-zinc-800/80 pl-6 cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700/60 group-hover:border-[#D4AF37]/50 transition-colors">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-left leading-tight hidden md:block">
                  <p className={`text-[10px] font-black uppercase tracking-wider group-hover:text-[#D4AF37] transition-colors ${styleTextTitle}`}>Alastair Aetherion</p>
                  <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Fleet Operator</p>
                </div>
              </div>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-3 w-56 rounded-2xl border p-3.5 z-50 shadow-2xl ${
                        isDark 
                          ? 'bg-zinc-950/95 backdrop-blur-2xl border-zinc-900/90 text-white' 
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="pb-2 mb-2 border-b border-zinc-900/40 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        Operator Quick Menu
                      </div>
                      
                      <div className="space-y-1.5 text-[9px] font-black uppercase tracking-wider">
                        <button 
                          onClick={() => { navigate('/store'); setIsUserDropdownOpen(false); }}
                          className={`w-full text-left p-2 rounded-xl transition-colors ${
                            isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-900/60' : 'text-slate-650 hover:bg-slate-100'
                          }`}
                        >
                          Switch to Client Store
                        </button>
                        
                        <button 
                          onClick={() => { navigate('/showroom'); setIsUserDropdownOpen(false); }}
                          className={`w-full text-left p-2 rounded-xl transition-colors ${
                            isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-900/60' : 'text-slate-650 hover:bg-slate-100'
                          }`}
                        >
                          Showroom Vault Site
                        </button>

                        <button 
                          onClick={() => { setActiveTab('profile'); setIsUserDropdownOpen(false); }}
                          className={`w-full text-left p-2 rounded-xl transition-colors ${
                            isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-900/60' : 'text-slate-650 hover:bg-slate-100'
                          }`}
                        >
                          Security Profile
                        </button>
                        
                        <div className="border-t border-zinc-900/40 my-2 pt-2" />
                        
                        <button 
                          onClick={() => { logout(); setIsUserDropdownOpen(false); }}
                          className="w-full text-left p-2 rounded-xl text-red-400 hover:bg-red-950/15 transition-colors"
                        >
                          Log out console
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* CORE DYNAMIC VIEWS GRID */}
        <div className="flex-grow p-8">
          <ErrorBoundary componentName="Enterprise Tab Workspace">
            
            {/* VIEW 1: ENTERPRISE OVERVIEW DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* 12 Metric Top Cards Row with premium sparklines */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                  {[
                    { title: 'Vault Total Cars', value: totalVehiclesCount, desc: 'Units cataloged', icon: Car, color: '#D4AF37', points: '10,18,12,24,18,22,28' },
                    { title: 'Supercars Units', value: supercarCount, desc: 'High-performance', icon: Award, color: '#EF4444', points: '8,12,10,18,15,16,22' },
                    { title: 'EV Fleet Autonomy', value: evCount, desc: 'Electric drive', icon: Zap, color: '#3B82F6', points: '5,8,12,10,14,19,25' },
                    { title: 'Bespoke Balance', value: `$${(totalPortfolioValue + 155820).toLocaleString()}`, desc: 'Asset valuation', icon: DollarSign, color: '#10B981', points: '15,20,18,25,22,29,32' },
                    { title: 'Ledger Expenses', value: `$${ledgerExpenses.toLocaleString()}`, desc: 'Logged invoices cost', icon: FileSpreadsheet, color: '#F59E0B', points: '8,15,12,18,14,20,16' },
                    { title: 'Reservations', value: bookings.length, desc: 'VIP visitors booked', icon: Calendar, color: '#8B5CF6', points: '12,10,16,14,20,18,24' }
                  ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                      <div key={idx} className={`rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[130px] group ${styleCard}`}>
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] uppercase tracking-widest font-black text-zinc-500">{card.title}</span>
                          <Icon className="w-4 h-4" style={{ color: card.color }} />
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className={`text-base font-black font-mono tracking-tight ${styleTextTitle}`}>{card.value}</p>
                            <p className="text-[7px] text-zinc-555 font-black uppercase tracking-wider mt-0.5">{card.desc}</p>
                          </div>
                          
                          {/* Sparkline visualization */}
                          <svg viewBox="0 0 100 30" className="w-14 h-6 opacity-65 shrink-0 overflow-visible">
                            <polyline
                              fill="none"
                              stroke={card.color}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={card.points}
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dashboard dynamic SVG charts container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Financial area graph chart */}
                  <div className={`lg:col-span-8 rounded-3xl p-6 border flex flex-col justify-between min-h-[380px] relative ${styleCard}`}>
                    <div className="flex justify-between items-baseline mb-6 border-b border-zinc-900/40 pb-4">
                      <div>
                        <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Bespoke Portfolio Cashflow</h3>
                        <p className="text-[8px] text-zinc-550 font-black uppercase">Asset growth vs logged operating costs</p>
                      </div>
                      <span className="text-[7px] border border-zinc-800 bg-zinc-900/25 px-2.5 py-1 rounded text-zinc-400 font-mono font-bold">REAL-TIME TELEMETRY</span>
                    </div>

                    {/* SVG Curve chart */}
                    <div className="h-60 w-full relative">
                      <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="glowCashflow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="glowExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                          <line key={i} x1="20" y1={20 + r * 140} x2="480" y2={20 + r * 140} stroke="#3f3f46" strokeOpacity={0.12} strokeDasharray="3 3" />
                        ))}
                        
                        {/* Area graphs */}
                        <path d="M 20 160 L 100 120 L 180 130 L 260 80 L 340 90 L 420 50 L 480 60 L 480 160 Z" fill="url(#glowCashflow)" />
                        <path d="M 20 160 L 100 140 L 180 145 L 260 110 L 340 115 L 420 90 L 480 100 L 480 160 Z" fill="url(#glowExpense)" />
                        
                        {/* Line paths */}
                        <path d="M 20 160 L 100 120 L 180 130 L 260 80 L 340 90 L 420 50 L 480 60" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M 20 160 L 100 140 L 180 145 L 260 110 L 340 115 L 420 90 L 480 100" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
                        
                        {/* Scatter points */}
                        {[
                          {x: 20, y: 160}, {x: 100, y: 120}, {x: 180, y: 130}, {x: 260, y: 80}, {x: 340, y: 90}, {x: 420, y: 50}, {x: 480, y: 60}
                        ].map((pt, i) => (
                          <circle 
                            key={i} cx={pt.x} cy={pt.y} r="4" fill="#D4AF37" stroke="#000" strokeWidth="1.5" 
                            className="cursor-pointer transition-all duration-300 hover:scale-150 hover:fill-white"
                            onMouseEnter={() => setActiveHoverIdx(i)}
                            onMouseLeave={() => setActiveHoverIdx(null)}
                          />
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Donut chart for components */}
                  <div className={`lg:col-span-4 rounded-3xl p-6 border flex flex-col justify-between min-h-[380px] ${styleCard}`}>
                    <div className="border-b border-zinc-900/40 pb-4">
                      <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Division Allocation</h3>
                      <p className="text-[8px] text-zinc-555 font-black uppercase font-sans">Store sales vs maintenance allocations</p>
                    </div>

                    <div className="h-44 w-full relative flex items-center justify-center">
                      <svg viewBox="0 0 200 200" className="w-40 h-40 overflow-visible">
                        <circle cx="100" cy="100" r="60" fill="transparent" stroke="#EF4444" strokeWidth="13" strokeDasharray="180 376.99" strokeDashoffset="0" className="transition-all hover:stroke-[15px]" />
                        <circle cx="100" cy="100" r="60" fill="transparent" stroke="#3B82F6" strokeWidth="13" strokeDasharray="100 376.99" strokeDashoffset="-180" className="transition-all hover:stroke-[15px]" />
                        <circle cx="100" cy="100" r="60" fill="transparent" stroke="#D4AF37" strokeWidth="13" strokeDasharray="96.99 376.99" strokeDashoffset="-280" className="transition-all hover:stroke-[15px]" />
                      </svg>
                      <div className="absolute text-center pointer-events-none">
                        <p className="text-[7px] font-black uppercase tracking-widest text-zinc-555">Asset Allocation</p>
                        <p className={`text-sm font-black font-mono ${styleTextTitle}`}>100% Secure</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-[8px] font-black uppercase tracking-wider text-zinc-505">
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"/>Supercars Group</span><span>48%</span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"/>EV Autonomy Suite</span><span>27%</span></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D4AF37]"/>Accessories Vault</span><span>25%</span></div>
                    </div>
                  </div>

                </div>

                {/* REAL-LIFE TIME SYSTEM LOG CONSOLE */}
                <div className={`p-6 border rounded-3xl ${styleCard} space-y-4`}>
                  <div className="flex justify-between items-center border-b border-zinc-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                      <h3 className={`text-[10px] font-black uppercase tracking-widest ${styleTextTitle}`}>
                        Aetherion Data Core: Live System Telemetry Stream
                      </h3>
                    </div>
                    <span className="text-[7px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded uppercase font-black tracking-widest">
                      Real-Life Time Stream Active
                    </span>
                  </div>

                  {/* Terminal log logs */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-900 font-mono text-[9px] text-zinc-450">
                    {liveLogs.map((log, idx) => (
                      <div key={idx} className="flex gap-4 items-start py-0.5 hover:bg-zinc-900/10 transition-colors rounded px-2">
                        <span className="text-zinc-600 font-bold shrink-0">[{log.time}]</span>
                        <span className="text-zinc-400 shrink-0">⚡</span>
                        <span className="text-zinc-300 font-medium">{log.event}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 2: VEHICLE VAULT INVENTORY MANAGER & BRANDS SECTION */}
            {activeTab === 'inventory' && (
              <div className="space-y-10">
                
                {/* SUB-SECTION 1: Dynamic Brand Directory (Sync'd with live client page brands) */}
                <div className="space-y-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Manufacturers Vault Directory</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {brandMetrics.map((brand, i) => (
                      <div key={i} className={`p-4 border rounded-2xl flex flex-col justify-between min-h-[100px] ${styleCard}`}>
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-black uppercase tracking-wide ${styleTextTitle}`}>{brand.name}</span>
                          <span className="text-[7px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 px-2 py-0.5 rounded-full font-black">
                            {brand.count} Cars
                          </span>
                        </div>
                        <div className="mt-2 text-[8px] text-zinc-550 font-black uppercase">
                          <div className="truncate">Top Model: <span className="text-white">{brand.bestSeller}</span></div>
                          <div className="mt-1 font-mono text-[#D4AF37]">${brand.value.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-900/40 my-6" />

                {/* SUB-SECTION 2: Active Vehicles Registry */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <h4 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Showroom Catalog Inventory</h4>
                    <button 
                      onClick={() => { resetCarForm(); setIsCarModalOpen(true); }}
                      className="px-5 py-3 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-lg shadow-[#D4AF37]/10"
                    >
                      <Plus className="w-4 h-4" /> Catalog New Vehicle
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {cars.map(car => (
                      <div key={car.id || car._id} className={`rounded-3xl border overflow-hidden p-5 relative flex flex-col justify-between min-h-[240px] group ${styleCard}`}>
                        <div>
                          <div className="h-40 w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-900/60 mb-4 relative">
                            <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-3 right-3 bg-black/85 border border-[#D4AF37]/35 text-[#D4AF37] text-[7px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                              {car.category}
                            </span>
                          </div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37]">{car.brand}</p>
                          <h4 className={`text-sm font-black uppercase tracking-wide leading-tight ${styleTextTitle}`}>{car.name}</h4>
                          
                          <div className="grid grid-cols-2 gap-3 mt-4 text-[8px] text-zinc-550 font-black uppercase">
                            <div>Horsepower: <span className="text-zinc-400 font-mono">{car.specs?.horsepower || 'N/A'} HP</span></div>
                            <div>Top Speed: <span className="text-zinc-400 font-mono">{car.specs?.topSpeed || 'N/A'} MPH</span></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-5 border-t border-zinc-900/40 pt-4">
                          <span className="text-sm font-black text-[#D4AF37] font-mono">${(car.price || 0).toLocaleString()}</span>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditCarSelect(car)} className="p-2 border border-zinc-800 hover:border-[#D4AF37] rounded-xl text-zinc-500 hover:text-[#D4AF37] transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteCar(car.id || car._id)} className="p-2 border border-zinc-800 hover:border-red-500 rounded-xl text-zinc-500 hover:text-red-400 transition">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW 3: STORE PRODUCTS CATALOG (Linked with real client storeItems) */}
            {activeTab === 'store' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Luxury Parts Catalog</h3>
                    <p className="text-[8px] text-[#D4AF37] font-black uppercase mt-1">Live synchronized store data: {storeProducts.length} items registered</p>
                  </div>
                  <button 
                    onClick={() => setIsProductModalOpen(true)}
                    className="px-5 py-3 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Catalog Product
                  </button>
                </div>

                <div className={`rounded-2xl overflow-x-auto border ${styleBorder} ${styleCard}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`${styleTableHead} text-[8px] uppercase tracking-widest font-black`}>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">SKU Code</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-[9px] font-black text-zinc-400">
                      {storeProducts.slice(0, 40).map(p => (
                        <tr key={p.id} className={`transition-colors ${styleTableRow}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {p.image && (
                                <img src={p.image} alt={p.name} className="w-9 h-7 rounded object-cover border border-zinc-900 shrink-0" />
                              )}
                              <span className={`font-black text-xs uppercase tracking-wide ${styleTextTitle}`}>{p.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-[#D4AF37] font-semibold">{p.brand}</td>
                          <td className="p-4">{p.category}</td>
                          <td className="p-4 font-mono">{p.sku || `SKU-${p.id}`}</td>
                          <td className="p-4 font-mono text-white">${p.price.toLocaleString()}</td>
                          <td className="p-4 font-mono">{p.stock || 20} units</td>
                          <td className="p-4">
                            <span className={`text-[8px] px-3 py-1 rounded-full border ${
                              (p.stock > 5) 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>{p.stock > 5 ? 'In Stock' : 'Low Stock'}</span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-zinc-600 hover:text-red-400 font-black uppercase tracking-wider text-[8px] transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 4: ORDERS & SALES */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Bespoke Client Orders</h3>
                
                <div className={`rounded-2xl overflow-x-auto border ${styleBorder} ${styleCard}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`${styleTableHead} text-[8px] uppercase tracking-widest font-black`}>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">VIP Customer</th>
                        <th className="p-4">Component Purchase</th>
                        <th className="p-4">Date Logged</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Tracking Code</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-[9px] font-black text-zinc-400">
                      {orders.map(o => (
                        <tr key={o.id} className={`transition-colors ${styleTableRow}`}>
                          <td className="p-4 font-mono font-black text-[#D4AF37]">#ATH-{o.id}</td>
                          <td className={`p-4 uppercase tracking-wide ${styleTextTitle}`}>{o.customer}</td>
                          <td className="p-4 text-zinc-350">{o.product}</td>
                          <td className="p-4 font-mono">{o.date}</td>
                          <td className="p-4 font-mono text-white">${o.amount.toLocaleString()}</td>
                          <td className="p-4 font-mono">{o.tracking}</td>
                          <td className="p-4">
                            <span className={`text-[8px] px-3 py-1 rounded-full border uppercase ${
                              o.status === 'Delivered'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : o.status === 'Pending'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 5: VIP CUSTOMERS */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>VIP Registry & Memberships</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Julien Sorel', email: 'j.sorel@concierge.org', tier: 'Centurion (Black)', points: '24,500 pts', vehicle: 'Ferrari Tourbillon' },
                    { name: 'Amelie Laurent', email: 'a.laurent@luxury.fr', tier: 'Aetherion Diamond', points: '18,200 pts', vehicle: 'Aston Martin DB12' },
                    { name: 'Vikram Mehta', email: 'vik.mehta@mumbai.co', tier: 'Aetherion Platinum', points: '14,000 pts', vehicle: 'Acura MDX Type S' }
                  ].map((cust, i) => (
                    <div key={i} className={`p-6 border rounded-3xl space-y-4 relative overflow-hidden ${styleCard}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`text-sm font-black uppercase tracking-wider ${styleTextTitle}`}>{cust.name}</h4>
                          <span className="text-[8px] text-zinc-550 font-bold uppercase">{cust.email}</span>
                        </div>
                        <span className="text-[8px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 font-bold uppercase px-3 py-1 rounded-full">
                          {cust.tier}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[9px] font-black uppercase border-t border-zinc-900/40 pt-4 text-zinc-450">
                        <div>Loyalty Level: <span className="text-white font-mono">{cust.points}</span></div>
                        <div>Acquired Asset: <span className="text-white">{cust.vehicle}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 6: APPOINTMENTS */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Bespoke Consultations List</h3>
                
                <div className={`rounded-2xl overflow-x-auto border ${styleBorder} ${styleCard}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`${styleTableHead} text-[8px] uppercase tracking-widest font-black`}>
                        <th className="p-4">VIP Client</th>
                        <th className="p-4">Vehicle Model Request</th>
                        <th className="p-4">Consultation Type</th>
                        <th className="p-4">Scheduled Date & Time</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-[9px] font-black text-zinc-400">
                      {bookings.map(book => (
                        <tr key={book.id || book._id} className={`transition-colors ${styleTableRow}`}>
                          <td className={`p-4 font-black uppercase ${styleTextTitle}`}>{book.name || 'N/A'}</td>
                          <td className="p-4 text-[#D4AF37]">{book.preferredVehicle || 'N/A'}</td>
                          <td className="p-4 uppercase">{book.appointmentType || 'N/A'}</td>
                          <td className="p-4 font-mono">{book.date || 'N/A'} | {book.time || 'N/A'}</td>
                          <td className="p-4 uppercase">{book.city || 'N/A'}</td>
                          <td className="p-4">
                            <span className={`text-[8px] px-3 py-1 rounded-full border inline-block uppercase ${
                              book.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>{book.status || 'pending'}</span>
                          </td>
                          <td className="p-4 text-right space-y-1.5">
                            <button onClick={() => handleUpdateBookingStatus(book.id || book._id, book.status)} className="block w-full text-right text-[8px] text-luxury-gold hover:text-white transition uppercase">Toggle Status</button>
                            <button onClick={() => handleDeleteBooking(book.id || book._id)} className="block w-full text-right text-[8px] text-zinc-555 hover:text-red-400 transition uppercase">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 7: SERVICES */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Bespoke Service Packages</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Xpel Ultimate Paint Protection Film', price: 6500, time: '3-4 Days Work', warranty: '10-Year Warranty' },
                    { name: 'Gtechniq Dual Ceramic Coating Suite', price: 1800, time: '2 Days Work', warranty: '5-Year Guarantee' },
                    { name: 'Full Custom Vinyl wrap & Accents', price: 9200, time: '5-7 Days Work', warranty: '3-Year Trim Warranty' }
                  ].map((srv, idx) => (
                    <div key={idx} className={`p-6 border rounded-3xl space-y-4 flex flex-col justify-between min-h-[170px] ${styleCard}`}>
                      <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest leading-relaxed ${styleTextTitle}`}>{srv.name}</h4>
                        <p className="text-[8px] text-zinc-550 font-black uppercase mt-1">Timeline: {srv.time} | {srv.warranty}</p>
                      </div>
                      <div className="flex justify-between items-center border-t border-zinc-900/40 pt-4">
                        <span className="text-sm font-black text-[#D4AF37] font-mono">${srv.price.toLocaleString()}</span>
                        <span className="text-[8px] font-black border border-zinc-800 bg-zinc-950 px-2.5 py-1 rounded-full text-zinc-500 uppercase tracking-widest">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 8: GARAGE DIAGNOSTICS */}
            {activeTab === 'garage' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Garage Repair Workflow</h3>
                  <button 
                    onClick={() => setIsJobModalOpen(true)}
                    className="px-5 py-3 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Assign Work Order
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {garageJobs.map(job => (
                    <div key={job.id} className={`p-5 border rounded-3xl space-y-4 relative ${styleCard}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>{job.car}</h4>
                          <span className="text-[8px] text-zinc-555 font-black uppercase">Client: {job.customer}</span>
                        </div>
                        <span className={`text-[8px] px-3 py-1 rounded-full border uppercase font-black ${
                          job.status === 'Completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>{job.status}</span>
                      </div>
                      
                      <div className="space-y-2 text-[8px] font-black uppercase text-zinc-500">
                        <div>Mechanic: <span className="text-white">{job.mechanic}</span></div>
                        <div>Job Scope: <span className="text-white">{job.jobType}</span></div>
                        <div>Details: <p className="text-zinc-400 normal-case mt-1 font-medium leading-relaxed">{job.details}</p></div>
                      </div>

                      <div className="space-y-1.5 pt-3">
                        <div className="flex justify-between text-[7px] font-black font-mono text-[#D4AF37]">
                          <span>DIAGNOSTIC TELEMETRY</span>
                          <span>{job.progress}%</span>
                        </div>
                        <div className="w-full bg-zinc-950 rounded-full h-1.5 border border-zinc-900 overflow-hidden">
                          <div className="bg-[#D4AF37] h-1.5 transition-all duration-500" style={{ width: `${job.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 9: WORKERS EMPLOYEE ROSTER */}
            {activeTab === 'workers' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Employee Management Roster</h3>
                  <button 
                    onClick={() => setIsWorkerModalOpen(true)}
                    className="px-5 py-3 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Onboard Crew Member
                  </button>
                </div>

                <div className={`rounded-2xl overflow-x-auto border ${styleBorder} ${styleCard}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`${styleTableHead} text-[8px] uppercase tracking-widest font-black`}>
                        <th className="p-4">Crew Name</th>
                        <th className="p-4">Assigned Role</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Monthly Salary</th>
                        <th className="p-4">Shift schedule</th>
                        <th className="p-4">Performance KPI</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-[9px] font-black text-zinc-400">
                      {workers.map(w => (
                        <tr key={w.id} className={`transition-colors ${styleTableRow}`}>
                          <td className={`p-4 font-black uppercase ${styleTextTitle}`}>{w.name}</td>
                          <td className="p-4 text-[#D4AF37]">{w.role}</td>
                          <td className="p-4">{w.dept}</td>
                          <td className="p-4 font-mono">${w.salary.toLocaleString()}</td>
                          <td className="p-4 uppercase">{w.shift}</td>
                          <td className="p-4 font-mono text-white">{w.performance}</td>
                          <td className="p-4">
                            <span className={`text-[8px] px-3 py-1 rounded-full border ${
                              w.status === 'Active' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-[#1c1c1c] text-zinc-500 border-zinc-700'
                            }`}>{w.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 10: EV HUB */}
            {activeTab === 'ev_hub' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>EV Supercharger Bays telemetry</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {evStats.map((stat, i) => (
                    <div key={i} className={`p-5 border rounded-3xl space-y-4 relative ${styleCard}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>{stat.station}</h4>
                          <span className="text-[8px] text-zinc-550 font-black uppercase">{stat.type}</span>
                        </div>
                        <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                          <BatteryCharging className="w-5 h-5" />
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-[9px] font-black uppercase border-t border-zinc-900/40 pt-4 text-zinc-450">
                        <div>Battery Health: <span className="text-white font-mono">{stat.health}</span></div>
                        <div>Ambient Temp: <span className="text-white font-mono">{stat.temp}</span></div>
                        <div>Current Load: <span className="text-white font-mono">{stat.usage}</span></div>
                        <div>Charging Tariff: <span className="text-white font-mono">${stat.cost}/kWh</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 11: FINANCE EXPENSES LEDGER */}
            {activeTab === 'finance' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Finance Ledger & Expenses</h3>
                  <button 
                    onClick={() => setIsTxModalOpen(true)}
                    className="px-5 py-3 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Log Expenditure
                  </button>
                </div>

                <div className={`rounded-2xl overflow-x-auto border ${styleBorder} ${styleCard}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`${styleTableHead} text-[8px] uppercase tracking-widest font-black`}>
                        <th className="p-4">Expenditure Account</th>
                        <th className="p-4">Transaction Class</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Ledger Cost</th>
                        <th className="p-4">Date Logged</th>
                        <th className="p-4">Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-[9px] font-black text-zinc-400">
                      {transactions.map(t => (
                        <tr key={t.id} className={`transition-colors ${styleTableRow}`}>
                          <td className={`p-4 font-black uppercase ${styleTextTitle}`}>{t.name}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-950/20 text-zinc-400 text-[8px] uppercase font-black">
                              {t.category}
                            </span>
                          </td>
                          <td className="p-4 font-mono">{t.quantity}</td>
                          <td className="p-4 font-mono text-white">${t.amount.toLocaleString()}</td>
                          <td className="p-4 font-mono">{t.date}</td>
                          <td className="p-4">
                            <span className={`text-[8px] px-3 py-1 rounded-full border uppercase ${
                              t.status === 'Completed' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-455 border-amber-500/20'
                            }`}>{t.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 12: ANALYTICS DETAIL PAGE */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Bespoke Metrics Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 border rounded-3xl ${styleCard} space-y-4`}>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Traffic Stream Source</h4>
                    <p className="text-[8px] text-zinc-555 font-bold uppercase">Monthly visits attribution telemetry</p>
                    <div className="space-y-4 pt-3 text-[9px] font-black uppercase text-zinc-400">
                      <div>Direct Concierge Access: (74%) <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mt-1.5"><div className="bg-[#D4AF37] h-full" style={{ width: '74%' }}/></div></div>
                      <div>Organic Referral Catalog: (18%) <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mt-1.5"><div className="bg-zinc-700 h-full" style={{ width: '18%' }}/></div></div>
                      <div>Social Campaign Media: (8%) <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mt-1.5"><div className="bg-zinc-800 h-full" style={{ width: '8%' }}/></div></div>
                    </div>
                  </div>

                  <div className={`p-6 border rounded-3xl ${styleCard} space-y-4`}>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Top Selling Model Groups</h4>
                    <p className="text-[8px] text-zinc-555 font-bold uppercase font-sans">Brand distribution sales percentages</p>
                    <div className="space-y-4 pt-3 text-[9px] font-black uppercase text-zinc-400">
                      <div>Ferrari Heritage Collection: (48%) <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mt-1.5"><div className="bg-red-500 h-full" style={{ width: '48%' }}/></div></div>
                      <div>Lamborghini Hybrid V12: (32%) <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mt-1.5"><div className="bg-[#D4AF37] h-full" style={{ width: '32%' }}/></div></div>
                      <div>Porsche Autonomy EV: (20%) <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden mt-1.5"><div className="bg-blue-500 h-full" style={{ width: '20%' }}/></div></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 13: MARKETING CAMPAIGNS */}
            {activeTab === 'marketing' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Bespoke Campaigns Suite</h3>
                
                <div className={`rounded-2xl overflow-x-auto border ${styleBorder} ${styleCard}`}>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`${styleTableHead} text-[8px] uppercase tracking-widest font-black`}>
                        <th className="p-4">Campaign Title</th>
                        <th className="p-4">Marketing Medium</th>
                        <th className="p-4">VIP Audience Target</th>
                        <th className="p-4">CTR Response Rate</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/40 text-[9px] font-black text-zinc-400">
                      {marketingCampaigns.map(c => (
                        <tr key={c.id} className={`transition-colors ${styleTableRow}`}>
                          <td className={`p-4 font-black uppercase ${styleTextTitle}`}>{c.title}</td>
                          <td className="p-4 text-[#D4AF37] font-semibold">{c.medium}</td>
                          <td className="p-4">{c.audience}</td>
                          <td className="p-4 font-mono text-white">{c.ctr}</td>
                          <td className="p-4">
                            <span className={`text-[8px] px-3 py-1 rounded-full border ${
                              c.status === 'Active' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-[#1c1c1c] text-zinc-500 border-zinc-700'
                            }`}>{c.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 14: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Bespoke Feedback Ratings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { author: 'Vikram Mehta', rating: 5, vehicle: 'Acura MDX Type S', text: 'Absolute perfection. Custom ceramic wrap coating is highly durable and beautiful.' },
                    { author: 'Lando Norris', rating: 5, vehicle: 'Acura NSX', text: 'Stunning high-speed active aerodynamics calibration. The track dampers feel superb.' }
                  ].map((rev, idx) => (
                    <div key={idx} className={`p-5 border rounded-3xl space-y-3 relative ${styleCard}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>{rev.author}</h4>
                          <span className="text-[7px] text-[#D4AF37] font-mono uppercase font-black">Verified Asset Owner</span>
                        </div>
                        <div className="flex gap-0.5 text-[#D4AF37]">
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />)}
                        </div>
                      </div>
                      <p className="text-[9px] text-zinc-400 italic normal-case leading-relaxed font-light">"{rev.text}"</p>
                      <div className="text-[8px] text-zinc-555 font-black uppercase pt-3 border-t border-zinc-900/40">Vehicle: {rev.vehicle}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 15: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>System Alerts Logs</h3>
                
                <div className="space-y-3">
                  {[
                    { msg: 'VIP Consultation booked by Julien Sorel for a test drive appointment.', type: 'booking', time: '12 mins ago' },
                    { msg: 'Billet Alloy Cross-Spoke Wheel inventory stock level dipped below 5 units threshold.', type: 'alert', time: '1 hour ago' },
                    { msg: 'Automated database backups executed successfully onto Aetherion secure vault server.', type: 'info', time: '6 hours ago' }
                  ].map((notif, i) => (
                    <div key={i} className={`p-4 border rounded-2xl flex items-center justify-between gap-4 ${styleCard}`}>
                      <div className="flex items-center gap-3">
                        <AlertCircle className={`w-4 h-4 shrink-0 ${notif.type === 'alert' ? 'text-red-400' : 'text-zinc-500'}`} />
                        <span className="text-[9px] font-bold text-zinc-350">{notif.msg}</span>
                      </div>
                      <span className="text-[8px] font-mono text-zinc-555 shrink-0">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 16: MEDIA LIBRARY */}
            {activeTab === 'media_library' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Asset Files Vault</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mediaItems.map(item => (
                    <div key={item.id} className={`p-5 border rounded-3xl space-y-3 flex flex-col justify-between min-h-[150px] ${styleCard}`}>
                      <div className="flex justify-between items-start">
                        <Folder className="w-6 h-6 text-[#D4AF37]" />
                        <span className="text-[8px] bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded text-zinc-500 uppercase">{item.type}</span>
                      </div>
                      <div>
                        <h4 className={`text-[10px] font-black uppercase truncate ${styleTextTitle}`} title={item.name}>{item.name}</h4>
                        <p className="text-[8px] text-zinc-555 font-bold uppercase mt-0.5">Size: {item.size} | {item.folder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 17: WEBSITE CONTENT EDITOR */}
            {activeTab === 'website_content' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Homepage Hero Configurations</h3>
                
                <div className={`p-6 border rounded-3xl space-y-4 ${styleCard}`}>
                  <div className="border-b border-zinc-900/40 pb-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Hero Sliders Control</h4>
                    <p className="text-[8px] text-zinc-555 font-bold uppercase mt-0.5">Configure live showroom main display titles</p>
                  </div>
                  <div className="space-y-3 text-[9px] font-black uppercase text-zinc-455">
                    <div>Slide Header: <span className="text-white block font-serif normal-case text-xs mt-1">Aetherion Motors Luxury</span></div>
                    <div>Slide Subtitle: <span className="text-white block normal-case text-xs mt-1">Serving as the primary international catalog broker for rare hypercars.</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 18: REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Reports & Compilers</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Financial Revenue Ledger', desc: 'Invoices costs, payroll audits, and operating margins.', type: 'financial' },
                    { name: 'Showroom Catalog Inventory', desc: 'Active showroom vehicles vault values.', type: 'inventory' }
                  ].map((rep, idx) => (
                    <div key={idx} className={`p-6 border rounded-3xl space-y-4 relative ${styleCard}`}>
                      <h4 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>{rep.name}</h4>
                      <p className="text-[9px] text-zinc-500 normal-case leading-relaxed font-light">{rep.desc}</p>
                      <button 
                        onClick={() => downloadPDFReport(rep.type)}
                        className="px-5 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all mt-4"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D4AF37]" /> Export PDF Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 19: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Company Profile Controls</h3>
                
                <div className={`p-6 border rounded-3xl space-y-6 ${styleCard}`}>
                  <div className="border-b border-zinc-900/40 pb-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Showroom Configuration</h4>
                    <p className="text-[8px] text-zinc-555 font-bold uppercase mt-0.5">Corporate metadata settings</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[9px] font-bold uppercase text-zinc-400">
                    <div className="space-y-1.5"><div>Showroom Location:</div><span className="text-white block font-medium normal-case text-xs mt-1">Beverly Hills Flagship Office, CA</span></div>
                    <div className="space-y-1.5"><div>Taxes System:</div><span className="text-white block font-mono text-xs mt-1">Structured corporate tax structures</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 20: SECURITY PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Operator Clearances Profile</h3>
                
                <div className={`p-6 border rounded-3xl space-y-6 ${styleCard}`}>
                  <div className="flex items-center gap-4 border-b border-[#1c1c1c] pb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-wider ${styleTextTitle}`}>Alastair Aetherion</h4>
                      <p className="text-[8px] text-zinc-555 font-bold uppercase tracking-widest mt-0.5">Role Clearances: <span className="text-[#D4AF37]">{activeRole}</span></p>
                    </div>
                  </div>

                  <div className="space-y-3 text-[9px] font-bold uppercase text-zinc-450">
                    <div>Authorized Email: <span className="text-white font-mono block text-xs normal-case mt-1">{user?.email || 'admin@aetherion.com'}</span></div>
                    <div>Clearance Level: <span className="text-emerald-400 block text-xs mt-1">Level 5 (Bespoke Access)</span></div>
                  </div>
                </div>
              </div>
            )}

          </ErrorBoundary>
        </div>

        {/* MODALS INVENTORY FOR CREATORS */}
        <AnimatePresence>
          
          {/* CAR REGISTRY MODAL */}
          {isCarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-lg p-6 rounded-[2rem] border shadow-2xl relative max-h-[90vh] overflow-y-auto ${styleCard}`}>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>{isEditing ? 'Modify Specs' : 'Catalog New Vehicle'}</h3>
                  <button onClick={() => setIsCarModalOpen(false)} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">Close</button>
                </div>
                <form onSubmit={handleCarFormSubmit} className="space-y-4 text-[10px] font-bold text-zinc-400">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Manufacturer</label>
                      <input type="text" required value={carForm.brand} onChange={e => setCarForm({ ...carForm, brand: e.target.value })} placeholder="Lamborghini" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Model Name</label>
                      <input type="text" required value={carForm.name} onChange={e => setCarForm({ ...carForm, name: e.target.value })} placeholder="Revuelto" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Category</label>
                      <select value={carForm.category} onChange={e => setCarForm({ ...carForm, category: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer ${styleInput}`}>
                        <option value="Supercars">Supercars</option>
                        <option value="Sports Cars">Sports Cars</option>
                        <option value="EV Cars">EV Cars</option>
                        <option value="Off-Road Cars">Off-Road Cars</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Price ($)</label>
                      <input type="number" required value={carForm.price} onChange={e => setCarForm({ ...carForm, price: e.target.value })} placeholder="608000" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] uppercase text-zinc-550">Image URL</label>
                    <input type="text" required value={carForm.image} onChange={e => setCarForm({ ...carForm, image: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <input type="number" placeholder="Horsepower" value={carForm.horsepower} onChange={e => setCarForm({ ...carForm, horsepower: e.target.value })} className={`rounded-xl px-3 py-2 text-white focus:outline-none ${styleInput}`} />
                    <input type="number" placeholder="Torque" value={carForm.torque} onChange={e => setCarForm({ ...carForm, torque: e.target.value })} className={`rounded-xl px-3 py-2 text-white focus:outline-none ${styleInput}`} />
                    <input type="number" placeholder="Top Speed" value={carForm.topSpeed} onChange={e => setCarForm({ ...carForm, topSpeed: e.target.value })} className={`rounded-xl px-3 py-2 text-white focus:outline-none ${styleInput}`} />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all mt-4">Commit to Vault</button>
                </form>
              </motion.div>
            </div>
          )}

          {/* STORE PRODUCT MODAL */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md p-6 rounded-[2rem] border shadow-2xl relative ${styleCard}`}>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Catalog Store Product</h3>
                  <button onClick={() => setIsProductModalOpen(false)} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">Close</button>
                </div>
                <form onSubmit={handleProductSubmit} className="space-y-4 text-[10px] font-bold text-zinc-400">
                  <div className="space-y-1">
                    <label className="text-[7px] uppercase text-zinc-550">Product Title</label>
                    <input type="text" required value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} placeholder="Rotary Forged Luxury Rim" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Brand</label>
                      <input type="text" required value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} placeholder="Aetherion Wheels" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Category</label>
                      <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer ${styleInput}`}>
                        <option value="Forged Wheels">Forged Wheels</option>
                        <option value="Alloy Wheels">Alloy Wheels</option>
                        <option value="Carbon Fiber">Carbon Fiber</option>
                        <option value="Ceramic Coating">Ceramic Coating</option>
                        <option value="Interior">Interior</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Price ($)</label>
                      <input type="number" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Stock Quantity</label>
                      <input type="number" required value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all mt-4">Add to Store</button>
                </form>
              </motion.div>
            </div>
          )}

          {/* GARAGE WORK ORDER MODAL */}
          {isJobModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md p-6 rounded-[2rem] border shadow-2xl relative ${styleCard}`}>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Assign Diagnostic Work Order</h3>
                  <button onClick={() => setIsJobModalOpen(false)} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">Close</button>
                </div>
                <form onSubmit={handleJobSubmit} className="space-y-4 text-[10px] font-bold text-zinc-400">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Vehicle Model</label>
                      <input type="text" required value={jobForm.car} onChange={e => setJobForm({ ...jobForm, car: e.target.value })} placeholder="Acura NSX" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">VIP Client</label>
                      <input type="text" required value={jobForm.customer} onChange={e => setJobForm({ ...jobForm, customer: e.target.value })} placeholder="Lando Norris" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Assign Mechanic</label>
                      <select value={jobForm.mechanic} onChange={e => setJobForm({ ...jobForm, mechanic: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer ${styleInput}`}>
                        <option value="Marco Rossi">Marco Rossi</option>
                        <option value="Pierre Dubois">Pierre Dubois</option>
                        <option value="Kenji Tanaka">Kenji Tanaka</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Service Scope</label>
                      <input type="text" required value={jobForm.jobType} onChange={e => setJobForm({ ...jobForm, jobType: e.target.value })} placeholder="Active Aerodynamics tuning" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7px] uppercase text-zinc-555">Diagnostics notes</label>
                    <textarea rows="3" value={jobForm.details} onChange={e => setJobForm({ ...jobForm, details: e.target.value })} placeholder="Recalibrating high speed dampers." className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none resize-none ${styleInput}`} />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all mt-4">Submit Work Order</button>
                </form>
              </motion.div>
            </div>
          )}

          {/* WORKER ONBOARD MODAL */}
          {isWorkerModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md p-6 rounded-[2rem] border shadow-2xl relative ${styleCard}`}>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Onboard Crew Member</h3>
                  <button onClick={() => setIsWorkerModalOpen(false)} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">Close</button>
                </div>
                <form onSubmit={handleWorkerSubmit} className="space-y-4 text-[10px] font-bold text-zinc-400">
                  <div className="space-y-1">
                    <label className="text-[7px] uppercase text-zinc-550">Crew Member Name</label>
                    <input type="text" required value={workerForm.name} onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })} placeholder="Kenji Tanaka" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Crew Role</label>
                      <input type="text" required value={workerForm.role} onChange={e => setWorkerForm({ ...workerForm, role: e.target.value })} placeholder="EV Systems Architect" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-[#1c1c1c] font-black">Department</label>
                      <select value={workerForm.dept} onChange={e => setWorkerForm({ ...workerForm, dept: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer ${styleInput}`}>
                        <option value="Garage & Tuning">Garage & Tuning</option>
                        <option value="VIP Sales">VIP Sales</option>
                        <option value="EV Autonomy">EV Autonomy</option>
                        <option value="Customer Support">Customer Support</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Monthly Salary ($)</label>
                      <input type="number" required value={workerForm.salary} onChange={e => setWorkerForm({ ...workerForm, salary: e.target.value })} placeholder="12500" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-555">Shift schedule</label>
                      <select value={workerForm.shift} onChange={e => setWorkerForm({ ...workerForm, shift: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer ${styleInput}`}>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all mt-4">Submit Crew profile</button>
                </form>
              </motion.div>
            </div>
          )}

          {/* FINANCE LEDGER TRANSACTION MODAL */}
          {isTxModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`w-full max-w-md p-6 rounded-[2rem] border shadow-2xl relative ${styleCard}`}>
                <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${styleTextTitle}`}>Record Expenditure</h3>
                  <button onClick={() => setIsTxModalOpen(false)} className="text-[8px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">Close</button>
                </div>
                <form onSubmit={handleTxSubmit} className="space-y-4 text-[10px] font-bold text-zinc-400">
                  <div className="space-y-1">
                    <label className="text-[7px] uppercase text-zinc-550">Expenditure Title</label>
                    <input type="text" required value={txForm.name} onChange={e => setTxForm({ ...txForm, name: e.target.value })} placeholder="Brake Caliper replacement" className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Category</label>
                      <select value={txForm.category} onChange={e => setTxForm({ ...txForm, category: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none cursor-pointer ${styleInput}`}>
                        <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                        <option value="Staff Salaries">Staff Salaries</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[7px] uppercase text-zinc-550">Amount ($)</label>
                      <input type="number" required value={txForm.amount} onChange={e => setTxForm({ ...txForm, amount: e.target.value })} className={`w-full rounded-xl px-4 py-2.5 text-white focus:outline-none ${styleInput}`} />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-[#D4AF37] text-black hover:bg-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all mt-4">Log transaction</button>
                </form>
              </motion.div>
            </div>
          )}

        </AnimatePresence>

      </main>
    </div>
  );
}
