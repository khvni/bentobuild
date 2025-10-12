#!/bin/bash

echo "==================================="
echo "CI Pipeline Verification Script"
echo "==================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Not in project root directory${NC}"
    exit 1
fi

echo "Running pre-CI checks..."
echo ""

# 1. Check Node.js version
echo -n "Node.js version: "
NODE_VERSION=$(node --version)
echo -e "${GREEN}$NODE_VERSION${NC}"

# 2. Check npm version
echo -n "npm version: "
NPM_VERSION=$(npm --version)
echo -e "${GREEN}$NPM_VERSION${NC}"
echo ""

# 3. Install dependencies
echo "Installing dependencies..."
if npm ci > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# 4. Run linting
echo "Running ESLint..."
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Linting passed${NC}"
else
    echo -e "${RED}✗ Linting failed${NC}"
    echo "  Run: npm run lint"
fi
echo ""

# 5. Run type checking
echo "Running TypeScript type check..."
if npx tsc --noEmit > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Type checking passed${NC}"
else
    echo -e "${RED}✗ Type checking failed${NC}"
    echo "  Run: npx tsc --noEmit"
fi
echo ""

# 6. Check formatting
echo "Checking code formatting..."
if npm run format:check > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Code formatting is correct${NC}"
else
    echo -e "${YELLOW}⚠ Code needs formatting${NC}"
    echo "  Run: npm run format"
fi
echo ""

# 7. Run build
echo "Building project..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    echo "  Run: npm run build"
fi
echo ""

# 8. Security audit
echo "Running security audit..."
if npm audit --audit-level=moderate > /dev/null 2>&1; then
    echo -e "${GREEN}✓ No security vulnerabilities found${NC}"
else
    echo -e "${YELLOW}⚠ Security vulnerabilities detected${NC}"
    echo "  Run: npm audit"
fi
echo ""

echo "==================================="
echo "Verification Complete"
echo "==================================="
echo ""
echo "To run all checks: npm run ci"
