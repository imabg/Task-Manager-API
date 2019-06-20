#Task-Manager-API

**Please Edit emails/account.js file by providing valid SendGrid Secret Key and a valid Email address and configure db/mongoose.js file according to your MongoDB setup.**

##Task Manager API **USER Endpoints** contain following endpoint:

- (POST)/user
- (GET)/user/me
- (POST)/user/logout
- (POST)/user/logoutAll
- (PATCH)/user/me
- (POST)/user/login
- (DELETE)/user/me
- (POST)/user/me/avatar
- (DELETE)/user/me/avatar
- (GET)/user/:id/avatar

**Task Endpoints:**

- (POST)/tasks
- (GET)/tasks
- (GET)/task/:id
- (PATCH)/task/:id
- (DELETE)/task/:id

**Technology/Packages used:**

- Node.js
- Mongoose
- Sendgrid API for Mail service
- Bcrypt for password hassing
- jsonwebtoken for creating JSON token
- multer for saving Avatar
- sharp for croping and changing format of Avatar
