# API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints (Week 2)

### Register User
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "tenantName": "My Company"
}

Response (201 Created):
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Error (400):
{
  "error": "Email already exists"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response (200 OK):
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Error (401):
{
  "error": "Invalid credentials"
}
```

### Refresh Token
```
POST /auth/refresh
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Error (401):
{
  "error": "Invalid or expired token"
}
```

## Company Endpoints (Week 2)

### List Companies
```
GET /companies
Headers:
  Authorization: Bearer <token>

Query Parameters:
  ?page=1&limit=20
  ?search=acme
  ?industry=technology

Response (200 OK):
{
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "industry": "Technology",
      "website": "https://acme.com",
      "phone": "+1-555-0100",
      "email": "contact@acme.com",
      "employees": 150,
      "annualRevenue": 5000000,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Create Company
```
POST /companies
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request Body:
{
  "name": "Acme Corp",
  "industry": "Technology",
  "website": "https://acme.com",
  "phone": "+1-555-0100",
  "email": "contact@acme.com",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "postalCode": "94105",
  "employees": 150,
  "annualRevenue": 5000000
}

Response (201 Created):
{
  "id": "uuid",
  "name": "Acme Corp",
  "industry": "Technology",
  ... (all fields)
}

Error (400):
{
  "error": "Validation failed",
  "details": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

### Get Company
```
GET /companies/:id
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "id": "uuid",
  "name": "Acme Corp",
  ... (full company object)
}

Error (404):
{
  "error": "Company not found"
}
```

### Update Company
```
PUT /companies/:id
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request Body:
{
  "name": "Acme Corp Updated",
  "industry": "Software"
  ... (any fields to update)
}

Response (200 OK):
{
  "id": "uuid",
  "name": "Acme Corp Updated",
  ... (updated company object)
}
```

### Delete Company
```
DELETE /companies/:id
Headers:
  Authorization: Bearer <token>

Response (204 No Content)
```

## Contact Endpoints (Week 2)

### List Contacts
```
GET /contacts
Headers:
  Authorization: Bearer <token>

Query Parameters:
  ?page=1&limit=20
  ?search=john
  ?companyId=uuid

Response (200 OK):
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "phone": "+1-555-0101",
      "jobTitle": "VP Sales",
      "department": "Sales",
      "companyId": "uuid",
      "isPrimaryContact": true,
      "notes": "Key decision maker",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Create Contact
```
POST /contacts
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request Body:
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "+1-555-0101",
  "jobTitle": "VP Sales",
  "department": "Sales",
  "companyId": "uuid",
  "isPrimaryContact": true,
  "notes": "Key decision maker"
}

Response (201 Created):
{ ... (created contact) }
```

### Get Contact
```
GET /contacts/:id
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{ ... (contact object) }
```

### Update Contact
```
PUT /contacts/:id
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request Body:
{ ... (fields to update) }

Response (200 OK):
{ ... (updated contact) }
```

### Delete Contact
```
DELETE /contacts/:id
Headers:
  Authorization: Bearer <token>

Response (204 No Content)
```

### Get Contacts by Company
```
GET /companies/:companyId/contacts
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "data": [ ... (contacts for company) ],
  "pagination": { ... }
}
```

## Deal Endpoints (Week 2)

### List Deals
```
GET /deals
Headers:
  Authorization: Bearer <token>

Query Parameters:
  ?page=1&limit=20
  ?status=open,won,lost
  ?ownerId=uuid
  ?minValue=10000&maxValue=100000

Response (200 OK):
{
  "data": [
    {
      "id": "uuid",
      "title": "Enterprise Package Deal",
      "description": "Potential $50k deal",
      "value": 50000,
      "currency": "USD",
      "status": "open",
      "probability": 75,
      "expectedCloseDate": "2024-03-31",
      "companyId": "uuid",
      "contactId": "uuid",
      "ownerId": "uuid",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### Create Deal
```
POST /deals
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request Body:
{
  "title": "Enterprise Package Deal",
  "description": "Potential $50k deal",
  "value": 50000,
  "currency": "USD",
  "status": "open",
  "probability": 75,
  "expectedCloseDate": "2024-03-31",
  "companyId": "uuid",
  "contactId": "uuid",
  "ownerId": "uuid"
}

Response (201 Created):
{ ... (created deal) }
```

### Get Deal
```
GET /deals/:id
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{ ... (deal object) }
```

### Update Deal
```
PUT /deals/:id
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Request Body:
{
  "status": "won",
  "probability": 100,
  ... (fields to update)
}

Response (200 OK):
{ ... (updated deal) }
```

### Delete Deal
```
DELETE /deals/:id
Headers:
  Authorization: Bearer <token>

Response (204 No Content)
```

### Get Deals by Company
```
GET /companies/:companyId/deals
Headers:
  Authorization: Bearer <token>

Response (200 OK):
{
  "data": [ ... (deals for company) ],
  "pagination": { ... }
}
```

### Get Deals by Status
```
GET /deals/status/:status
Headers:
  Authorization: Bearer <token>

Path Parameters:
  :status = "open" | "won" | "lost" | "on-hold"

Response (200 OK):
{
  "data": [ ... (deals with status) ],
  "pagination": { ... }
}
```

## Activity Endpoints (Week 3)

### List Activities
```
GET /activities
Headers:
  Authorization: Bearer <token>

Query Parameters:
  ?entityType=company|contact|deal
  ?entityId=uuid
  ?limit=50

Response (200 OK):
{
  "data": [
    {
      "id": "uuid",
      "entityType": "company",
      "entityId": "uuid",
      "activityType": "created|updated|deleted|called|emailed",
      "description": "Contact updated by John Doe",
      "createdBy": "uuid",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied - you cannot access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "requestId": "uuid"
}
```

## Authentication Header

All endpoints (except /auth/register and /auth/login) require:

```
Authorization: Bearer <jwt_token>
```

Example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## Rate Limiting

```
Rate Limit: 100 requests per 15 minutes per IP
Headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1705334400

Error (429 Too Many Requests):
{
  "error": "Rate limit exceeded",
  "retryAfter": 600
}
```

## Pagination

All list endpoints support pagination:

```
Query Parameters:
  ?page=1      (default: 1)
  ?limit=20    (default: 20, max: 100)

Response includes:
{
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error - Server error |

---

This is the complete API specification for the CRM SaaS. Implementation will happen in Week 2.
