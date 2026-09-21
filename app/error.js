'use client';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';

export default function ErrorPage({ reset }) {
  return (
    <main className="page-message">
      <Alert severity="error">
        <AlertTitle>We could not load the shop</AlertTitle>
        Please try again.
      </Alert>
      <Button type="button" variant="contained" color="secondary" onClick={reset} sx={{ mt: 2 }}>
        Try again
      </Button>
    </main>
  );
}
