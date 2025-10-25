# Youtube Clone Frontend

This project is a YouTube-inspired platform built with React and Vite.

## Features

- React 19
- Vite for fast development
- Material UI for UI components
- Material UI Icons for iconography
- Tailwind CSS for utility-first styling

## Getting Started

### Install dependencies

```sh
npm install
```

### Start the development server

```sh
npm run dev
```

## Using Material UI

Material UI is used for building the UI. To use a component:

```jsx
import Button from "@mui/material/Button";

function App() {
  return <Button variant="contained">Hello World</Button>;
}
```

## Using Material UI Icons

Material UI Icons are available via `@mui/icons-material`.

```jsx
import HomeIcon from "@mui/icons-material/Home";

function App() {
  return <HomeIcon />;
}
```

Find more icons here: https://mui.com/material-ui/material-icons/

## Fonts

Roboto font is included via `@fontsource/roboto` for Material UI compatibility.

## Tailwind CSS

Tailwind is available for utility-first styling. You can use both Tailwind and Material UI together.

---

For more details, see the main project README or the [Material UI documentation](https://mui.com/).
