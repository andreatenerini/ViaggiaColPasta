import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  // Non lanciare errore in import time — lo controlliamo all'uso per non rompere il build
  // quando le env non sono ancora configurate.
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-06-30.basil' as Stripe.LatestApiVersion,
  typescript: true,
})
