# Live Preview Sync Documentation

## Overview

The Live Preview Sync feature enables real-time synchronization between the Bentoblocks builder and the Daytona preview sandbox. When enabled, changes made to blocks in the builder are automatically reflected in the live preview without needing to redeploy.

## Architecture

### Components

1. **API Route**: `/app/api/update-preview/route.ts`
   - Handles sync requests from the client
   - Updates HTML in existing Daytona sandbox
   - Implements rate limiting (2 seconds minimum between updates)
   - Validates requests and handles errors gracefully

2. **Custom Hook**: `/hooks/usePreviewSync.ts`
   - Manages sync state and lifecycle
   - Subscribes to Zustand store changes
   - Implements intelligent debouncing
   - Handles retry logic with exponential backoff

3. **UI Component**: `/components/ui/PreviewButton.tsx`
   - Displays preview modal with live sync controls
   - Toggle switch to enable/disable sync
   - Real-time sync status indicators
   - Manual sync button

4. **Library Updates**: `/lib/daytonaClient.ts`
   - Added `sandboxId` to `PreviewResult` interface
   - Returns sandbox ID after deployment for tracking

## How It Works

### 1. Initial Preview Creation

```typescript
// User clicks "Preview Site" button
// → Creates Daytona sandbox
// → Deploys HTML with HTTP server
// → Returns preview URL + sandboxId
{
  success: true,
  url: "https://preview.daytona.io/...",
  sandboxId: "sandbox-123abc",
  isMock: false
}
```

### 2. Enabling Live Sync

```typescript
// User toggles "Live Sync" ON in preview modal
// → Calls enableSync(sandboxId)
// → Hook subscribes to Zustand store changes
// → Starts monitoring blocks and contextPrompt
```

### 3. Change Detection & Debouncing

```typescript
// User makes changes to blocks
// → Zustand store updates
// → Hook detects changes
// → Debounce timer starts (2.5 seconds)
// → If more changes occur, timer resets
// → Max wait timer ensures sync within 10 seconds
```

### 4. Sync Execution

```typescript
// Debounce timer expires
// → Deep equality check (skip if no real changes)
// → POST /api/update-preview with:
//    - sandboxId
//    - blocks array
//    - contextPrompt
// → API regenerates HTML
// → Uploads to sandbox via Daytona SDK
// → Updates sync status in UI
```

### 5. Error Handling

```typescript
// If sync fails:
// → Retry with exponential backoff (3 attempts)
// → Show error message in UI
// → After 5 consecutive errors, disable auto-sync
// → Manual sync still available

// If sandbox no longer exists:
// → Disable sync automatically
// → Notify user to create new preview
```

## Debouncing Strategy

The hook uses a sophisticated debouncing approach:

| Scenario | Debounce Time | Behavior |
|----------|---------------|----------|
| Normal editing | 2.5 seconds | Resets on each change |
| Rapid changes | 2.5 seconds | Keeps resetting |
| Max wait time | 10 seconds | Forces sync even if still changing |
| No actual change | 0 seconds | Skip sync entirely |

This ensures:
- Responsive feedback (not too slow)
- Efficient API usage (not too many requests)
- Guaranteed sync (max 10 seconds)
- Smart skipping (no unnecessary syncs)

## API Specification

### POST /api/update-preview

**Request:**
```json
{
  "sandboxId": "string (required)",
  "blocks": "Block[] (required)",
  "contextPrompt": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "timestamp": "2025-10-10T12:34:56.789Z",
  "blocksCount": 5
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid sandboxId"
}
```

**404 Not Found (sandbox deleted):**
```json
{
  "success": false,
  "error": "Sandbox not found or no longer exists",
  "sandboxGone": true
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "error": "Rate limit: Please wait 1 seconds",
  "retryAfter": 1000
}
```

**503 Service Unavailable:**
```json
{
  "success": false,
  "error": "DAYTONA_API_KEY not configured",
  "isMock": true
}
```

## Rate Limiting

### Server-Side
- Minimum 2 seconds between updates per sandbox
- Tracked in-memory with Map<sandboxId, lastUpdateTime>
- Automatic cleanup of old entries (>1 hour)

### Client-Side
- Debounce: 2.5 seconds default
- Max wait: 10 seconds
- Retry delays: 1s, 2s, 4s (exponential backoff)

## State Management

### Hook State
```typescript
{
  sandboxId: string | null,        // Current sandbox ID
  isSyncing: boolean,              // Sync in progress
  lastSyncTime: Date | null,       // Last successful sync
  syncError: string | null,        // Current error message
  liveSyncEnabled: boolean,        // Sync active/inactive
}
```

### Hook Methods
```typescript
{
  enableSync: (sandboxId: string) => void,  // Start syncing
  disableSync: () => void,                   // Stop syncing
  manualSync: () => Promise<void>,           // Force sync now
}
```

## UI Elements

### Sync Status Indicators
- 🟢 Green: Synced and up to date
- 🟡 Yellow: Syncing in progress (with pulse animation)
- 🔴 Red: Sync error
- ⚪ Gray: Sync disabled

### Toggle Switch
- ON (blue): Live sync active
- OFF (gray): Live sync inactive
- Disabled for mock previews (no sandboxId)

### Status Display
```
Status: [Up to date / Syncing... / Error]
Last synced: [Just now / 5s ago / 2m ago / Never]
```

### Manual Sync Button
- Always available when preview is open
- Disabled during active sync
- Bypasses debounce timer
- Shows "Syncing..." when active

## Performance Characteristics

