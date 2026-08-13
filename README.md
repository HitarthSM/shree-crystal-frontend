# Shree Crystal Frontend

This is the frontend application for the Shree Crystal Co-op Credit and Consumers Society Limited.

## Getting Started

Follow these steps to run the project locally after cloning the repository.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/HitarthSM/shree-crystal-frontend.git
   cd shree-crystal-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   By default, the app expects the backend to be running on `http://localhost:3000`. 
   If your backend is running elsewhere, create a `.env` file in the root of the project and add:
   ```env
   VITE_API_URL=http://your-backend-url
   ```

### Development

To start the development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

### Building for Production

To build the application for production:
```bash
npm run build
```
This will generate the built assets in the `dist` folder.
