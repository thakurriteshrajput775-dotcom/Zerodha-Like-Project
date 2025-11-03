// Login functionality
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');

// Application State
const state = {
    portfolioValue: 125430.50,
    availableCash: 15680.25,
    todayPL: 1240.50,
    todayPLPercent: 0.98,
    portfolioChange: 2450.80,
    portfolioChangePercent: 1.99,
    holdings: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', shares: 12, avgPrice: 2400.50, currentPrice: 2450.75, value: 29409.00, pnl: 603.00, pnlPercent: 2.09 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', shares: 8, avgPrice: 3250.25, currentPrice: 3285.50, value: 26284.00, pnl: 282.00, pnlPercent: 1.08 },
        { symbol: 'INFY', name: 'Infosys', shares: 15, avgPrice: 1660.75, currentPrice: 1650.25, value: 24753.75, pnl: -157.50, pnlPercent: -0.63 },
        { symbol: 'HDFC', name: 'HDFC Bank', shares: 10, avgPrice: 1565.80, currentPrice: 1580.40, value: 15804.00, pnl: 146.00, pnlPercent: 0.93 }
    ],
    watchlist: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2450.75, change: 1.25, changePercent: 1.25 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3285.50, change: 27.85, changePercent: 0.85 },
        { symbol: 'INFY', name: 'Infosys', price: 1650.25, change: -7.45, changePercent: -0.45 },
        { symbol: 'HDFC', name: 'HDFC Bank', price: 1580.40, change: 17.52, changePercent: 1.12 }
    ],
    orders: [
        { id: 1, symbol: 'RELIANCE', type: 'BUY', quantity: 5, price: 2445.00, status: 'completed', timestamp: '2023-06-15 10:23:45' },
        { id: 2, symbol: 'TCS', type: 'SELL', quantity: 3, price: 3290.00, status: 'pending', timestamp: '2023-06-15 09:45:12' },
        { id: 3, symbol: 'INFY', type: 'BUY', quantity: 10, price: 1645.00, status: 'completed', timestamp: '2023-06-14 14:32:18' },
        { id: 4, symbol: 'HDFC', type: 'BUY', quantity: 8, price: 1575.00, status: 'cancelled', timestamp: '2023-06-14 11:15:33' }
    ],
    positions: [
        { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 12, avgPrice: 2400.50, ltp: 2450.75, pnl: 603.00 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 8, avgPrice: 3250.25, ltp: 3285.50, pnl: 282.00 },
        { symbol: 'INFY', name: 'Infosys', quantity: 15, avgPrice: 1660.75, ltp: 1650.25, pnl: -157.50 }
    ],
    transactions: [
        { id: 1, type: 'credit', description: 'Funds added via UPI', amount: 10000, date: '2023-06-15' },
        { id: 2, type: 'debit', description: 'Stock purchase - RELIANCE', amount: 12225, date: '2023-06-14' },
        { id: 3, type: 'credit', description: 'Dividend received - TCS', amount: 320, date: '2023-06-10' },
        { id: 4, type: 'debit', description: 'Stock purchase - INFY', amount: 16450, date: '2023-06-08' }
    ],
    searchData: [
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.' },
        { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.' },
        { symbol: 'INFY', name: 'Infosys Ltd.' },
        { symbol: 'HDFC', name: 'HDFC Bank Ltd.' },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.' },
        { symbol: 'ITC', name: 'ITC Ltd.' },
        { symbol: 'SBIN', name: 'State Bank of India' },
        { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.' }
    ],
    chartData: {
        labels: [],
        data: []
    }
};

// Chart instance
let portfolioChart;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const watchlistContainer = document.getElementById('watchlistContainer');
const holdingsList = document.getElementById('holdingsList');
const orderList = document.getElementById('ordersList');
const addFundsBtn = document.getElementById('addFundsBtn');
const addFundsModal = document.getElementById('addFundsModal');
const buySellModal = document.getElementById('buySellModal');
const closeModalButtons = document.querySelectorAll('.close-modal');
const timeFilters = document.querySelectorAll('.time-filter');
const orderFilters = document.querySelectorAll('.order-filter');
const navLinks = document.querySelectorAll('.nav-links li');
const mobileNavItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
const buyBtn = document.getElementById('buyBtn');
const sellBtn = document.getElementById('sellBtn');
const priceTypeSelect = document.getElementById('priceType');
const priceInputContainer = document.getElementById('priceInputContainer');
const quantityInput = document.getElementById('quantity');
const estimatedAmount = document.getElementById('estimatedAmount');
const confirmTradeBtn = document.getElementById('confirmTrade');
const confirmAddFundsBtn = document.getElementById('confirmAddFunds');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.querySelector('.sidebar');
const pages = document.querySelectorAll('.page');
const filterTabs = document.querySelectorAll('.filter-tab');
const addFundsPageBtn = document.getElementById('addFundsPageBtn');

// Portfolio value elements
const portfolioValueEl = document.getElementById('portfolioValue');
const portfolioChangeEl = document.getElementById('portfolioChange');
const availableCashEl = document.getElementById('availableCash');
const todayPLEl = document.getElementById('todayPL');
const todayPLPercentEl = document.getElementById('todayPLPercent');
const fundsAvailableEl = document.getElementById('fundsAvailable');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in (for demo purposes)
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
    
    // Setup login form
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
});

