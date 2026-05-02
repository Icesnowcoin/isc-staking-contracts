// ==================== Configuration ====================
const CONFIG = {
    // ISC Token Contract
    ISC_ADDRESS: '0x11229a3f976566FA8a3ba462C432122f3B8876f6',
    ISC_ABI: [
        'function balanceOf(address owner) view returns (uint256)',
        'function approve(address spender, uint256 amount) returns (bool)',
        'function allowance(address owner, address spender) view returns (uint256)',
        'function decimals() view returns (uint8)',
        'function symbol() view returns (string)',
        'function transfer(address to, uint256 amount) returns (bool)'
    ],

    // Staking Contract (Replace with actual address)
    STAKING_ADDRESS: '0x9014Be9d27b64a4cb889B9d0334740683F18185a',
    STAKING_ABI: [
        'function poolInfo(uint256 pid) view returns (address lpToken, uint256 allocPoint, uint256 lastRewardBlock, uint256 accISCPerShare)',
        'function userInfo(uint256 pid, address user) view returns (uint256 amount, uint256 rewardDebt)',
        'function pendingISC(uint256 pid, address user) view returns (uint256)',
        'function deposit(uint256 pid, uint256 amount) external',
        'function withdraw(uint256 pid, uint256 amount) external',
        'function harvest(uint256 pid) external',
        'function poolLength() view returns (uint256)',
        'function totalAllocPoint() view returns (uint256)',
        'function ISCPerBlock() view returns (uint256)'
    ],

    // BSC Network
    CHAIN_ID: 56,
    RPC_URL: 'https://bsc-dataseed1.binance.org:8545',
    BLOCK_EXPLORER: 'https://bscscan.com'
};

// ==================== Global State ====================
let provider = null;
let signer = null;
let userAddress = null;
let iscContract = null;
let stakingContract = null;
let pools = [];

// ==================== Utility Functions ====================
function formatNumber(num, decimals = 2) {
    if (!num) return '0.00';
    return parseFloat(num).toFixed(decimals);
}

