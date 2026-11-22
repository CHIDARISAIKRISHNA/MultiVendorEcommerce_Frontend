# SHOPSTACK -- Multi-Vendor E-Commerce Platform

A React-based frontend project that demonstrates the core workflow of a
multi-vendor e-commerce platform. Vendors can submit products,
administrators can review and approve or reject submissions, and
customers can browse approved products and use shopping features.

> **Project scope:** This repository contains the frontend
> implementation. The current workflow uses React context and browser
> `localStorage` for client-side state/persistence. It is not yet a
> complete production system with a shared backend database, server-side
> authorization, payment gateway, or secure order processing.

------------------------------------------------------------------------

## 1. Project Overview

SHOPSTACK is designed around three main roles:

  -----------------------------------------------------------------------
  Role                                Responsibility
  ----------------------------------- -----------------------------------
  Vendor                              Adds products and submits them for
                                      admin review

  Admin                               Reviews submitted products and
                                      approves or rejects them

  Customer                            Browses approved products, manages
                                      a cart and wishlist, and proceeds
                                      through checkout
  -----------------------------------------------------------------------

The main purpose is to demonstrate how the three roles interact in a
multi-vendor shopping workflow.

## 2. Main Application Workflow

### Step 1 -- Vendor adds a product

1.  The vendor signs in using the vendor account available in the
    application.
2.  The vendor opens the vendor dashboard.
3.  The vendor navigates to **Add Product**.
4.  The vendor enters the product information:
    -   Product name
    -   Category
    -   Price
    -   Stock quantity
    -   Product image URL
    -   Product description
5.  The vendor clicks **Add Product** to submit the product.

The submitted product is stored by the frontend with a pending approval
state. The product data includes fields such as its ID, vendor ID,
product details, approval status, and creation date.

### Step 2 -- Admin reviews the product

1.  The administrator signs in using the admin account configured for
    the application.
2.  The administrator opens the admin dashboard.
3.  The administrator navigates to **Manage Products**.
4.  The admin checks the product details submitted by the vendor.
5.  The admin chooses one of the available actions:
    -   **Approve:** Changes the product's status to approved.
    -   **Reject:** Marks the submitted product as rejected.

Only products that meet the application's approved-product condition
should be displayed in the customer product listing.

### Step 3 -- Customer views approved products

1.  The customer signs in.
2.  The customer opens the shopping/home page.
3.  The customer browses the products available in the customer
    catalogue.
4.  Approved vendor products are included in the customer-facing product
    listing.
5.  The customer can open a product details page to view more
    information.

Pending or rejected vendor submissions should not be presented as
approved customer products.

### Step 4 -- Customer adds products to the cart

1.  The customer selects **Add to Cart** on a product.
2.  The product is added to the cart.
3.  A success notification can be displayed.
4.  The customer can open the cart to review selected products.
5.  The customer can increase or decrease item quantities.
6.  The customer can remove an item from the cart.
7.  The cart subtotal and shipping amount are calculated in the
    frontend.

The current cart context stores cart data in browser `localStorage`
using the key `shopstack-cart`.

### Step 5 -- Customer proceeds to checkout

1.  The customer clicks **Buy Now** or **Proceed to Checkout**.
2.  The application navigates to the checkout page.
3.  The checkout page displays the information needed for the frontend
    checkout flow.
4.  The customer can continue through the implemented checkout
    interface.

**Note:** A frontend checkout screen does not by itself mean that real
payments or server-confirmed orders are processed. A payment gateway and
backend order API/database are needed for production order processing.

------------------------------------------------------------------------

## 3. Features by Role

### A. Vendor Features

-   Vendor dashboard.
-   Vendor profile page.
-   Add new products.
-   Enter product name, category, price, stock quantity, image URL, and
    description.
-   Submit products for admin review.
-   View vendor product management page.
-   Access vendor orders page, where implemented.

### B. Admin Features

-   Admin dashboard.
-   Manage vendors.
-   Manage customers.
-   Manage products.
-   Review vendor-submitted products.
-   Approve or reject product submissions.
-   View/manage orders through the admin orders page.

### C. Customer Features