// Handle login
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in a real app, this would be more secure)
    if (username && password) {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        showDashboard();
    } else {
        alert('Please enter both username and password');
    }
}

// Show login page
function showLogin() {
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
}

// Show dashboard
function showDashboard() {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    
    // Initialize dashboard components
    initializeChart();
    updatePortfolioValues();
    populateWatchlist();
    populateHoldings();
    populateOrders();
    populateHoldingsTable();
    populatePositionsTable();
    populateTransactions();
    setupEventListeners();
    startRealTimeUpdates();
    startLiveChartUpdates();
}

// Logout function (can be called from anywhere)
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    showLogin();
}

// Initialize chart with real-time data
function initializeChart() {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    
    // Generate initial chart data (last 60 minutes)
    const now = new Date();
    state.chartData.labels = [];
    state.chartData.data = [];
    
    for (let i = 60; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        state.chartData.labels.push(time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        
        // Start from base value and add some random variation
        const baseValue = 123000;
        const randomVariation = (Math.random() - 0.5) * 1000;
        const value = i === 60 ? baseValue : state.chartData.data[state.chartData.data.length - 1] + randomVariation;
        state.chartData.data.push(Math.max(value, 120000)); // Ensure minimum value
    }
    
    portfolioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: state.chartData.labels,
            datasets: [{
                label: 'Portfolio Value',
                data: state.chartData.data,
                borderColor: '#387ed1',
                backgroundColor: 'rgba(56, 126, 209, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 8
                    }
                }
            },
            animation: {
                duration: 0 // Disable animation for real-time updates
            },
            elements: {
                line: {
                    tension: 0.4 // Smooth line
                }
            }
        }
    });
}

