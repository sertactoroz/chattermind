# Backend for Frontend (BFF) Architecture

## Overview

This project implements a Backend for Frontend (BFF) pattern with clear separation of concerns. The architecture is designed to scale as the project grows while maintaining clean code organization and maintainability.

## Architecture Layers

### 1. **Frontend Layer** (`src/app/`, `src/features/`)
- **Purpose**: User interface and user interactions
- **Responsibilities**: 
  - UI components and pages
  - State management
  - User input handling
  - Display logic

### 2. **BFF Layer** (`src/bff/`)
- **Purpose**: Backend for Frontend - API orchestration layer
- **Responsibilities**:
  - Request validation
  - Business logic coordination
  - Service orchestration
  - Response formatting
  - Error handling

### 3. **Service Layer** (`src/services/`)
- **Purpose**: Business logic and external service integration
- **Responsibilities**:
  - AI service integration (Groq API)
  - Character management
  - Database operations
  - Data transformation

### 4. **Shared Layer** (`src/shared/`)
- **Purpose**: Reusable utilities and helpers
- **Responsibilities**:
  - Error handling
  - Response formatting
  - Validation
  - Common utilities

### 5. **Domain Layer** (`src/domain/`)
- **Purpose**: Core business types and interfaces
- **Responsibilities**:
  - Type definitions
  - Business interfaces
  - Domain models

## Directory Structure

```
src/
├── app/                        # Next.js App Router (Frontend)
│   └── api/                   # API endpoints (BFF entry points)
├── bff/                        # Backend for Frontend logic
│   ├── chat/                   # Chat BFF handlers
│   ├── characters/             # Character BFF handlers
│   ├── ai/                    # AI BFF handlers
│   └── users/                 # User BFF handlers
├── services/                   # Service layer
│   ├── ai/                    # AI services
│   │   ├── AIService.ts
│   │   └── CharacterService.ts
│   └── database/              # Database services
│       └── DatabaseService.ts
├── shared/                     # Shared utilities
│   ├── errors/                # Error handling
│   │   └── AppError.ts
│   ├── response/              # Response formatting
│   │   └── ApiResponse.ts
│   └── validation/            # Validation utilities
│       └── Validator.ts
├── domain/                    # Domain layer
│   └── types.ts
└── features/                  # Frontend features
    ├── chat/
    ├── characters/
    └── speech/
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Each layer has a single, well-defined responsibility
- Easy to understand and maintain
- Changes in one layer don't affect others

### 2. **Scalability**
- Easy to add new features
- Clear path for adding new services
- Frontend and backend can scale independently

### 3. **Testability**
- Each layer can be tested independently
- Mock services for testing
- Clear interfaces make unit testing easier

### 4. **Maintainability**
- Clear code organization
- Consistent patterns
- Easy to find and fix bugs

### 5. **Flexibility**
- Easy to swap out services (e.g., different AI providers)
- Multiple frontend clients (mobile, web) can use same BFF
- Easy to add caching, rate limiting, etc.

## How to Use

### Adding a New Feature

1. **Define types** in `src/domain/types.ts`
2. **Create service** in `src/services/` if needed
3. **Create BFF handler** in `src/bff/`
4. **Add API route** in `src/app/api/`
5. **Create frontend components** in `src/features/`

### Example: Creating a New BFF Handler

```typescript
// src/bff/myfeature/handleMyFeatureBFF.ts
import { successResponse, errorResponse } from '@/shared/response/ApiResponse';
import { validateRequired } from '@/shared/validation/Validator';

export async function handleMyFeatureBFF(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const field = validateRequired(body.field, 'field');
    
    // Business logic here
    const result = processField(field);
    
    return successResponse(result, 200);
  } catch (error) {
    return errorResponse(error);
  }
}
```

### Example: Adding an API Route

```typescript
// src/app/api/myfeature/route.ts
import { NextRequest } from 'next/server';
import { handleMyFeatureBFF } from '@/bff/myfeature/handleMyFeatureBFF';

export async function POST(req: NextRequest) {
  return await handleMyFeatureBFF(req);
}
```

## Error Handling

All errors are handled consistently using the `AppError` class hierarchy:

- `ValidationError` (400)
- `UnauthorizedError` (401)
- `NotFoundError` (404)
- `ExternalServiceError` (502)
- `InternalServerError` (500)

## Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "details": { ... }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Services

### AIService
Handles all AI-related operations using Groq API.

### CharacterService
Manages character data and prompt generation.

### DatabaseService
Handles all database operations using Supabase.

## Best Practices

1. **Keep BFF handlers thin** - Only orchestrate services, don't implement business logic
2. **Use proper error types** - Always throw appropriate error types
3. **Validate input** - Always validate user input in BFF handlers
4. **Use service layer** - Don't make external API calls directly from BFF
5. **Follow naming conventions** - Use clear, descriptive names
6. **Write tests** - Test each layer independently
7. **Document changes** - Update this README when adding features

## Migration Notes

The original API routes have been refactored to use the new BFF pattern:
- `/api/chat/ai` now uses `handleChatBFF`
- Business logic moved to service layer
- Consistent error handling
- Standardized response format

## Future Improvements

- [ ] Add caching layer
- [ ] Implement rate limiting
- [ ] Add API versioning
- [ ] Add request logging/middleware
- [ ] Implement pagination
- [ ] Add webhook support
- [ ] Create mobile-specific BFF endpoints
- [ ] Add GraphQL support