# Posts and Comments System Implementation Plan

# Search Feature Implementation Plan

## Background and Motivation
This plan outlines the implementation of a Posts and Comments system for a backend application using Drizzle ORM. The system will allow users to create, read, and update posts and comments, with proper relationships between them.

## Key Challenges and Analysis
1. **Database Schema Design**: Need to create two tables (Posts and Comments) with proper relationships.
2. **API Implementation**: Need to implement CRUD operations for both Posts and Comments.
3. **Integration with Existing Codebase**: Need to follow the existing project structure and patterns.
4. **Validation**: Need to implement proper validation for all API endpoints.

# Pagination Implementation Plan

## Background and Motivation
This plan outlines the implementation of pagination for the Posts API. The pagination will allow clients to request a specific subset of posts using offset and limit parameters, improving performance and user experience for large datasets.

## Current Implementation Analysis
- The current `GET /` route returns all posts without pagination
- The response schema is a simple array of posts with comment counts
- The repository method `getAllPosts()` fetches all posts without any pagination parameters

## Recommendation
Update the existing route rather than creating a new one. This is because:
1. It's a common practice to add pagination to existing GET endpoints
2. It maintains backward compatibility while adding new functionality
3. It follows RESTful principles for resource collections

## Implementation Plan

### Task 1: Update Schema Files
**Objective**: Create a new schema to support paginated responses.
- **Subtask 1.1**: Create `PaginatedResponseSchema` in `src/api/routes/schemas/PaginatedResponseSchema.ts`
  - Add fields: data (generic array), meta (with total, limit, offset, page, totalPages)
  - Success Criteria: Schema is defined with all required fields
- **Subtask 1.2**: Update `GetAllPostsRespSchema` to `GetPostsRespSchema` and use the new paginated response structure
  - Success Criteria: Schema is renamed and updated to use the new structure

### Task 2: Update Repository
**Objective**: Modify the post repository to support pagination.
- **Subtask 2.1**: Update `IPostRepo` interface to accept pagination parameters
  - Rename `getAllPosts` to `getPosts` and update it to accept limit and offset
  - Add method to get total post count if needed
  - Success Criteria: Interface is updated with all required methods
- **Subtask 2.2**: Update `post.repo.ts` implementation
  - Rename and implement pagination in `getPosts` method
  - Implement method to get total post count if needed
  - Success Criteria: Repository is updated with all required methods

### Task 3: Update Controller
**Objective**: Update the post controller to handle pagination parameters.
- **Subtask 3.1**: Rename `get-all-posts.ts` to `get-posts.ts` and update controller
  - Accept limit and offset parameters
  - Calculate pagination metadata (page, totalPages)
  - Return structured response with data and metadata
  - Success Criteria: Controller is renamed and updated to handle pagination

### Task 4: Update Route
**Objective**: Update the posts route to validate and pass pagination parameters.
- **Subtask 4.1**: Update `posts.route.ts`
  - Add query parameter validation for limit and offset
  - Update import for the renamed controller
  - Pass parameters to the controller
  - Update response schema reference
  - Success Criteria: Route is updated to handle pagination parameters

# Sorting Implementation Plan

## Background and Motivation
This plan outlines the implementation of sorting functionality for the Posts API. The sorting will allow clients to request posts sorted by different criteria, enhancing the user experience and providing more control over the data presentation.

## Current Implementation Analysis
- The current `getPosts` method in `post.repo.ts` supports pagination and search but has fixed sorting by `createdAt` in descending order.
- The API endpoint doesn't accept any sorting parameters.
- We need to add support for sorting by:
  - Title (A-Z and Z-A)
  - Created at (ascending and descending)
  - Comments count (ascending and descending)

## Key Challenges and Analysis
1. **Parameter Design**: Need to define a clear and intuitive way for clients to specify sorting criteria and direction.
2. **Database Query Modification**: Need to modify the Drizzle ORM queries to support dynamic sorting.
3. **Type Safety**: Need to ensure type safety throughout the implementation.
4. **Backward Compatibility**: Need to maintain backward compatibility with existing clients.

## Implementation Plan

