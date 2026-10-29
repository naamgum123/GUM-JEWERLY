function escapeHTML(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
}

const reviewForm = document.getElementById("reviewForm");
const reviewsList = document.getElementById("reviewsList");
const reviewMessage = document.getElementById("reviewMessage");

let reviews = JSON.parse(localStorage.getItem("gumReviews")) || [];

function displayReviews() {

    if (!reviewsList) {
        return;
    }

    reviewsList.innerHTML = "";

    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <p class="no-reviews">
                No reviews yet. Be the first to share your experience.
            </p>
        `;
        return;
    }

    reviews.forEach(function(review) {

        const reviewItem = document.createElement("div");

        reviewItem.classList.add("review-item");

        reviewItem.innerHTML = `
            <h4>${escapeHTML(review.name)}</h4>
            <div class="review-stars">
                ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
            </div>
            <p>${escapeHTML(review.text)}</p>
        `;

        reviewsList.appendChild(reviewItem);
    });
}


if (reviewForm) {

    reviewForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("reviewName").value.trim();

        const rating =
            Number(document.getElementById("reviewRating").value);

        const text =
            document.getElementById("reviewText").value.trim();

        if (!name || !rating || !text) {

            reviewMessage.textContent =
                "Please complete all fields.";

            return;
        }

        const newReview = {
            name: name,
            rating: rating,
            text: text
        };

        reviews.push(newReview);

        localStorage.setItem(
            "gumReviews",
            JSON.stringify(reviews)
        );

        reviewMessage.textContent =
            "Thank you for your review!";

        reviewForm.reset();

        displayReviews();

    });

}

displayReviews();
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm) newsletterForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;

    localStorage.setItem("subscriberEmail", email);

    newsletterMessage.textContent =
        "Thank you for subscribing to GUM Jewelry!";

    newsletterForm.reset();

});
const contactForm = document.getElementById("contactForm");
const contactResponse = document.getElementById("contactResponse");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        contactResponse.textContent =
            "Thank you for contacting GUM Jewelry. We will get back to you soon.";

        contactForm.reset();

    });

}
// Navigation dropdown
document.querySelectorAll(".dropdown-toggle").forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.stopPropagation();
        const dropdown = button.closest(".dropdown");
        const isOpen = dropdown.classList.contains("open");
        document.querySelectorAll(".dropdown.open").forEach(function(item) {
            item.classList.remove("open");
        });
        if (!isOpen) {
            dropdown.classList.add("open");
        }
    });
});
document.addEventListener("click", function() {
    document.querySelectorAll(".dropdown.open").forEach(function(item) {
        item.classList.remove("open");
    });
});

// Mobile hamburger menu

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function() {
        navLinks.classList.toggle("active");
    });

}
// GUM Jewelry Shopping Cart

let gumCart = JSON.parse(localStorage.getItem("gumCart")) || [];

function saveCart() {
    localStorage.setItem("gumCart", JSON.stringify(gumCart));
}

document.querySelectorAll(".product-card, .shop-product-card").forEach(function(card) {

    const button = card.querySelector("button");

    if (!button || !button.textContent.toLowerCase().includes("add to cart")) {
        return;
    }

    button.addEventListener("click", function() {

        const name = card.querySelector("h3").textContent.trim();
        const priceText = card.querySelector(".price, .shop-price").textContent;
        const price = Number(priceText.replace(/[^0-9.]/g, ""));
        const image = card.querySelector("img").getAttribute("src");

        const existingProduct = gumCart.find(function(product) {
            return product.name === name;
        });

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            gumCart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }

        saveCart();

        alert(name + " added to your cart!");
    });

});
// Display saved products on the cart page

const cartItemsContainer = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

function displayCart() {

    if (!cartItemsContainer || !cartTotalElement) {
        return;
    }

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (gumCart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your shopping cart is empty.</p>";
        cartTotalElement.textContent = "0 UGX";
        return;
    }

    gumCart.forEach(function(product, index) {

        const itemTotal = product.price * product.quantity;
        total += itemTotal;

        const item = document.createElement("div");
        item.classList.add("cart-item");

        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}" width="100">
            <div>
                <h3>${product.name}</h3>
                <p>Price: ${product.price.toLocaleString()} UGX</p>
                <p>Quantity: ${product.quantity}</p>
                <p>Subtotal: ${itemTotal.toLocaleString()} UGX</p>
                <button class="remove-cart-item" data-index="${index}">
                    Remove
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(item);
    });

    cartTotalElement.textContent = total.toLocaleString() + " UGX";
}

if (cartItemsContainer) {
    displayCart();

    cartItemsContainer.addEventListener("click", function(event) {

        if (event.target.classList.contains("remove-cart-item")) {

            const index = Number(event.target.dataset.index);

            gumCart.splice(index, 1);
            saveCart();
            displayCart();
        }

    });
}

// FAQ accordion
document.querySelectorAll(".faq-question").forEach(function(btn) {
    btn.addEventListener("click", function() {
        const item = btn.closest(".faq-item");
        item.classList.toggle("open");
        btn.setAttribute("aria-expanded", item.classList.contains("open"));
    });
});

// Gallery filter + lightbox
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");

if (galleryItems.length && lightbox) {
    const lbImg = document.getElementById("lbImg");
    const lbCaption = document.getElementById("lbCaption");
    let visible = [];
    let current = 0;

    document.querySelectorAll(".filter-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".filter-btn").forEach(function(b) { b.classList.remove("active"); });
            btn.classList.add("active");
            galleryItems.forEach(function(item) {
                const show = btn.dataset.filter === "All" || item.dataset.category === btn.dataset.filter;
                item.classList.toggle("hide", !show);
            });
        });
    });

    function showImage(i) {
        current = (i + visible.length) % visible.length;
        const img = visible[current].querySelector("img");
        lbImg.src = img.getAttribute("src");
        lbImg.alt = img.alt;
        lbCaption.textContent = img.alt;
    }

    galleryItems.forEach(function(item) {
        item.addEventListener("click", function() {
            visible = Array.from(galleryItems).filter(function(g) { return !g.classList.contains("hide"); });
            showImage(visible.indexOf(item));
            lightbox.classList.add("open");
        });
    });

    document.getElementById("lbClose").addEventListener("click", function() { lightbox.classList.remove("open"); });
    document.getElementById("lbPrev").addEventListener("click", function() { showImage(current - 1); });
    document.getElementById("lbNext").addEventListener("click", function() { showImage(current + 1); });
    lightbox.addEventListener("click", function(e) { if (e.target === lightbox) lightbox.classList.remove("open"); });
    document.addEventListener("keydown", function(e) {
        if (!lightbox.classList.contains("open")) return;
        if (e.key === "Escape") lightbox.classList.remove("open");
        if (e.key === "ArrowLeft") showImage(current - 1);
        if (e.key === "ArrowRight") showImage(current + 1);
    });
}


// Wishlist
let gumWishlist = JSON.parse(localStorage.getItem("gumWishlist")) || [];

function saveWishlist() {
    localStorage.setItem("gumWishlist", JSON.stringify(gumWishlist));
}

document.querySelectorAll(".product-card, .shop-product-card").forEach(function(card) {
    const name = card.querySelector("h3").textContent.trim();
    const heart = document.createElement("button");
    heart.type = "button";
    heart.className = "wish-btn";
    heart.setAttribute("aria-label", "Add to wishlist");

    function sync() {
        const saved = gumWishlist.some(function(p) { return p.name === name; });
        heart.textContent = saved ? "\u2665" : "\u2661";
        heart.classList.toggle("active", saved);
    }

    heart.addEventListener("click", function() {
        const index = gumWishlist.findIndex(function(p) { return p.name === name; });
        if (index >= 0) {
            gumWishlist.splice(index, 1);
        } else {
            const priceText = card.querySelector(".price, .shop-price").textContent;
            gumWishlist.push({
                name: name,
                price: Number(priceText.replace(/[^0-9.]/g, "")),
                image: card.querySelector("img").getAttribute("src")
            });
        }
        saveWishlist();
        sync();
    });

    sync();
    card.appendChild(heart);
});

const wishlistContainer = document.getElementById("wishlistItems");

function displayWishlist() {
    if (!wishlistContainer) { return; }
    wishlistContainer.innerHTML = "";

    if (gumWishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
        return;
    }

    gumWishlist.forEach(function(product, index) {
        const item = document.createElement("div");
        item.classList.add("cart-item");
        item.innerHTML = `
            <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" width="100">
            <div>
                <h3>${escapeHTML(product.name)}</h3>
                <p>Price: ${product.price.toLocaleString()} UGX</p>
                <button class="wish-to-cart" data-index="${index}">Add to Cart</button>
                <button class="wish-remove" data-index="${index}">Remove</button>
            </div>
        `;
        wishlistContainer.appendChild(item);
    });
}

if (wishlistContainer) {
    displayWishlist();

    wishlistContainer.addEventListener("click", function(event) {
        const index = Number(event.target.dataset.index);

        if (event.target.classList.contains("wish-remove")) {
            gumWishlist.splice(index, 1);
            saveWishlist();
            displayWishlist();
        }

        if (event.target.classList.contains("wish-to-cart")) {
            const product = gumWishlist[index];
            const existing = gumCart.find(function(p) { return p.name === product.name; });
            if (existing) {
                existing.quantity++;
            } else {
                gumCart.push({ name: product.name, price: product.price, image: product.image, quantity: 1 });
            }
            saveCart();
            alert(product.name + " added to your cart!");
        }
    });
}