-   Customer dashboard / home page.
-   Browse product listings.
-   View product details.
-   Add products to cart.
-   Buy Now navigation to checkout.
-   Update cart quantities.
-   Remove products from cart.
-   View cart subtotal and shipping calculation.
-   Wishlist: save and remove products.
-   Compare products.
-   My Orders page.
-   Order details page.
-   Recently Viewed page.
-   Notifications page.
-   Customer profile.
-   Manage addresses.
-   Account settings.
-   Customer support component.

The exact availability of each feature depends on its current
implementation and data source.

------------------------------------------------------------------------

## 4. Technology Stack

  -----------------------------------------------------------------------
  Technology                          Purpose
  ----------------------------------- -----------------------------------
  React                               Building reusable UI components

  JavaScript                          Application logic

  Vite                                Development server and build tool

  React Router DOM                    Client-side navigation and routes

  CSS                                 Layout, styling, and responsive
                                      design

  Context API                         Sharing cart, wishlist,
                                      authentication, comparison, and
                                      shop state

  localStorage                        Persisting selected frontend data
                                      in the browser

  Lucide React                        Icons

  qrcode.react                        QR code UI in the checkout flow,
                                      where used
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 5. Project Structure

The following is a guide to the main structure discussed during
development. Some additional files may exist in your local project.

``` text
shopstack-ecommerce-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── WishlistButton.jsx
│   │   ├── CompareButton.jsx
│   │   ├── CustomerSupport.jsx
│   │   ├── RoleBasedRoute.jsx
│   │   ├── RoleHomeRedirect.jsx
│   │   └── AuthScreen.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── WishlistContext.jsx
│   │   ├── CompareContext.jsx
│   │   └── ShopContext.jsx
│   │
│   ├── data/
│   │   ├── products.js
│   │   └── accountData.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageVendors.jsx
│   │   │   ├── ManageCustomers.jsx
│   │   │   ├── ManageProducts.jsx
│   │   │   └── AdminOrders.jsx
│   │   │
│   │   ├── vendor/
│   │   │   ├── VendorLayout.jsx
│   │   │   ├── VendorDashboard.jsx
│   │   │   ├── VendorProfile.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   ├── ManageProducts.jsx
│   │   │   └── VendorOrders.jsx
│   │   │
│   │   └── customer/
│   │       ├── Home.jsx
│   │       ├── Cart.jsx
│   │       ├── Checkout.jsx
│   │       ├── ProductDetails.jsx
│   │       ├── Wishlist.jsx
│   │       ├── Compare.jsx
│   │       ├── MyOrders.jsx
│   │       ├── OrderDetails.jsx
│   │       ├── RecentlyViewed.jsx
│   │       ├── Notifications.jsx
│   │       ├── Profile.jsx
│   │       ├── Addresses.jsx
│   │       └── AccountSettings.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── index.html
├── package.json
└── README.md
```

> This is a representative structure, not a command to rename files.
> Keep the filenames and locations that actually exist in your project.
> If a page is still directly under `src/pages/`, its import path in
> `App.jsx` must match that location.

------------------------------------------------------------------------

## 6. Important Context Files

### `AuthContext.jsx`

Manages authentication-related frontend state and the current user/role
information used by the application.

### `CartContext.jsx`

Manages shopping cart state. The context exposes:

-   `cart`
-   `addToCart(product)`
-   `removeFromCart(id)`
-   `updateQuantity(id, quantity)`
-   `clearCart()`
-   `itemCount`
-   `subtotal`

Cart data is saved in `localStorage` under `shopstack-cart`.

### `WishlistContext.jsx`

Manages wishlist state and provides:

-   `wishlist`
-   `addToWishlist(product)`
-   `removeFromWishlist(id)`
-   `isWishlisted(id)`

Wishlist data is saved under `shopstack-wishlist`.

The product-card heart button and Wishlist page should both use this
same context so they display the same saved products.

### `CompareContext.jsx`

Manages the products selected for comparison.

### `ShopContext.jsx`

Stores account-related frontend data such as orders, profile, addresses,
recently viewed products, notifications, and other shop state. It uses
localStorage keys such as `ss_orders`, `ss_profile`, `ss_addresses`, and
`ss_notifications`.

**Important:** Do not accidentally use `ShopContext` for the Wishlist
page while the product heart button uses `WishlistContext`. Those are
separate state stores in the current project.

------------------------------------------------------------------------

## 7. Application Routes

The main routes configured in `App.jsx` include the following.

