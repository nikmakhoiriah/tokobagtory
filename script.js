// Data Produk
const products = [
    {
        id: 1,
        name: "Tas Kulit Elegan",
        price: 250685,
        image: "tas_kulit.jpeg"
    },
    {
        id: 2,
        name: "Tas Tote Modern",
        price: 124300,
        image: "tas_tote_modren.jpeg"
    },
    {
        id: 3,
        name: "Yumi Tas Miniatur",
        price: 180000,
        image: "Yumi_Tas_Miniatur.webp"
    },
    {
        id: 4,
        name: "Yumi Totebag",
        price: 89000,
        image: "totebag_.webp"
    },
    {
        id: 5,
        name: "BOSTANTEN Tas Selempang",
        price: 176758,
        image: "bostante_tas_selempang.webp"
    },
    {
        id: 6,
        name: "Nandalu Tas Wanita",
        price: 298000,
        image: "Nadalu_Tas_Wanita.webp"
    }
];

// Keranjang Belanja
let cart = [];

// Format Rupiah
function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Render Produk ke Halaman
function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price">${formatRupiah(p.price)}</div>
                <button class="add-to-cart" onclick="addToCart(${p.id})">
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

// Tambah Produk ke Keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartCount();
    alert(`${product.name} ditambahkan ke keranjang!`);
}

// Update Jumlah Item di Keranjang
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Hapus Produk dari Keranjang
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// Update Kuantitas Produk
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
        }
    }
    updateCartCount();
}

// Hitung Total Belanja
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Render Keranjang Belanja
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const checkoutSection = document.getElementById('checkoutSection');

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><h3>Keranjang Anda Kosong</h3><p>Silakan tambahkan produk ke keranjang</p></div>';
        checkoutSection.innerHTML = '';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatRupiah(item.price)}</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
        </div>
    `).join('');

    const subtotal = calculateTotal();
    const ongkir = 25000;
    const total = subtotal + ongkir;

    checkoutSection.innerHTML = `
        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatRupiah(subtotal)}</span>
            </div>
            <div class="total-row">
                <span>Ongkos Kirim:</span>
                <span>${formatRupiah(ongkir)}</span>
            </div>
            <div class="total-row grand-total">
                <span>Total Pembayaran:</span>
                <span>${formatRupiah(total)}</span>
            </div>
        </div>

        <h3>📋 Informasi Pembeli</h3>
        <form id="checkoutForm" onsubmit="processCheckout(event)">
            <div class="form-group">
                <label>Nama Lengkap:</label>
                <input type="text" id="nama" required placeholder="Masukkan nama lengkap">
            </div>
            <div class="form-group">
                <label>Nomor Telepon:</label>
                <input type="tel" id="telp" required placeholder="08xxxxxxxxxx">
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="email" required placeholder="email@example.com">
            </div>
            <div class="form-group">
                <label>Alamat Lengkap:</label>
                <textarea id="alamat" required placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"></textarea>
            </div>
            <div class="form-group">
                <label>Kota:</label>
                <input type="text" id="kota" required placeholder="Nama Kota">
            </div>
            <div class="form-group">
                <label>Kode Pos:</label>
                <input type="text" id="kodepos" required placeholder="12345">
            </div>
            <div class="form-group">
                <label>Metode Pembayaran:</label>
                <select id="payment" required>
                    <option value="">Pilih Metode Pembayaran</option>
                    <option value="Transfer Bank">Transfer Bank</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="E-Wallet">E-Wallet (GoPay/OVO/Dana)</option>
                    <option value="Kartu Kredit">Kartu Kredit</option>
                </select>
            </div>
            <button type="submit" class="checkout-btn">
                💳 Proses Pembayaran ${formatRupiah(total)}
            </button>
        </form>
    `;
}

// Proses Checkout
function processCheckout(e) {
    e.preventDefault();
    
    const nama = document.getElementById('nama').value;
    const telp = document.getElementById('telp').value;
    const email = document.getElementById('email').value;
    const alamat = document.getElementById('alamat').value;
    const kota = document.getElementById('kota').value;
    const kodepos = document.getElementById('kodepos').value;
    const payment = document.getElementById('payment').value;
    
    const subtotal = calculateTotal();
    const ongkir = 25000;
    const total = subtotal + ongkir;

    const orderSummary = `
        <div class="success-message">
            <h2>✅ Pesanan Berhasil!</h2>
            <p>Terima kasih atas pembelian Anda</p>
        </div>
        
        <h3>📦 Detail Pesanan</h3>
        ${cart.map(item => `
            <div style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong> - ${item.quantity}x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}
            </div>
        `).join('')}
        
        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatRupiah(subtotal)}</span>
            </div>
            <div class="total-row">
                <span>Ongkos Kirim:</span>
                <span>${formatRupiah(ongkir)}</span>
            </div>
            <div class="total-row grand-total">
                <span>Total Pembayaran:</span>
                <span>${formatRupiah(total)}</span>
            </div>
        </div>

        <h3>👤 Informasi Pembeli</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <p><strong>Nama:</strong> ${nama}</p>
            <p><strong>Telepon:</strong> ${telp}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Alamat:</strong> ${alamat}</p>
            <p><strong>Kota:</strong> ${kota}</p>
            <p><strong>Kode Pos:</strong> ${kodepos}</p>
            <p><strong>Metode Pembayaran:</strong> ${payment}</p>
        </div>

        <button class="checkout-btn" onclick="resetCart()">
            Kembali ke Toko
        </button>
    `;

    document.getElementById('cartItems').innerHTML = '';
    document.getElementById('checkoutSection').innerHTML = orderSummary;
}

// Reset Keranjang
function resetCart() {
    cart = [];
    updateCartCount();
    closeCart();
}

// Buka Modal Keranjang
function openCart() {
    renderCart();
    document.getElementById('cartModal').style.display = 'block';
}

// Tutup Modal Keranjang
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Tutup Modal ketika klik di luar
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) {
        closeCart();
    }
}

// Jalankan saat halaman dimuat
renderProducts();