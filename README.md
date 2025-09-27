# TecDoc Article Manager

A Next.js application for managing TecDoc articles and marking their existence status.

## Features

- 📊 **Dashboard**: View statistics of total, existing, not existing, and unmarked articles
- 🔍 **Multiple Articles Focus**: Shows only InputCodes with multiple articles for comparison
- ✅ **Individual Marking**: Mark each article as existing or not existing
- 🚀 **Bulk Actions**: Mark all articles with the same InputCode at once
- 🖼️ **Image Display**: Show product images with fallback for missing images
- 🏢 **Supplier Logos**: Display supplier logos from the `suppliers/` folder
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 📄 **Pagination**: Shows 4 grouped articles per page for better performance

## Setup

### 1. Install Dependencies

```bash
cd nextjs-app
npm install
# or
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in the `nextjs-app` directory:

```env
DATABASE_URL="your-postgresql-connection-string"
```

### 3. Copy Prisma Schema

Copy the Prisma schema from the parent directory:

```bash
cp ../prisma/schema.prisma ./prisma/schema.prisma
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Copy Images

Copy the images folder to the public directory:

```bash
cp -r ../images ./public/images
```

This will copy both product images and supplier logos to the public directory.

### 6. Run the Application

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Viewing Articles

1. The main page shows only InputCodes that have multiple articles with `exists: null`
2. Each group shows all articles with the same InputCode for comparison
3. Articles are displayed in cards with images, details, and action buttons
4. Supplier logos are displayed next to supplier names
5. A supplier showcase shows all unique suppliers in each group
6. Single articles (unique InputCodes) are filtered out to focus on comparisons

### Marking Articles

#### Individual Marking
- Click "Mark as Existing" to set `exists: true`
- Click "Mark as Not Existing" to set `exists: false`
- Once marked, the button shows the current status

#### Bulk Marking
- Use "Mark All as Existing" to mark all articles in a group as existing
- Use "Mark All as Not Existing" to mark all articles in a group as not existing
- Only unmarked articles (`exists: null`) are affected by bulk actions

### Statistics

The dashboard shows:
- **Total Articles**: All articles in the database
- **Marked as Existing**: Articles with `exists: true`
- **Marked as Not Existing**: Articles with `exists: false`
- **Unmarked**: Articles with `exists: null`

## API Endpoints

### Update Single Article
```
POST /api/articles/update
{
  "id": 123,
  "exists": true
}
```

### Bulk Update Articles
```
POST /api/articles/bulk-update
{
  "inputCode": "ABC123",
  "exists": false
}
```

## File Structure

```
nextjs-app/
├── app/
│   ├── api/
│   │   └── articles/
│   │       ├── update/
│   │       └── bulk-update/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ArticleCard.tsx
│   ├── ArticleGroup.tsx
│   ├── ArticleList.tsx
│   └── StatsCard.tsx
├── lib/
│   ├── prisma.ts
│   └── types.ts
├── public/
│   └── images/
└── package.json
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **Lucide React**: Icons

## Development

### Adding New Features

1. Create components in the `components/` directory
2. Add API routes in `app/api/`
3. Update types in `lib/types.ts`
4. Use Prisma client from `lib/prisma.ts`

### Styling

The app uses Tailwind CSS with a clean, modern design:
- Cards with subtle shadows and borders
- Color-coded buttons (green for existing, red for not existing)
- Responsive grid layouts
- Loading states and animations

### Database Queries

The app efficiently queries the database:
- Uses Prisma transactions for statistics
- Includes related data (supplier, OEM numbers, images)
- Orders results by InputCode and product name
- Filters for unmarked articles (`exists: null`)
