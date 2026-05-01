# ISC Staking Contracts & Frontend

Ice Snow Coin (ISC) Staking Platform - Complete frontend implementation with smart contract integration.

## 📁 Directory Structure

```
isc-staking-contracts/
├── frontend/                    # Frontend files
│   ├── website/                 # Official website pages
│   │   ├── index.html          # Main landing page with SEO
│   │   ├── whitepaper.html     # Whitepaper page
│   │   ├── stake.html          # Staking info page
│   │   ├── sitemap.xml         # SEO sitemap
│   │   └── robots.txt          # Search engine config
│   │
│   └── staking/                # Staking platform
│       ├── staking.html        # Main staking interface
│       ├── staking.css         # Responsive styles
│       └── staking.js          # Web3 functionality
│
├── contracts/                   # Smart contracts (Solidity)
├── scripts/                     # Deployment scripts
├── docs/                        # Documentation
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🚀 Features

### Website Pages
- **index.html** - Official ISC website with complete SEO optimization
- **whitepaper.html** - Multi-language whitepaper page
- **stake.html** - Staking information page
- **sitemap.xml** - Complete sitemap for search engines
- **robots.txt** - Search engine crawler configuration

### Staking Platform
- **Complete Web3 Integration**
  - ethers.js v5.7 for blockchain interaction
  - MetaMask wallet connection
  - Automatic BSC network detection and switching

- **Smart Contract Functions**
  - `deposit()` - Stake tokens in pools
  - `withdraw()` - Unstake tokens
  - `harvest()` - Claim pending rewards
  - `poolInfo()` - Query pool information
  - `userInfo()` - Query user staking data
  - `pendingISC()` - Calculate pending rewards

- **4 Staking Pools**
  1. ISC Pool - 45% APY
  2. ISC-BNB LP - 78% APY
  3. ISC-USDT LP - 65% APY
  4. ISC-BUSD LP - 62% APY

- **User Interface**
  - Real-time wallet connection status
  - ISC token balance display
  - Total staked amount tracking
  - Pending rewards calculation
  - Individual pool cards with APY and TVL
  - Stake/Unstake/Harvest controls
  - Error handling and user alerts
  - Responsive design for mobile

## 🔧 Configuration

### ISC Token Contract
```javascript
ISC_ADDRESS: '0x11229a3f976566FA8a3ba462C432122f3B8876f6'
```

### Staking Contract (Update Required)
```javascript
STAKING_ADDRESS: '0x0000000000000000000000000000000000000000'  // Replace with actual address
```

### Network Configuration
- **Chain ID**: 56 (Binance Smart Chain)
- **RPC URL**: https://bsc-dataseed1.binance.org:8545
- **Block Explorer**: https://bscscan.com

## 📝 Usage

### 1. Deploy Website
Copy the `frontend/website/` files to your web server:
```bash
cp -r frontend/website/* /var/www/icesnowcoin.com/
```

### 2. Deploy Staking Platform
Copy the `frontend/staking/` files to your staking subdomain:
```bash
cp -r frontend/staking/* /var/www/staking.icesnowcoin.com/
```

### 3. Update Configuration
Edit `frontend/staking/staking.js` and replace:
- `STAKING_ADDRESS` - Your deployed staking contract address
- `STAKING_ABI` - Your staking contract ABI

### 4. Access the Platform
- **Website**: https://icesnowcoin.com
- **Staking**: https://icesnowcoin.com/staking.html

## 🔐 Security Features

- ✅ ethers.js official library for secure blockchain interaction
- ✅ MetaMask integration with automatic network validation
- ✅ Approval mechanism for token spending
- ✅ Transaction confirmation and error handling
- ✅ User input validation
- ✅ Real-time balance updates

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with MetaMask support

## 🛠️ Development

### Prerequisites
- MetaMask browser extension
- BNB tokens for gas fees
- ISC tokens for staking

### Local Testing
1. Install MetaMask
2. Add BSC network to MetaMask
3. Open `staking.html` in browser
4. Connect wallet
5. Test staking functions

## 📊 SEO Optimization

The website includes:
- ✅ Meta tags (description, keywords)
- ✅ Open Graph tags (social sharing)
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Sitemap.xml
- ✅ robots.txt
- ✅ Google Site Verification

## 🐛 Troubleshooting

### MetaMask Not Detected
- Ensure MetaMask is installed and enabled
- Check browser console for errors

### Network Connection Failed
- Verify you're connected to Binance Smart Chain (Chain ID: 56)
- Check your internet connection
- Try switching networks in MetaMask

### Transaction Failed
- Ensure you have enough BNB for gas fees
- Check token allowance
- Verify contract address is correct

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/Icesnowcoin/isc-staking-contracts/issues
- Telegram: https://t.me/IceSnowCoin
- Email: dev@icesnowcoin.com

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- ethers.js team for blockchain library
- MetaMask for wallet integration
- Binance Smart Chain for network infrastructure

---

**Last Updated**: May 1, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
