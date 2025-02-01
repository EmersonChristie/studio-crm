# Art Gallery CRM Specification

## Project Overview

The Art Gallery CRM is designed to manage all aspects of an art gallery business, including contacts, artworks, sales, invoicing, email campaigns, and sales pipeline. It will also serve as a data source for the user's marketing website. The application aims to be modular, robust, and scalable, following best practices in software development.

## Core Architecture

### 1. Server-First Approach

- Use Server Components for data fetching and caching.
- Client Components are reserved for interactive UI elements.
- Implement Server Actions for data mutations.

### 2. Rendering Strategy

- **Static Rendering**: Default for gallery pages, artwork listings, and artist profiles.
- **Dynamic Rendering**: For personalized content and real-time data, such as admin dashboards.
- **Streaming**: For long data-fetching operations, with immediate UI feedback using `loading.tsx`.

## Component Architecture

### 1. Modular Design

- Create reusable components for tables, filters, and pagination.
- Use props to customize components for different data types (e.g., artworks, contacts).

### 2. Custom Hooks

- Implement hooks for shared logic, such as data fetching and state management.

### 3. Type Safety

- Use TypeScript for end-to-end type safety.
- Define clear interfaces for data structures and handle nullable fields.

## Features

### 1. Artworks View

- **Pagination**: Implement server-side pagination for efficient data handling.
- **Advanced Search and Filtering**: Allow users to search and filter artworks based on various criteria.
- **Bulk Editing**: Enable users to edit multiple artworks simultaneously.
- **Content Creation**: Generate price lists, PDFs, and other documents.
- **AI Integration**: Leverage AI for features like image recognition and automated tagging.

### 2. Contacts View

- Similar to the Artworks View, with specific features for managing contacts.

## Data Fetching Best Practices

### 1. Server Components

- Use server components by default for data fetching.
- Keep client components only for interactive UI elements.

### 2. Data Service Layer

- Separate data fetching logic from components.
- Use 'use server' directive for server actions.
- Implement caching strategy using React cache and Next.js `unstable_cache`.
- Handle authentication checks and include proper error handling.

## Caching Strategy

- Use React's cache for request deduplication.
- Use Next.js `unstable_cache` for persistent caching.
- Implement cache invalidation using tags and set appropriate revalidation periods.

## Performance Optimization

- Implement appropriate caching strategies.
- Use parallel data fetching.
- Optimize image loading with `next/image`.

## Error Handling

- Implement proper error boundaries.
- Add loading states and handle edge cases.

## Development Guidelines

- Follow the Server-First Approach.
- Maintain a modular architecture with separate concerns (data/UI/types).
- Ensure performance optimization and type safety throughout the codebase.