// Update portfolio values in UI
function updatePortfolioValues() {
    portfolioValueEl.textContent = `₹${state.portfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    portfolioChangeEl.textContent = `+ ₹${state.portfolioChange.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${state.portfolioChangePercent.toFixed(2)}%)`;
    availableCashEl.textContent = `₹${state.availableCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    todayPLEl.textContent = `₹${state.todayPL.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    todayPLPercentEl.textContent = `+ ${state.todayPLPercent.toFixed(2)}%`;
    fundsAvailableEl.textContent = `₹${state.availableCash.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

// Populate watchlist
function populateWatchlist() {
    watchlistContainer.innerHTML = '';
    
    state.watchlist.forEach(stock => {
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        const changeIcon = stock.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        const stockItem = document.createElement('div');
        stockItem.className = 'stock-item';
        stockItem.innerHTML = `
            <div class="stock-info">
                <h4>${stock.symbol}</h4>
                <p>${stock.name}</p>
                <div class="stock-actions">
                    <button class="stock-action-btn buy" data-symbol="${stock.symbol}" data-price="${stock.price}">Buy</button>
                    <button class="stock-action-btn sell" data-symbol="${stock.symbol}" data-price="${stock.price}">Sell</button>
                </div>
            </div>
            <div class="stock-price">
                <span class="price">₹${stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span class="change ${changeClass}">
                    ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)
                    <i class="fas ${changeIcon}"></i>
                </span>
            </div>
        `;
        
        watchlistContainer.appendChild(stockItem);
    });
    
    // Add event listeners to buy/sell buttons
    document.querySelectorAll('.stock-action-btn.buy').forEach(btn => {
        btn.addEventListener('click', function() {
            openBuySellModal('buy', this.getAttribute('data-symbol'), this.getAttribute('data-price'));
        });
    });
    
    document.querySelectorAll('.stock-action-btn.sell').forEach(btn => {
        btn.addEventListener('click', function() {
            openBuySellModal('sell', this.getAttribute('data-symbol'), this.getAttribute('data-price'));
        });
    });
}

// Populate holdings
function populateHoldings() {
    holdingsList.innerHTML = '';
    
    state.holdings.forEach(holding => {
        const pnlClass = holding.pnl >= 0 ? 'positive' : 'negative';
        const pnlIcon = holding.pnl >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        const holdingItem = document.createElement('div');
        holdingItem.className = 'holding-item';
        holdingItem.innerHTML = `
            <div class="holding-info">
                <h4>${holding.symbol}</h4>
                <p>${holding.shares} shares • Avg: ₹${holding.avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            <div class="holding-value">
                <span class="value">₹${holding.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                <span class="change ${pnlClass}">
                    ${holding.pnl >= 0 ? '+' : ''}₹${holding.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${holding.pnlPercent.toFixed(2)}%)
                    <i class="fas ${pnlIcon}"></i>
                </span>
            </div>
        `;
        
        holdingsList.appendChild(holdingItem);
    });
}

// Populate holdings table
function populateHoldingsTable() {
    const tableBody = document.getElementById('holdingsTableBody');
    tableBody.innerHTML = '';
    
    state.holdings.forEach(holding => {
        const pnlClass = holding.pnl >= 0 ? 'pnl-positive' : 'pnl-negative';
        const pnlSign = holding.pnl >= 0 ? '+' : '';
        
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div class="stock-cell">
                <span class="stock-symbol">${holding.symbol}</span>
                <span class="stock-name">${holding.name}</span>
            </div>
            <div>${holding.shares}</div>
            <div>₹${holding.avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div>₹${holding.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div class="${pnlClass}">${pnlSign}₹${holding.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        `;
        
        tableBody.appendChild(row);
    });
}

// Populate positions table
function populatePositionsTable() {
    const tableBody = document.getElementById('positionsTableBody');
    tableBody.innerHTML = '';
    
    state.positions.forEach(position => {
        const pnlClass = position.pnl >= 0 ? 'pnl-positive' : 'pnl-negative';
        const pnlSign = position.pnl >= 0 ? '+' : '';
        
        const row = document.createElement('div');
        row.className = 'table-row';
        row.innerHTML = `
            <div class="stock-cell">
                <span class="stock-symbol">${position.symbol}</span>
                <span class="stock-name">${position.name}</span>
            </div>
            <div>${position.quantity}</div>
            <div>₹${position.avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div>₹${position.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div class="${pnlClass}">${pnlSign}₹${position.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        `;
        
        tableBody.appendChild(row);
    });
}

// Populate orders
function populateOrders(filter = 'all') {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    
    const filteredOrders = filter === 'all' 
        ? state.orders 
        : state.orders.filter(order => order.status === filter);
    
    filteredOrders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-info">
                <h4>${order.symbol} • ${order.type} • ${order.quantity} shares</h4>
                <p>Price: ₹${order.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })} • ${order.timestamp}</p>
            </div>
            <div class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
        `;
        
        ordersList.appendChild(orderItem);
    });
}

// Populate transactions
function populateTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    state.transactions.forEach(transaction => {
        const amountClass = transaction.type === 'credit' ? 'credit' : 'debit';
        const sign = transaction.type === 'credit' ? '+' : '-';
        
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        transactionItem.innerHTML = `
            <div class="transaction-info">
                <h4>${transaction.description}</h4>
                <p>${transaction.date}</p>
            </div>
            <div class="transaction-amount ${amountClass}">${sign}₹${transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        `;
        
        transactionsList.appendChild(transactionItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Modal functionality
    addFundsBtn.addEventListener('click', () => {
        addFundsModal.style.display = 'flex';
    });
    
    addFundsPageBtn.addEventListener('click', () => {
        addFundsModal.style.display = 'flex';
    });
    
    buyBtn.addEventListener('click', () => {
        openBuySellModal('buy');
    });
    
    sellBtn.addEventListener('click', () => {
        openBuySellModal('sell');
    });
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModals);
    });
    
    // Time filters
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            timeFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            // In a real app, this would update the chart data
        });
    });
    
    // Order filters
    orderFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            orderFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            const filterType = this.getAttribute('data-type');
            populateOrders(filterType);
        });
    });
    
    // Filter tabs for orders page
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const status = this.getAttribute('data-status');
            populateOrders(status);
        });
    });
    
    // Desktop navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Mobile navigation
    mobileNavItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileNavItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const page = this.getAttribute('data-page');
            showPage(page);
            
            // Close sidebar if open
            sidebar.classList.remove('mobile-open');
        });
    });
    
    // Mobile menu button
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('mobile-open');
    });
    
    // Price type change
    priceTypeSelect.addEventListener('change', function() {
        if (this.value === 'limit' || this.value === 'sl') {
            priceInputContainer.style.display = 'block';
        } else {
            priceInputContainer.style.display = 'none';
        }
    });
    
    // Quantity input change
    quantityInput.addEventListener('input', updateEstimatedAmount);
    
    // Confirm trade
    confirmTradeBtn.addEventListener('click', placeOrder);
    
    // Confirm add funds
    confirmAddFundsBtn.addEventListener('click', addFunds);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModals();
        }
    });
    
    // Close sidebar when clicking outside on mobile
    window.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !mobileMenuBtn.contains(event.target) &&
            sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
        }
    });
}

