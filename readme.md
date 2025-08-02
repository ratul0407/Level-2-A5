# Parcel Delivery System Backend

This is a project that enables users to delivers parcels all around bangladesh. We have implemented all the necessary API's to get you going.

There are three main API endpoints `user`, `auth` and `parcel`

## User Routes

- `[POST] /register` : this is the route that the user will use to create an account in the webapp. To create an account he must hit the api with these information.

  - **name**, **email**, **phone**, **address** (an object containing **division**, **city**, **zip** and **street** **address**) and pick a **role** of either _SENDER_ or _RECEIVER_

- `[PATCH] /:id` : User will use this route to update his personal information.

## Auth Routes

- `[POST] /login` : This is the route used to login in the app. User will login with his email and password.

## Parcel Routes

- `[Post] /create` : This is the route used for creating a parcel. Only Senders can Create a parcel.

- `[PATCH] /approve/:tracking_id` : This is the route that `ADMIN` will use to approve any `requested` parcels and assign them to a `DELIVERY_PERSONNEL`.
- `[PATCH] /status/:tracking_id`: The `DELIVERY_PERSONNEL` will be using this route to update the status of a parcel from `APPROVED` to `PICKED_UP` and then `OUT_FOR_DELIVERY` and so on.
- `[PATCH] /cancel/:tracking_id` : This route will be used for cancelling and order both the `RECEIVER` and `SENDER` can use this route to cancel a delivery. But they will be able to cancel if the `STATUS` is appropriate for cancelling and order.
- `[PATCH] /confirm-delivery/:tracking_id`: This route will be used to confirm a parcel being delivered by the `RECEIVER` of that parcel.
- `[GET] /all-parcels` : This is an `ADMIN` only route. This route will be used to get all the parcels and filter them according to the need.
- `[GET] /my-parcels/:tracking_id` : This route will be used to get a single parcel using it's tracking_id. Both the `SENDER` and `RECEIVER` can use this route for their needs.
- `[GET] /my-parcels/:id` : This get route will give the user all of his parcels. And the user can filter them out as he wants.