### Task 1: Update Schema Files
**Objective**: Create a schema to support sorting parameters.
- **Subtask 1.1**: Update `PaginationQuerySchema` in `src/api/routes/schemas/PaginationQuerySchema.ts` to include sorting parameters
  - Add `sortBy` field with allowed values: "title", "createdAt", "commentsCount"
  - Add `sortDirection` field with allowed values: "asc", "desc"
  - Make both fields optional with defaults (createdAt, desc)
  - Success Criteria: Schema is updated with sorting parameters

### Task 2: Update Repository Interface
**Objective**: Update the repository interface to support sorting parameters.
- **Subtask 2.1**: Update `IPostRepo` interface in `src/types/IPostRepo.ts`
  - Update `getPosts` method to accept sorting parameters
  - Success Criteria: Interface is updated with sorting parameters

### Task 3: Update Repository Implementation
**Objective**: Implement sorting functionality in the repository.
- **Subtask 3.1**: Update `post.repo.ts` implementation
  - Modify `getPosts` method to support dynamic sorting based on parameters
  - Implement sorting logic for title, createdAt, and commentsCount
  - Success Criteria: Repository is updated to support sorting

### Task 4: Update Controller
**Objective**: Update the controller to handle sorting parameters.
- **Subtask 4.1**: Update `get-posts.ts` controller
  - Accept and pass sorting parameters to the repository
  - Success Criteria: Controller is updated to handle sorting parameters

### Task 5: Update Route
**Objective**: Update the route to validate and pass sorting parameters.
- **Subtask 5.1**: Update `posts.route.ts`
  - Pass sorting parameters from request to controller
  - Success Criteria: Route is updated to handle sorting parameters

## High-level Task Breakdown

### Task 1: Database Schema Implementation
**Objective**: Create the database schema for Posts and Comments tables using Drizzle ORM.
- **Subtask 1.1**: Create the Posts table schema in `src/services/drizzle/schema.ts`
  - Add fields: id(uuid), title, description, createdAt, updatedAt
  - Success Criteria: Posts table schema is defined with all required fields
- **Subtask 1.2**: Create the Comments table schema in `src/services/drizzle/schema.ts`
  - Add fields: id(uuid), text, postId(foreign key), createdAt, updatedAt
  - Add relationship to Posts table
  - Success Criteria: Comments table schema is defined with all required fields and relationship to Posts

### Task 2: Repository Implementation
**Objective**: Create repositories for Posts and Comments to handle database operations.
- **Subtask 2.1**: Create Post repository in `src/repos/post.repo.ts`
  - Implement createPost, updatePost, getPostById, getAllPosts methods
  - Add method to get post with comments count
  - Success Criteria: Post repository is implemented with all required methods
- **Subtask 2.2**: Create Comment repository in `src/repos/comment.repo.ts`
  - Implement createComment, updateComment, getCommentsByPostId methods
  - Success Criteria: Comment repository is implemented with all required methods
- **Subtask 2.3**: Update `src/repos/index.ts` to export the new repositories
  - Success Criteria: New repositories are exported from index.ts

### Task 3: Type Definitions
**Objective**: Create TypeScript types for Posts and Comments.
- **Subtask 3.1**: Create Post type in `src/types/Post.ts`
  - Define Post interface and Zod schema
  - Success Criteria: Post type is defined with all required fields
- **Subtask 3.2**: Create Comment type in `src/types/Comment.ts`
  - Define Comment interface and Zod schema
  - Success Criteria: Comment type is defined with all required fields
- **Subtask 3.3**: Create repository interfaces in `src/types/IPostRepo.ts` and `src/types/ICommentRepo.ts`
  - Success Criteria: Repository interfaces are defined with all required methods

### Task 4: Controller Implementation
**Objective**: Create controllers for Posts and Comments to handle business logic.
- **Subtask 4.1**: Create Post controllers in `src/controllers/post/`
  - Implement create-post.ts, update-post.ts, get-post-by-id.ts, get-all-posts.ts
  - Success Criteria: Post controllers are implemented with all required methods
- **Subtask 4.2**: Create Comment controllers in `src/controllers/comment/`
  - Implement create-comment.ts, update-comment.ts, get-comments-by-post-id.ts
  - Success Criteria: Comment controllers are implemented with all required methods

