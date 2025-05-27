# 🎮 Petropia – AI-Powered NFT Gaming on Sui Blockchain

Where retro gaming meets blockchain innovation, and your digital companions become legendary NFTs.

**Petropia** is an immersive degen-driven memeverse where players create, mint, train, and evolve unique AI-generated NFT pets. Built on the Sui blockchain, every interaction—minting, feeding, training, battling—is recorded on-chain, making your pet's journey truly eternal.

### 🧠 Smart Contract Details (Sui Network)

- **Package ID**: [`0x017694b3f149a2bae73306e386ab7b423e84fe1daa5ca05e7e6514d8157fa348`](https://suiexplorer.com/object/0x017694b3f149a2bae73306e386ab7b423e84fe1daa5ca05e7e6514d8157fa348?network=testnet)
- **NFT Collection ID**: [`0x03137402436274b7d1f15454f885f38512b8c344532050023ffb45faf968c35c`](https://suiexplorer.com/object/0x03137402436274b7d1f15454f885f38512b8c344532050023ffb45faf968c35c?network=testnet)
- **Battle Collection ID**: [`0x262cb60cb3ba40e58a9c169f3685b6e7856735e96577f013ca9080d0195e2fce`](https://suiexplorer.com/object/0x262cb60cb3ba40e58a9c169f3685b6e7856735e96577f013ca9080d0195e2fce?network=testnet)



**Live Application:** [Petropia](https://petropia.vercel.app/)

---

## 🧬 What Is Petropia?

Petropia transforms traditional NFTs into living, evolving digital companions. Combining AI-powered generation, retro pixel art aesthetics, and blockchain technology, it creates a vibrant ecosystem where your pets grow stronger through care and interaction.

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
- In Every Feed or Train Interaction, you earn TAILZ
- Help other players' pets grow stronger through community interaction

### **🦋 Evolution Mechanics**
- Pets evolve when `Points ≥ 15 × Current Level`
- Each evolution adds new story elements and enhanced abilities
- **Points Formula:** `(Happiness + Power) × Multiplier`

### **🏆 Pet Collection**
- Display the most powerful and beloved pets
- Featured pets gain special recognition in the community
- Showcase your prized companions to the world

### ** Pet Battles**
- Battle Pets against each other.
- Stake TAILZ on Pet.
- Winner Pet's owner gets 50% of the winning stakes/rewards
- Stakers of Winning Pet get the rest of the rewards

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

### **3. 🍖 Feed & 🏋️ Train to Earn TAILZ**
**Feed Your Pet:**
- +5 Happiness
- +1 Power  
- +0.1 Multiplier

**Train Your Pet:**
- +1 Happiness
- +5 Power
- +0.15 Multiplier

### **4. 🦋 Watch Them Evolve**
When your pet reaches `Points ≥ 15 × Current Level`, they can evolve to the next stage, unlocking new abilities and story elements.

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
![image](https://github.com/user-attachments/assets/1f7e20e5-ee1c-4465-9a95-c34560370d2d)



### 🎨 Pet Creation
![image](https://github.com/user-attachments/assets/9c5f2046-09f7-45ae-82b4-1e7cfe27651e)


### 📊 Pet Collection
![image](https://github.com/user-attachments/assets/7d9e2eb8-7227-4d79-996e-41d4e3873416)


### 🎯 Battle Arena: Pit Pets Against Each Other

![image](https://github.com/user-attachments/assets/dd836b3d-4200-459b-b62b-cd12bff940f4)

##  🎯 Battle Arena: Ongoing Battles

![image](https://github.com/user-attachments/assets/bd42bdbb-4adb-44a5-b088-47a7ee721122)



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
---

**Built with ❤️ for the future of gaming and NFTs**

*Petropia - Where every pixel tells a story, and every story becomes legend.*

