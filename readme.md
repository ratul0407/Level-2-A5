# Parcel Delivery System Backend

This is a project that enables users to delivers parcels all around bangladesh. We have implemented all the necessary API's to get you going.

# Overview

### File structure

The file structured in a modular MVC pattern. Which has configs, errorHandlers, modules containing user, auth and parcels , middlewares, utility functions , interfaces and routes.

### Module overview

all the modules has their own model, interface. and the controller and service handles the business login. the routes handle the routing for each module. The route is protected by the checkAuth middleware function which checks for user role and their tokens and decides if a user is authorized to use the route or not.

### Error handling

The error handling is mostly done by the global error handler and the AppError custom class which extends the built-in Error class provided by javascript.

### Core dependencies

This is a list of all the core dependencies you will need to get the app running!

- typescript
- express
- mongoose
- zod
- jsonwebtoken
- cookie-parser
- uuid
- dotenv
- bcryptjs
- cors
- http-status-codes

## Routes

There are three main API endpoints `user`, `auth` and `parcel`

### User Routes

- `[POST] /register` : this is the route that the user will use to create an account in the webapp. To create an account he must hit the api with these information.

  - **name**, **email**, **phone**, **address** (an object containing **division**, **city**, **zip** and **street** **address**) and pick a **role** of either _SENDER_ or _RECEIVER_

- `[PATCH] /:id` : User will use this route to update his personal information.

### Auth Routes

- `[POST] /login` : This is the route used to login in the app. User will login with his email and password.

### Parcel Routes

- `[Post] /create` : This is the route used for creating a parcel. Only Senders can Create a parcel.

---

- `[PATCH] /approve/:tracking_id` : This is the route that **ADMIN** will use to approve any **requested** parcels and assign them to a **DELIVERY_PERSONNEL**.

---

- `[PATCH] /status/:tracking_id`: The **DELIVERY_PERSONNEL** will be using this route to update the status of a parcel from **APPROVED** to **PICKED_UP** and then **OUT_FOR_DELIVERY** and so on.

---

- `[PATCH] /cancel/:tracking_id` : This route will be used for cancelling and order both the **RECEIVER** and **SENDER** can use this route to cancel a delivery. But they will be able to cancel if the **STATUS** is appropriate for cancelling and order.
- `[PATCH] /confirm-delivery/:tracking_id`: This route will be used to confirm a parcel being delivered by the **RECEIVER** of that parcel.
- `[GET] /all-parcels` : This is an **ADMIN** only route. This route will be used to get all the parcels and filter them according to the need.
- `[GET] /my-parcels/:tracking_id` : This route will be used to get a single parcel using it's tracking_id. Both the **SENDER** and **RECEIVER** can use this route for their needs.
- `[GET] /my-parcels/:id` : This get route will give the user all of his parcels. And the user can filter them out as he wants.

### How to setup the project

```javascript
git clone https://github.com/ratul0407/Level-2-A5.git
cd  Level-2-A5
npm install
npm run dev
```

and you wil be good to go

Hope you liked the project.