### Task 5: API Schema Implementation
**Objective**: Create validation schemas for API requests and responses.
- **Subtask 5.1**: Create Post API schemas in `src/api/routes/schemas/`
  - Implement CreatePostReqSchema.ts, UpdatePostReqSchema.ts, GetPostByIdRespSchema.ts, GetAllPostsRespSchema.ts
  - Success Criteria: Post API schemas are implemented with all required fields
- **Subtask 5.2**: Create Comment API schemas in `src/api/routes/schemas/`
  - Implement CreateCommentReqSchema.ts, UpdateCommentReqSchema.ts, GetCommentsByPostIdRespSchema.ts
  - Success Criteria: Comment API schemas are implemented with all required fields

### Task 6: API Route Implementation
**Objective**: Create API routes for Posts and Comments.
- **Subtask 6.1**: Create Post routes in `src/api/routes/posts/posts.route.ts`
  - Implement POST / (create), GET / (get all), GET /:postId (get by id), PUT /:postId (update)
  - Success Criteria: Post routes are implemented with all required endpoints
- **Subtask 6.2**: Create Comment routes in `src/api/routes/posts/:postId/comments/comments.route.ts`
  - Implement POST / (create), GET / (get all for post), PUT /:commentId (update)
  - Success Criteria: Comment routes are implemented with all required endpoints
- **Subtask 6.3**: Update API server to register the new routes
  - Success Criteria: New routes are registered in the API server

### Task 7: Testing and Validation
**Objective**: Test the implementation to ensure it works as expected.
- **Subtask 7.1**: Test Post API endpoints
  - Test create, get all, get by id, update
  - Success Criteria: All Post API endpoints work as expected
- **Subtask 7.2**: Test Comment API endpoints
  - Test create, get all for post, update
  - Success Criteria: All Comment API endpoints work as expected

## Project Status Board
- [x] Task 1: Database Schema Implementation
  - [x] Subtask 1.1: Create Posts table schema
  - [x] Subtask 1.2: Create Comments table schema
- [x] Task 2: Repository Implementation
  - [x] Subtask 2.1: Create Post repository
  - [x] Subtask 2.2: Create Comment repository
  - [x] Subtask 2.3: Update index.ts
- [x] Task 3: Type Definitions
  - [x] Subtask 3.1: Create Post type
  - [x] Subtask 3.2: Create Comment type
  - [x] Subtask 3.3: Create repository interfaces
- [x] Task 4: Controller Implementation
  - [x] Subtask 4.1: Create Post controllers
  - [x] Subtask 4.2: Create Comment controllers
- [x] Task 5: API Schema Implementation
  - [x] Subtask 5.1: Create Post API schemas
  - [x] Subtask 5.2: Create Comment API schemas
- [x] Task 6: API Route Implementation
  - [x] Subtask 6.1: Create Post routes
  - [x] Subtask 6.2: Create Comment routes
  - [x] Subtask 6.3: Update API server
- [x] Task 7: Testing and Validation
  - [x] Subtask 7.1: Test Post API endpoints
  - [x] Subtask 7.2: Test Comment API endpoints

## Pagination Implementation Status Board
- [x] Task 1: Update Schema Files
  - [x] Subtask 1.1: Create `PaginatedResponseSchema`
  - [x] Subtask 1.2: Update `GetAllPostsRespSchema` to `GetPostsRespSchema`
- [x] Task 2: Update Repository
  - [x] Subtask 2.1: Update `IPostRepo` interface
  - [x] Subtask 2.2: Update `post.repo.ts` implementation
- [x] Task 3: Update Controller
  - [x] Subtask 3.1: Rename and update controller
- [x] Task 4: Update Route
  - [x] Subtask 4.1: Update `posts.route.ts`

## Sorting Implementation Status Board
- [x] Task 1: Update Schema Files
  - [x] Subtask 1.1: Update `PaginationQuerySchema` to include sorting parameters
- [x] Task 2: Update Repository Interface
  - [x] Subtask 2.1: Update `IPostRepo` interface to accept sorting parameters
- [x] Task 3: Update Repository Implementation
  - [x] Subtask 3.1: Update `post.repo.ts` implementation to support sorting
