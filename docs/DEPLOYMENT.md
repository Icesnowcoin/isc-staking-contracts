# Deployment Guide

## Prerequisites

- Node.js 14+ or just a web server
- MetaMask browser extension
- BNB tokens for gas fees
- ISC tokens for testing

## Website Deployment

### 1. Copy Files to Web Server

```bash
cp -r frontend/website/* /var/www/icesnowcoin.com/
```

### 2. Configure DNS

Point your domain to your web server:
```
icesnowcoin.com    A    your.server.ip
www.icesnowcoin.com CNAME icesnowcoin.com
```

### 3. Set up SSL Certificate

Use Let's Encrypt:
```bash
certbot certonly --webroot -w /var/www/icesnowcoin.com -d icesnowcoin.com -d www.icesnowcoin.com
```

## Staking Platform Deployment

### 1. Copy Files

```bash
cp -r frontend/staking/* /var/www/staking.icesnowcoin.com/
```

### 2. Update Configuration

Edit `frontend/staking/staking.js`:

```javascript
STAKING_ADDRESS: '0xYourActualStakingContractAddress',
ISC_ADDRESS: '0x11229a3f976566FA8a3ba462C432122f3B8876f6'
```

### 3. Test Locally

Open `frontend/staking/staking.html` in your browser and test:
- Connect Wallet
- Switch to BSC network
- View pool information
- Test deposit/withdraw/harvest (on testnet first)

## Production Checklist

- [ ] Update STAKING_ADDRESS with actual contract address
- [ ] Test on BSC testnet
- [ ] Verify all links work correctly
- [ ] Check SEO meta tags
- [ ] Set up SSL certificates
- [ ] Configure DNS records
- [ ] Test wallet connection
- [ ] Verify gas fees are reasonable
- [ ] Set up monitoring/alerts
- [ ] Create backup strategy

## Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed
- Check browser console for errors
- Verify RPC endpoint is accessible

### Transaction Failures
- Check gas prices
- Verify contract addresses
- Ensure sufficient token balance
- Check contract ABI matches deployed contract

### CORS Issues
- Configure CORS headers on your server
- Use CORS proxy if needed
- Ensure RPC endpoint allows your domain

## Support

For issues, contact: dev@icesnowcoin.com
