# Demo Notes - Frontend Unit Tests

## Test Commands

```bash
npm test
```
Runs all 33 unit tests (should all pass ✅)

```bash
npm run test:coverage
```
Shows test coverage report with percentages

```bash
npm run test:watch
```
Runs tests in watch mode (re-runs on file changes)

## Test Structure

```
__tests__/
├── utils/
│   ├── api.test.ts       # API layer tests (8 tests)
│   └── auth.test.ts      # Auth utility tests (5 tests)
├── components/
│   ├── Header.test.tsx   # Header component tests (2 tests)
│   └── PostCard.test.tsx # Post card tests (3 tests)
└── app/
    ├── home.test.tsx     # Home feed tests (5 tests)
    ├── search.test.tsx   # User search tests (4 tests)
    ├── messages.test.tsx # Messaging tests (4 tests)
    └── index.test.tsx    # App entry tests (3 tests)
```
