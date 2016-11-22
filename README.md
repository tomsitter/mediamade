# MediaMade API

# Endpoints

## Authentication

### POST /api/v1/signup
Creates a new user account and returns an authentication token, logs in a user to an existing account

__URL params:__ None

__Body:__
```json
{
  "email": "test@gmail.com",
  "password": "testpassword",
  "user_type": "CLIENT""
}
```

__Success__:  

When creating account
  - Code: 201
  - Content:  
`{ token: "json-web-token" }`
  
When logging into account
  - Code: 200
  - Content:  
`{ token: "json-web-token" }`

__Error:__

### POST /api/v1/login
Accepts user login credentials and returns an authentication token

__URL params:__ None

__Body:__
```json
{
  "email": "test@gmail.com",
  "password": "testpassword",
}
```

__Success__:  
  - Code: 200
  - Content:  
`{ token: "json-web-token" }`

__Error:__
  - Code: 401
  - Content:
  

## Profiles
Create, edit, and view user profiles

### GET /api/v1/profile

### GET /api/v1/profile/:id

### POST /api/v1/profile

### PUT /api/v1/profile


## Jobs
Create, edit, and view jobs

## Wait List

### POST /api/v1/waitlist
Register for the mediamade waitlist. Accepts email and surveys

__URL params:__ None

__Body:__
```json
{
  //required
  "email": "test@gmail.com",
  
  //optional
  "survey": {
    "client_type": "CLIENT",
    "hiring": "PHOTO",
    "services": ["SERVICES"],
    "city": "Thunder Bay",
    "photo_price": 100, // per 10 photos?
    "video_price": 150  // per 1 minute video?
  }
}
```

__Success__:  

When adding new email to waitlist
  - Code: 201
  - Content:  waitlist document
  
When updating/adding survey to existing email
  - Code: 200
  - Content:  waitlist document

__Error:__

  -Code:500
  -Content:
  `{error: "Failed to add customer to waitlist"}`



# To Do:

As a Company looking to hire media:

  - sign up for the app
  - create a profile
  - create a job
       - OR look for Production companies to pitch your video idea to
  - message Production company
  - establish an agreement
  - make payment
  - be notified when work is done
  - agree that work was complete
  - review production company


As a Production company:

  - sign up for the app
  - create profile
        - link to existing work
  - respond to a posted job / job pitch
  - create an invoice / price sheet for the work
  - establish an agreement
  - accept payment
  - update the client on progress / completion of work
  - receive confirmation that work is complete
  - review client
