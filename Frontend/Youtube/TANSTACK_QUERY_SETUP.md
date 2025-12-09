# TanStack Query + Axios Setup Guide

## Setup Complete! ✅

Your frontend now has a fully configured axios instance ready for TanStack Query.

### Files Created:

1. **`src/api/axiosInstance.js`** - Configured axios instance with:
   - Base URL from environment variables
   - Request interceptor for JWT tokens
   - Response interceptor for error handling
   - Cookie support (withCredentials)
   - Global timeout

2. **`src/hooks/useApi.js`** - Pre-built TanStack Query hooks for:
   - Video queries (get all, get by ID)
   - User queries (current user)
   - User mutations (login, register, logout)
   - Video mutations (publish, update, delete)
   - Like, comment, and subscription mutations

3. **`.env.example`** - Environment variable template

## Step 1: Install TanStack Query

```bash
npm install @tanstack/react-query
```

## Step 2: Create `.env` file

Copy `.env.example` to `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Update the URL based on your backend port (default: 8000).

## Step 3: Setup QueryClientProvider in main.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

## Step 4: Use in Your Components

### Example 1: Fetch Videos

```jsx
import { useGetAllVideos } from "./hooks/useApi";

function VideoList() {
  const {
    data: videos,
    isLoading,
    error,
  } = useGetAllVideos({
    page: 1,
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {videos?.data?.map((video) => (
        <li key={video._id}>{video.title}</li>
      ))}
    </ul>
  );
}
```

### Example 2: Login User

```jsx
import { useLoginUser } from "./hooks/useApi";

function LoginForm() {
  const loginMutation = useLoginUser();

  const handleLogin = async (email, password) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      console.log("Logged in:", result);
      // Redirect to dashboard
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Get form data and call handleLogin
      }}
    >

    </form>
  );
}
```

### Example 3: Publish Video

```jsx
import { usePublishVideo } from "./hooks/useApi";

function PublishVideoForm() {
  const publishMutation = usePublishVideo();

  const handlePublish = async (formData) => {
    try {
      await publishMutation.mutateAsync(formData);
      alert("Video published!");
    } catch (error) {
      alert(`Failed: ${error.message}`);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Get FormData with file and call handlePublish
      }}
    >
     
    </form>
  );
}
```

## Features Included

✅ **Automatic Token Management** - Access tokens stored in localStorage and sent with each request
✅ **Error Handling** - Automatic 401 redirect for expired tokens
✅ **Request/Response Interceptors** - Centralized token & error handling
✅ **Credentials** - withCredentials enabled for cookie-based auth
✅ **Query Caching** - Smart caching with configurable stale times
✅ **Mutation Management** - Automatic cache invalidation after mutations

## Customization

### Add More Hooks

Add to `src/hooks/useApi.js`:

```jsx
export const useGetPlaylistVideos = (playlistId) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      const response = await apiClient.get(`/playlists/${playlistId}`);
      return response.data;
    },
    enabled: !!playlistId,
  });
};
```

### Change Timeout or Retry Logic

Edit `src/api/axiosInstance.js`:

```js
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // Change timeout
  // ... other config
});
```

## Environment Variables

Use different base URLs for different environments:

**Development (.env)**

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**Production (.env.production)**

```
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## Next Steps

1. ✅ Ensure your backend is running on port 8000
2. ✅ Update `.env` with correct backend URL
3. ✅ Install TanStack Query: `npm install @tanstack/react-query`
4. ✅ Setup QueryClientProvider in `main.jsx`
5. ✅ Start using hooks in your components!

## Troubleshooting

**CORS Issues?**

- Make sure backend CORS_ORIGIN env var includes your frontend URL
- Check `Backend/.env` has correct CORS_ORIGIN

**Token not sending?**

- Check localStorage has `accessToken` key
- Verify interceptor in `axiosInstance.js`

**Queries not refetching?**

- Use `queryClient.invalidateQueries()` after mutations
- Hooks already do this automatically

**401 Redirects?**

- Token expired - user will be redirected to `/login`
- Implement refresh token logic if needed

---

Happy coding! 🚀
