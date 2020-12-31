# Express Auth with JWT
Simple JWT auth with Express and In-memory user storage for minimal dependencies

## User flow
1- Login at `/login` to get auth and refresh tokens
2- Store auth token in memory, store refresh token in httpOnly cookie
3- When auth token is about to expire, send request to `/refresh` to retreive new auth token
4- When refresh token expires, login again to get a new access and refresh token

## Known issues
1. ~~If access token expires before renewing it, the refresh token is effectively also useless as it can't be used to refresh the access token (See [Issue #2])~~ Fixed! See [PR #3]
2. No explicit token invalidation (Left to user, specific to database and implementation)

[Issue #2]: https://github.com/dodiameer/express-auth-jwt/issues/2
[PR #3]: https://github.com/dodiameer/express-auth-jwt/pulls/3