### Customer routes

  Route                   Page
  ----------------------- -------------------------
  `/customer/dashboard`   Customer home/dashboard
  `/product/:id`          Product details
  `/cart`                 Shopping cart
  `/checkout`             Checkout
  `/wishlist`             Wishlist
  `/my-orders`            My Orders
  `/order-details/:id`    Order Details
  `/recently-viewed`      Recently Viewed
  `/notifications`        Notifications
  `/profile`              Profile
  `/addresses`            Addresses
  `/account-settings`     Account Settings
  `/compare`              Compare products

### Vendor routes

  Route                   Page
  ----------------------- ------------------
  `/vendor/dashboard`     Vendor Dashboard
  `/vendor/profile`       Vendor Profile
  `/vendor/add-product`   Add Product
  `/vendor/products`      Manage Products
  `/vendor/orders`        Vendor Orders

### Admin routes

  Route                Page
  -------------------- ------------------
  `/admin/dashboard`   Admin Dashboard
  `/admin/vendors`     Manage Vendors
  `/admin/customers`   Manage Customers
  `/admin/products`    Manage Products
  `/admin/orders`      Admin Orders

### Authentication and status routes

  Route                 Purpose
  --------------------- --------------------------
  `/login`              Login
  `/register`           Registration
  `/`                   Role-based home redirect
  `/unauthorized`       Unauthorized access page
  `/account-inactive`   Inactive account page

Routes are client-side React Router routes. Protected routes use the
role-based route component where configured.

------------------------------------------------------------------------

## 8. Installation and Setup

### Prerequisites

Install the following before running the project:

1.  Node.js (LTS version recommended).
2.  npm (normally included with Node.js).
3.  Visual Studio Code or another code editor.
4.  A modern browser such as Chrome or Edge.

Check that Node.js and npm are installed:

``` bash
node -v
npm -v
```

### Step 1 -- Open the project

Open the project folder in VS Code.

Open the VS Code terminal:

**Terminal → New Terminal**

Make sure the terminal is inside the project root folder, where
`package.json` is located.

### Step 2 -- Install dependencies

``` bash
npm install
```

This installs the dependencies listed in `package.json`.

### Step 3 -- Start the development server

``` bash
npm run dev
```

Vite will print a local development URL in the terminal, commonly:

``` text
http://localhost:5173/
```

Open the exact URL shown by your terminal in your browser.





------------------------------------------------------------------------

## 9. Important Development Notes

### Product approval flow

The intended flow is:

``` text
Vendor Login
     |
     v
Vendor Dashboard
     |
     v
Add Product
     |
     v
Submit Product
     |
     v
Pending Approval
     |
     v
Admin Login
     |
     v
Manage Products
     |
     +-------------------+
     |                   |
     v                   v
   Approve              Reject
     |                   |
     v                   v
Approved Product     Rejected Product
     |
     v
Customer Catalogue
     |
     v
Add to Cart / Buy Now
     |
     v
Cart and Checkout
```

### Product visibility

The customer catalogue should display approved products only. When
testing, verify that:

-   A newly submitted product is pending.
-   A rejected product does not appear as an approved customer product.
-   An approved product appears in the customer catalogue.
-   Product details and prices are displayed correctly.

### Browser localStorage

This frontend uses browser localStorage for several data stores. You can
inspect it in Chrome or Edge:

1.  Open the application.
2.  Press `F12`.
3.  Open the **Application** tab.
4.  Expand **Local Storage**.
5.  Select the application's localhost origin.
6.  Inspect the relevant keys.

Examples include:

-   `shopstack-cart`
-   `shopstack-wishlist`
-   `ss_orders`
-   `ss_profile`
-   `ss_addresses`
-   `ss_notifications`

The exact product-storage key depends on the implementation in the
vendor and admin product files.

**Important limitations of localStorage:**

-   Data is stored in the current browser and origin.
-   Different browsers or devices do not automatically share the data.
-   Clearing browser storage can remove the saved data.
-   localStorage is not a secure database.
-   Frontend role checks are not a substitute for server-side
    authorization.

For a real multi-user application, connect the frontend to a backend API
and shared database.

------------------------------------------------------------------------


## 10. How to Run 

Run these commands from the project root directory:

``` bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev

```
Open the localhost URL printed by Vite in your terminal.
