# Security Specification for Songs Collection

## Data Invariants
1.  **Schema Integrity**: A song must ALWAYS have a `title`, `artist`, and `chords` string field.
2.  **ID Consistency**: The `id` field must match the document ID in Firestore.
3.  **Non-Empty Fields**: Title and artist cannot be empty strings.

## The "Dirty Dozen" Payloads (Examples to Reject)
1.  **Missing `title`**: `{ "artist": "Elevation", "chords": "..." }`
2.  **Missing `artist`**: `{ "title": "Alaba", "chords": "..." }`
3.  **Missing `chords`**: `{ "title": "Alaba", "artist": "Elevation" }`
4.  **Empty `title`**: `{ "title": "", "artist": "Elevation", "chords": "..." }`
5.  **Massive Payload**: A `chords` string exceeding 1MB (to prevent resource exhaustion).
6.  **Schema Injection**: `{ "title": "Song", "artist": "Artist", "chords": "...", "isAdmin": true }` (injecting unauthorized field).
7.  **Wrong Type**: `{ "title": 123, "artist": "Elevation", "chords": "..." }`
8.  **Invalid Path**: Attempting to write to `/songs/forbidden-id` (if strict regex check needed).
9.  **Payload with Ghost Fields**: `{ "title": "S", "artist": "A", "chords": "...", "maliciousKey": "..." }`
10. **Empty Payload**: `{}`
11. **Spoofed ID**: Trying to set ownerId in a document that doesn't have it.
12. **Null Values**: `{ "title": null, "artist": "A", "chords": "..." }`

## The Test Runner Plan
- `firestore.rules.test.ts` will use `@firebase/rules-unit-testing` to verify these payloads are rejected.