### Network Usage
- Average sync: ~1-50 KB (depends on block count)
- Typical frequency: Every 2-10 seconds while editing
- Smart caching: Skips sync if no changes detected

### CPU Usage
- Debounce timers: Negligible
- Deep equality check: O(n) where n = block count
- JSON serialization: Standard browser performance

### Memory Usage
- Rate limit cache: ~100 bytes per sandbox
- Hook state: ~1 KB
- No memory leaks (proper cleanup on unmount)

## Error Recovery

### Automatic Recovery
1. **Network errors**: 3 retries with exponential backoff
2. **Rate limiting**: Wait and retry automatically
3. **Temporary failures**: Continue trying

### Manual Recovery
1. **Manual sync button**: Force immediate sync
2. **Toggle sync off/on**: Reset sync state
3. **Create new preview**: Fresh start

### Graceful Degradation
- Sync errors don't break the builder
- Preview still works without sync
- Clear error messages guide users
- Fallback to manual preview always available

## Limitations

### Current Limitations
1. **Mock mode**: No live sync (requires DAYTONA_API_KEY)
2. **Single preview**: One active preview per session
3. **Browser-only**: No cross-device sync
4. **No offline queue**: Changes while offline are lost

### Known Issues
1. **Sandbox lifecycle**: Preview sandbox may timeout after inactivity
2. **Large sites**: Sync time increases with block count
3. **Network dependency**: Requires stable connection

### Browser Compatibility
- Modern browsers only (ES2020+)
- Requires fetch API
- Requires AbortController
- No IE11 support

## Testing Scenarios

### Manual Testing Checklist
- [ ] Enable sync, make change, verify preview updates
- [ ] Make rapid changes, verify debouncing works
- [ ] Close and reopen modal, verify sync resumes
- [ ] Disable sync, make changes, verify no sync occurs
- [ ] Manual sync button works immediately
- [ ] Error message displays on failure
- [ ] Status indicator changes correctly
- [ ] Time ago updates in real-time

### Edge Cases
- [ ] Sandbox no longer exists (deleted externally)
- [ ] Network timeout during sync
- [ ] Rate limit exceeded
- [ ] Empty blocks array
- [ ] Very large HTML (1000+ blocks)
- [ ] Rapid enable/disable sync toggling

## Future Enhancements

### Potential Improvements
1. **Iframe preview**: Embed preview in builder for instant visual feedback
2. **Diff detection**: Only send changed blocks, not full HTML
3. **Offline queue**: Save changes and sync when connection restored
4. **Multi-device sync**: WebSocket-based real-time collaboration
5. **Sync indicator per block**: Show which blocks were just synced
6. **Preview history**: Rollback to previous preview versions
7. **Sync analytics**: Track sync frequency and performance

### Performance Optimizations
1. **Incremental updates**: Update only changed sections
2. **Better caching**: Browser-side HTML cache
3. **Compressed payloads**: Gzip API requests
4. **Batch updates**: Combine multiple changes

## Troubleshooting

### Sync Not Working
1. Check DAYTONA_API_KEY is configured
2. Verify preview was created successfully (not mock)
3. Check browser console for errors
4. Try manual sync button
5. Toggle sync off and on
6. Create a new preview

### Slow Sync
1. Reduce block count (split into pages)
2. Check network connection speed
3. Verify Daytona API status
4. Check rate limiting (wait 2 seconds)

### Error Messages

**"No preview active"**
- Solution: Create a preview first, then enable sync

**"Preview closed - please create a new preview"**
- Solution: Sandbox was deleted, create new preview

**"Rate limit: Please wait X seconds"**
- Solution: Wait indicated time, sync will retry automatically

**"DAYTONA_API_KEY not configured"**
- Solution: Add API key to environment variables

## Development Guide

### Adding New Sync Triggers
```typescript
// In usePreviewSync.ts, modify the subscription:
useEffect(() => {
  const unsubscribe = useBuilderStore.subscribe((state) => {
    // Add new state properties to monitor
    const newProperty = state.newProperty;

    if (hasChanged(newProperty)) {
      debouncedSync(state.blocks, state.contextPrompt);
    }
  });
}, [sandboxId]);
```

### Customizing Debounce Timing
```typescript
// In usePreviewSync.ts:
const DEBOUNCE_DELAY = 3000; // 3 seconds (increase for slower sync)
const MAX_WAIT_TIME = 15000; // 15 seconds (increase max wait)
```

### Adding Sync Callbacks
```typescript
// In PreviewButton.tsx:
const { enableSync } = usePreviewSync({
  onSyncStart: () => console.log('Sync started'),
  onSyncSuccess: () => console.log('Sync completed'),
  onSyncError: (error) => console.error('Sync failed:', error),
});
```

## Security Considerations

### API Security
- Sandbox ID validation (format check)
- Rate limiting prevents abuse
- No authentication required (sandboxes are public)
- HTML sanitization in generateStaticHTML

### XSS Prevention
- All user content is escaped in HTML generation
- No inline script execution
- Content Security Policy on preview

### Rate Limiting
- Per-sandbox rate limiting
- Memory-efficient tracking
- Automatic cleanup of old entries

## Conclusion

The Live Preview Sync feature provides a seamless, real-time editing experience for Bentoblocks users. It intelligently balances responsiveness with API efficiency, provides robust error handling, and degrades gracefully when issues occur.

**Key Benefits:**
- Instant visual feedback on changes
- Efficient API usage (smart debouncing)
- Robust error recovery
- Clear user feedback
- Performance-optimized

**Production Ready:**
- TypeScript strict mode
- Comprehensive error handling
- Memory leak prevention
- Rate limiting
- Graceful degradation
