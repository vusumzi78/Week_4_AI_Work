"use client";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_session", {
      method: "POST",
      headers: {
        origin: "http://localhost:3000",
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const { isSignedIn } = useAuth();

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      {/* Navigation bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero section */}
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2"> Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">
          The easiest way to create flashcards from your text.
        </Typography>
        {/* <Button
          variant="contained"
          color="primary"
          href={"/generate"}
          sx={{ mt: 2 }}
        >
          Get Started
        </Button> */}

        {isSignedIn ? (
          <Button
            variant="contained"
            color="primary"
            href={"/generate"}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            href={"/sign-in"} // Redirect to the sign-in page if not signed in
            sx={{ mt: 2 }}
          >
            Sign In to Get Started
          </Button>
        )}
      </Box>

      {/* Feature Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" components="h2">
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item sx={12} md={4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>
              Simply input your text and let our software do the rets. Creating
              flashcards has never been easier.
            </Typography>
          </Grid>
          <Grid item sx={12} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>
              Our AI intelligently breaks down your text into concise
              flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item sx={12} md={4}>
            <Typography variant="h6">Accessible Anywhere</Typography>
            <Typography>
              Access your flashcards from any devie, at any time. Study on the
              go with ease.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" components="h2">
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item sx={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" sx={{ md: "5px" }}>
                Basic
              </Typography>

              <Typography variant="h6" sx={{ md: "5px" }}>
                $0.99/month
              </Typography>
              <Typography gutterBottom>
                Access to basic features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2, md: 5 }}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item sx={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" sx={{ md: "5" }}>
                Pro
              </Typography>

              <Typography variant="h6" sx={{ md: "5" }}>
                $2.99/month
              </Typography>
              <Typography gutterBottom>
                Unlimited flashcard and storage, with priority support{" "}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, md: 5 }}
                onClick={handleSubmit}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
