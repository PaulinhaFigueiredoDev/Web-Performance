'use client';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function Newsletter() {
  return (
    <section className="newsletter" id="newsletter-section" aria-labelledby="newsletter-title">
      <h2 id="newsletter-title">Newsletter Signup</h2>
      <p>Subscribe now and don&apos;t miss a single deal!</p>
      <form className="newsletter-form">
        <TextField
          className="newsletter-field"
          id="newsletter-email"
          type="email"
          name="email"
          label="Email address"
          variant="outlined"
          size="small"
          required
          slotProps={{
            htmlInput: {
              autoComplete: 'email'
            }
          }}
          sx={{
            width: 326,
            maxWidth: '65%',
            '& .MuiOutlinedInput-root': {
              height: 50,
              borderRadius: '60px 0 0 60px'
            }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{
            width: 145,
            maxWidth: '35%',
            height: 50,
            borderRadius: '0 60px 60px 0'
          }}
        >
          Subscribe
        </Button>
      </form>
    </section>
  );
}
