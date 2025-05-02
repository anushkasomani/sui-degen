'use client'
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
export default function Home() {
  const account = useCurrentAccount();

  return (
    <main>
      <ConnectButton />
      {account && (
        <div>
          <p>Connected as: {account.address}</p>
        </div>
      )}
    </main>
  );
}
