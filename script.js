// تحسين تجربة المستخدم وإضافة وظائف جديدة

// التحقق من تطابق كلمات المرور في صفحة التسجيل
function validatePassword() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('كلمات المرور غير متطابقة');
    } else {
        confirmPassword.setCustomValidity('');
    }
}

// إضافة منتج إلى السلة مع تأثيرات متحركة
function addToCart(productName, price, element) {
    // إنشاء عنصر في localStorage إذا لم يكن موجودًا
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // الحصول على السلة الحالية
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        // زيادة الكمية إذا كان المنتج موجودًا بالفعل
        existingProduct.quantity += 1;
    } else {
        // إضافة منتج جديد إذا لم يكن موجودًا
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // حفظ السلة المحدثة
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // إضافة تأثير متحرك للزر
    if (element) {
        element.classList.add('added');
        element.textContent = 'تمت الإضافة ✓';
        
        setTimeout(() => {
            element.classList.remove('added');
            element.textContent = 'إضافة للسلة';
        }, 1500);
    }
    
    // عرض رسالة تأكيد
    showNotification(`تمت إضافة ${productName} إلى السلة`);
    
    // تحديث عدد العناصر في السلة
    updateCartCount();
    
    // إضافة تأثير متحرك للسلة
    animateCart();
}

// تأثير متحرك للسلة عند إضافة منتج
function animateCart() {
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink) {
        cartLink.classList.add('cart-shake');
        setTimeout(() => {
            cartLink.classList.remove('cart-shake');
        }, 500);
    }
}

// عرض إشعار بسيط مع تأثيرات متحركة
function showNotification(message) {
    // إزالة الإشعارات السابقة
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // إضافة أيقونة
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    if (!window.FontAwesome) {
        notification.innerHTML = `✓ ${message}`;
    }
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // تأثير متحرك للظهور
    setTimeout(() => {
        notification.style.transform = 'translateY(10px)';
    }, 10);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
    }, 50);
    
    // إزالة الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// تحديث عدد العناصر في السلة مع تأثير متحرك
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    // الحصول على السلة من localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // حساب إجمالي العناصر
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // الحصول على القيمة السابقة للتأثير المتحرك
    const previousValue = parseInt(cartCountElement.textContent) || 0;
    
    // تحديث العنصر في واجهة المستخدم
    cartCountElement.textContent = totalItems;
    
    // إخفاء العدد إذا كانت السلة فارغة
    if (totalItems === 0) {
        cartCountElement.style.display = 'none';
    } else {
        cartCountElement.style.display = 'inline-block';
    }
}

// عرض محتويات السلة في صفحة السلة
function displayCart() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    if (!cartTableBody) return;
    
    // الحصول على السلة من localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // مسح محتويات الجدول الحالية
    cartTableBody.innerHTML = '';
    
    // التحقق مما إذا كانت السلة فارغة
    if (cart.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 30px;">
                السلة فارغة. <a href="products.html">تصفح المنتجات</a>
            </td>
        `;
        cartTableBody.appendChild(emptyRow);
        
        // إخفاء ملخص الطلب
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        
        return;
    }
    
    // إضافة كل منتج إلى الجدول
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        subtotal += total;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="product${index + 1}.jpg" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>${item.price} ريال</td>
            <td>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                onchange="updateQuantity('${item.name}', this.value)">
            </td>
            <td>${total} ريال</td>
            <td><button class="remove-btn" onclick="removeFromCart('${item.name}')">إزالة</button></td>
        `;
        
        cartTableBody.appendChild(row);
    });
    
    // تحديث ملخص الطلب
    updateOrderSummary(subtotal);
}

// تحديث كمية منتج في السلة
function updateQuantity(productName, quantity) {
    // الحصول على السلة من localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // البحث عن المنتج
    const product = cart.find(item => item.name === productName);
    
    if (product) {
        // تحديث الكمية
        product.quantity = parseInt(quantity);
        
        // حفظ السلة المحدثة
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // تحديث عرض السلة
        displayCart();
    }
}

// إزالة منتج من السلة
function removeFromCart(productName) {
    // الحصول على السلة من localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // إزالة المنتج
    const updatedCart = cart.filter(item => item.name !== productName);
    
    // حفظ السلة المحدثة
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // تحديث عرض السلة
    displayCart();
    
    // تحديث عدد العناصر في السلة
    updateCartCount();
    
    // عرض رسالة تأكيد
    showNotification(`تمت إزالة ${productName} من السلة`);
}