// Show specific page
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    // Update desktop nav
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// Handle search
function handleSearch() {
    const query = searchInput.value.toLowerCase();
    
    if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
    }
    
    const results = state.searchData.filter(item => 
        item.symbol.toLowerCase().includes(query) || 
        item.name.toLowerCase().includes(query)
    );
    
    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.style.display = 'none';
        return;
    }
    
    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <div><strong>${result.symbol}</strong></div>
            <div>${result.name}</div>
        `;
        
        resultItem.addEventListener('click', () => {
            searchInput.value = result.symbol;
            searchResults.style.display = 'none';
            // In a real app, this would navigate to the stock page
        });
        
        searchResults.appendChild(resultItem);
    });
    
    searchResults.style.display = 'block';
}

// Open buy/sell modal
function openBuySellModal(type, symbol = 'RELIANCE', price = '2450.75') {
    const modalTitle = document.getElementById('tradeModalTitle');
    const stockName = document.getElementById('tradeStockName');
    const stockPrice = document.getElementById('tradeStockPrice');
    
    modalTitle.textContent = type === 'buy' ? 'Buy Stock' : 'Sell Stock';
    stockName.textContent = symbol;
    stockPrice.textContent = `₹${parseFloat(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    
    // Reset form
    quantityInput.value = '';
    priceTypeSelect.value = 'market';
    priceInputContainer.style.display = 'none';
    estimatedAmount.textContent = '₹0.00';
    
    buySellModal.style.display = 'flex';
}

// Close all modals
function closeModals() {
    addFundsModal.style.display = 'none';
    buySellModal.style.display = 'none';
}

// Update estimated amount
function updateEstimatedAmount() {
    const quantity = parseInt(quantityInput.value) || 0;
    const price = 2450.75; // In a real app, this would be the current price
    
    const amount = quantity * price;
    estimatedAmount.textContent = `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

// Place order
function placeOrder() {
    const quantity = parseInt(quantityInput.value);
    const price = parseFloat(document.getElementById('price').value) || 2450.75;
    const symbol = document.getElementById('tradeStockName').textContent;
    const type = document.getElementById('tradeModalTitle').textContent.includes('Buy') ? 'BUY' : 'SELL';
    
    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    const totalAmount = quantity * price;
    
    if (type === 'BUY' && totalAmount > state.availableCash) {
        alert('Insufficient funds to place this order');
        return;
    }
    
    // Add order to state
    const newOrder = {
        id: state.orders.length + 1,
        symbol: symbol,
        type: type,
        quantity: quantity,
        price: price,
        status: 'completed',
        timestamp: new Date().toLocaleString('en-IN')
    };
    
    state.orders.unshift(newOrder);
    
    // Update portfolio based on order type
    if (type === 'BUY') {
        state.availableCash -= totalAmount;
        
        // Add to holdings or update existing holding
        const existingHolding = state.holdings.find(h => h.symbol === symbol);
        if (existingHolding) {
            const totalShares = existingHolding.shares + quantity;
            const totalCost = (existingHolding.avgPrice * existingHolding.shares) + (price * quantity);
            existingHolding.avgPrice = totalCost / totalShares;
            existingHolding.shares = totalShares;
            existingHolding.value = existingHolding.shares * existingHolding.currentPrice;
            existingHolding.pnl = existingHolding.value - totalCost;
            existingHolding.pnlPercent = (existingHolding.pnl / totalCost) * 100;
        } else {
            // Add new holding
            const newHolding = {
                symbol: symbol,
                name: state.searchData.find(s => s.symbol === symbol)?.name || symbol,
                shares: quantity,
                avgPrice: price,
                currentPrice: price,
                value: quantity * price,
                pnl: 0,
                pnlPercent: 0
            };
            state.holdings.push(newHolding);
        }
        
        // Add transaction
        state.transactions.unshift({
            id: state.transactions.length + 1,
            type: 'debit',
            description: `Stock purchase - ${symbol}`,
            amount: totalAmount,
            date: new Date().toISOString().split('T')[0]
        });
    } else {
        // SELL order
        state.availableCash += totalAmount;
        
        // Update holdings
        const existingHolding = state.holdings.find(h => h.symbol === symbol);
        if (existingHolding && existingHolding.shares >= quantity) {
            existingHolding.shares -= quantity;
            if (existingHolding.shares === 0) {
                // Remove holding if no shares left
                state.holdings = state.holdings.filter(h => h.symbol !== symbol);
            } else {
                existingHolding.value = existingHolding.shares * existingHolding.currentPrice;
                const totalCost = existingHolding.avgPrice * (existingHolding.shares + quantity);
                existingHolding.pnl = existingHolding.value - (existingHolding.avgPrice * existingHolding.shares);
                existingHolding.pnlPercent = (existingHolding.pnl / (existingHolding.avgPrice * existingHolding.shares)) * 100;
            }
            
            // Add transaction
            state.transactions.unshift({
                id: state.transactions.length + 1,
                type: 'credit',
                description: `Stock sale - ${symbol}`,
                amount: totalAmount,
                date: new Date().toISOString().split('T')[0]
            });
        }
    }
    
    // Update portfolio value (simplified calculation)
    state.portfolioValue = state.holdings.reduce((sum, h) => sum + h.value, 0) + state.availableCash;
    
    // Update UI
    updatePortfolioValues();
    populateHoldings();
    populateHoldingsTable();
    populateTransactions();
    
    alert(`Order placed for ${quantity} shares of ${symbol}`);
    closeModals();
}

// Add funds
function addFunds() {
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    // Update state
    state.availableCash += amount;
    state.portfolioValue += amount;
    
    // Add transaction
    state.transactions.unshift({
        id: state.transactions.length + 1,
        type: 'credit',
        description: `Funds added via ${paymentMethod}`,
        amount: amount,
        date: new Date().toISOString().split('T')[0]
    });
    
    // Update UI
    updatePortfolioValues();
    populateTransactions();
    
    alert(`₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} added via ${paymentMethod}`);
    closeModals();
    
    // Reset form
    amountInput.value = '';
}

// Start real-time updates for stock prices
function startRealTimeUpdates() {
    // Simulate real-time price updates
    setInterval(() => {
        // Update watchlist prices
        state.watchlist.forEach(stock => {
            const change = (Math.random() - 0.5) * 10;
            stock.price += change;
            stock.change += change;
            stock.changePercent = (stock.change / (stock.price - stock.change)) * 100;
        });
        
        // Update holdings prices
        state.holdings.forEach(holding => {
            const change = (Math.random() - 0.5) * 5;
            holding.currentPrice += change;
            holding.value = holding.shares * holding.currentPrice;
            holding.pnl = holding.value - (holding.avgPrice * holding.shares);
            holding.pnlPercent = (holding.pnl / (holding.avgPrice * holding.shares)) * 100;
        });
        
        // Update portfolio value
        const holdingsValue = state.holdings.reduce((sum, h) => sum + h.value, 0);
        state.portfolioValue = holdingsValue + state.availableCash;
        
        // Update UI
        updatePortfolioValues();
        populateWatchlist();
        populateHoldings();
        populateHoldingsTable();
    }, 2000); // Update every 2 seconds
}

// Start live chart updates
function startLiveChartUpdates() {
    setInterval(() => {
        // Add new data point
        const now = new Date();
        state.chartData.labels.push(now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        
        // Remove oldest data point if we have more than 60 points
        if (state.chartData.labels.length > 60) {
            state.chartData.labels.shift();
            state.chartData.data.shift();
        }
        
        // Calculate new value with realistic market movement
        const lastValue = state.chartData.data[state.chartData.data.length - 1] || 123000;
        const volatility = 0.002; // 0.2% volatility
        const changePercent = (Math.random() - 0.5) * volatility;
        const newValue = lastValue * (1 + changePercent);
        
        state.chartData.data.push(newValue);
        
        // Update the chart
        portfolioChart.data.labels = state.chartData.labels;
        portfolioChart.data.datasets[0].data = state.chartData.data;
        portfolioChart.update('none'); // 'none' for no animation during live updates
    }, 1000); // Update every second for real-time feel
}