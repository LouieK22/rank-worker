# rank-worker

Simple Cloudflare Worker that exposes an API to change a player's rank in a group on the Roblox site.

Handy for use in games because Roblox *still* doesn't expose an API for changing player roles.

## Setup
1. Set appropriate configs in `wrangler.toml`. See the [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/get-started/guide#7-configure-your-project-for-deployment) for more information
2. `wrangler publish` to create the worker on Cloudflare
3. Create 2 encrypted environment variables for the worker. One called `ROBLOX_COOKIE` that is set to the .ROBLOSECURITY cookie for the bot account
4. The other secret should be called `AUTH_TOKEN`. This is used to authenticate requests to the worker and should be a long random string. Pass this in the `token` header when making requests to the worker.
5. You're good to go.