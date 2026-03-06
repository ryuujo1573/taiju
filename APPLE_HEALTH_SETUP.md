# Apple Health Weight Integration Guide

This guide explains how to integrate your Apple Health weight data with your Cloudflare Worker API.

## Prerequisites

- Cloudflare Account
- iOS Device with Apple Health data
- Shortcuts App (installed by default on iOS)

## 1. Cloudflare Worker Setup

### 1.1 Create KV Namespace
You need a KV namespace to store your weight data. Run the following command in your terminal:

```bash
npx wrangler kv:namespace create WEIGHT_KV
```

This will output something like:
```toml
[[kv_namespaces]]
binding = "WEIGHT_KV"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Copy the `id` and update your `wrangler.toml` file:
```toml
[[kv_namespaces]]
binding = "WEIGHT_KV"
id = "<YOUR_ID_FROM_ABOVE>"
preview_id = "<YOUR_PREVIEW_ID_IF_NEEDED>" 
```

### 1.2 Set API Key
For security, you should set a secret API key.
1. Generate a strong random string (e.g., `openssl rand -hex 32`).
2. Set it as a secret in Cloudflare:

```bash
npx wrangler secret put API_KEY
```
(Enter your generated key when prompted)

### 1.3 Deploy
Deploy your worker to Cloudflare:

```bash
npx wrangler deploy
```

Note your worker's URL (e.g., `https://taiju.<your-subdomain>.workers.dev`).

## 2. iOS Shortcut Setup

You will create an iOS Shortcut that fetches your latest weight and sends it to your API.

1. Open **Shortcuts** app on your iPhone.
2. Tap **+** to create a new shortcut.
3. Add action: **Find Health Samples**.
   - Type: **Weight**
   - Sort by: **Start Date** (Latest First)
   - Limit: **1**
4. Add action: **Get Contents of URL**.
   - URL: `https://your-worker-url.workers.dev/api/weight`
   - Method: **POST**
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer <YOUR_API_KEY>`
   - Request Body: **JSON**
     - Add field `weight`: Select **Weight** (from Health Sample) -> **Value**.
     - Add field `date`: Select **Weight** -> **Start Date**.
5. Run the shortcut to test. It should show a success message.

## 3. Automation (Optional)

To make this automatic:
1. Go to **Automation** tab in Shortcuts.
2. Create **Personal Automation**.
3. Choose a trigger (e.g., **Time of Day** or **When Health app is closed**).
4. Add action: **Run Shortcut** and select the shortcut you created above.
5. Turn off "Ask Before Running" for full automation.
