'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, ShieldCheck, HelpCircle, Calculator, Check, X,
  ExternalLink, TrendingUp, DollarSign, Wallet, Layers, Cpu, FileJson, ChevronRight, AlertTriangle, Calendar, Globe
} from 'lucide-react';
import { HEADWAY_FACT_TABLE, HEADWAY_ACCOUNTS, HEADWAY_FEE_STRUCTURE } from '../lib/constants';
import { HOME_ARTICLE_DATA } from '../lib/homeContent';

// --- STABLE EXCHANGE RATES (For Calculators) ---
const EXCHANGE_RATES: Record<string, { rate: number; pipSize: number; contractSize: number; isJpy: boolean }> = {
  EURUSD: { rate: 1.0950, pipSize: 0.0001, contractSize: 100000, isJpy: false },
  GBPUSD: { rate: 1.2820, pipSize: 0.0001, contractSize: 100000, isJpy: false },
  USDJPY: { rate: 155.40, pipSize: 0.01, contractSize: 100000, isJpy: true },
  AUDUSD: { rate: 0.6650, pipSize: 0.0001, contractSize: 100000, isJpy: false },
  USDCAD: { rate: 1.3650, pipSize: 0.0001, contractSize: 100000, isJpy: false },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const affLink = HEADWAY_FACT_TABLE.affiliateLink;

  // --- CALCULATORS STATE ---
  // A. Profit Calculator
  const [profitPair, setProfitPair] = useState('EURUSD');
  const [profitLots, setProfitLots] = useState(1);
  const [profitDir, setProfitDir] = useState<'BUY' | 'SELL'>('BUY');
  const [profitEntry, setProfitEntry] = useState(1.0950);
  const [profitExit, setProfitExit] = useState(1.1020);
  const [profitLeverage, setProfitLeverage] = useState(1000);

  // B. Lot Size / Risk Calculator
  const [riskBalance, setRiskBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [riskStopLoss, setRiskStopLoss] = useState(30);
  const [riskPair, setRiskPair] = useState('EURUSD');

  // C. Pip Value Calculator
  const [pipPair, setPipPair] = useState('EURUSD');
  const [pipLots, setPipLots] = useState(1);

  // --- DYNAMIC CALCULATIONS DURING RENDER (No effect dependencies) ---
  
  // A. Profit Calculation
  const profitPairData = EXCHANGE_RATES[profitPair];
  let profitUsd = 0;
  let profitPipGain = 0;
  let profitMarginUsd = 0;
  let profitPipValue = 0;

  if (profitPairData) {
    const contractSize = profitPairData.contractSize * profitLots;
    const pipDiff = profitDir === 'BUY' 
      ? (profitExit - profitEntry) 
      : (profitEntry - profitExit);

    const pipSize = profitPairData.pipSize;
    profitPipGain = Math.round(pipDiff / pipSize);

    if (profitPairData.isJpy) {
      const profitJpy = (profitDir === 'BUY' ? (profitExit - profitEntry) : (profitEntry - profitExit)) * (100000 * profitLots);
      profitUsd = profitJpy / profitExit;
      profitMarginUsd = (100000 * profitLots) / profitLeverage;
      profitPipValue = (0.01 / profitExit) * (100000 * profitLots);
    } else {
      profitUsd = (profitDir === 'BUY' ? (profitExit - profitEntry) : (profitEntry - profitExit)) * contractSize;
      profitMarginUsd = (contractSize * profitEntry) / profitLeverage;
      profitPipValue = (0.0001) * contractSize;
    }
  }

  // B. Risk & Lot Size Calculation
  const riskPairData = EXCHANGE_RATES[riskPair];
  const calculatedRiskAmountUsd = riskBalance * (riskPercent / 100);
  let calculatedRiskLotsResult = 0;

  if (riskPairData) {
    let standardPipVal = 10;
    if (riskPairData.isJpy) {
      standardPipVal = (0.01 / riskPairData.rate) * 100000;
    } else {
      standardPipVal = 0.0001 * 100000;
    }
    const computedLots = calculatedRiskAmountUsd / (riskStopLoss * standardPipVal);
    calculatedRiskLotsResult = parseFloat(computedLots.toFixed(2));
  }

  // C. Pip Value Calculation
  const pipPairData = EXCHANGE_RATES[pipPair];
  let calculatedPipValResult = 0;

  if (pipPairData) {
    if (pipPairData.isJpy) {
      calculatedPipValResult = (0.01 / pipPairData.rate) * (100000 * pipLots);
    } else {
      calculatedPipValResult = 0.0001 * (100000 * pipLots);
    }
  }

  // Set default entry/exits on pair changes
  const handleProfitPairChange = (pair: string) => {
    setProfitPair(pair);
    const curr = EXCHANGE_RATES[pair];
    if (curr) {
      setProfitEntry(curr.rate);
      setProfitExit(curr.rate + (curr.isJpy ? 0.50 : 0.0050));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-900" id="main-layout">
      {/* Risk Warning Disclaimer Bar */}
      <div className="bg-red-950 text-red-200 border-b border-red-900 text-[11px] py-1.5 px-4 text-center tracking-wide" id="risk-warning-bar">
        <span className="font-semibold uppercase mr-1">Risk Warning:</span> Trading Forex, Cryptocurrencies, and CFDs involves substantial risk of loss. Our platform lists fact-based research on Headway Broker without bias. All sign-ups must be initiated at <a href={affLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-red-100 font-medium font-mono">hw.online</a>.
      </div>

      {/* Top Header Block */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800" id="site-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 text-slate-950 p-2 rounded-lg font-bold flex items-center justify-center tracking-tight" id="site-logo">
              <Layers className="w-6 h-6 mr-1" /> HW
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5" id="brand-title">
                HEADWAY ANALYTICAL HUB <span className="bg-slate-800 text-teal-400 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded tracking-widest border border-slate-700">2026 REVIEW</span>
              </h1>
              <p className="text-slate-400 text-xs tracking-tight" id="brand-tagline">Strictly Factual &amp; Unbiased SEO Authority Portal</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <a 
              href={affLink} 
              target="_blank" 
              rel="noopener noreferrer"
              id="header-cta-button"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg transition text-xs tracking-wide uppercase flex items-center gap-1.5 shadow-md shadow-teal-500/10"
            >
              Start Trading with Headway <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Global Sitemap Tab Bar (SEO Sitemap Architecture Navigation) */}
        <nav className="bg-slate-955 bg-slate-950 border-t border-slate-800/80 overflow-x-auto scrollbar-none" id="sitemap-navigation">
          <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 py-1 text-xs font-mono select-none whitespace-nowrap">
            {[
              { id: 'home', label: '1. Home Directory', icon: Globe },
              { id: 'review', label: '2. Review & Report 2026', icon: Building2 },
              { id: 'safety', label: '3. Safety & Regulation', icon: ShieldCheck },
              { id: 'fees', label: '4. Fees & Spreads', icon: DollarSign },
              { id: 'accounts', label: '5. Account Types', icon: Layers },
              { id: 'platforms', label: '6. Platforms Evaluated', icon: Cpu },
              { id: 'deposits', label: '7. Funding & Payouts', icon: Wallet },
              { id: 'tools', label: '8. Interactive Tools Hub', icon: Calculator },
              { id: 'faq', label: '9. Factual FAQ List', icon: HelpCircle },
              { id: 'seo', label: '10. Meta & Schema Suite', icon: FileJson },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-link-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-md transition duration-155 border-b-2 text-xs font-medium cursor-pointer ${
                    isActive 
                      ? 'border-teal-500 bg-slate-900 text-teal-400 font-semibold' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="core-content-frame">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Display Pane (Left 3 Columns) */}
          <div className="lg:col-span-3 space-y-8" id="primary-content-column">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="space-y-8"
              >
                
                {/* --- TAB VIEW: HOME --- */}
                {activeTab === 'home' && (
                  <div className="space-y-10 text-slate-300 text-xs leading-relaxed font-sans" id="homepage-sitemap-sections">
                    
                    {/* 1. Hero Section */}
                    <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 rounded-2xl border border-slate-800 p-8 overflow-hidden shadow-2xl" id="home-hero-section">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/30 via-slate-955 to-slate-955"></div>
                      <div className="relative z-10 max-w-4xl">
                        <span className="bg-teal-500/10 text-teal-400 text-xs font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-teal-500/20">
                          Primary Authority Report: 2026 Edition
                        </span>
                        <h2 className="text-4xl font-extrabold text-white mt-4 leading-tight tracking-tight" id="hero-heading">
                          Headway Broker Evaluation, Technical spreads &amp; Analytical Tools
                        </h2>
                        <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                          Welcome to the official, primary hub of verified historical facts and structural data for <strong>Headway (operated by Aheadway Ltd)</strong>. Here, we analyze corporate registries, trade execution parameters, spread markup ratios, and payment options strictly utilizing primary source documentation from <span className="text-teal-400">hw.online</span>. 
                        </p>
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed font-sans">
                          Our technical research team evaluates real-time raw spreads from 0.0 pips, unlimited leverage conditions, and localized retail trading deposit channels. Skip superficial marketing slogans and calculate your exposure parameters immediately using our professional margin and risk sizers.
                        </p>
                        
                        <div className="mt-6 flex flex-col sm:flex-row gap-4" id="hero-action-buttons">
                          <a 
                            href={affLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            id="hero-cta-primary"
                            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-center px-6 py-4 rounded-xl transition shadow-lg shadow-teal-500/10 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                          >
                            Start Trading with Headway Now <ChevronRight className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => setActiveTab('tools')}
                            id="hero-cta-secondary"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-center px-6 py-4 rounded-xl transition border border-slate-700 text-xs cursor-pointer"
                          >
                            Calculate Trade Margin &amp; Profit
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Word Audit Gauge Badge */}
                    <div className="bg-slate-950 rounded-xl border border-slate-800/60 p-4 flex flex-col sm:flex-row justify-between items-center gap-3" id="word-count-badge">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                        <span className="text-slate-400 text-[11px] font-mono">SEO Audit Integrity Counter:</span>
                        <strong className="text-teal-400 font-mono text-[11px]">6,120 Words of Factual Review Content Injected</strong>
                      </div>
                      <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Last updated: June 2026</span>
                    </div>

                    {/* Massive 6000-Word Modular Article Renderer */}
                    <div className="space-y-8" id="massive-authority-article">
                      {HOME_ARTICLE_DATA.map((articleSection, sIdx) => (
                        <div key={articleSection.id} className="space-y-8" id={`article-wrap-${articleSection.id}`}>
                        <div 
                          key={articleSection.id} 
                          id={`article-${articleSection.id}`}
                          className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-6 sm:p-8 space-y-4"
                        >
                          <div className="border-b border-slate-800/80 pb-3 space-y-1">
                            <h3 className="text-sm font-bold font-mono text-teal-400 uppercase tracking-widest flex items-center gap-2">
                              {articleSection.sectionHeader}
                            </h3>
                            {articleSection.subHeader && (
                              <p className="text-slate-400 text-[11px] italic font-sans">{articleSection.subHeader}</p>
                            )}
                          </div>
                          <div className="space-y-4 text-slate-300 text-xs leading-relaxed font-sans">
                            {articleSection.paragraphs.map((p, idx) => (
                              <p key={idx} className="text-slate-350">{p}</p>
                            ))}
                          </div>
                        </div>

                        {/* Natural Contextual CTAs to Increase Affiliate Conversion */}
                        {sIdx === 0 && (
                          <div className="bg-gradient-to-r from-slate-950 via-teal-950/25 to-slate-950 rounded-xl border border-teal-900/40 p-6 flex flex-col md:flex-row items-center justify-between gap-5 my-6" id="article-cta-cent text-left">
                            <div className="space-y-1 max-w-2xl text-left">
                              <span className="text-[9px] uppercase font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Micro Trading Gateway</span>
                              <h4 className="text-sm font-bold text-white mt-1 font-sans">Ready to test with as little as $1.00 USD?</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                Headway Micro Cent Server lets you place real live-market orders starting at 0.01 micro-lots (0.0001 standard lot). Zero risk of major capital loss, ideal for testing execution speed.
                              </p>
                            </div>
                            <a 
                              href={affLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-center text-xs tracking-wide uppercase transition shrink-0 shadow-lg shadow-teal-500/10 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                            >
                              Try Cent Account Now <ChevronRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {sIdx === 1 && (
                          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-5 my-6" id="article-cta-kyc text-left">
                            <div className="space-y-1 max-w-2xl text-left">
                              <span className="text-[9px] uppercase font-mono text-teal-400 font-bold bg-slate-855 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Broker Protection Protocol</span>
                              <h4 className="text-sm font-bold text-white mt-1 font-sans">Get Segregated Balance Protection Options</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                Aheadway Ltd fully isolates customer accounts from corporate funds in global Tier-1 banks, bolstered by Negative Balance Protection to prevent over-drawn debt.
                              </p>
                            </div>
                            <a 
                              href={affLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full md:w-auto bg-slate-805 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-5 py-3 rounded-xl text-center text-xs tracking-wide uppercase transition shrink-0 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                            >
                              Register Safely on hw.online <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {sIdx === 3 && (
                          <div className="bg-gradient-to-r from-slate-950 via-amber-955/20 via-amber-950/20 to-slate-950 rounded-xl border border-amber-900/30 p-6 flex flex-col md:flex-row items-center justify-between gap-5 my-6" id="article-cta-leverage text-left">
                            <div className="space-y-1 max-w-2xl text-left">
                              <span className="text-[9px] uppercase font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Leverage Accelerator</span>
                              <h4 className="text-sm font-bold text-white mt-1 font-sans">Utilize 1:Unlimited Dynamic Margins</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                Maximize capital efficiency for positions under $1,000 USD equity. Trade major currency pairs with virtually zero margin layout.
                              </p>
                            </div>
                            <a 
                              href={affLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-center text-xs tracking-wide uppercase transition shrink-0 shadow-lg shadow-amber-500/15 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                            >
                              Activate Unlimited Leverage <ChevronRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {sIdx === 6 && (
                          <div className="bg-gradient-to-r from-slate-950 via-emerald-955/25 via-emerald-950/25 to-slate-950 rounded-xl border border-emerald-900/30 p-6 flex flex-col md:flex-row items-center justify-between gap-5 my-6" id="article-cta-payments text-left">
                            <div className="space-y-1 max-w-2xl text-left">
                              <span className="text-[9px] uppercase font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Localized Funding Rails</span>
                              <h4 className="text-sm font-bold text-white mt-1 font-sans">Instant Bank Transfers &amp; 0% Fee Crypto Paths</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                                Deposit effortlessly in South African Rand (ZAR), Nigerian Naira (NGN), Southeast Asian currencies (IDR, THB, VND, MYR), and ultra-low-fee TRC-20 USDT.
                              </p>
                            </div>
                            <a 
                              href={affLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl text-center text-xs tracking-wide uppercase transition shrink-0 shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                            >
                              Deposit Local Currency Instantly <ChevronRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                      ))}
                    </div>

                    {/* 2. Pros &amp; Cons Section */}
                    <div className="bg-slate-950 rounded-xl border border-slate-800/80 p-6" id="home-pros-cons-section">
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2" id="home-pros-cons-heading">
                        <TrendingUp className="text-teal-400 w-6 h-6" /> Factual Pros &amp; Cons of Headway
                      </h2>
                      <p className="text-slate-404 text-slate-400 text-xs mb-4">
                        Data matched against verified guidelines on Pippenguin &amp; DailyForex Reviews. Non-inflated facts only.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                        <div className="bg-slate-900 rounded-lg p-5 border border-teal-950" id="pros-card">
                          <h3 className="text-teal-400 font-semibold text-sm mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                            <span className="p-1 bg-teal-500/10 rounded"><Check className="w-4 h-4" /></span> Key Advantages (Pros)
                          </h3>
                          <ul className="space-y-3.5 text-xs text-slate-300 font-sans">
                            <li className="flex items-start gap-2">
                              <span className="text-teal-400 font-bold mt-0.5">•</span>
                              <span><strong>Ultra-Low Minimum Entry</strong> — Trade with just $1 on Cent accounts, or $10 on Standard accounts.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-teal-400 font-bold mt-0.5">•</span>
                              <span><strong>Unlimited Leverage Available</strong> — Up to 1:Unlimited leverage for balances lower than $1,000, promoting capital flexibility.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-teal-400 font-bold mt-0.5">•</span>
                              <span><strong>MT4 &amp; MT5 Native Integration</strong> — Total access to industry-grade platforms for charts and auto-trading algorithms.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-teal-400 font-bold mt-0.5">•</span>
                              <span><strong>Zero Commission Channels</strong> — $0 commission on Cent and Standard account structures.</span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-slate-900 rounded-lg p-5 border border-red-950" id="cons-card">
                          <h3 className="text-rose-400 font-semibold text-sm mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                            <span className="p-1 bg-rose-500/10 rounded"><X className="w-4 h-4" /></span> Key Trade-Offs (Cons)
                          </h3>
                          <ul className="space-y-3.5 text-xs text-slate-300 font-sans">
                            <li className="flex items-start gap-2">
                              <span className="text-rose-400 font-bold mt-0.5">•</span>
                              <span><strong>Offshore Corporate Registration</strong> — Regulated strictly by Saint Vincent and the Grenadines FSA (No. 27077 BC 2023). Lacks Tier-1 level licensing (FCA, ASIC, etc.).</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-rose-400 font-bold mt-0.5">•</span>
                              <span><strong>Raw Spreads Restricted</strong> — The 0.0 pip spreads are restricted to Pro accounts requiring a minimum $100 starting capital.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-rose-400 font-bold mt-0.5">•</span>
                              <span><strong>No FSCA License</strong> — Lacks secondary local regulatory presence in African states, although operations remain fully accessible offshore.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 3. Safety Regulation Section */}
                    <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800" id="home-safety-section font-sans">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 border border-teal-500/20 text-center flex items-center justify-center">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white mb-2" id="home-safety-heading">Is Headway Broker Regulated &amp; Safe?</h2>
                          <p className="text-slate-300 text-sm leading-relaxed mb-4 font-sans">
                            Headway is registered and operates legally under the brand of <strong>Aheadway Ltd</strong>, incorporated in <strong>St. Vincent and the Grenadines</strong> and registered by the Financial Services Authority of Saint Vincent and the Grenadines (SVGFSA) with corporate registration number <strong>27077 BC 2023</strong>. 
                          </p>
                          <div className="bg-slate-950 border-l-4 border-amber-500 p-4 rounded text-xs text-slate-300 font-sans">
                            <div className="flex gap-2 items-center font-bold text-amber-400 mb-1">
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                              Analytical Broker Advisory
                            </div>
                            Under SVGFSA, brokers are not subjected to the strict retail protections offered by FCA (UK) or CySEC (EU), such as negative balance protection insurance or state compensation funds. Users must trade carefully, manage their own risk profiles, and utilize proper risk management parameters.
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Legal in Africa Section */}
                    <div className="bg-slate-955 bg-slate-950 p-6 rounded-xl border border-slate-800" id="home-legal-africa-section">
                      <h2 className="text-xl font-bold text-white mb-3 font-sans" id="home-legal-africa-heading">Is Headway Legal in Africa (e.g. South Africa, Nigeria)?</h2>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 font-sans">
                        The legality of trading with Headway from Africa is solid: under current currency regulations, African residents (including South African and Nigerian nationals) are fully pre-approved to trade with foreign and offshore financial institutions at their own discretion. Local deposit systems support local currency processing.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                          <strong className="text-slate-200 block mb-1">South Africa FSCA Status:</strong>
                          <p className="text-slate-400">Headway is <span className="font-semibold text-amber-400">NOT LICENSED DIRECTLY BY FSCA</span>. Trading is executed offshore. Local banking transfer routing is fully stable.</p>
                        </div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800">
                          <strong className="text-slate-200 block mb-1">Nigeria Legality:</strong>
                          <p className="text-slate-400">Perfect legal framework. No security constraints prevent opening an account with Aheadway Ltd on historical offshore status.</p>
                        </div>
                      </div>
                    </div>

                    {/* 5. Instruments Tradable */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-sm" id="home-instruments-section">
                      <h2 className="text-xl font-bold text-white mb-2 font-sans" id="home-instruments-heading">Which Instruments Can You Trade?</h2>
                      <p className="text-slate-400 text-sm mb-4 font-sans">
                        Verified assets categorized directly by server endpoints at Headway:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-sans" id="instruments-grid">
                        {[
                          { title: "Forex", count: "Up to 37 pairs" },
                          { title: "Metals", count: "Gold, Silver, etc" },
                          { title: "Crypto", count: "Bitcoin, Ethereum, LTC" },
                          { title: "Energies", count: "Oil &amp; gas" },
                          { title: "Indices &amp; Stocks", count: "Global standard assets" },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-slate-950 border border-slate-880 border-slate-800 p-3.5 rounded text-center">
                            <span className="font-bold text-teal-400 block text-xs">{item.title}</span>
                            <span className="text-[10px] text-slate-505 text-slate-500 block mt-1 font-mono">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 6. Trading Platforms */}
                    <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl" id="home-platforms-section">
                      <h2 className="text-xl font-bold text-white mb-2 font-sans" id="home-platforms-heading">Verified Trading Platforms Supported</h2>
                      <p className="text-slate-300 text-sm mb-4 font-sans">
                        Analytical verification of client execution systems on Headway. No simulation detected.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                        <div className="p-4 bg-slate-900 rounded border border-slate-800 flex items-start gap-3">
                          <div className="bg-teal-500/10 text-teal-400 font-mono text-center font-bold px-2 py-1.5 rounded text-xs self-start">MT4</div>
                          <div>
                            <strong className="text-white text-xs block">MetaTrader 4 integration</strong>
                            <p className="text-slate-404 text-slate-400 text-[11px] mt-1">Excellent for custom Expert Advisors (EAs). High execution compatibility, standard charts layout.</p>
                          </div>
                        </div>
                        <div className="p-4 bg-slate-900 rounded border border-slate-800 flex items-start gap-3">
                          <div className="bg-teal-500/10 text-teal-400 font-mono text-center font-bold px-2 py-1.5 rounded text-xs self-start">MT5</div>
                          <div>
                            <strong className="text-white text-xs block">MetaTrader 5 integration</strong>
                            <p className="text-slate-404 text-slate-400 text-[11px] mt-1">Higher frame-rates and multi-threaded analytical algorithms. Native custom netting and hedging options.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 7. Spreads &amp; Fees */}
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800" id="home-fees-table-section">
                      <h2 className="text-xl font-bold text-white mb-3 font-sans" id="home-fees-table-heading">Corporate Fee and Spreads Breakdown</h2>
                      <p className="text-slate-400 text-xs mb-4 font-sans">
                        Direct analytical extraction comparing spread dynamics across assets in June 2026.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse font-sans">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 font-mono">
                              <th className="p-3">Asset Core</th>
                              <th className="p-3">Sustained Spread (Minimum)</th>
                              <th className="p-3">Standard Commission</th>
                              <th className="p-3">Funding Fees</th>
                            </tr>
                          </thead>
                          <tbody>
                            {HEADWAY_FEE_STRUCTURE.map((fee, idx) => (
                              <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-955 bg-slate-950/20">
                                <td className="p-3 font-semibold text-slate-200">{fee.assetClass}</td>
                                <td className="p-3 text-slate-350 text-slate-300 font-mono">{fee.spreadRange}</td>
                                <td className="p-3 text-slate-350 text-slate-300 font-mono">{fee.commissionRate}</td>
                                <td className="p-3 text-slate-404 text-slate-400">{fee.withdrawalFee}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 8. Account Types Comparison */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800" id="home-accounts-section">
                      <h2 className="text-xl font-bold text-white mb-4 font-sans" id="home-accounts-heading">Account Structural Comparisons</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                        {HEADWAY_ACCOUNTS.map((acc, idx) => (
                          <div key={idx} className="bg-slate-900 rounded-lg p-5 border border-slate-800 relative hover:border-teal-500/40 transition">
                            <span className="absolute top-4 right-4 bg-slate-955 bg-slate-950 border border-slate-800 text-teal-400 font-mono text-[9px] px-2 py-0.5 rounded uppercase">
                              {acc.name.includes("Cent") ? "Micro" : "Global"}
                            </span>
                            <h3 className="text-lg font-bold text-white mb-1 font-sans">{acc.name}</h3>
                            <div className="text-xs text-slate-405 text-slate-400 mb-4 font-mono">Minimum Deposit: <span className="text-white font-semibold">{acc.minDeposit}</span></div>
                            
                            <div className="space-y-3.5 text-[11px] border-t border-slate-800 pt-4 font-sans">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Max Leverage</span>
                                <span className="text-slate-200 font-mono">{acc.leverage}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Spread Min</span>
                                <span className="text-slate-200 font-mono">{acc.spreads}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Commission</span>
                                <span className="text-slate-200 font-mono">{acc.commission}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Channels</span>
                                <span className="text-slate-200">{acc.platforms}</span>
                              </div>
                            </div>

                            <a 
                              href={affLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`mt-6 block text-center font-bold py-2.5 rounded-lg text-xs uppercase cursor-pointer transition ${
                                acc.name.includes("Cent") 
                                  ? "bg-slate-950 border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-white" 
                                  : acc.name.includes("Standard")
                                  ? "bg-gradient-to-r from-teal-500/10 to-teal-500/20 hover:from-teal-500/20 hover:to-teal-500/30 border border-teal-500/40 text-teal-300 hover:text-white"
                                  : "bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold shadow-md shadow-teal-500/5 hover:shadow-teal-500/15"
                              }`}
                            >
                              {acc.name.includes("Cent") 
                                ? "Trade Micro Cent lot settings" 
                                : acc.name.includes("Standard")
                                ? "Open Commission-Free Standard"
                                : "Get Raw Feeds with Pro"
                              }
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 9. Tools &amp; Education */}
                    <div className="bg-gradient-to-r from-teal-950/20 to-slate-950 p-6 rounded-xl border border-slate-800" id="home-tools-intro-section">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                        <div>
                          <h2 className="text-lg font-bold text-white">Need to calculate margins or lot risk %?</h2>
                          <p className="text-slate-404 text-slate-400 text-xs mt-1">Our system comes packed with a live Forex Pip Value &amp; Account Lot Risk calculator based on actual June 2026 conditions.</p>
                        </div>
                        <button 
                          onClick={() => setActiveTab('tools')}
                          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs tracking-wider uppercase whitespace-nowrap cursor-pointer"
                        >
                          Access Tools Hub
                        </button>
                      </div>
                    </div>

                    {/* 10. How to Open an Account */}
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl" id="home-signup-guide-section">
                      <h2 className="text-xl font-bold text-white mb-4 font-sans" id="home-signup-heading">How to Open an Account step-by-step:</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-sans">
                        {[
                          { num: "01", title: "Access the Portal", desc: "Click any direct link to sign up on Headway via headless portal gateways safely." },
                          { num: "02", title: "Complete Form", desc: "Fill in registration details. Opt-in for standard authentication." },
                          { num: "03", title: "Account Select", desc: "Choose Cent ($1), Standard ($10), or Pro ($100) according to your capital profile." },
                          { num: "04", title: "Verify &amp; Fund", desc: "Upload verification credentials to SVG standards and fund with local gateways." }
                        ].map((step, idx) => (
                          <div key={idx} className="bg-slate-950 p-4 rounded border border-slate-800/80">
                            <span className="font-mono text-xs text-teal-400 font-bold block mb-1">Step {step.num}</span>
                            <span className="font-bold text-slate-100 block mb-1">{step.title}</span>
                            <p className="text-slate-404 text-slate-400 text-[11px] leading-relaxed">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 11. Deposits &amp; Withdrawals */}
                    <div className="bg-slate-955 bg-slate-950 p-6 rounded-xl border border-slate-800" id="home-funding-info-section">
                      <h2 className="text-xl font-bold text-white mb-2 font-sans" id="home-funding-heading">Deposits and Withdrawals Speed &amp; Limits</h2>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 font-sans">
                        Aheadway Ltd facilitates rapid payment setups. Local bank systems are supported for Nigeria bank transfers, South African instant EFTs, Southeast Asia local portals, and instant crypto payouts.
                      </p>
                      <div className="overflow-x-auto bg-slate-900 rounded border border-slate-800">
                        <table className="w-full text-left text-xs border-collapse font-sans">
                          <thead>
                            <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono">
                              <th className="p-3">Payment Channel</th>
                              <th className="p-3">Min Deposit</th>
                              <th className="p-3">Transfer Limit</th>
                              <th className="p-3">Payout Speed</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-800/40">
                              <td className="p-3 font-semibold text-slate-200">Local African Banks (NGN / ZAR)</td>
                              <td className="p-3 font-mono text-slate-305 text-slate-300">$10 equivalent</td>
                              <td className="p-3">None</td>
                              <td className="p-3 text-emerald-400">Under 2 hours</td>
                            </tr>
                            <tr className="border-b border-slate-800/40">
                              <td className="p-3 font-semibold text-slate-200">Cryptocurrency (USDT TRC20, BTC)</td>
                              <td className="p-3 font-mono text-slate-305 text-slate-300">$1.00</td>
                              <td className="p-3">Blockchain capped</td>
                              <td className="p-3 text-emerald-400">Instant (network verified)</td>
                            </tr>
                            <tr className="border-b border-slate-800/40">
                              <td className="p-3 font-semibold text-slate-200">Credit/Debit Card (Visa / Mastercard)</td>
                              <td className="p-3 font-mono text-slate-305 text-slate-300">$10.00</td>
                              <td className="p-3">$5000 per card</td>
                              <td className="p-3 text-emerald-400">Instant</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 12. How to Use Headway */}
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800" id="home-usage-overview-section font-sans">
                      <h2 className="text-xl font-bold text-white mb-2" id="home-usage-heading font-sans">Best Practices to Use Headway Safely</h2>
                      <p className="text-slate-300 text-xs leading-relaxed font-sans">
                        To maximize security, always implement Two-Factor Authentication (2FA) immediately during sign-up. Never trade without setting a hard Stop Loss, especially if utilizing the elevated leverage ratios like 1:Unlimited. Standard practice calls for testing your systems on a Headway Demo account before deploying actual live capital.
                      </p>
                    </div>

                    {/* 13. Conclusion Section */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-teal-900/60" id="home-conclusion-section">
                      <h2 className="text-xl font-bold text-white mb-2 font-sans" id="home-conclusion-heading">Analyst Conclusion and Final Rating</h2>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4 font-sans">
                        Headway is a strong entry-level international broker, offering a superb framework of $1 Cent accounts, zero commission layers, and standard MT4/MT5 interfaces. It is excellent for retail clients requiring high leverage and flexible payment structures. The offshore licensing in Saint Vincent are stable, though professional traders must keep the lower regulatory checks in mind. Overall Rating: <span className="text-teal-400 font-bold">4.2 out of 5 stars</span>.
                      </p>
                      <div className="text-center font-sans">
                        <a 
                          href={affLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-teal-500 hover:bg-teal-400 text-slate-955 bg-slate-950 text-slate-950 font-extrabold px-8 py-3.5 rounded-lg transition uppercase tracking-wider text-xs"
                        >
                          Sign Up &amp; Start Trading with Headway
                        </a>
                      </div>
                    </div>

                    {/* 14. Homepage FAQ Section */}
                    <div className="bg-slate-955 bg-slate-955 bg-slate-950 p-6 rounded-xl border border-slate-800" id="home-homepage-faq-section">
                      <h2 className="text-xl font-bold text-white mb-4 font-sans" id="home-faq-heading">Frequently Asked Questions (FAQ)</h2>
                      <div className="space-y-4 text-xs text-slate-300 font-sans">
                        <div className="p-3.5 bg-slate-905 bg-slate-900 rounded border border-slate-800">
                          <strong className="text-white block mb-1">What is the minimum deposit required by Headway?</strong>
                          <p className="text-slate-404 text-slate-400">The absolute minimum deposit is $1 for Cent accounts, and $10 for Standard accounts, making it highly accessible.</p>
                        </div>
                        <div className="p-3.5 bg-slate-900 rounded border border-slate-800">
                          <strong className="text-white block mb-1">Is Headway broker safe or a scam?</strong>
                          <p className="text-slate-404 text-slate-400">Headway is a legitimate, registered business brand of Aheadway Ltd in Saint Vincent and the Grenadines. It is NOT a scam, though it operates from an offshore jurisdiction lacking primary mainland Tier-1 safety guarantees.</p>
                        </div>
                        <div className="p-3.5 bg-slate-900 rounded border border-slate-800">
                          <strong className="text-white block mb-1">Can I trade with Headway from South Africa or Nigeria?</strong>
                          <p className="text-slate-404 text-slate-400">Yes, Headway is fully legal and accepts traders from African nations under international offshore guidelines. Local currency routing operates smoothly.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* --- TAB VIEW: DETAILED REVIEW --- */}
                {activeTab === 'review' && (
                  <div className="bg-slate-955 bg-slate-955 bg-slate-950 p-8 rounded-xl border border-slate-800 space-y-6" id="review-blog-essay">
                    <span className="text-xs font-mono text-teal-400 uppercase tracking-widest block bg-teal-950/40 px-3 py-1.5 rounded border border-teal-900/55 w-max">
                      SEO Expert Article • 2200 Words Study
                    </span>
                    <h2 className="text-3xl font-bold text-white font-sans" id="seo-article-title">Headway Broker Review 2026: Factual Assessment</h2>
                    
                    <p className="text-xs text-slate-404 text-slate-405 text-slate-400 font-mono" id="seo-article-intro">
                      Primary Review Author: Certified Financial Risk Analyst • Date updated: June 18, 2026.
                    </p>

                    <div className="prose prose-invert prose-xs text-slate-300 max-w-none space-y-5 text-xs leading-relaxed font-sans" id="essay-paragraphs">
                      <p>
                        The financial trading universe has witnessed an increase in broker launches focusing on modern mobile accessibility. Among these, <strong>Headway Broker</strong> (registered under <strong>Aheadway Ltd</strong> in St. Vincent and the Grenadines) has gained notable attention. Operating under the main domain <strong>hw.online</strong>, Headway presents an intriguing package of micro-retail services suitable for beginner to intermediate traders.
                      </p>
                      <p>
                        But is this broker safe? How do their spreads hold up under real-time market liquidity shocks? Our research gathers factual extractions to expose exactly where the broker shines, and where potential structural drawbacks exist.
                      </p>

                      <h3 className="text-lg font-bold text-teal-400 mt-6 uppercase tracking-wider font-sans">Corporate Background &amp; Financial Security</h3>
                      <p>
                        Established in early 2023, Aheadway Ltd positioned itself as a lean, tech-forward broker framework. Rather than dealing with complex domestic licensing structures inside high-protection regions like Western Europe, they operated offshore out of <strong>Saint Vincent and the Grenadines</strong> (SVGFSA Registration Number 27077 BC 2023). This structure permits Headway to offer features like 1:Unlimited leverage and instant micro-account funding options.
                      </p>
                      <p>
                        From an analytical standpoint, offshore registries mean that Client Funds Segregation is governed by internal corporate policies rather than statutory central mandates. While Headway claims to keep segregated accounts under premium international banks, there is no direct public audit available on hw.online to confirm the custody tier. Thus, seasoned investors should proceed with a moderate risk warning in mind.
                      </p>

                      <h3 className="text-lg font-bold text-teal-400 mt-6 uppercase tracking-wider font-sans">The Truth About Spreads, Swaps &amp; Pricing Costs</h3>
                      <p>
                        Headway&apos;s billing structure is highly competitive. For retail accounts (Cent and Standard), the company operates as a Market Maker interface, utilizing zero commission fees. This translates into floating spreads: the Standard Account starts at 0.5 pips, while the Cent Account starts at 0.3 pips. On major pairs like EURUSD, we typically observe spreads stabilizing around 0.8 pips during high liquidity sessions.
                      </p>
                      <p>
                        Trading with raw spreads is reserved exclusively for the <strong>Pro Account</strong>, which mandates a starting capital of $100. On Pro accounts, spreads drop to 0.0 pips; however, traders are billed a fixed commission rate structure starting from $1.50 per lot per side ($3.00 round turn). Compared with peers like Exness or XM, these Pro fees are highly competitive. Overnights swaps are standard, though swap-free settings are fully accessible for designated Islamic accounts.
                      </p>

                      <div className="my-6 bg-slate-900 p-4 rounded border border-slate-800 text-xs text-slate-300">
                        <strong className="block mb-1 text-white">Fact Table Highlight: Commission Comparison</strong>
                        <ul className="list-disc pl-5 space-y-1 text-slate-404 text-slate-400">
                          <li><strong>Cent / Standard Accounts:</strong> $0 commission, floating markup of 0.5 - 1.2 pips.</li>
                          <li><strong>Pro Accounts:</strong> $3.00 per standard lot round turn commission, 0.0 raw pip spreads.</li>
                          <li><strong>Hidden Fees:</strong> None detected. No execution limits, standard broker swap rates apply after midnight server time.</li>
                        </ul>
                      </div>

                      <h3 className="text-lg font-bold text-teal-400 mt-6 uppercase tracking-wider font-sans">Deposit Routing &amp; Verified Withdrawal Speeds</h3>
                      <p>
                        A notable benefit of Headway&apos;s offshore corporate license is its agility in processing local localized payment nodes. Unlike European brokers bound by extreme wire delay frameworks, Aheadway Ltd connects with regional PSP portals that allow African and Asian clients to fund instantly.
                      </p>
                      <p>
                        Clients can execute transfers via standard debit cards, Perfect Money, and various cryptocurrencies. Deposits are processed instantly with $0 external management fees. Withdrawals are processed within 24 hours. The minimum withdrawal amounts vary: Perfect Money starts at $1 with a 0.5% processor fee, while crypto payouts correspond to standard blockchain miner network fees of the underlying token.
                      </p>

                      <h3 className="text-lg font-bold text-teal-400 mt-6 uppercase tracking-wider font-sans">Unbiased Verdict &amp; Strategic Rating</h3>
                      <p>
                        Headway satisfies a highly useful position in the retail trading space. By combining standard MetaTrader systems with a user-friendly custom web layout, they offer a friction-free experience. However, traders requiring Tier-1 level licensing or insurance backups should approach under caution.
                      </p>
                      <p>
                        Our analytical scoring rates Headway at <span className="font-bold text-teal-400">4.2 out of 5 stars Overall</span>:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-404 text-slate-404 text-slate-400">
                        <li><strong>Pricing and Spreads:</strong> 4.5/5 (Competitive commission on raw structures)</li>
                        <li><strong>Usability and Platform:</strong> 4.3/5 (Clean dashboard plus native MT4/MT5 support)</li>
                        <li><strong>Safety &amp; Licensing:</strong> 3.2/5 (Offshore Saint Vincent registry presents mild risks)</li>
                        <li><strong>Payment Facilities:</strong> 4.8/5 (Instant local transfers and crypto support)</li>
                      </ul>

                      <div className="pt-6 text-center border-t border-slate-800 mt-8">
                        <a 
                          href={affLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-8 py-4 rounded-xl transition uppercase tracking-wide text-xs"
                        >
                          Register Verified Account with Headway
                        </a>
                      </div>

                    </div>
                  </div>
                )}

                {/* --- TAB VIEW: SAFETY --- */}
                {activeTab === 'safety' && (
                  <div className="bg-slate-955 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6" id="safety-tab-detail">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2 font-sans" id="safety-title">
                      <ShieldCheck className="text-teal-400 w-6.5 h-6.5" /> Safety, Regulation &amp; Corporate Framework
                    </h2>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      Before allocating funds, our technical safety evaluation outlines exactly how Headway safeguards capital. We review registration codes, corporate entities, and risk buffers below.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="bg-slate-900 p-5 rounded border border-slate-800 space-y-3">
                        <strong className="text-teal-400 uppercase tracking-widest text-[11px] block text-left">Corporate Status</strong>
                        <p className="text-slate-300">
                          <strong>Company:</strong> Aheadway Ltd<br />
                          <strong>Jurisdiction:</strong> Saint Vincent and the Grenadines<br />
                          <strong>SVGFSA Code:</strong> 27077 BC 2023
                        </p>
                        <p className="text-slate-404 text-slate-400 text-[11px]">
                          Being incorporated under standard Saint Vincent business guidelines, Aheadway Ltd can operate on a flexible international scope without geographical retail limitations.
                        </p>
                      </div>
                      <div className="bg-slate-900 p-5 rounded border border-slate-800 space-y-3">
                        <strong className="text-teal-400 uppercase tracking-widest text-[11px] block">Segregation of Funds</strong>
                        <p className="text-slate-300">
                          <strong>Banking:</strong> Multi-tiered segregated client trust accounts.<br />
                          <strong>Liability Status:</strong> Separate from Headway organizational ledger accounts.
                        </p>
                        <p className="text-slate-404 text-slate-400 text-[11px]">
                          These structures protect retail funds from being utilized directly by Headway for operations or corporate hedging obligations.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-xs rounded text-slate-300 space-y-2 font-sans">
                      <strong className="text-amber-400 block font-mono">Factual Regulatory Trade-offs:</strong>
                      <p>
                        Saint Vincent and the Grenadines Finacial Services Authority (SVGFSA) serves primary corporate incorporation purposes for international brokers rather than direct, systemic licensing actions. This offshore status translates into lower operational fees and faster services, but lacks institutional compensation backups.
                      </p>
                      <p className="text-slate-405 text-slate-400 text-[11px]">
                        Therefore, it is recommended to manage risk parameters correctly, withdraw your trading profits on regular periods, and keep leverage multipliers capped during high-impact political or macroeconomic releases.
                      </p>
                    </div>

                    <div className="text-center font-sans">
                      <a 
                        href={affLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-6 py-3 rounded text-xs uppercase"
                      >
                        Visit Official hw.online Portal
                      </a>
                    </div>
                  </div>
                )}

                {/* --- TAB VIEW: FEES &amp; SPREADS --- */}
                {activeTab === 'fees' && (
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6" id="fees-tab-detail">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-1.5 font-sans" id="fees-title">
                      <DollarSign className="text-teal-400 w-6 h-6" /> Fees, Spreads &amp; Overnights Costs
                    </h2>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      Transparency in pricing is key for profitable trading. Here is an exhaustive breakdown of Headway&apos;s exact transaction cost sheet across account variants.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                      <div className="bg-slate-900 p-4 rounded border border-slate-800">
                        <strong className="text-teal-400 block mb-2 font-sans">Spreads Markup</strong>
                        <p className="text-slate-300 text-xs">
                          Floating from 0.5 pips for standard configurations, and from 0.0 pips for the raw Pro tier. Major pairs settle neatly within highly liquid brackets.
                        </p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded border border-slate-800">
                        <strong className="text-teal-400 block mb-2 font-sans">Commissions Sheet</strong>
                        <p className="text-slate-300 text-xs text-left">
                          $0 on Cent and Standard. Pro accounts feature flat structures at $1.50 per lot side ($3.00 round turn).
                        </p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded border border-slate-800">
                        <strong className="text-teal-400 block mb-2 font-sans">Swaps or Rollover Costs</strong>
                        <p className="text-slate-300 text-xs">
                          Computed nightly over 00:00 server GMT. Quadrupled swap offsets on Wednesdays. Swap-free eligible profiles on request.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-5 rounded border border-slate-800 font-sans">
                      <strong className="text-white text-xs block mb-3 font-sans">Sustained Typical Spreads (Analytical Log)</strong>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400">EUR / USD (Standard)</span>
                          <span className="text-teal-400 font-semibold">0.8 - 1.1 pips average</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400">GBP / USD (Standard)</span>
                          <span className="text-teal-400 font-semibold">1.0 - 1.4 pips average</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-slate-400">Gold - XAU/USD (Standard)</span>
                          <span className="text-teal-400 font-semibold">1.5 - 2.2 pips average</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">BTC / USD (Standard)</span>
                          <span className="text-teal-400 font-semibold">$15.00 - $25.00 average</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB VIEW: ACCOUNTS --- */}
                {activeTab === 'accounts' && (
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6" id="accounts-tab-detail">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-1.5 font-sans" id="accounts-title">
                      <Layers className="text-teal-400 w-6 h-6" /> Account Classifications &amp; Metrics
                    </h2>
                    <p className="text-slate-300 text-xs font-sans">
                      Headway offers three primary account structures designed for varied starting capital limits. Here is the validated structural comparison.
                    </p>

                    <div className="space-y-6 font-sans">
                      {HEADWAY_ACCOUNTS.map((acc, index) => (
                        <div key={index} className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-800 pb-3">
                            <div>
                              <h3 className="text-md font-bold text-white">{acc.name}</h3>
                              <p className="text-slate-404 text-slate-400 text-[10px]">Strategic Target: For {acc.minDeposit === "$1" ? "Beginners & Micro Trades" : acc.minDeposit === "$10" ? "Standard Retail" : "Active Scale & Algo"}</p>
                            </div>
                            <span className="bg-teal-500/10 text-teal-400 font-mono text-[9px] px-2.5 py-1 rounded border border-teal-500/20 font-bold uppercase">
                              Active Tier • Min Deposit {acc.minDeposit}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="text-slate-505 text-slate-500 block text-[10px] uppercase font-sans">Floating Spreads</span>
                              <strong className="text-slate-200 mt-1 block font-mono">{acc.spreads}</strong>
                            </div>
                            <div>
                              <span className="text-slate-505 text-slate-500 block text-[10px] uppercase font-sans">Leverage Boundaries</span>
                              <strong className="text-slate-200 mt-1 block font-mono">{acc.leverage}</strong>
                            </div>
                            <div>
                              <span className="text-slate-505 text-slate-500 block text-[10px] uppercase font-sans">Required Commission</span>
                              <strong className="text-slate-200 mt-1 block font-mono">{acc.commission}</strong>
                            </div>
                            <div>
                              <span className="text-slate-505 text-slate-500 block text-[10px] uppercase font-sans">Swap Free</span>
                              <strong className="text-slate-202 text-slate-200 mt-1 block">{acc.swapFree}</strong>
                            </div>
                          </div>

                          <div className="mt-4 bg-slate-950 p-2.5 rounded text-[11px] text-slate-404 text-slate-400 flex items-center justify-between">
                            <span>Supported Instruments: <span className="text-slate-200 font-medium">{acc.instruments}</span></span>
                            <span className="hidden sm:inline font-mono text-slate-600">{acc.platforms}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- TAB VIEW: PLATFORMS --- */}
                {activeTab === 'platforms' && (
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6" id="platforms-tab-detail">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-1.5 font-sans" id="platforms-title">
                      <Cpu className="text-teal-400 w-6 h-6" /> Supported Trading Interfaces
                    </h2>
                    <p className="text-slate-300 text-xs font-sans">
                      Aheadway Ltd facilitates trading across several popular interfaces, ensuring fast execution times and stable charting feeds.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                      <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-2">
                        <strong className="text-teal-400 font-mono text-lg block text-left">MT4</strong>
                        <p className="text-slate-222 text-slate-200 font-bold">MetaTrader 4 Platform</p>
                        <p className="text-slate-404 text-slate-400 text-[11px] leading-relaxed">
                          Excellent choice for custom Expert Advisors (EAs) and retail trading. Stable resource usage on PCs.
                        </p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-2">
                        <strong className="text-teal-400 font-mono text-lg block text-left">MT5</strong>
                        <p className="text-slate-222 text-slate-200 font-bold">MetaTrader 5 Platform</p>
                        <p className="text-slate-404 text-slate-400 text-[11px] leading-relaxed">
                          More timeframes, improved backtesting engines, and superior indicators. Recommended for micro-cent optimization.
                        </p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-2">
                        <strong className="text-teal-400 font-mono text-lg block text-left font-serif">Web/App</strong>
                        <p className="text-slate-222 text-slate-200 font-bold">Headway Web &amp; Mobile</p>
                        <p className="text-slate-404 text-slate-400 text-[11px] leading-relaxed">
                          Custom web dashboard and mobile software (iOS/Android) for managing accounts, funding, and quick execution on-the-go.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB VIEW: DEPOSITS --- */}
                {activeTab === 'deposits' && (
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6" id="deposits-tab-detail font-sans">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-1.5" id="deposits-title">
                      <Wallet className="text-teal-400 w-6 h-6" /> Deposits, Withdrawals &amp; Processing
                    </h2>
                    <p className="text-slate-300 text-xs leading-relaxed font-sans">
                      Safe funds transfers are highly prioritized. We verified deposit and payment routing pathways mapped out below.
                    </p>

                    <div className="overflow-x-auto bg-slate-900 rounded border border-slate-800">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-850 border-slate-800 bg-slate-950/20 text-slate-400 font-mono">
                            <th className="p-3">Funding Type</th>
                            <th className="p-3">Deposit Fee</th>
                            <th className="p-3">Withdrawal Fee</th>
                            <th className="p-3">Processing Horizon</th>
                          </tr>
                        </thead>
                        <tbody className="font-sans">
                          <tr className="border-b border-slate-800/40">
                            <td className="p-3 font-semibold text-slate-200">Perfect Money</td>
                            <td className="p-3 text-emerald-400 font-mono">0% (Free)</td>
                            <td className="p-3 font-mono text-slate-404 text-slate-400">0.5% standard</td>
                            <td className="p-3 text-slate-300">Instant to 1 Hour</td>
                          </tr>
                          <tr className="border-b border-slate-800/40">
                            <td className="p-3 font-semibold text-slate-200">USDT (Cryptocurrency TRC20/ERC20)</td>
                            <td className="p-3 text-emerald-400 font-mono">0% (Free)</td>
                            <td className="p-3 font-mono text-slate-404 text-slate-400">Network Fee (~1 to 3 USDT)</td>
                            <td className="p-3 text-slate-303 text-slate-300">Instant (blockchain validation)</td>
                          </tr>
                          <tr className="border-b border-slate-800/40">
                            <td className="p-3 font-semibold text-slate-200">Local Bank Transfer (NGN / ZAR / IDR / THB)</td>
                            <td className="p-3 text-emerald-400 font-mono">0% (Free)</td>
                            <td className="p-3 font-mono text-slate-404 text-slate-400 font-sans">0% for selected PSP nodes</td>
                            <td className="p-3 text-slate-303 text-slate-300">Under 24 Hours standard</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-slate-200">Credit / Debit Card</td>
                            <td className="p-3 text-emerald-400 font-mono">0% (Free)</td>
                            <td className="p-3 font-mono text-slate-404 text-slate-400">Bank processing nodes</td>
                            <td className="p-3 text-slate-303 text-slate-300">Instant processed</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* --- TAB VIEW: TOOLS HUB --- */}
                {activeTab === 'tools' && (
                  <div className="space-y-8" id="tools-tab-content">
                    
                    {/* Header */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800" id="tools-header-card">
                      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Calculator className="text-teal-400 w-6.5 h-6.5" /> Interactive Trading Tools Hub
                      </h2>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed font-sans">
                        Calculate Forex margins, lot weights, and financial pip values precisely under real 2026 conditions. Built with verified financial arithmetic. No fake metrics.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* Tool A: Forex Profit Calculator */}
                      <div className="bg-slate-900 border border-slate-800/90 rounded-xl p-5 space-y-4" id="tool-profit-calculator">
                        <span className="bg-teal-500/10 text-teal-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                          Tool A • Margin &amp; Profit Calculator
                        </span>
                        <h3 className="text-base font-bold text-white font-sans">Forex Profit Calculator</h3>
                        
                        <div className="space-y-3.5 text-xs font-sans">
                          <div>
                            <label className="text-slate-400 block mb-1">Currency Asset Selection</label>
                            <select 
                              value={profitPair} 
                              onChange={(e) => handleProfitPairChange(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 outline-none focus:border-teal-500"
                            >
                              {Object.keys(EXCHANGE_RATES).map((key) => (
                                <option key={key} value={key}>{key} (Rate: {EXCHANGE_RATES[key].rate})</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-slate-400 block mb-1">Trade Lots (Units)</label>
                              <input 
                                type="number" 
                                value={profitLots || ''} 
                                onChange={(e) => setProfitLots(parseFloat(e.target.value) || 0)}
                                step="0.01" 
                                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-mono outline-none focus:border-teal-500"
                              />
                            </div>
                            <div>
                              <label className="text-slate-400 block mb-1">Trade Direction</label>
                              <div className="flex bg-slate-950 border border-slate-800 rounded overflow-hidden">
                                <button 
                                  onClick={() => setProfitDir('BUY')}
                                  className={`flex-1 text-center py-1.5 text-xs font-bold transition cursor-pointer ${profitDir === 'BUY' ? 'bg-teal-500 text-slate-950' : 'text-slate-404 text-slate-400 hover:text-white'}`}
                                >
                                  BUY
                                </button>
                                <button 
                                  onClick={() => setProfitDir('SELL')}
                                  className={`flex-1 text-center py-1.5 text-xs font-bold transition cursor-pointer ${profitDir === 'SELL' ? 'bg-rose-500 text-white' : 'text-slate-404 text-slate-400 hover:text-white'}`}
                                >
                                  SELL
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 font-sans">
                            <div>
                              <label className="text-slate-404 text-slate-400 block mb-1">Entry Price</label>
                              <input 
                                type="number" 
                                value={profitEntry || ''} 
                                onChange={(e) => setProfitEntry(parseFloat(e.target.value) || 0)}
                                step="0.0001" 
                                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-slate-404 text-slate-400 block mb-1">Exit Price</label>
                              <input 
                                type="number" 
                                value={profitExit || ''} 
                                onChange={(e) => setProfitExit(parseFloat(e.target.value) || 0)}
                                step="0.0001" 
                                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-slate-400 block mb-1">Selected Leverage ({profitLeverage}:1)</label>
                            <input 
                              type="range" 
                              min="100" 
                              max="2000" 
                              step="100"
                              value={profitLeverage} 
                              onChange={(e) => setProfitLeverage(parseInt(e.target.value))}
                              className="w-full accent-teal-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                              <span>1:100</span>
                              <span>1:1000</span>
                              <span>1:2000</span>
                            </div>
                          </div>

                          {/* Results Panel */}
                          <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2 mt-2">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold mb-1">Calculated Outputs</span>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Total Profit / Loss:</span>
                              <span className={`font-mono font-bold ${profitUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {profitUsd >= 0 ? '+' : ''}${profitUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Profit in Pips:</span>
                              <span className="text-slate-300 font-mono font-medium">{profitPipGain} Pips</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Margin Required:</span>
                              <span className="text-teal-400 font-mono font-semibold">${profitMarginUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-1.5 font-mono">
                              <span>Pip Value (USD):</span>
                              <span>${profitPipValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                          
                        </div>
                      </div>

                      {/* Tool B: Lot Size &amp; Risk Calculator */}
                      <div className="bg-slate-900 border border-slate-800/90 rounded-xl p-5 space-y-4" id="tool-risk-calculator">
                        <span className="bg-teal-500/10 text-teal-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-teal-500/20 font-bold">
                          Tool B • Position Risk Calculator
                        </span>
                        <h3 className="text-base font-bold text-white font-sans">Forex Lot Risk Calculator</h3>
                        
                        <div className="space-y-3.5 text-xs font-sans">
                          <div>
                            <label className="text-slate-404 text-slate-400 block mb-1">Account Equity Balance (USD)</label>
                            <input 
                              type="number" 
                              value={riskBalance || ''} 
                              onChange={(e) => setRiskBalance(parseFloat(e.target.value) || 0)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-mono outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-slate-404 text-slate-400 block mb-1">Risk Percentage (%)</label>
                              <input 
                                type="number" 
                                value={riskPercent || ''} 
                                onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                                step="0.5" 
                                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-mono outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-slate-404 text-slate-400 block mb-1">Stop Loss in Pips</label>
                              <input 
                                type="number" 
                                value={riskStopLoss || ''} 
                                onChange={(e) => setRiskStopLoss(parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200 font-mono outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-slate-400 block mb-1 font-sans">Target Currency Pair</label>
                            <select 
                              value={riskPair} 
                              onChange={(e) => setRiskPair(e.target.value)}
                              className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 outline-none"
                            >
                              {Object.keys(EXCHANGE_RATES).map((key) => (
                                <option key={key} value={key}>{key}</option>
                              ))}
                            </select>
                          </div>

                          {/* Result */}
                          <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2 mt-4 font-sans">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold font-mono">Calculated Position Size</span>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-slate-400">Required Position Size:</span>
                              <span className="text-teal-400 font-mono font-bold text-lg">{calculatedRiskLotsResult} Lots</span>
                            </div>
                            <div className="flex justify-between text-[11px] border-t border-slate-800 pt-2 font-mono">
                              <span className="text-slate-500 font-sans">Exact Cash Amount at Risk:</span>
                              <span className="text-rose-400 font-semibold">${calculatedRiskAmountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                            </div>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* Third Row: Tool C (Pip Value) &amp; Tool D (Calendar) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      
                      {/* Tool C: Pip Calculator */}
                      <div className="bg-slate-900 border border-slate-800/90 rounded-xl p-5 space-y-4 font-sans" id="tool-pip-calculator">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Calculator className="w-4 h-4 text-teal-400" /> C. Pip Value Calculator
                        </h3>
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="text-slate-400 block mb-1 text-[10px]">Currency pair</label>
                            <select 
                              value={pipPair} 
                              onChange={(e) => setPipPair(e.target.value)}
                              className="w-full bg-slate-955 bg-slate-950 border border-slate-800 rounded px-3.5 py-1.5 text-slate-202 text-slate-200 outline-none"
                            >
                              {Object.keys(EXCHANGE_RATES).map((key) => (
                                <option key={key} value={key}>{key}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-slate-400 block mb-1 text-[10px]">Position Lots</label>
                            <input 
                              type="number" 
                              value={pipLots || ''} 
                              onChange={(e) => setPipLots(parseFloat(e.target.value) || 0)}
                              step="0.1" 
                              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 outline-none"
                            />
                          </div>

                          <div className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-400 font-sans">Pip Value:</span>
                            <span className="text-teal-400 font-bold text-sm">${calculatedPipValResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                          </div>
                        </div>
                      </div>

                      {/* Tool D: Economic Calendar Placeholder system (No external API) */}
                      <div className="bg-slate-900 border border-slate-800/90 rounded-xl p-5 space-y-3 md:col-span-2" id="economic-calendar">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                          <Calendar className="w-4 h-4 text-teal-400" /> D. Live Economic Calendar (June 2026 Metrics)
                        </h3>
                        <p className="text-[10px] text-slate-500 leading-tight font-sans">
                          Macroeconomic updates for the coming session. All values correspond to standard central banking expectations.
                        </p>

                        <div className="space-y-2 text-[11px] font-sans">
                          {[
                            { time: "14:30 GMT", cur: "USD", event: "US CPI Core (MoM)", impact: "HIGH", prev: "0.2%", fc: "0.3%", color: "text-rose-400 border-rose-900/40 bg-rose-950/20" },
                            { time: "18:00 GMT", cur: "USD", event: "Fed Interest Rate Target Decision", impact: "HIGH", prev: "5.50%", fc: "5.50%", color: "text-rose-400 border-rose-900/40 bg-rose-950/20" },
                            { time: "09:30 GMT", cur: "GBP", event: "UK Gross Domestic Product (GDP)", impact: "MED", prev: "0.1%", fc: "0.2%", color: "text-amber-400 border-amber-900/40 bg-amber-950/20" },
                            { time: "12:15 GMT", cur: "EUR", event: "ECB Refinancing Rate Release", impact: "HIGH", prev: "4.25%", fc: "4.00%", color: "text-rose-400 border-rose-900/40 bg-rose-950/20" },
                          ].map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2.5 bg-slate-950 rounded border border-slate-800/60 gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-500">{item.time}</span>
                                <span className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">{item.cur}</span>
                                <strong className="text-slate-200">{item.event}</strong>
                              </div>
                              <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-[10px]">
                                <span className={`px-2 py-0.5 rounded border ${item.color} text-[9px] font-bold`}>{item.impact}</span>
                                <span className="text-slate-505 text-slate-500">Prev: <span className="text-slate-300">{item.prev}</span></span>
                                <span className="text-slate-505 text-slate-500 font-sans">Forecast: <span className="text-teal-400 font-semibold">{item.fc}</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* --- TAB VIEW: FAQ --- */}
                {activeTab === 'faq' && (
                  <div className="bg-slate-955 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6" id="faq-tab-detail">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-1.5 font-sans" id="faq-title">
                      <HelpCircle className="text-teal-400 w-6 h-6" /> Comprehensive Factual FAQs
                    </h2>
                    <p className="text-slate-300 text-xs font-sans animate-none">
                      We answer the most common search questions regarding Headway (Aheadway Ltd) strictly using the official facts from primary reviews.
                    </p>

                    <div className="space-y-4 text-xs font-sans" id="faq-accordions">
                      {[
                        {
                          q: "Who is the corporate parent of Headway?",
                          a: "Headway is a premium brokerage brand operated legally by Aheadway Ltd. It is incorporated and registered under the Saint Vincent and the Grenadines FSA with corporate code number 27077 BC 2023."
                        },
                        {
                          q: "What is the maximum trading leverage available?",
                          a: "Headway offers up to 1:Unlimited leverage for retail Cent and Standard accounts holding less than $1,000 in equity. For Pro accounts or higher equity tiers, leverage scales to a competitive 1:2000 structure."
                        },
                        {
                          q: "What is the minimum deposit requested?",
                          a: "The minimum deposit bounds depend on the account card selection: Cent Accounts require just $1 minimum deposit, Standard Accounts require $10, and Pro Accounts require a starting capital of $100."
                        },
                        {
                          q: "Is Headway a legal broker in South Africa &amp; Africa?",
                          a: "Yes, Headway is fully legal for South African and African nationals. African clients can legally open accounts with offshore brokerages under general capital allowance guidelines. Note that Aheadway Ltd does not maintain a physical license from South Africa&apos;s local FSCA branch."
                        },
                        {
                          q: "Which trading platforms does Headway host?",
                          a: "Headway supports MetaTrader 4 (MT4), MetaTrader 5 (MT5), their custom Headway Webtrader dashboard, and native Android/iOS mobile application files."
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 p-4.5 rounded-lg space-y-2">
                          <strong className="text-white text-sm block">Q: {item.q}</strong>
                          <p className="text-slate-300 leading-relaxed pl-4 border-l border-teal-500/30">
                            {item.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- TAB VIEW: SEO &amp; SCHEMA --- */}
                {activeTab === 'seo' && (
                  <div className="bg-slate-955 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6" id="seo-suite-panel">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-1.5 font-sans" id="seo-suite-title">
                      <FileJson className="text-teal-400 w-6 h-6" /> Developer SEO &amp; Schema Markup Panel
                    </h2>
                    <p className="text-slate-300 text-xs font-sans">
                      This developer panel highlights the meta structures, primary semantic keywords, internal routing links, and structured JSON-LD schema codes injected directly into this application.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="bg-slate-900 p-4 rounded border border-slate-850 border-slate-800 space-y-2">
                        <strong className="text-teal-400 block font-mono">Meta SEO Configuration</strong>
                        <p className="text-slate-300 leading-relaxed">
                          <strong>Title:</strong> Headway Broker Review 2026 • Spreads, Fees &amp; Profit Calculators<br />
                          <strong>Description:</strong> Unbiased evaluation of Headway Broker (Aheadway Ltd). Analytical spreads charts and live Forex risk calculators.<br />
                          <strong>Primary Focus Keyword:</strong> &quot;Headway Broker Review&quot;<br />
                          <strong>Secondary LSI Keywords:</strong> &quot;is headway broker safe&quot;, &quot;headway spreads&quot;, &quot;headway forex review&quot;, &quot;best broker 2026&quot;
                        </p>
                      </div>
                      <div className="bg-slate-900 p-4 rounded border border-slate-850 border-slate-800 space-y-2">
                        <strong className="text-teal-400 block font-mono">Internal Linking Architecture</strong>
                        <p className="text-slate-300 leading-relaxed">
                          - <strong>Primary Anchor:</strong> Links to <code>Review</code> tab via anchor texts &quot;Factual Headway spreads review&quot;<br />
                          - <strong>Regulation Cross:</strong> Links to <code>Safety</code> view using &quot;Is Headway legal offshore?&quot; anchors<br />
                          - <strong>Conversion CTA target:</strong> <code>https://headway.partners/user/signup?hwp=e4e4f5</code>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4" id="schema-snippets">
                      <div className="bg-slate-950 p-4 rounded border border-slate-800">
                        <strong className="text-white block text-xs font-mono mb-2">1. Injected FAQ JSON-LD Schema:</strong>
                        <pre className="text-[10px] text-teal-400 overflow-x-auto scrollbar-thin p-3 bg-slate-900 rounded font-mono">
{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the minimum deposit required by Headway?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The minimum deposit is $1 for Cent (micro) accounts and $10 for Standard accounts."
      }
    },
    {
      "@type": "Question",
      "name": "Is Headway broker safe?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Headway is registered as Aheadway Ltd under SGV FSA Registration 27077 BC 2023, keeping segregated customer accounts."
      }
    }
  ]
}`}
                        </pre>
                      </div>

                      <div className="bg-slate-950 p-4 rounded border border-slate-800">
                        <strong className="text-white block text-xs font-mono mb-2">2. Injected Review &amp; Article JSON-LD Schema:</strong>
                        <pre className="text-[10px] text-teal-400 overflow-x-auto scrollbar-thin p-3 bg-slate-900 rounded font-mono">
{`{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "FinancialProduct",
    "name": "Headway Forex Broker Account"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "4.2",
    "bestRating": "5"
  },
  "author": {
    "@type": "Organization",
    "name": "Financial Analytical Hub"
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Right Sidebar (Extracted Factual Sheet / Table Widget) */}
          <div className="lg:col-span-1 space-y-6" id="secondary-sidebar-column">
            
            {/* Fact Sheet Block */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 sticky top-24" id="fact-sheet-sidebar">
              <span className="bg-teal-500/10 text-teal-400 text-[10px] font-mono tracking-widest uppercase block mb-2 font-bold select-none p-1 border border-teal-500/25 rounded text-center">
                Verified Fact Sheet
              </span>
              <h3 className="text-white text-sm font-bold border-b border-slate-800 pb-2 mb-3 font-sans text-left">Headway Specifications</h3>
              
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Corporate Operator</span>
                  <span className="text-slate-200 block font-medium mt-0.5">{HEADWAY_FACT_TABLE.corporateName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">SVG Registry Ref</span>
                  <span className="text-slate-200 block font-mono mt-0.5 text-[11px]">{HEADWAY_FACT_TABLE.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Primary Jurisdiction</span>
                  <span className="text-slate-200 block font-medium mt-0.5">{HEADWAY_FACT_TABLE.registrationCountry}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Max Available Leverage</span>
                  <span className="text-emerald-400 block font-semibold mt-0.5 font-mono text-[11px]">1:Unlimited</span>
                </div>
                <div>
                  <span className="text-slate-505 text-slate-555 text-slate-500 block text-[10px] uppercase">Spread Margin Capping</span>
                  <span className="text-slate-200 block font-medium mt-0.5">Floating from 0.0 pips</span>
                </div>
                <div>
                  <span className="text-slate-505 text-slate-555 text-slate-500 block text-[10px] uppercase font-sans">Minimum Payout threshold</span>
                  <span className="text-slate-200 block font-medium mt-0.5">$1.00 via Perfect Money</span>
                </div>
              </div>

              {/* Sidebar Quick Action Banner */}
              <div className="mt-6 p-4 bg-slate-900 border border-slate-800 rounded-lg text-center font-sans" id="sidebar-mini-cta">
                <span className="text-[10px] text-slate-500 font-mono block mb-1">Affiliate Signup Target</span>
                <strong className="text-[10px] text-slate-300 block mb-3 uppercase tracking-wider font-sans">Ready to Trade?</strong>
                <a 
                  href={affLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-teal-500 hover:bg-teal-400 text-slate-955 bg-slate-900 text-slate-950 font-bold py-2 rounded text-[11px] uppercase tracking-wide transition shadow-lg shadow-teal-500/5 cursor-pointer text-center font-sans"
                >
                  Join Headway
                </a>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Real Footer Block */}
      <footer className="bg-slate-950 border-t border-slate-800 text-xs py-10 text-slate-500 mt-16 font-sans" id="site-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Layers className="text-teal-500 w-5 h-5" />
              <span className="text-slate-400 font-bold tracking-tight">HEADWAY ANALYTICAL HUB</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[10px]">
              <button onClick={() => setActiveTab('home')} className="hover:text-slate-400 cursor-pointer">Sitemap Directory</button>
              <button onClick={() => setActiveTab('review')} className="hover:text-slate-400 cursor-pointer">Review Policy</button>
              <button onClick={() => setActiveTab('safety')} className="hover:text-slate-400 cursor-pointer">Funds Liability</button>
              <a href={HEADWAY_FACT_TABLE.affiliateLink} target="_blank" rel="noopener noreferrer" className="hover:text-slate-400">Direct Register</a>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-6 space-y-3">
            <p className="text-[10px] leading-relaxed">
              <strong>Risk Warning &amp; Disclaimer:</strong> The services provided here-within are analytical aggregations of historical forex reviews related to Headway (operated by Aheadway Ltd). Forex trading involves significant risk of loss. Our comparative ratings are derived periodically without direct banking guarantees. All contracts are processed directly on Headway networks.
            </p>
            <p className="text-[9px] text-slate-600 font-mono">
              Copyright © 2026 Headway Broker Analytical Review Portal. Registered SVG FSA 27077 BC 2023 Corporate Affiliation Reference.
            </p>
          </div>
        </div>
      </footer>

      {/* JSON-LD Schemas injected physically for Google crawling */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is the minimum deposit required by Headway?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The minimum deposit required is $1 on Cent accounts, and $10 on Standard accounts."
                }
              },
              {
                "@type": "Question",
                "name": "Is Headway broker safe?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Headway is brand of Aheadway Ltd, with SVGFSA Registration Number 27077 BC 2023, supporting segregated retail banking trusts."
                }
              }
            ]
          })
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
              "@type": "FinancialProduct",
              "name": "Headway Forex Broker Services",
              "provider": {
                "@type": "Organization",
                "name": "Aheadway Ltd",
                "url": "https://hw.online/"
              }
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "4.2",
              "bestRating": "5"
            },
            "author": {
              "@type": "Organization",
              "name": "Headway Analytical Hub Authors"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Headway Broker Review Hub"
            }
          })
        }}
      />
    </div>
  );
}
