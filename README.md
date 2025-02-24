# Bills Dashboard

A React application that allows users to view and manage bills from the Oireachtas API.
Users can filter bills, view details in English and Irish, and mark bills as favorites.

## Features

✅ Fetches and displays bills in a paginated table  
✅ Allows filtering bills by type  
✅ Opens a modal to view bill details (English & Gaeilge)  
✅ Enables favoriting/unfavoriting bills  
✅ Displays favorited bills in a separate tab  
✅ Uses Material UI for styling  
✅ Written in TypeScript  
✅ Includes unit tests with Jest & React Testing Library

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

## State Management

Using Recoil for state management with the following atoms:

- `billsState`: Stores the current list of bills
- `billHeadState`: Manages pagination metadata
- `favoriteBillsState`: Maintains list of favorited bills
- `fetchedPagesState`: Maintains list of visited pages

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

## Testing

### Running Tests

```sh
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure

```
src/tests/
├── components/     # Component tests
│   ├── BillsTable.test.tsx
│   ├── BillFilterSelect.test.tsx
│   │── ModalTabPanel.test.tsx
│   ├── TabContent.test.tsx
│   ├── TabWrapper.test.tsx
│   ├── ModalTabPanel.test.tsx
│   ├── TableSkeleton.test.tsx
│   ├── Loader.test.tsx
│   ├── ErrorBoundary.test.tsx
│   └── Layout.test.tsx
├── mocks/         # Mock data
└── setupTests.ts  # Test configuration
```

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
- Optimized state updates with batching

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

### Code Examples

```typescript
// Example of page tracking implementation
const [fetchedPages, setFetchedPages] = useRecoilState(fetchedPagesState);

// Check if page is already fetched
if (!fetchedPages.has(newPage)) {
  await fetchData(newPage);
  setFetchedPages(prev => new Set(prev).add(newPage));
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

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

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```sh
   lsof -i :5173
   kill -9 <PID>
   ```

2. **Node Version Mismatch**
   ```sh
   nvm use 22
   ```

## License

[MIT License](LICENSE)

## Contact

Subhom Kundu - [@SubhomKundu](https://twitter.com/subhom_Kundu)

Project Link: [https://github.com/Subhom1/bills-dashboard](https://github.com/Subhom1/bills-dashboard)
