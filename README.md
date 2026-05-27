# SpaceX Launches App

Angular 21 standalone application for browsing SpaceX launches and viewing launch details.

## Features

- Authentication flow
- Upcoming launches table
- Past launches table
- Latest launch view
- Launch details view
- Pagination support
- Launch status badges
- Responsive UI
- SpaceX API integration through custom backend API

## Tech Stack

- Angular 21
- TypeScript
- RxJS
- Angular Material
- Bootstrap
- SCSS

## Project Structure

```
src/
 ├── app/
 │    ├── core/
 │    ├── features/
 │    ├── shared/
 │    └── layouts/
 ├── assets/
 └── environments/
```

## Prerequisites

- Node.js 22+
- Angular CLI 21+

## Installation

```bash
npm install
```

## Development Server

```bash
ng serve
```

Navigate to:

```
http://localhost:4200
```

## Build

```bash
ng build
```

## Environment Configuration

Update API base URL inside:

```
src/environments/
```

## Main Functionality

### Authentication

The application contains a simple authentication flow with protected routes.

### Launches Table

Users can:
- Browse upcoming launches
- Browse past launches
- Navigate through paginated results
- Open launch details

### Launch Details

Detailed launch information includes:
- Launch patch
- Rocket information
- Launchpad information
- Crew members
- Launch success status
- External links

## Notes

- Application uses standalone Angular architecture.
- UI is fully responsive.
- SpaceX public API data is consumed through the backend API layer.
