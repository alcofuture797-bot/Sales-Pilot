document.addEventListener('DOMContentLoaded', () => {
    const addClientBtn = document.getElementById('add-client-btn');
    const modal = document.getElementById('add-client-modal');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const addClientForm = document.getElementById('add-client-form');
    const clientList = document.getElementById('client-list');
    const validationMessage = document.querySelector('.validation-message');

    let clients = [];

    const openModal = () => modal.style.display = 'block';
    const closeModal = () => {
        modal.style.display = 'none';
        addClientForm.reset();
        validationMessage.textContent = '';
    };

    addClientBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    const orderModal = document.getElementById('add-order-modal');
    const closeOrderBtn = document.querySelector('.close-order-btn');
    const cancelOrderBtn = document.querySelector('.cancel-order-btn');
    const addOrderForm = document.getElementById('add-order-form');
    const orderValidationMessage = document.getElementById('order-validation-message');
    const orderClientName = document.getElementById('order-client-name');
    const orderClientIdInput = document.getElementById('order-client-id');

    let orders = [];

    const openOrderModal = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            orderClientName.textContent = client.name;
            orderClientIdInput.value = clientId;
            orderModal.style.display = 'block';
        }
    };

    const closeOrderModal = () => {
        orderModal.style.display = 'none';
        addOrderForm.reset();
        orderValidationMessage.textContent = '';
    };

    closeOrderBtn.addEventListener('click', closeOrderModal);
    cancelOrderBtn.addEventListener('click', closeOrderModal);

    addOrderForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const category = document.getElementById('product-category').value;
        const amount = document.getElementById('order-amount').value;

        if (!category || !amount) {
            orderValidationMessage.textContent = 'Product Category and Amount are required.';
            return;
        }

        const newOrder = {
            id: Date.now(),
            clientId: parseInt(orderClientIdInput.value),
            category,
            amount,
            status: document.getElementById('order-status').value
        };

        orders.push(newOrder);
        renderAll();
        closeOrderModal();
    });

    function updateDashboard() {
        const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
        const activeClients = clients.filter(client => client.status === 'Active').length;
        const outstandingPayments = orders
            .filter(order => order.status !== 'Paid')
            .reduce((sum, order) => sum + parseFloat(order.amount), 0);
        const totalOrders = orders.length;

        document.getElementById('total-sales').textContent = `${totalSales.toFixed(2)} EGP`;
        document.getElementById('active-clients').textContent = activeClients;
        document.getElementById('outstanding-payments').textContent = `${outstandingPayments.toFixed(2)} EGP`;
        document.getElementById('total-orders').textContent = totalOrders;
    }

    function renderAll() {
        renderClients();
        updateDashboard();
    }

    addClientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const clientName = document.getElementById('client-name').value.trim();

        if (!clientName) {
            validationMessage.textContent = 'Client Name is required.';
            return;
        }

        const newClient = {
            id: Date.now(),
            name: clientName,
            type: document.getElementById('client-type').value,
            status: document.getElementById('status').value,
            location: document.getElementById('location').value,
            contactPerson: document.getElementById('contact-person').value,
            email: document.getElementById('contact-email').value,
            phone: document.getElementById('contact-phone').value,
            target: document.getElementById('monthly-target').value,
            nextVisit: document.getElementById('next-visit-date').value,
            notes: document.getElementById('notes').value,
        };

        clients.push(newClient);
        renderAll();
        closeModal();
    });

    function renderClients() {
        clientList.innerHTML = '';
        clients.forEach(client => {
            const clientCard = document.createElement('div');
            clientCard.className = 'client-card';
            clientCard.setAttribute('data-client-id', client.id);

            const clientOrders = orders.filter(order => order.clientId === client.id);
            const totalSales = clientOrders.reduce((sum, order) => sum + parseFloat(order.amount), 0);

            clientCard.innerHTML = `
                <h3>${client.name}</h3>
                <p><strong>Location:</strong> ${client.location}</p>
                <p><strong>Type:</strong> ${client.type}</p>
                <p><strong>Status:</strong> ${client.status}</p>
                <p><strong>Total Sales:</strong> ${totalSales.toFixed(2)} EGP</p>
                <div class="client-card-orders">
                    <h4>Orders:</h4>
                    <ul class="order-list">
                        ${clientOrders.map(order => `<li>${order.category}: ${order.amount} EGP (${order.status})</li>`).join('') || '<li>No orders yet.</li>'}
                    </ul>
                </div>
                <button class="add-order-btn">Add Order</button>
            `;
            clientList.appendChild(clientCard);
        });
    }

    clientList.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-order-btn')) {
            const card = event.target.closest('.client-card');
            const clientId = parseInt(card.getAttribute('data-client-id'));
            openOrderModal(clientId);
        }
    });
});