const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const API_KEY = 'YOUR_ADYEN_API_KEY'; // Pobierz klucz API z Adyen
const MERCHANT_ACCOUNT = 'YOUR_MERCHANT_ACCOUNT'; // Twój merchant account z Adyen

// Endpoint do inicjowania płatności
app.post('/payments', async (req, res) => {
    const paymentData = {
        merchantAccount: MERCHANT_ACCOUNT,
        amount: {
            currency: "USD",
            value: req.body.amount, // wartość w najmniejszej jednostce waluty, np. 1000 = 10.00 USD
        },
        reference: "YOUR_ORDER_REFERENCE", // unikalny numer referencyjny zamówienia
        paymentMethod: req.body.paymentMethod,
        returnUrl: "https://your-return-url.com", // URL do przekierowania po zakończeniu płatności
    };

    try {
        const response = await axios.post('https://checkout-test.adyen.com/v67/payments', paymentData, {
            headers: {
                'X-API-Key': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Payment initiation failed');
    }
});

// Endpoint do obsługi webhooków z Adyen (opcjonalnie)
app.post('/webhooks', (req, res) => {
    // Obsługa webhooków Adyen
    console.log(req.body);
    res.send('Webhook received');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
