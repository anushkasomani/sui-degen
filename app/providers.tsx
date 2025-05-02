'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { 
  SuiClientProvider,
  WalletProvider,
  createNetworkConfig 
} from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'

const queryClient = new QueryClient()

const { networkConfig } = createNetworkConfig({
  devnet: { url: getFullnodeUrl('devnet') },
  mainnet: { url: getFullnodeUrl('mainnet') }
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
        <WalletProvider>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
