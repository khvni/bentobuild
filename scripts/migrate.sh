#!/bin/bash
# Prisma Migration Script for Bentoblocks
# This script runs database migrations and generates the Prisma client

set -e  # Exit on error

echo "🗄️  Starting Prisma migration..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo "Please copy .env.example to .env.local and add your Supabase credentials"
  exit 1
fi

# Run migrations
echo "📦 Running Prisma migrations..."
npx prisma migrate dev --name init

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Migration completed successfully!"
echo "You can now use the Prisma client in your application"
