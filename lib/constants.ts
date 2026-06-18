// Verified Fact Table and Constants for Headway Broker Review Hub

export interface FactTable {
  brokerName: string;
  corporateName: string;
  registrationCountry: string;
  registrationNumber: string;
  regulationStatus: string;
  fscaStatus: string;
  establishedYear: string;
  minimumDeposit: string;
  maxLeverage: string;
  commissionRate: string;
  minimumSpread: string;
  tradingPlatforms: string[];
  depositMethods: string[];
  withdrawalMethods: string[];
  affiliateLink: string;
  riskDisclaimer: string;
}

export const HEADWAY_FACT_TABLE: FactTable = {
  brokerName: "Headway",
  corporateName: "Aheadway Ltd",
  registrationCountry: "St. Vincent and the Grenadines",
  registrationNumber: "27077 BC 2023",
  regulationStatus: "Registered by the Financial Services Authority of Saint Vincent and the Grenadines (SVGFSA) under registration number 27077 BC 2023. Headway does not hold Tier-1 regulatory licenses (e.g., FCA, ASIC, CySEC).",
  fscaStatus: "NOT LICENSED BY FSCA. Headway is an offshore broker. While legal to use for South African and African traders on an offshore basis, Headway lacks direct regulatory oversight from South Africa's FSCA.",
  establishedYear: "2023",
  minimumDeposit: "$1 (Cent Account)",
  maxLeverage: "1:Unlimited (available on Cent and Standard accounts for balances under $1,000)",
  commissionRate: "$0 for Cent & Standard accounts; from $1.50 per lot per side ($3.00 round turn) for Pro accounts",
  minimumSpread: "From 0.0 pips (Pro Account), from 0.5 pips (Standard), from 0.3 pips (Cent)",
  tradingPlatforms: ["MetaTrader 4 (MT4)", "MetaTrader 5 (MT5)", "Headway Web Platform", "Headway Mobile App (iOS/Android)"],
  depositMethods: [
    "Mastercard / Visa Credit Cards",
    "Perfect Money",
    "Cryptocurrencies (USDT ERC20, USDT TRC20, BTC, LTC, ETH)",
    "Local Bank Transfers (Southeast Asia, Nigeria, South Africa, India, Latin America)",
    "Electronic payment systems (PSP gateways)"
  ],
  withdrawalMethods: [
    "Cryptocurrencies (USDT, BTC, ETH, LTC)",
    "Perfect Money",
    "Local Bank Transfers"
  ],
  affiliateLink: "https://headway.partners/user/signup?hwp=e4e4f5",
  riskDisclaimer: "Trading Forex and Leveraged Financial Instruments involves high risk of capital loss and is not suitable for all investors. Spreads and market conditions can fluctuate rapidly."
};

export interface AccountTypeSpec {
  name: string;
  minDeposit: string;
  spreads: string;
  commission: string;
  leverage: string;
  platforms: string;
  minLotSize: string;
  maxOrders: string;
  instruments: string;
  swapFree: string;
}

export const HEADWAY_ACCOUNTS: AccountTypeSpec[] = [
  {
    name: "Cent Account",
    minDeposit: "$1",
    spreads: "Floating from 0.3 pips",
    commission: "Zero ($0)",
    leverage: "1:Unlimited (equity < $1,000)",
    platforms: "MT4, MT5",
    minLotSize: "0.01 micro-lots (0.0001 standard lot)",
    maxOrders: "500",
    instruments: "Forex (33 currency pairs), Gold, Silver, Cryptocurrencies",
    swapFree: "Yes"
  },
  {
    name: "Standard Account",
    minDeposit: "$10",
    spreads: "Floating from 0.5 pips",
    commission: "Zero ($0)",
    leverage: "1:Unlimited (equity < $1,000)",
    platforms: "MT4, MT5, Web, App",
    minLotSize: "0.01 standard lots",
    maxOrders: "Unlimited",
    instruments: "Forex (37 pairs), Metals, Cryptocurrencies, Energies, Indices",
    swapFree: "Yes"
  },
  {
    name: "Pro Account",
    minDeposit: "$100",
    spreads: "Floating from 0.0 pips (Raw Spreads)",
    commission: "From $1.50 per lot per side ($3.00 round turn)",
    leverage: "Fixed up to 1:2000",
    platforms: "MT4, MT5, Web, App",
    minLotSize: "0.01 standard lots",
    maxOrders: "Unlimited",
    instruments: "Full Asset List: Forex, Metals, Cryptocurrencies, Energies, Indices, Global Stocks",
    swapFree: "Yes (optional on request)"
  }
];

export interface FeeStructureEntry {
  assetClass: string;
  spreadRange: string;
  commissionRate: string;
  overnightSwap: string;
  depositFee: string;
  withdrawalFee: string;
}

export const HEADWAY_FEE_STRUCTURE: FeeStructureEntry[] = [
  {
    assetClass: "Forex Majors (EURUSD, GBPUSD)",
    spreadRange: "0.0 - 0.5 pips (Pro); 0.5 - 1.2 pips (Standard); 0.3 - 1.4 pips (Cent)",
    commissionRate: "Pro: $3.00 round turn; Cent & Standard: $0",
    overnightSwap: "Triple swap on Wednesdays; swap-free accounts available",
    depositFee: "0% for most local channels and cryptocurrencies",
    withdrawalFee: "Perfect Money: 0.5%; Crypto: Network/Blockchain fees; Local Banks: 0% - 1% depending on PSP"
  },
  {
    assetClass: "Gold (XAUUSD)",
    spreadRange: "Floating from 1.0 pip (Standard), from 0.0 pip (Pro)",
    commissionRate: "Pro: $3.00/lot; Cent & Standard: $0",
    overnightSwap: "Swap-free eligible",
    depositFee: "0%",
    withdrawalFee: "Standard gateway fees"
  },
  {
    assetClass: "Cryptocurrencies (BTCUSD, ETHUSD)",
    spreadRange: "Tight spreads variable by liquidity (e.g. BTC from $15.00)",
    commissionRate: "Pro: $3.00/lot; Cent & Standard: $0",
    overnightSwap: "Swap charges apply, Islamic options exceptions",
    depositFee: "0% (Blockchain fees apply at sender's node)",
    withdrawalFee: "Network transaction fees of the respective currency"
  },
  {
    assetClass: "Indices & Stocks",
    spreadRange: "Floating depending on market spreads (e.g., US30 from 1.5 pips)",
    commissionRate: "Pro: $3.00/lot; Standard: $0; Cent: Not Available",
    overnightSwap: "Standard index finance fees apply",
    depositFee: "0%",
    withdrawalFee: "Standard gateway fees"
  }
];
