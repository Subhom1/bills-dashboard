# Bills Dashboard

A React application that allows users to view and manage bills from the Oireachtas API.
Users can filter bills, view details in English and Irish, and mark bills as favorites.

## Features

- Fetches and displays bills in a paginated table
- Allows filtering bills by bill status 
- Opens a modal to view bill details (English & Gaeilge)
- Enables favoriting/unfavoriting bills
- Displays favorited bills in a separate tab
- Uses Material UI for styling
- Written in TypeScript
- Includes unit tests with Jest & React Testing Library

## Tech Stack

- React 18 - Frontend library
- TypeScript - Type safety and better developer experience
- Material UI - UI component library for consistent design
- Recoil - State management for React
- Vite - Next generation frontend tooling
- Jest & React Testing Library - Testing framework
- Tailwind CSS - Utility-first CSS framework

## Key Components

### BillsTabPanel

Main container component that manages the tabs for bills and favorites.

- Handles tab switching logic
- Manages bill filtering
- Coordinates data fetching

### BillsTable

Displays bills in a paginated table format.

- Implements row-level click handling
- Manages favorite toggling
- Handles pagination

### ModalTabPanel

Modal dialog for displaying detailed bill information.

- Shows bill titles in English and Irish
- Implements tabbed interface
- Manages modal state

### BillFilterSelect

Selectbox to show all bill status option for filtering

- Shows bill statuses
- Implements bills filtering by bill status

## State Management

Using Recoil for state management with the following atoms:

- `billsState`: Stores the current list of bills
- `billHeadState`: Manages pagination metadata
- `favoriteBillsState`: Maintains list of favorited bills
- `fetchedPagesState`: Maintains list of visited pages
- `filterState`: Maintains selected filter state
- `networkState`: Maintains device online/offline status 

Recoil Selector for filtered states tailored to the component needs
- `billSelectors`: This has one selector **filteredBillsSelector**;  extracts the filtered bills from the fetched dataset based on the filterState value selected by the **BillFilterSelct** component.

## Network Calls Management

- The `bills.ts` file manages network calls for fetching bills data from the Oireachtas API.
- Uses an Axios instance configured with a base URL, timeout settings, and common headers to ensure consistent API calls.
- The `fetchBills` function retrieves bills data, supporting pagination and mock data for testing.
- The `favoriteService` object simulates API calls to toggle the favorite status of a bill.
- The `fetchBillsWithCache` function caches API responses to reduce redundant network requests and improve performance.

## Installation & Setup

### Prerequisites

- Node.js (22.0+)
- npm

### Steps to Run

1. **Clone the Repository**

   ```sh
   git clone https://github.com/Subhom1/bills-dashboard.git
   cd bills-dashboard
   ```
   'main' is the latest updated branch
2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL="https://api.oireachtas.ie/v1/"
   ```

4. **Start Development Server**
   ```sh
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server on port 5173
- `npm run build` - Build for production
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Code Style

- Using ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode enabled

## Performance Considerations

### Table Optimization

- Smart pagination with cached page tracking
- Smooth loading transitions with skeleton states
- Optimized table re-renders with fixed dimensions

### Data Management

- Intelligent data fetching with page caching
- Prevents duplicate API calls for visited pages
- Efficient duplicate prevention using Set data structure

### Component Optimization

- Memoized expensive computations with `useMemo`
- Optimized re-renders with `React.memo`
- Lazy loading for modal and filter components
- Consistent table heights to prevent layout shifts

### State Management

- Recoil atoms for efficient state updates
- Tracking mechanism for fetched pages
- Optimized favorite toggling with local state

### Loading States

- Skeleton loading with matched dimensions
- Smooth transitions between states
- Prevented layout shifts during loading
- Consistent table dimensions across states

### Smart Filtering System 

- **Efficient Filter State**: Uses [`filterState`](src/state/atoms/filterState.ts) atom to manage filter selections without re-rendering the entire table
- **Smart Filter Logic**: The [`filteredBillsSelector`](src/state/selectors/billsSelector.ts) only applies filters to the fetched dataset
- **Quick Status Updates**: 
  - Filters bills by status (Current, Withdrawn, Enacted, etc.)
  - Updates immediately without waiting for API responses
  - Resets filter state while switching between tabs
- **Optimized Filter Performance**:
  - Uses [`useMemo`](src/components/bills/BillsTable.tsx) to cache filtered results
  - Prevents unnecessary re-filtering when pagination changes
  - Only re-applies filters when filter criteria actually change
- **User-Friendly Experience**:
  - Automatic page reset when applying new filters
  - Clear visual feedback when filters are active
  - Easy filter clearing with "All" option
- **Filter + Favorites Integration**:
  - Filters work seamlessly in both main bills and favorites tabs
  - Maintains separate filtered counts for each view
  - Preserves favorite status across filter changes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Update documentation
style: Code style update
refactor: Code refactoring
test: Add tests
chore: Tooling changes
```

## Contact

Subhom Kundu - [@SubhomKundu](https://twitter.com/subhom_Kundu)

Project Link: [https://github.com/Subhom1/bills-dashboard](https://github.com/Subhom1/bills-dashboard)
