# Product Requirements Document (PRD)

## Expense Tracker Backend API

**Version:** 1.2
**Date:** January 13, 2026
**Author:** Development Team
**Status:** In Development

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Development Environment](#development-environment)
5. [Database Schema](#database-schema)
6. [API Architecture Layers](#api-architecture-layers)
7. [Code Style & Conventions](#code-style--conventions)
8. [Project Structure](#project-structure)
9. [Feature Requirements](#feature-requirements)
10. [Security Requirements](#security-requirements)
11. [Error Handling Strategy](#error-handling-strategy)
12. [Development Workflow](#development-workflow)
13. [Environment Configuration](#environment-configuration)

---

## 1. Project Overview

### 1.1 Purpose

Develop a RESTful API backend for a personal income and expense tracking application. The system will allow users to:

- Register and authenticate securely
- Create and manage expense/income categories
- Record and track financial transactions
- View financial summaries and reports

### 1.2 Goals

- Build a scalable, maintainable backend using TypeScript
- Implement secure authentication with JWT
- Follow industry best practices for API design
- Use class-based architecture for better organization
- Ensure type safety throughout the application

### 1.3 Target Users

Individual users who want to track their personal finances through a web or mobile application.

---

## 2. Technology Stack

### 2.1 Core Technologies

| Technology | Version | Purpose |
| ------------ | --------- | --------- |
| **Node.js** | >=18.0.0 | JavaScript runtime environment |
| **TypeScript** | ^5.3.3 | Type-safe JavaScript superset |
| **Express** | ^4.18.2 | Web application framework |
| **MySQL** | Latest | Relational database |
| **pnpm** | >=8.0.0 | Package manager |

### 2.2 Dependencies

#### Production Dependencies

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.9.1",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "zod": "^3.22.4",
  "cookie-parser": "^1.4.6",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5"
}
```

**Purpose of each:**

- **express**: HTTP server and routing
- **mysql2**: MySQL database driver with Promise support
- **jsonwebtoken**: JWT token generation and verification
- **bcryptjs**: Password hashing
- **zod**: Runtime type validation and schema definition
- **cookie-parser**: Parse HTTP cookies
- **cors**: Enable Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

#### Development Dependencies

```json
{
  "typescript": "^5.3.3",
  "@types/express": "^4.17.21",
  "@types/node": "^20.11.5",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/bcryptjs": "^2.4.6",
  "@types/cookie-parser": "^1.4.7",
  "@types/cors": "^2.8.17",
  "@biomejs/biome": "^1.9.4",
  "tsx": "^4.7.0",
  "nodemon": "^3.0.3"
}
```

**Purpose of each:**

- **typescript**: TypeScript compiler
- **@types/\***: Type definitions for libraries
- **@biomejs/biome**: Linter and formatter (replaces ESLint + Prettier)
- **tsx**: Execute TypeScript files directly (development)
- **nodemon**: Auto-restart server on file changes

---

## 3. Project Architecture

### 3.1 Architecture Pattern

**Layered Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         HTTP Layer (Routes)             │
│  - Route definitions                    │
│  - Middleware application               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Controller Layer                  │
│  - HTTP request/response handling       │
│  - Input extraction                     │
│  - Cookie management                    │
│  - Response formatting                  │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        Service Layer                    │
│  - Business logic                       │
│  - Data validation                      │
│  - Password hashing                     │
│  - JWT token generation                 │
│  - Business rules enforcement           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Model Layer                     │
│  - Database queries                     │
│  - Data access                          │
│  - Raw SQL operations                   │
│  - No business logic                    │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Database (MySQL)                │
│  - Users                                │
│  - Categories                           │
│  - Transactions                         │
└─────────────────────────────────────────┘
```

### 3.2 Design Principles

1. **Separation of Concerns**: Each layer has a single, well-defined responsibility
2. **Dependency Injection**: Services and models are injected through constructors
3. **Class-Based Architecture**: Use classes for Models, Services, and Controllers
4. **Single Responsibility Principle**: Each class/function does one thing well
5. **DRY (Don't Repeat Yourself)**: Reusable utilities and middleware

### 3.3 Key Architectural Decisions

#### Decision 1: Class-Based Architecture

**Rationale**: Better organization, encapsulation, and maintainability
**Implementation**: All Models, Services, and Controllers are implemented as classes

```typescript
// Example structure
export class UserModel { /* database operations */ }
export class AuthService { /* business logic */ }
export class AuthController { /* HTTP handling */ }
```

#### Decision 2: Singleton Pattern for Instances

**Rationale**: Single instance of each class throughout the application
**Implementation**: Export both class and instance

```typescript
export class UserModel { }
export const userModel = new UserModel()
```

#### Decision 3: asyncHandler Wrapper

**Rationale**: Eliminate repetitive try-catch blocks, ensure consistent error handling
**Implementation**: Wrap all async route handlers with asyncHandler utility

#### Decision 4: Model Method Reusability

**Rationale**: Promote code reuse and maintain single source of truth for data access
**Implementation**:

- Models contain generic, reusable query methods (e.g., `findByEmail`, `findById`, `findByUsername`)
- Services reuse model methods across different features
- Specialized methods created only when query differs significantly
- Example: `UserModel.findByEmail()` used by `AuthService`, `UserService`

**Benefits**:

- Single source of truth for database queries
- Easier maintenance and testing
- Consistent data access patterns
- Follows DRY principle

#### Decision 5: Dynamic SQL Query Building

**Rationale**: Enable flexible partial updates without code duplication
**Implementation**:

- Model update methods accept `Partial<T>` types for optional fields
- SQL queries built dynamically based on provided fields
- Only updates fields that are actually provided
- Prevents unnecessary database operations

**Example**:

```typescript
async update(userId: number, data: Partial<{ username: string; email: string }>) {
  const updates: string[] = []
  const values: any[] = []

  if (data.username !== undefined) {
    updates.push('user_username = ?')
    values.push(data.username)
  }

  if (data.email !== undefined) {
    updates.push('user_email = ?')
    values.push(data.email)
  }

  const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`
  // Execute with parameterized values for SQL injection protection
}
```

**Security**: Column names are hardcoded, only values are parameterized - safe from SQL injection

**Benefits**:

- Flexible partial updates (PATCH semantics)
- No unnecessary UPDATE operations
- Cleaner code (no multiple update methods)
- Better performance

---

## 4. Development Environment

### 4.1 Package Manager

**pnpm** - Fast, disk space efficient package manager

### 4.2 TypeScript Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "sourceMap": true,
    "removeComments": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key Settings**:

- `target: ES2022` - Modern JavaScript features
- `module: CommonJS` - Node.js compatibility
- `strict: true` - Maximum type safety
- `noUnusedLocals/Parameters: true` - Catch unused code
- `sourceMap: true` - Enable debugging

### 4.3 Biome Configuration (Linter & Formatter)

**File**: `biome.json`

**Custom Requirements**:

- ✅ NO semicolons (asNeeded)
- ✅ Single quotes for strings
- ✅ 2-space indentation
- ✅ 100 character line width

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "semicolons": "asNeeded",
      "quoteStyle": "single",
      "arrowParentheses": "always",
      "bracketSpacing": true,
      "trailingCommas": "es5"
    }
  }
}
```

### 4.4 NPM Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "biome lint ./src",
    "format": "biome format --write ./src",
    "check": "biome check --write ./src",
    "type-check": "tsc --noEmit"
  }
}
```

### 4.5 Git Configuration

**File**: `.gitignore`

**Special Requirement**: Uses `**/` prefix for monorepo compatibility (backend is a subfolder)

Key ignored items:

- `**/node_modules/`
- `**/dist/`
- `**/.env*`
- `**/pnpm-lock.yaml` (lockfile ignored per request)
- `**/package-lock.json`
- `**/yarn.lock`

---

## 5. Database Schema

### 5.1 Database: expense_tracker

### 5.2 Tables

#### Table: users

```sql
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_username VARCHAR(50) NOT NULL UNIQUE,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields**:

- `user_id`: Primary key, auto-increment
- `user_username`: Unique username (3-50 characters)
- `user_email`: Unique email address
- `user_password`: Bcrypt hashed password
- `user_created_at`: Account creation timestamp
- `user_updated_at`: Last update timestamp

#### Table: categories

```sql
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_user_id INT NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    category_type ENUM('income', 'expense') NOT NULL,
    category_color VARCHAR(7) DEFAULT '#667eea',
    category_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (category_user_id, category_name)
);
```

**Fields**:

- `category_id`: Primary key
- `category_user_id`: Foreign key to users (CASCADE delete)
- `category_name`: Category name (unique per user)
- `category_type`: 'income' or 'expense'
- `category_color`: Hex color code for UI

#### Table: transactions

```sql
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_user_id INT NOT NULL,
    transaction_category_id INT NOT NULL,
    transaction_amount DECIMAL(10, 2) NOT NULL,
    transaction_type ENUM('income', 'expense') NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_description TEXT,
    transaction_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_category_id) REFERENCES categories(category_id) ON DELETE RESTRICT
);
```

**Fields**:

- `transaction_id`: Primary key
- `transaction_user_id`: Foreign key to users (CASCADE delete)
- `transaction_category_id`: Foreign key to categories (RESTRICT delete)
- `transaction_amount`: Amount (10 digits, 2 decimal places)
- `transaction_type`: 'income' or 'expense'
- `transaction_date`: Transaction date
- `transaction_description`: Optional notes

### 5.3 Relationships

```
users (1) ──────< (many) categories
users (1) ──────< (many) transactions
categories (1) ──< (many) transactions
```

---

## 6. API Architecture Layers

### 6.1 Models Layer

**Responsibility**: Direct database interaction only

**Implementation**:

```typescript
export class UserModel {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE user_email = ?',
      [email]
    )
    return rows.length > 0 ? (rows[0] as User) : null
  }

  async create(username: string, email: string, hashedPassword: string): Promise<User> {
    // INSERT query and return created user
  }
}

export const userModel = new UserModel()
```

**Rules**:

- Use `pool.execute()` for parameterized queries (security)
- Return raw database results
- No business logic
- No password hashing
- No validation beyond SQL constraints

### 6.2 Services Layer

**Responsibility**: Business logic and data processing

**Implementation**:

```typescript
export class AuthService {
  constructor(private userModel: UserModel) {}

  async register(username: string, email: string, password: string) {
    // 1. Check if user exists
    const existing = await this.userModel.findByEmail(email)
    if (existing) throw new AppError('Email already in use', 400)

    // 2. Hash password
    const hashedPassword = await this.hashPassword(password)

    // 3. Create user
    const user = await this.userModel.create(username, email, hashedPassword)

    // 4. Generate token
    const token = this.generateToken(user.user_id)

    return { user: this.sanitizeUser(user), token }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
  }

  private sanitizeUser(user: any) {
    const { user_password, ...sanitized } = user
    return sanitized
  }
}

export const authService = new AuthService(userModel)
```

**Rules**:

- Contains all business logic
- Calls models for data access
- Throws `AppError` for business rule violations
- Private methods for internal operations
- Returns processed data (not raw DB results)

### 6.3 Controllers Layer

**Responsibility**: HTTP request/response handling

**Implementation**:

```typescript
export class AuthController {
  constructor(private authService: AuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    const result = await this.authService.register(username, email, password)

    // Set HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      maxAge: env.COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    })
  })
}

export const authController = new AuthController(authService)
```

**Rules**:

- Extract data from `req.body`, `req.params`, `req.query`
- Call services (no direct model access)
- Set cookies for authentication
- Send formatted JSON responses
- Use `asyncHandler` wrapper (never manual try-catch)
- Use arrow functions to preserve `this` binding

### 6.4 Middleware Layer

**Types**:

1. **Validation Middleware** (`validator.ts`)
   - Validates request data with Zod schemas
   - Throws `AppError` on validation failure
   - Replaces `req.body` with validated data
   - Removes extra fields not in schema

   **Implementation**:

   ```typescript
   export const validate = (schema: ZodSchema) => {
     return (req: Request, res: Response, next: NextFunction) => {
       try {
         const validatedData = schema.parse(req.body)
         req.body = validatedData
         next()
       } catch (error) {
         if (error instanceof ZodError) {
           const errors = error.errors.map((err) => ({
             field: err.path.join('.'),
             message: err.message
           }))
           throw new AppError(JSON.stringify(errors), 400)
         }
         throw error
       }
     }
   }
   ```

2. **Authentication Middleware** (`auth.ts`)
   - Verifies JWT token from cookie
   - Attaches `userId` to request object
   - Supports JWT error handling (invalid token, expired token)
   - Throws `AppError` if unauthorized
   - Extends Express Request type to include userId property

   **Implementation**:

   ```typescript
   // Extend Express Request type
   declare global {
     namespace Express {
       interface Request {
         userId?: number
       }
     }
   }

   interface JwtPayload {
     userId: number
     iat: number
     exp: number
   }

   export const auth = (req: Request, _res: Response, next: NextFunction) => {
     try {
       const token = req.cookies.token

       if (!token) {
         throw new AppError('Access token not provided', 401)
       }

       const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
       req.userId = decoded.userId

       next()
     } catch (error) {
       if (error instanceof jwt.JsonWebTokenError) {
         throw new AppError('Invalid token', 401)
       }
       if (error instanceof jwt.TokenExpiredError) {
         throw new AppError('Token expired', 401)
       }
       throw error
     }
   }
   ```

3. **Error Handler Middleware** (`errorHandler.ts`)
   - Catches all errors
   - Formats error responses
   - Logs programming errors
   - Sends appropriate HTTP status codes
   - Must be registered as last middleware

   **Implementation**:

   ```typescript
   export const errorHandler = (
     err: Error,
     req: Request,
     res: Response,
     next: NextFunction
   ) => {
     if (err instanceof AppError) {
       return res.status(err.statusCode).json({
         success: false,
         message: err.message
       })
     }

     return res.status(500).json({
       success: false,
       message: 'Internal server error'
     })
   }
   ```

### 6.5 Utilities Layer

**AppError.ts**:

```typescript
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}
```

**asyncHandler.ts**:

```typescript
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>

export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

### 6.6 Configuration Layer

**database.ts**:

```typescript
import mysql from 'mysql2/promise'
import { env } from './env'

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default pool
```

**env.ts**:

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
  COOKIE_EXPIRES_DAYS: z.string().transform(Number),
  COOKIE_SECURE: z.string().transform(val => val === 'true'),
  COOKIE_HTTP_ONLY: z.string().transform(val => val === 'true')
})

export const env = envSchema.parse(process.env)
```

**index.ts** (Application Entry Point):

```typescript
import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

// Middleware
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Error handler (must be last)
app.use(errorHandler)

app.listen(env.PORT, () => console.log(`server runing on port ${env.PORT}`))
```

---

## 7. Code Style & Conventions

### 7.1 Formatting Rules (Enforced by Biome)

- **No semicolons** (semicolons: "asNeeded")
- **Single quotes** for strings
- **2 spaces** indentation
- **100 characters** max line width
- **LF** line endings (Unix)
- **Trailing commas** (ES5 style)
- **Arrow parentheses** always included
- **Bracket spacing** enabled

### 7.2 Naming Conventions

| Type | Convention | Example |
| ------ | ------------ | --------- |
| Classes | PascalCase | `UserModel`, `AuthService` |
| Instances | camelCase | `userModel`, `authService` |
| Functions | camelCase | `findByEmail`, `hashPassword` |
| Variables | camelCase | `hashedPassword`, `userId` |
| Constants | UPPER_SNAKE_CASE | `MAX_LOGIN_ATTEMPTS` |
| Interfaces | PascalCase with I prefix | `IUser`, `IConfig` |
| Types | PascalCase | `User`, `AsyncFunction` |
| Files | kebab-case | `user.model.ts`, `auth.service.ts` |

### 7.3 File Naming

```
<feature>.<layer>.ts

Examples:
- user.model.ts
- auth.service.ts
- category.controller.ts
- transaction.routes.ts
- user.schema.ts
```

### 7.4 TypeScript Guidelines

1. **Avoid `any` type** - Use `unknown` if type is uncertain
2. **Define interfaces** for all data structures
3. **Use type inference** where obvious
4. **Explicit return types** for public methods
5. **Generic types** for reusable functions
6. **Strict null checks** enabled

---

## 8. Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MySQL connection pool
│   │   └── env.ts               # Environment validation (Zod)
│   │
│   ├── middlewares/
│   │   ├── auth.ts              # JWT verification middleware
│   │   ├── errorHandler.ts     # Global error handler
│   │   └── validator.ts         # Zod validation middleware
│   │
│   ├── schemas/
│   │   ├── user.schema.ts       # User validation schemas (register, login, updateProfile)
│   │   ├── category.schema.ts  # Category validation schemas
│   │   └── transaction.schema.ts # Transaction validation schemas
│   │
│   ├── models/
│   │   ├── user.model.ts        # User database operations
│   │   ├── category.model.ts    # Category database operations
│   │   └── transaction.model.ts # Transaction database operations
│   │
│   ├── services/
│   │   ├── auth.service.ts      # Authentication business logic
│   │   ├── user.service.ts      # User-related business logic
│   │   ├── category.service.ts  # Category business logic
│   │   └── transaction.service.ts # Transaction business logic
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts   # Authentication HTTP handlers (register, login)
│   │   ├── user.controller.ts   # User HTTP handlers (get user info, update profile)
│   │   ├── category.controller.ts # Category HTTP handlers
│   │   └── transaction.controller.ts # Transaction HTTP handlers
│   │
│   ├── routes/
│   │   ├── auth.routes.ts       # Auth endpoints (/api/auth)
│   │   ├── user.routes.ts       # User endpoints (/api/users)
│   │   ├── category.routes.ts   # Category endpoints
│   │   └── transaction.routes.ts # Transaction endpoints
│   │
│   ├── utils/
│   │   ├── AppError.ts          # Custom error class
│   │   └── asyncHandler.ts      # Async error wrapper
│   │
│   └── index.ts                 # Application entry point
│
├── .env                         # Environment variables (not in git)
├── .gitignore                   # Git ignore rules (monorepo compatible)
├── biome.json                   # Biome configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
└── pnpm-lock.yaml              # pnpm lock file (ignored in git)
```

---

## 9. Feature Requirements

### 9.1 Authentication Features

#### Feature: User Registration

- **Endpoint**: `POST /api/auth/register`
- **Input**: username, email, password (validated by Zod)
- **Process**:
  1. Validate input with `registerSchema`
  2. Check if email/username exists
  3. Hash password with bcrypt (10 rounds)
  4. Create user in database
  5. Generate JWT token
  6. Set HTTP-only cookie (1 day expiration)
- **Output**: User object (without password) + token
- **Error Cases**:
  - 400: Invalid input (Zod validation)
  - 400: Email already exists
  - 400: Username already exists

#### Feature: User Login

- **Endpoint**: `POST /api/auth/login`
- **Input**: email, password
- **Process**:
  1. Validate input with `loginSchema`
  2. Find user by email
  3. Verify password with bcrypt
  4. Generate JWT token
  5. Set HTTP-only cookie (1 day expiration)
- **Output**: User object + token
- **Error Cases**:
  - 401: Invalid credentials (user not found)
  - 401: Invalid credentials (wrong password)

#### Feature: User Logout

- **Endpoint**: `POST /api/auth/logout`
- **Process**: Clear authentication cookie
- **Output**: Success message

### 9.2 User Features

#### Feature: Get User Info

- **Endpoint**: `GET /api/users/info`
- **Auth**: Required (JWT)
- **Process**: Return current authenticated user data
- **Output**: User object (without password)
- **Error Cases**:
  - 401: No token provided
  - 401: Invalid token
  - 401: Token expired
  - 404: User not found

#### Feature: Update User Profile

- **Endpoint**: `PATCH /api/users/profile`
- **Auth**: Required (JWT)
- **Input**: username (optional), email (optional)
- **Validation**: At least one field must be provided
- **Process**:
  1. Validate input with `updateProfileSchema`
  2. Check username uniqueness (if provided, exclude current user)
  3. Check email uniqueness (if provided, exclude current user)
  4. Update user with dynamic SQL query
  5. Return updated user data
- **Output**: Updated user object (without password)
- **Error Cases**:
  - 400: No fields provided
  - 401: No token provided
  - 401: Invalid token
  - 409: Username already in use (by another user)
  - 409: Email already in use (by another user)
  - 500: Failed to update user

**Implementation Details**:

- Uses dynamic SQL query to update only provided fields
- Allows partial updates (username only, email only, or both)
- Uniqueness validation excludes current user (users can keep their own username/email)
- Model method `updateUser` builds query dynamically based on provided fields

**Architecture Note**: User-related operations are separated from authentication logic:

- `AuthService` handles authentication (login, register, logout)
- `UserService` handles user operations (get info, update profile)
- This separation allows for better code organization and reusability

---

## 10. Implemented API Endpoints

### Authentication Endpoints (`/api/auth`)

- `POST /api/auth/register` - Register new user (public)
- `POST /api/auth/login` - Login user (public)

### User Endpoints (`/api/users`)

- `GET /api/users/info` - Get current user information (protected)
- `PATCH /api/users/profile` - Update user profile (username/email) (protected)

**Note**: Protected endpoints require JWT token in HTTP-only cookie named `token`

---

### 9.3 Category Features

#### Feature: Create Category

- **Endpoint**: `POST /api/categories`
- **Auth**: Required
- **Input**: name, type (income/expense), color (optional)
- **Validation**:
  - Name: 1-100 characters
  - Type: 'income' or 'expense'
  - Color: Valid hex color
- **Error Cases**:
  - 400: Invalid input
  - 409: Category name already exists for user

#### Feature: Get All Categories

- **Endpoint**: `GET /api/categories`
- **Auth**: Required
- **Query Params**: type (optional filter)
- **Output**: Array of user's categories

#### Feature: Update Category

- **Endpoint**: `PUT /api/categories/:id`
- **Auth**: Required
- **Validation**: User owns category
- **Error Cases**:
  - 404: Category not found
  - 403: Not category owner

#### Feature: Delete Category

- **Endpoint**: `DELETE /api/categories/:id`
- **Auth**: Required
- **Business Rule**: Cannot delete if transactions exist (FK RESTRICT)
- **Error Cases**:
  - 404: Category not found
  - 403: Not category owner
  - 400: Category has associated transactions

### 9.4 Transaction Features

#### Feature: Create Transaction

- **Endpoint**: `POST /api/transactions`
- **Auth**: Required
- **Input**: categoryId, amount, type, date, description (optional)
- **Validation**:
  - Amount > 0
  - Valid date format
  - Category belongs to user
- **Error Cases**:
  - 400: Invalid input
  - 404: Category not found
  - 403: Category doesn't belong to user

#### Feature: Get All Transactions

- **Endpoint**: `GET /api/transactions`
- **Auth**: Required
- **Query Params**:
  - type (income/expense)
  - categoryId
  - startDate, endDate
  - limit, offset (pagination)
- **Output**: Paginated array of transactions with category info

#### Feature: Get Transaction by ID

- **Endpoint**: `GET /api/transactions/:id`
- **Auth**: Required
- **Validation**: User owns transaction
- **Error Cases**:
  - 404: Transaction not found
  - 403: Not transaction owner

#### Feature: Update Transaction

- **Endpoint**: `PUT /api/transactions/:id`
- **Auth**: Required
- **Validation**: User owns transaction
- **Error Cases**:
  - 404: Transaction not found
  - 403: Not transaction owner

#### Feature: Delete Transaction

- **Endpoint**: `DELETE /api/transactions/:id`
- **Auth**: Required
- **Validation**: User owns transaction

#### Feature: Get Financial Summary

- **Endpoint**: `GET /api/transactions/summary`
- **Auth**: Required
- **Query Params**: startDate, endDate
- **Output**:
  - Total income
  - Total expenses
  - Balance (income - expenses)
  - Breakdown by category

---

## 10. Security Requirements

### 10.1 Password Security

- **Hashing Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Storage**: Never store plain text passwords
- **Validation**: Minimum 8 characters (enforced by Zod)

### 10.2 Authentication Security

- **Token Type**: JWT (JSON Web Token)
- **Storage**: HTTP-only cookies (prevents XSS)
- **Token Expiration**: 7 days (configurable)
- **Secret**: Minimum 32 characters, stored in environment variables
- **Cookie Attributes**:
  - `httpOnly: true` (prevents JavaScript access)
  - `secure: true` (HTTPS only in production)
  - `sameSite: 'strict'` (CSRF protection)

### 10.3 SQL Injection Prevention

- **Method**: Parameterized queries using `pool.execute()`
- **Never**: String concatenation for SQL queries
- **Example**:

```typescript
// ✅ Correct (parameterized)
pool.execute('SELECT * FROM users WHERE user_email = ?', [email])

// ❌ Wrong (vulnerable to SQL injection)
pool.query(`SELECT * FROM users WHERE user_email = '${email}'`)
```

### 10.4 CORS Configuration

- **Development**: Allow localhost:5173 (frontend dev server)
- **Production**: Whitelist specific domains only
- **Credentials**: Enable to allow cookies

### 10.5 Environment Variables

- **Storage**: `.env` file (never committed to git)
- **Validation**: Zod schema ensures all required vars exist
- **Access**: Through validated `env` object only

### 10.6 Error Messages

- **Operational Errors**: Send specific messages to client
- **Programming Errors**: Log details, send generic message to client
- **Authentication**: Use generic "Invalid credentials" (don't reveal if email exists)

---

## 11. Error Handling Strategy

### 11.1 Error Types

#### Operational Errors (Expected)

- User input validation failures
- Resource not found (404)
- Duplicate resources (409)
- Unauthorized access (401, 403)
- Database constraint violations

**Handling**: Send detailed error to client

#### Programming Errors (Unexpected)

- Bugs in code
- Undefined variables
- Type errors
- Unhandled promise rejections

**Handling**: Log error, send generic message to client

### 11.2 AppError Class

```typescript
class AppError extends Error {
  statusCode: number
  isOperational: boolean = true
}
```

**Usage**:

```typescript
// In services
if (!user) {
  throw new AppError('User not found', 404)
}

if (existingUser) {
  throw new AppError('Email already in use', 400)
}

if (!isAuthorized) {
  throw new AppError('Unauthorized', 403)
}
```

### 11.3 Error Handler Middleware

**Location**: Last middleware in Express app

**Responsibilities**:

1. Catch all errors from routes and middleware
2. Determine if error is operational or programming
3. Format error response
4. Log programming errors
5. Send appropriate HTTP status and message

**Implementation**:

```typescript
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    // Operational error - send to client
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    })
  }

  // Programming error - log and send generic message
  console.error('ERROR:', err)
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}
```

### 11.4 asyncHandler Utility

**Purpose**: Eliminate try-catch blocks in controllers

**Implementation**:

```typescript
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

**Usage**:

```typescript
// No try-catch needed!
register = asyncHandler(async (req, res) => {
  const result = await authService.register(...)
  res.status(201).json(result)
})
```

---

## 12. Development Workflow

### 12.1 Initial Setup

```bash
# 1. Initialize project
pnpm init

# 2. Install dependencies
pnpm add express mysql2 jsonwebtoken bcryptjs zod cookie-parser cors dotenv
pnpm add -D typescript @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/cookie-parser @types/cors tsx nodemon @biomejs/biome

# 3. Create configuration files
# - tsconfig.json
# - biome.json
# - .gitignore
# - .env

# 4. Create folder structure
mkdir -p src/{config,middlewares,schemas,models,services,controllers,routes,utils}

# 5. Set up database
mysql -u root -p < expense_tracker_schema.sql
```

### 12.2 Development Process

```bash
# Start development server (auto-reload)
pnpm dev

# Check code quality
pnpm check          # Lint + format
pnpm lint           # Lint only
pnpm format         # Format only
pnpm type-check     # TypeScript errors only

# Build for production
pnpm build

# Run production build
pnpm start
```

### 12.3 Feature Implementation Order

1. **Phase 1: Foundation**
   - ✅ Environment & database setup
   - ✅ AppError utility
   - ✅ asyncHandler utility
   - ✅ env.ts config
   - ✅ database.ts config

2. **Phase 2: Authentication & User Management**
   - user.schema.ts (Zod validation schemas for register/login)
   - user.model.ts (database queries - findByEmail, findById, create)
   - auth.service.ts (authentication business logic)
   - auth.controller.ts (HTTP handlers for register/login)
   - user.service.ts (user-related business logic)
   - user.controller.ts (HTTP handlers for user info)
   - validator.ts middleware
   - errorHandler.ts middleware
   - auth.routes.ts (public auth endpoints)
   - user.routes.ts (protected user endpoints)
   - Test authentication flow

3. **Phase 3: Protected Routes**
   - auth.ts middleware (JWT verification)
   - Test protected endpoints

4. **Phase 4: Categories**
   - category.schema.ts
   - category.model.ts
   - category.service.ts
   - category.controller.ts
   - category.routes.ts
   - Test category CRUD

5. **Phase 5: Transactions**
   - transaction.schema.ts
   - transaction.model.ts
   - transaction.service.ts
   - transaction.controller.ts
   - transaction.routes.ts
   - Test transaction CRUD

6. **Phase 6: Analytics**
   - Summary endpoints
   - Reports
   - Filtering/pagination

### 12.4 Testing Approach

**Manual Testing Tools**:

- Postman or Thunder Client (VS Code extension)
- curl commands

**Test Checklist per Feature**:

- ✅ Valid input → Success response
- ✅ Invalid input → 400 error with validation details
- ✅ Missing authentication → 401 error
- ✅ Unauthorized access → 403 error
- ✅ Not found → 404 error
- ✅ Duplicate resource → 409 error

---

## 13. Environment Configuration

### 13.1 .env File

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Cookies
COOKIE_EXPIRES_DAYS=1
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
```

### 13.2 Environment Variables Reference

| Variable | Type | Description | Example |
| ---------- | ------ | ------------- | --------- |
| NODE_ENV | enum | Environment mode | development, production |
| PORT | number | Server port | 3000 |
| DB_HOST | string | MySQL host | localhost |
| DB_PORT | number | MySQL port | 3306 |
| DB_USER | string | MySQL username | root |
| DB_PASSWORD | string | MySQL password | password123 |
| DB_NAME | string | Database name | expense_tracker |
| JWT_SECRET | string | JWT signing key (min 32 chars) | long_random_string |
| JWT_EXPIRES_IN | string | Token expiration | 7d, 24h, 30m |
| COOKIE_EXPIRES_DAYS | number | Cookie duration in days | 1 |
| COOKIE_SECURE | boolean | HTTPS only (prod: true) | false, true |
| COOKIE_HTTP_ONLY | boolean | Prevent JS access | true |

### 13.3 Validation with Zod

All environment variables are validated on application start. If any required variable is missing or invalid, the application will crash with a clear error message.

---

## Appendix A: API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Appendix B: HTTP Status Codes Used

| Code | Meaning | Usage |
| ------ | --------- | ------- |
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 500 | Internal Server Error | Programming error |

---

## Appendix C: Development Checklist

### Setup Checklist

- [ ] Node.js >=18 installed
- [ ] pnpm >=8 installed
- [ ] MySQL installed and running
- [ ] Database created from schema
- [ ] All dependencies installed
- [ ] .env file created and configured
- [ ] TypeScript compiles without errors
- [ ] Biome runs without errors

### Code Quality Checklist

- [ ] No TypeScript errors
- [ ] No unused variables/imports
- [ ] All functions have proper types
- [ ] No `any` types used
- [ ] Biome formatting applied
- [ ] Proper error handling
- [ ] Input validation with Zod
- [ ] SQL queries are parameterized

### Security Checklist

- [ ] Passwords are hashed
- [ ] JWT tokens expire
- [ ] HTTP-only cookies set
- [ ] CORS properly configured
- [ ] No sensitive data in git
- [ ] Environment variables validated
- [ ] SQL injection prevented
- [ ] Generic error messages for auth

---

## Document History

| Version | Date | Author | Changes |
| --------- | ------ | -------- | --------- |
| 1.0 | 2026-01-10 | Development Team | Initial PRD created |
| 1.1 | 2026-01-13 | Development Team | Updated with implementation details: Added auth middleware with JWT error handling, separated UserService and UserController from AuthController, updated cookie expiration to 1 day, added model method reusability pattern, added complete middleware implementations, updated API endpoints structure |
| 1.2 | 2026-01-13 | Development Team | Added user profile update functionality: PATCH /api/users/profile endpoint, updateProfileSchema with partial updates, dynamic SQL query building in UserModel.updateUser, uniqueness validation excluding current user, architectural decision on dynamic SQL queries for security and flexibility |

---

**End of Document*
