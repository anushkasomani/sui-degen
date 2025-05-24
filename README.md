# 🎮 Petropia – AI-Powered NFT Gaming on Sui Blockchain

Where retro gaming meets blockchain innovation, and your digital companions become legendary NFTs.

**Petropia** is an immersive web3 gaming platform where players create, mint, train, and evolve unique AI-generated NFT pets. Built on the Sui blockchain, every interaction—minting, feeding, training, battling—is recorded on-chain, making your pet's journey truly eternal.

### 🧠 Smart Contract Details (Sui Network)

- **Package ID**: [`0x61aacd...164c9`](https://suiexplorer.com/object/0x61aacdc12b7dc69abe385fc684c7fa32fb4468a90db95a46cafb247c2df164c9?network=mainnet)
- **NFT Collection ID**: [`0x3575...acbf`](https://suiexplorer.com/object/0x35758890d2b392dd2699ef1bb9a07ce5c1fdeb70b10bccf8e6ed418ddc5bacbf?network=mainnet)
- **Global State Object ID**: [`0xe328...be1a`](https://suiexplorer.com/object/0xe3286f231cc2312b0212406dd98e5cfee68af391eb212d46580c238e5d17be1a?network=mainnet)
- **Battle Collection ID**: [`0xede2...85f3`](https://suiexplorer.com/object/0xede26f76990c34667fa4044354c4552af6780b35d24e6fd56455175824ae85f3?network=mainnet)
- **NFT Type**: `0x61aacdc12b7dc69abe385fc684c7fa32fb4468a90db95a46cafb247c2df164c9::tailz::TAILZ`


**Live Application:** [Petropia](https://pixelated-pets.vercel.app/)

---

## 🧬 What Is Petropia?

Petropia transforms traditional NFTs into living, evolving digital companions. Combining AI-powered generation, retro pixel art aesthetics, and blockchain technology, it creates a vibrant gaming ecosystem where your pets grow stronger through care and interaction.

Unlike static NFT collections, Petropia offers a dynamic experience where each pet has unique stats, evolves over time, and can be trained by the entire community.

---

## 🌟 Key Features

### **🪄 AI-Powered Pet Generation**
- Use advanced AI to create unique Petropia with custom backstories
- Generate one-of-a-kind appearances, names, and personality traits
- Each pet starts as a Baby Pet (Level 1) with room to grow

### **⛓️ Sui Blockchain Integration**
- Mint pets as NFTs directly on the Sui network
- All interactions are recorded on-chain for transparency
- Fast, low-cost transactions powered by Sui's architecture

### **🍖 Community Training System**
- **Feed Any Pet:** +5 Happiness, +1 Power, +0.1 Multiplier
- **Train Any Pet:** +1 Happiness, +5 Power, +0.15 Multiplier
- Help other players' pets grow stronger through community interaction

### **🦋 Evolution Mechanics**
- Pets evolve when `Points ≥ 20 × Current Level`
- Each evolution adds new story elements and enhanced abilities
- **Points Formula:** `(Happiness + Power) × Multiplier`

### **🏆 Hall of Fame Showcase**
- Display the most powerful and beloved pets
- Featured pets gain special recognition in the community
- Showcase your prized companions to the world

### **🤝 Social Features**
- Community-driven pet care system
- Share and celebrate pets together
- Interactive pet profiles with detailed backstories

---

## 🎮 How to Play

### **1. 🔑 Connect Your Wallet**
Connect your Sui-compatible wallet to enter the pixelated pet universe.

### **2. 🪄 Create Your Unique Pet**
- Use AI prompts to generate your pet's appearance
- Craft a unique backstory and choose a quirky name
- Mint your pet as an NFT to make it yours forever

### **3. 🍖 Feed & 🏋️ Train**
**Feed Your Pet:**
- +5 Happiness
- +1 Power  
- +0.1 Multiplier

**Train Your Pet:**
- +1 Happiness
- +5 Power
- +0.15 Multiplier

### **4. 🦋 Watch Them Evolve**
When your pet reaches `Points ≥ 20 × Current Level`, they can evolve to the next stage, unlocking new abilities and story elements.

### **5. 🏆 Showcase Your Collection**
Display your trained pets in the Hall of Fame and share their journey with the community.

---

## 🏗️ Project Architecture

 ```bash
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Blockchain    │    │   AI Services   │
│   (Next.js)     │◄──►│   (Sui Network) │    │   (Gemini AI)   │
│                 │    │                 │    │                 │
│ • React Query   │    │ • Smart         │    │ • Image Gen     │
│ • Tailwind CSS  │    │   Contracts     │    │ • Story Gen     │
│ • Sui dApp Kit  │    │ • NFT Storage   │    │ • Backstories   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```



---

## 📸 Screenshots

### 🏠 Landing Page
*Beautiful pixelated homepage with animated pet companions*

### 🎨 Pet Creation
*AI-powered pet generation with customization options*

### 🏆 Hall of Fame
*Showcase of the most legendary pets in the community*

### 📊 Pet Collection
*Your personal collection with detailed stats and training options*

### 🎯 Training Interface
*Interactive feeding and training system*

---

## 🛠️ Tech Stack

| **Category**     | **Technology**                    | **Purpose**                      |
|------------------|-----------------------------------|----------------------------------|
| **Frontend**     | Next.js 14, TypeScript          | React framework & type safety   |
| **Styling**      | Tailwind CSS, Custom Fonts      | Responsive UI & pixel aesthetics |
| **Blockchain**   | Sui Network, Move Language       | Smart contracts & NFT storage   |
| **Wallet**       | Sui dApp Kit, Wallet Adapters   | Seamless wallet integration     |
| **Data**         | React Query, Sui Client          | State management & blockchain queries |
| **AI**           | Gemini AI, Custom Prompts       | Pet generation & storytelling   |
| **Deployment**   | Vercel, IPFS                     | Hosting & decentralized storage |

---

## 🚀 Getting Started

### Installation Process:

1. **Clone the Repo**

```bash
git clone https://github.com/anushkasomani/sui-degen
cd sui-degen
```
2. **create .env**
```bash
GEMINI_API_KEY=
PINATA_JWT=
PINATA_API_KEY=
PINATA_SECRET_KEY=
NEXT_PUBLIC_GATEWAY_URL=
```
3. **run the development server**
```bash 
npm run dev
```
4.**Go to LocalHost**
```bash
http://localhost:3000/
```
## Our Team ✨

We are a team of three developers:

### Anushka Somani  
**Role:** Frontend & Backend Developer [Github](https://github.com/anushkasomani)

### Akash Mundari  
**Role:** Backend & Smart Contract Developer 
[Github](https://github.com/AkashMundari)


### Avula Ramswaroop  
**Role:** Frontend & Deployment 
[Github](https://github.com/AvulaRamSwaroop)

---


## 🙏 Acknowledgments

- Sui Foundation for blockchain infrastructure
- Gemini AI for generation capabilities
- The pixel art community for inspiration
- Our amazing beta testers and early adopters

---

**Built with ❤️ for the future of gaming and NFTs**

*Petropia - Where every pixel tells a story, and every story becomes legend.*

