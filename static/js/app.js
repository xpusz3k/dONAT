const express = require('express');
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Client, Config, CheckoutAPI } = require('@adyen/api-library');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Konfiguracja Stripe
app.post('/create-stripe-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
    } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} failed.`);
    }

    res.json({ received: true });
});

// Konfiguracja Adyen
const config = new Config();
config.apiKey = process.env.ADYEN_API_KEY;
const client = new Client({ config });
client.setEnvironment("TEST"); // Zmień na "LIVE" w produkcji
const checkout = new CheckoutAPI(client);

app.post('/adyen-payment', async (req, res) => {
    try {
        const { amount, currency, paymentMethod, returnUrl, reference } = req.body;

        const paymentRequest = {
            amount: { value: amount, currency: currency },
            paymentMethod,
            reference,
            merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
            returnUrl,
        };

        const paymentResponse = await checkout.payments(paymentRequest);

        res.status(200).send(paymentResponse);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/adyen-webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const webhook = req.body;

    if (webhook.eventCode === 'AUTHORISATION') {
        if (webhook.success === 'true') {
            console.log(`Payment for ${webhook.pspReference} was successful!`);
        } else {
            console.log(`Payment for ${webhook.pspReference} failed.`);
        }
    }

    res.status(200).send('[accepted]');
});

// Nowy endpoint obsługujący różne metody płatności
app.post('/create-payment', async (req, res) => {
    try {
        const { amount, currency = 'usd', method, paymentMethodDetails, returnUrl, reference } = req.body;

        if (method === 'stripe') {
            // Stripe Payment
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: currency,
            });
            res.status(200).send({
                clientSecret: paymentIntent.client_secret,
                method: 'stripe',
            });
        } else if (method === 'adyen') {
            // Adyen Payment
            const paymentRequest = {
                amount: { value: amount, currency: currency },
                paymentMethod: paymentMethodDetails,
                reference,
                merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
                returnUrl,
            };

            const paymentResponse = await checkout.payments(paymentRequest);
            res.status(200).send({
                paymentResponse,
                method: 'adyen',
            });
        } else {
            res.status(400).send({ error: 'Invalid payment method' });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