// تحديث ملخص الطلب
function updateOrderSummary(subtotal) {
    const summaryElement = document.querySelector('.cart-summary');
    if (!summaryElement) return;
    
    // حساب الشحن والضريبة
    const shipping = 20;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    // تحديث العناصر في واجهة المستخدم
    const summaryContent = `
        <h2>ملخص الطلب</h2>
        <div class="summary-row">
            <span>المجموع الفرعي:</span>
            <span>${subtotal.toFixed(2)} ريال</span>
        </div>
        <div class="summary-row">
            <span>الشحن:</span>
            <span>${shipping.toFixed(2)} ريال</span>
        </div>
        <div class="summary-row">
            <span>الضريبة (15%):</span>
            <span>${tax.toFixed(2)} ريال</span>
        </div>
        <hr>
        <div class="summary-row" style="font-weight: bold; margin-top: 15px;">
            <span>المجموع الكلي:</span>
            <span>${total.toFixed(2)} ريال</span>
        </div>
        
        <a href="checkout.html" class="checkout-btn">إتمام الشراء</a>
    `;
    
    summaryElement.innerHTML = summaryContent;
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // إضافة مستمعي الأحداث لنموذج التسجيل
    const registerForm = document.querySelector('form');
    if (registerForm && window.location.href.includes('register.html')) {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        
        if (password && confirmPassword) {
            password.addEventListener('change', validatePassword);
            confirmPassword.addEventListener('keyup', validatePassword);
            
            registerForm.addEventListener('submit', function(event) {
                if (password.value !== confirmPassword.value) {
                    event.preventDefault();
                    alert('كلمات المرور غير متطابقة');
                }
            });
        }
    }
    
    // إضافة مستمعي الأحداث لأزرار "إضافة للسلة"
    const addToCartButtons = document.querySelectorAll('.btn');
    addToCartButtons.forEach(button => {
        if (button.textContent === 'إضافة للسلة') {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                
                // الحصول على معلومات المنتج من العناصر المجاورة
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const priceText = productCard.querySelector('.price').textContent;
                const price = parseInt(priceText.replace(/\D/g, ''));
                
                // إضافة المنتج إلى السلة
                addToCart(productName, price, this);
            });
        }
    });
    
    // عرض محتويات السلة في صفحة السلة
    if (window.location.href.includes('cart.html')) {
        displayCart();
    }
    
    // تحديث عدد العناصر في السلة
    updateCartCount();
    
    // إضافة عنصر عدد العناصر في السلة إلى القائمة
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink && !document.getElementById('cart-count')) {
        const cartCount = document.createElement('span');
        cartCount.id = 'cart-count';
        cartCount.className = 'cart-count';
        cartLink.appendChild(cartCount);
        updateCartCount();
    }
    
    // إضافة تأثيرات متحركة لصفحة من نحن
    if (window.location.href.includes('about.html')) {
        // إضافة تأثير متحرك للصور عند التمرير
        const teamMembers = document.querySelectorAll('.team-member');
        
        // إضافة مستمع أحداث للنقر على صور الفريق
        teamMembers.forEach(member => {
            const img = member.querySelector('img');
            if (img) {
                img.addEventListener('click', function() {
                    this.classList.toggle('enlarged');
                    if (this.classList.contains('enlarged')) {
                        this.style.transform = 'scale(1.2)';
                        this.style.cursor = 'zoom-out';
                    } else {
                        this.style.transform = '';
                        this.style.cursor = 'zoom-in';
                    }
                });
                
                // تعيين مؤشر الفأرة
                img.style.cursor = 'zoom-in';
            }
        });
        
        // إضافة تأثير متحرك لقسم الرؤية والرسالة
        const missionSection = document.querySelector('.mission-section');
        if (missionSection) {
            // إضافة تأثير عند التمرير
            window.addEventListener('scroll', function() {
                const sectionPosition = missionSection.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (sectionPosition < screenPosition) {
                    missionSection.style.opacity = '1';
                    missionSection.style.transform = 'translateY(0)';
                }
            });
            
            // تعيين الحالة الأولية
            missionSection.style.opacity = '0';
            missionSection.style.transform = 'translateY(20px)';
            missionSection.style.transition = 'all 0.5s ease';
            
            // تشغيل التحقق مرة واحدة للتأكد من أن القسم مرئي عند تحميل الصفحة
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 100);
        }
    }
});

