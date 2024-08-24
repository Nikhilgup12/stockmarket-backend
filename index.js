const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let holdings = []; 


app.get('/api/holdings', (req, res) => {
    res.json({ holdings });
});


app.post('/api/trade', (req, res) => {
    const { symbol, quantity, type } = req.body;
    const existingHolding = holdings.find(h => h.symbol === symbol.toUpperCase());

    if (type === 'buy') {
        if (existingHolding) {
            existingHolding.quantity += quantity;
        } else {
            holdings.push({ symbol: symbol.toUpperCase(), quantity });
        }
        return res.json({ success: true });
    }

    if (type === 'sell') {
        if (!existingHolding || existingHolding.quantity < quantity) {
            return res.json({ success: false, message: 'Not enough shares to sell' });
        }
        existingHolding.quantity -= quantity;
        if (existingHolding.quantity === 0) {
            holdings = holdings.filter(h => h.symbol !== symbol.toUpperCase());
        }
        return res.json({ success: true });
    }

    res.json({ success: false, message: 'Invalid trade type' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