- [x] Task 4: Update Controller
  - [x] Subtask 4.1: Update `get-posts.ts` controller to handle sorting parameters
- [x] Task 5: Update Route
  - [x] Subtask 5.1: Update `posts.route.ts` to pass sorting parameters

## Current Status / Progress Tracking
Completed Task 1: Database Schema Implementation. Created Posts and Comments tables with proper relationships in the schema file.

Completed Task 2: Repository Implementation. Created repositories for Posts and Comments with all required methods.

Completed Task 3: Type Definitions. Created TypeScript types and interfaces for Posts and Comments.

Completed Task 4: Controller Implementation. Created controllers for Posts and Comments with all required methods.

Completed Task 5: API Schema Implementation. Created validation schemas for all API requests and responses.

Completed Task 6: API Route Implementation. Created API routes for Posts and Comments with all required endpoints.

All tasks for the Posts and Comments system have been completed!

### Pagination Implementation Progress
Completed Task 1: Updated Schema Files. Created PaginatedResponseSchema and renamed GetAllPostsRespSchema to GetPostsRespSchema.

Completed Task 2: Updated Repository. Modified IPostRepo interface and post.repo.ts implementation to support pagination with limit and offset parameters.

Completed Task 3: Updated Controller. Renamed get-all-posts.ts to get-posts.ts and updated it to handle pagination parameters and return structured response with data and metadata.

Completed Task 4: Updated Route. Modified posts.route.ts to validate and pass pagination parameters to the controller.

### Sorting Implementation Progress
Completed Task 1: Updated Schema Files. Modified PaginationQuerySchema to include sortBy and sortDirection parameters with proper validation and defaults. Added new type exports for the sorting enums.

Completed Task 2: Updated Repository Interface. The interface was already using TPaginationQuery which now includes the new sorting parameters, so no direct changes were needed to the interface itself.

Completed Task 3: Updated Repository Implementation. Implemented dynamic sorting in the getPosts method based on sortBy and sortDirection parameters, supporting sorting by title, createdAt, and commentsCount in both ascending and descending order.

Completed Task 4: Updated Controller. Modified the get-posts.ts controller to accept and pass the sorting parameters to the repository and include them in the response metadata.

Completed Task 5: Updated Route. Modified the posts.route.ts to extract and pass the sorting parameters from the request to the controller.

All tasks for the sorting implementation have been completed! The Posts API now supports sorting by title, creation date, and comments count in both ascending and descending order.

## Executor's Feedback or Assistance Requests
No feedback or assistance requests at this time. The plan for implementing sorting functionality is ready for review.

All tasks for the pagination implementation have been completed! The Posts API now supports pagination with offset and limit parameters.

## Executor's Feedback or Assistance Requests
No feedback or assistance requests yet.

## Lessons
1. **Directory Structure**: When implementing new features, it's important to follow the existing project structure. In this case, we followed the pattern of separating concerns into repositories, controllers, types, and API routes.

2. **Drizzle ORM Relations**: We learned how to implement one-to-many relationships in Drizzle ORM using the `relations` function, which allows for proper typing and query capabilities.

3. **Route Registration**: The project uses Fastify's autoload plugin to automatically register routes, so we don't need to manually register them in the API server file.

4. **Error Handling**: We implemented proper error handling in controllers by throwing errors when resources are not found, which will be caught by Fastify's error handler.

5. **Type Safety**: Using Zod schemas for validation ensures type safety throughout the application, from database to API responses.

6. **Pagination Implementation**: We learned how to implement pagination in a RESTful API using offset and limit parameters. This includes:
   - Creating a generic paginated response schema that can be reused across different endpoints
   - Using Zod for query parameter validation with sensible defaults
   - Calculating pagination metadata like page numbers and total pages
   - Implementing pagination at the database level using Drizzle ORM's limit and offset methods

7. **API Evolution**: When evolving an API, it's important to maintain backward compatibility while adding new functionality. In this case, we updated the existing endpoint rather than creating a new one, following RESTful principles.

8. **Consistent Naming**: We improved naming consistency by renaming functions and files from `getAllPosts` to `getPosts`, making the codebase more maintainable.

