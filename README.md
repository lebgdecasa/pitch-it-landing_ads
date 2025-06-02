# NexTraction Landing Page - Full-Stack Integration

This project is a complete front-end/back-end integration for the NexTraction landing page, ready for deployment on Vercel. It includes:

- Next.js frontend with TypeScript and Tailwind CSS
- MongoDB database integration for storing form submissions
- API routes for waitlist and demo request submissions
- Internationalization support (English and French)
- Form validation and error handling

## Getting Started

### Prerequisites

- Node.js 14.6.0 or newer
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `.env.local.example` and add your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Building for Production

```bash
npm run build
```

## Deployment on Vercel

This project is optimized for deployment on Vercel. To deploy:

1. Create a Vercel account if you don't have one
2. Install the Vercel CLI: `npm i -g vercel`
3. Run `vercel` in the project directory and follow the prompts
4. Add your MongoDB connection string as an environment variable in the Vercel dashboard

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

- `/components` - React components organized by type
- `/context` - React context providers (language context)
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and database connection
- `/models` - MongoDB models
- `/pages` - Next.js pages and API routes
- `/public` - Static assets
- `/styles` - Global CSS styles
- `/utils` - Utility functions and translations

## Database Models

### Waitlist Entry
- email: String (required, unique)
- language: String (en/fr)
- createdAt: Date
- source: String

### Demo Request
- name: String (required)
- email: String (required)
- company: String (optional)
- interest: String (required)
- language: String (en/fr)
- createdAt: Date
- status: String (pending/contacted/completed)
- source: String

## API Endpoints

### POST /api/waitlist
Adds an email to the waitlist.

Request body:
```json
{
  "email": "user@example.com",
  "language": "en"
}
```

### POST /api/demo-request
Submits a demo request.

Request body:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "company": "Company Name",
  "interest": "Interest details",
  "language": "en"
}
```

## Customization

- Edit translations in `/utils/translations.ts`
- Modify UI components in `/components`
- Update styles in `/styles/globals.css`
- Configure database models in `/models`