function formatAddress(addr) {
    if (!addr) return 'Not Connected';
    return addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
}

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} show`;
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}

// ==================== Wallet Connection ====================
async function connectWallet() {
    try {
        if (!window.ethereum) {
            showAlert('MetaMask is not installed. Please install it to continue.', 'error');
            return;
        }

        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        userAddress = accounts[0];

        // Check network
        const chainId = await window.ethereum.request({
            method: 'eth_chainId'
        });

        if (parseInt(chainId, 16) !== CONFIG.CHAIN_ID) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }]
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x38',
                            chainName: 'Binance Smart Chain',
                            rpcUrls: ['https://bsc-dataseed1.binance.org:8545'],
                            nativeCurrency: {
                                name: 'BNB',
                                symbol: 'BNB',
                                decimals: 18
                            },
                            blockExplorerUrls: ['https://bscscan.com']
                        }]
                    });
                }
            }
        }

        // Initialize provider and contracts
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        iscContract = new ethers.Contract(CONFIG.ISC_ADDRESS, CONFIG.ISC_ABI, signer);
        stakingContract = new ethers.Contract(CONFIG.STAKING_ADDRESS, CONFIG.STAKING_ABI, signer);

        // Update UI
        updateWalletUI();
        await loadPoolsData();

        showAlert('Wallet connected successfully!', 'success');
    } catch (error) {
        console.error('Wallet connection error:', error);
        showAlert(`Connection failed: ${error.message}`, 'error');
    }
}

function updateWalletUI() {
    const connectBtn = document.getElementById('connectWallet');
    if (userAddress) {
        connectBtn.textContent = formatAddress(userAddress);
        connectBtn.disabled = true;
    } else {
        connectBtn.textContent = 'Connect Wallet';
        connectBtn.disabled = false;
    }
}

// ==================== Data Loading ====================
async function loadPoolsData() {
    if (!stakingContract || !userAddress) return;

    try {
        // Mock pools data
        pools = [
            {
                id: 0,
                name: 'ISC Pool',
                lpToken: CONFIG.ISC_ADDRESS,
                allocPoint: 100,
                apy: '45%',
                tvl: '1,234,567 ISC'
            },
            {
                id: 1,
                name: 'ISC-BNB LP',
                lpToken: '0x0000000000000000000000000000000000000000',
                allocPoint: 200,
                apy: '78%',
                tvl: '2,345,678 ISC'
            },
            {
                id: 2,
                name: 'ISC-USDT LP',
                lpToken: '0x0000000000000000000000000000000000000000',
                allocPoint: 150,
                apy: '65%',
                tvl: '1,876,543 ISC'
            },
            {
                id: 3,
                name: 'ISC-BUSD LP',
                lpToken: '0x0000000000000000000000000000000000000000',
                allocPoint: 150,
                apy: '62%',
                tvl: '1,543,210 ISC'
            }
        ];

        // Load user data for each pool
        for (let pool of pools) {
            try {
                const tokenContract = new ethers.Contract(
                    pool.lpToken,
                    ['function balanceOf(address owner) view returns (uint256)'],
                    provider
                );
                const balance = await tokenContract.balanceOf(userAddress);
                pool.userBalance = ethers.utils.formatEther(balance);

                pool.pendingRewards = (Math.random() * 100).toFixed(2);
                pool.stakedAmount = (Math.random() * 500).toFixed(2);
            } catch (error) {
                console.log(`Error loading pool ${pool.id}:`, error);
                pool.userBalance = '0';
                pool.pendingRewards = '0';
                pool.stakedAmount = '0';
            }
        }

        // Update ISC balance
        try {
            const balance = await iscContract.balanceOf(userAddress);
            const balanceFormatted = ethers.utils.formatEther(balance);
            document.getElementById('balanceDisplay').textContent = formatNumber(balanceFormatted);
        } catch (error) {
            console.log('Error loading ISC balance:', error);
        }

        // Calculate totals
        const totalStaked = pools.reduce((sum, p) => sum + parseFloat(p.stakedAmount || 0), 0);
        const totalPending = pools.reduce((sum, p) => sum + parseFloat(p.pendingRewards || 0), 0);

        document.getElementById('totalStakedDisplay').textContent = formatNumber(totalStaked);
        document.getElementById('pendingRewardsDisplay').textContent = formatNumber(totalPending);
        document.getElementById('accountDisplay').textContent = formatAddress(userAddress);

        // Render pools
        renderPools();
    } catch (error) {
        console.error('Error loading pools data:', error);
        showAlert(`Error loading data: ${error.message}`, 'error');
    }
}

// ==================== UI Rendering ====================
function renderPools() {
    const container = document.getElementById('poolsContainer');
    container.innerHTML = '';

    pools.forEach((pool, index) => {
        const card = document.createElement('div');
        card.className = 'pool-card';
        card.innerHTML = `
            <div class="pool-header">
                <div class="pool-name">${pool.name}</div>
                <div class="pool-badge">${pool.apy} APY</div>
            </div>

            <div class="pool-info">
                <div class="info-row">
                    <span class="info-label">TVL:</span>
                    <span class="info-value">${pool.tvl}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Your Balance:</span>
                    <span class="info-value">${formatNumber(pool.userBalance)} ${pool.id === 0 ? 'ISC' : 'LP'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Staked:</span>
                    <span class="info-value">${formatNumber(pool.stakedAmount)} ${pool.id === 0 ? 'ISC' : 'LP'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Pending Rewards:</span>
                    <span class="info-value">${formatNumber(pool.pendingRewards)} ISC</span>
                </div>
            </div>

            <div class="input-group">
                <label class="input-label">Stake Amount</label>
                <div class="input-wrapper">
                    <input type="number" class="input-field" placeholder="0.00" min="0" step="0.01" id="stakeInput${index}">
                    <button class="btn btn-secondary" onclick="setMaxAmount(${index})">MAX</button>
                </div>
            </div>

            <div class="btn-group">
                <button class="btn btn-primary" onclick="handleStake(${index})" data-original-text="Stake">Stake</button>
                <button class="btn btn-secondary" onclick="handleHarvest(${index})" data-original-text="Harvest">Harvest</button>
            </div>

            <div class="btn-group" style="margin-top: 0.5rem;">
                <input type="number" class="input-field" placeholder="0.00" min="0" step="0.01" id="unstakeInput${index}" style="margin-bottom: 0;">
                <button class="btn btn-secondary" onclick="handleUnstake(${index})" data-original-text="Unstake">Unstake</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==================== Transaction Handlers ====================
function setMaxAmount(poolIndex) {
    const input = document.getElementById(`stakeInput${poolIndex}`);
    input.value = formatNumber(pools[poolIndex].userBalance);
}

async function handleStake(poolIndex) {
    if (!userAddress) {
        showAlert('Please connect your wallet first', 'warning');
        return;
    }

    const input = document.getElementById(`stakeInput${poolIndex}`);
    const amount = input.value;

    if (!amount || parseFloat(amount) <= 0) {
        showAlert('Please enter a valid amount', 'error');
        return;
    }

    try {
        const button = event.target;
        setButtonLoading(button, true);

        const amountWei = ethers.utils.parseEther(amount);

        // Check allowance
        const allowance = await iscContract.allowance(userAddress, CONFIG.STAKING_ADDRESS);
        if (allowance.lt(amountWei)) {
            const approveTx = await iscContract.approve(CONFIG.STAKING_ADDRESS, amountWei);
            await approveTx.wait();
            showAlert('Approval confirmed', 'success');
        }

        // Deposit
        const depositTx = await stakingContract.deposit(pools[poolIndex].id, amountWei);
        const receipt = await depositTx.wait();

        showAlert(`Successfully staked ${amount} tokens! Tx: ${receipt.transactionHash.substring(0, 10)}...`, 'success');
        input.value = '';

        // Reload data
        await loadPoolsData();
    } catch (error) {
        console.error('Stake error:', error);
        showAlert(`Stake failed: ${error.message}`, 'error');
    } finally {
        setButtonLoading(event.target, false);
    }
}

async function handleUnstake(poolIndex) {
    if (!userAddress) {
        showAlert('Please connect your wallet first', 'warning');
        return;
    }

    const input = document.getElementById(`unstakeInput${poolIndex}`);
    const amount = input.value;

    if (!amount || parseFloat(amount) <= 0) {
        showAlert('Please enter a valid amount', 'error');
        return;
    }

    try {
        const button = event.target;
        setButtonLoading(button, true);

        const amountWei = ethers.utils.parseEther(amount);
        const withdrawTx = await stakingContract.withdraw(pools[poolIndex].id, amountWei);
        const receipt = await withdrawTx.wait();

        showAlert(`Successfully unstaked ${amount} tokens! Tx: ${receipt.transactionHash.substring(0, 10)}...`, 'success');
        input.value = '';

        // Reload data
        await loadPoolsData();
    } catch (error) {
        console.error('Unstake error:', error);
        showAlert(`Unstake failed: ${error.message}`, 'error');
    } finally {
        setButtonLoading(event.target, false);
    }
}

async function handleHarvest(poolIndex) {
    if (!userAddress) {
        showAlert('Please connect your wallet first', 'warning');
        return;
    }

    try {
        const button = event.target;
        setButtonLoading(button, true);

        const harvestTx = await stakingContract.harvest(pools[poolIndex].id);
        const receipt = await harvestTx.wait();

        showAlert(`Successfully harvested rewards! Tx: ${receipt.transactionHash.substring(0, 10)}...`, 'success');

        // Reload data
        await loadPoolsData();
    } catch (error) {
        console.error('Harvest error:', error);
        showAlert(`Harvest failed: ${error.message}`, 'error');
    } finally {
        setButtonLoading(event.target, false);
    }
}

// ==================== Event Listeners ====================
document.getElementById('connectWallet').addEventListener('click', connectWallet);

// Listen for account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
            userAddress = null;
            updateWalletUI();
            document.getElementById('poolsContainer').innerHTML = '<p style="text-align: center; color: #94a3b8;">Please connect your wallet to view pools</p>';
        } else {
            userAddress = accounts[0];
            updateWalletUI();
            loadPoolsData();
        }
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}

// Initial check
window.addEventListener('load', async () => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_accounts'
            });
            if (accounts.length > 0) {
                userAddress = accounts[0];
                provider = new ethers.providers.Web3Provider(window.ethereum);
                signer = provider.getSigner();
                iscContract = new ethers.Contract(CONFIG.ISC_ADDRESS, CONFIG.ISC_ABI, signer);
                stakingContract = new ethers.Contract(CONFIG.STAKING_ADDRESS, CONFIG.STAKING_ABI, signer);
                updateWalletUI();
                await loadPoolsData();
            }
        } catch (error) {
            console.log('Auto-connect error:', error);
        }
    }
});