## Background and Motivation for Search Feature
This plan outlines the implementation of a search feature for the Posts API using PostgreSQL's pg_trgm extension. The search functionality will allow users to search posts by title and description, enhancing the user experience by providing more targeted results.

## Current Implementation Analysis
- The current `getPosts` method in the post repository supports pagination with limit and offset parameters
- The API endpoint accepts query parameters for pagination but doesn't support search functionality
- The database schema has title and description fields in the posts table which can be used for search

## Key Challenges and Analysis
1. **PostgreSQL Extension**: Need to enable the pg_trgm extension in the database
2. **Search Query Construction**: Need to build efficient search queries using Drizzle ORM
3. **API Parameter Handling**: Need to update the API to accept search parameters
4. **Performance Considerations**: Need to ensure search queries are optimized with proper indexes

## Implementation Plan

### Task 1: Database Configuration
**Objective**: Enable pg_trgm extension and create necessary indexes for efficient text search.
- **Subtask 1.1**: Create a migration to enable pg_trgm extension
  - Create a SQL migration file to run `CREATE EXTENSION IF NOT EXISTS pg_trgm;`
  - Success Criteria: pg_trgm extension is enabled in the database
- **Subtask 1.2**: Create GIN indexes for title and description columns
  - Add GIN indexes on posts.title and posts.description for faster text search
  - Success Criteria: Indexes are created and verified

### Task 2: Update Schema Files
**Objective**: Update the schema to support search parameters.
- **Subtask 2.1**: Update `PaginationQuerySchema` to include search parameters
  - Add an optional `search` field to the schema
  - Success Criteria: Schema is updated with the search parameter

### Task 3: Update Repository
**Objective**: Modify the post repository to support search functionality.
- **Subtask 3.1**: Update `IPostRepo` interface to include search parameter
  - Update the `getPosts` method to accept a search parameter
  - Success Criteria: Interface is updated with the search parameter
- **Subtask 3.2**: Update `post.repo.ts` implementation
  - Modify the `getPosts` method to filter by title and description using pg_trgm
  - Implement the search using Drizzle ORM's SQL functions and operators
  - Update the total count query to include the search filter
  - Success Criteria: Repository method filters posts based on search term

### Task 4: Update Controller
**Objective**: Update the post controller to handle search parameters.
- **Subtask 4.1**: Update `get-posts.ts` controller
  - Accept search parameter and pass it to the repository
  - Success Criteria: Controller passes search parameter to the repository

### Task 5: Update Route
**Objective**: Update the posts route to validate and pass search parameters.
- **Subtask 5.1**: Update `posts.route.ts`
  - Update query parameter validation to include search
  - Pass search parameter to the controller
  - Success Criteria: Route handles search parameter correctly

## Project Status Board for Search Feature
- [x] Task 1: Database Configuration
  - [x] Subtask 1.1: Enable pg_trgm extension
  - [x] Subtask 1.2: Create GIN indexes
- [x] Task 2: Update Schema Files
  - [x] Subtask 2.1: Update `PaginationQuerySchema`
- [x] Task 3: Update Repository
  - [x] Subtask 3.1: Update `IPostRepo` interface
  - [x] Subtask 3.2: Update `post.repo.ts` implementation
- [x] Task 4: Update Controller
  - [x] Subtask 4.1: Update `get-posts.ts` controller
- [x] Task 5: Update Route
  - [x] Subtask 5.1: Update `posts.route.ts`

## Current Status / Progress Tracking
Implementation of the search feature has been completed. All tasks have been successfully implemented.

1. Created a new SQL migration file to enable pg_trgm extension and add GIN indexes for title and description columns.
2. Updated PaginationQuerySchema to include an optional search parameter.
3. Updated the post repository to implement search functionality using pg_trgm with ILIKE for case-insensitive search.
4. Updated the controller to accept and pass the search parameter.
5. Updated the route to pass the search parameter to the controller.

## Executor's Feedback or Assistance Requests
The search feature implementation is complete. To apply the database changes, the migration needs to be run using:
```
npx drizzle-kit migrate
```

This will enable the pg_trgm extension and create the necessary indexes for efficient text search.
