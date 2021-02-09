REST API CALLS

Content-Type must be application/json

GET retrieves resources. 
POST submits new data to the server. 
PUT updates existing data. 
DELETE removes data.

USERS 5
- [x] Create user (ENCRYPTED PASS SHA256) (type: users/cuser) POST OK
- [x] Delete user (type: users/delete) DELETE OK
- [x] Update user details (type: users/update) PUT OK
- [x] Get user by id (type: users/user) GET OK
- [x] Send email to verify user account (type: users/sendemail) POST OK 

SESSION 4 
- [x] Account Login (type: session/login) POST OK
- [x] Manager Account Login (type: session/manager) POST OK
- [x] Account Logout (type: session/login) POST OK
- [ ] Remember Me

SHOPS 11
- [x] Display open Shops (type: shops/all) GET OK
- [x] Sort shops by date added (Default) (type: shops/all) GET OK
- [x] Sort shops by name (type: shops/all) GET OK ****** REMOVED
- [x] Display shops by type (type: shops/all) GET OK
- [x] Search Shop by name (type: shops/all) GET OK
- [x] Update shop details (type: shops/update) PUT OK
- [x] Show shop by id (type: shops/shop) GET OK
- [x] Show all (type: shops/all) GET OK 
- [x] Create shop (type: shops/cshop) POST OK
- [x] Display Shops by City (type: shops/all) GET OK
- [x] Sort Shops by rating (type: shops/all) GET OK

SHOPS_HOURS 3 
- [ ] Add open/close hours POST
- [ ] Delete open/close hours DELETE
- [ ] Update open/close hours PUT

PENDING_SHOPS 2
- [x] Add a pending shop (pendingShops/create) POST OK
- [x] Delete a pending shop (pendingShops/delete) DELETE OK
 
PENDING_USER 2
- [x] Create pending user while creating an account
- [x] Delete pending user if has been verified

RESERVATIONS 8
- [x] Accept/Decline/Cancel Reservation (type: reservasions/status) PUT OK
- [x] Add reservation (Pending) (type: reservasions/create) POST OK
- [x] Display reservation by shop id (managers) (type: reservasions/all) GET OK
- [x] Search reservation by name of the user and sorted by date added (managers) (type: reservasions/all) GET OK
- [x] Search reservation by name of the shop and sorted by date added (users) (type: reservasions/all) GET OK
- [x] Search reservation by phone number (managers) (type: reservasions/all) GET OK
- [x] Sort reservations by date added (users/managers) (type: reservasions/all) GET OK
- [x] Update reservation (type: reservasions/update) PUT OK

REVIEWS 5
- [x] Add review (type: reviews/creview) POST OK
- [x] Delete review (type: reviews/delete) DELETE OK
- [x] Display reviews by shop id (type: reviews/shop) GET OK
- [x] Calculate average rating after new review (type: reviews/creview) POST OK
- [x] Add rating and calculate average rating for the specific shop POST 

EVENTS 4
- [x] Add event (events/create) POST OK
- [x] Update event title/description/date (events/update) PUT OK
- [x] Delete Event (events/delete) DELETE OK
- [x] Display events by shop id (events/shop) GET OK 