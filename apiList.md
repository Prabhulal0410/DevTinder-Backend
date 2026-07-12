## login/logout
- POST /login
- POSt /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // forgot password

## connectionrequestRouter
- POST /request/send/:status/:userId
- POST /request/review/:status/:required

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed  // GEts you prpfiles pf other users on platform


Status : ignored,intrested,accepted,rejected