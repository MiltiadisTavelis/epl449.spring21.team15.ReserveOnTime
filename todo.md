REST API CALLS

Content-Type must be application/json

POST submits new data to the server. 
PUT updates existing data. 
DELETE removes data.

USERS 11
- [x] Create user (ENCRYPTED PASS SHA256) (type: users/cuser) POST 
- [x] Get user by id (type: users/user) POST 
- [x] Send email to verify user account (type: users/sendemail) POST  
- [x] Reset user password (type: users/passreset) POST  
- [x] Verify hash and email check (type: users/verifyhash) POST 
- [x] Get shop_id by user (type: users/shop) POST 
- [x] Get shop_id by user (type: users/shop) POST 
- [x] Downoad user data (type: users/data) POST 
- [x] Update user details (type: users/update) PUT 
- [x] Update user password (type: users/newpass) PUT 
- [x] Delete user (type: users/delete) DELETE 


SESSION 6
- [x] User Account Login (type: session/login) POST 
- [x] Manager Account Login (type: session/manager) POST 
- [x] Admin Account Login (type: session/admin) POST 
- [x] Account Logout (type: session/logout) POST 
- [x] Check if user/manager/admin is logged in (type: session/islogin) POST 
- [x] Get session type (type: session/type) POST 


SHOPS 23
- [x] Display open Shops (type: shops/all) POST 
- [x] Sort shops by date added (Default) (type: shops/all) POST 
- [x] Sort shops by name (type: shops/all) POST
- [x] Show shop by id (type: shops/shop) POST 
- [x] Display shop hours (type: shops/hours) POST 
- [x] Create shop (type: shops/cshop) POST 
- [x] Get all shop types (type: shops/types) POST 
- [x] Check shop full (type: shops/isfull) POST 
- [x] Display shops by area (type: shops/area) POST 
- [x] Display shops by street (type: shops/street) POST 
- [x] Display shops by postcode (type: shops/postcode) POST 
- [x] Get shops' images (type: shops/images) POST 
- [x] Change shop logo (type: shops/addimage) POST 
- [x] Change shop thumbnail (type: shops/addimage) POST 
- [x] Add new image (type: shops/addimage) POST 
- [x] Update shop details (type: shops/shopdetails) PUT 
- [x] Add shop hours (type: shops/addhour) PUT 
- [x] Remove shop hours (type: shops/addhour) PUT 
- [x] Disable/Enable shop hours (type: shops/addhour) PUT 
- [x] Delete shop image (type: shops/deleteimage) DELETE 
- [x] Add favorites (type: shops/addfavorite) PUT
- [x] Get favorites (type: shops/favorites) POST
- [x] Delete favorites (type: shops/deletefavorite) DELETE

PENDING_SHOPS 4
- [x] Add a pending shop (type: pendingShops/create) POST 
- [x] Display all pending shop (type: pendingShops/all) POST 
- [x] Accept pending shop (type: pendingShops/accept) POST 
- [x] Delete a pending shop (type: pendingShops/delete) DELETE 
 

PENDING_USER 2
- [x] Create pending user while creating an account
- [x] Delete pending user if has been verified


RESERVATIONS 10
- [x] Display reservation by shop id (managers) (type: reservasions/all) POST 
- [x] Search reservation by name of the user and sorted by date added (managers) (type: reservasions/all) POST 
- [x] Search reservation by name of the shop and sorted by date added (users) (type: reservasions/all) POST 
- [x] Search reservation by phone number (managers) (type: reservasions/all) POST 
- [x] Sort reservations by date added (users/managers) (type: reservasions/all) POST 
- [x] Add reservation (Pending) (type: reservasions/create) POST 
- [x] Update reservation (type: reservasions/update) PUT 
- [x] Accept Reservation (type: reservasions/status) PUT 
- [x] Decline Reservation (type: reservasions/status) PUT 
- [x] Cancel Reservation (type: reservasions/status) PUT 


REVIEWS 5
- [x] Display reviews by shop id (type: reviews/shop) POST 
- [x] Add new review (type: reviews/creview) POST 
- [x] Calculate average rating after new review (type: reviews/creview) POST 
- [x] Add rating and calculate average rating for the specific shop (type: reviews/creview) POST 
- [x] Delete review (type: reviews/delete) DELETE 


EVENTS 5
- [x] Display events by shop id (type: events/shop) POST 
- [x] Add event (type: events/create) POST 
- [x] Display event details by event id (type: events/event) POST 
- [x] Update event details (type: events/update) PUT 
- [x] Delete Event (type: events/delete) DELETE 
