import { TokenBalance, Paginator, createMegaYoursClient, Project, TokenMetadata, TransferHistory } from "@megayours/sdk";
import { useChromia } from "../chromia-connect/chromia-context";
import { createClient } from "postchain-client";
import { env } from "@/env";

export type GammaChainActions = {
  getTokens: (pageSize: number) => Promise<Paginator<TokenBalance>>;
  transferToken: (toBlockchainRid: string, project: Project, collection: string, tokenId: bigint) => Promise<void>;
  getMetadata: (project: Project, collection: string, tokenId: bigint) => Promise<TokenMetadata | null>;
  getTransferHistory: (pageSize: number) => Promise<Paginator<TransferHistory>>;
};

export type GammaChainState = {
  isInitialized: boolean;
  error?: Error;
};

export function useGammaChain(): [GammaChainActions, GammaChainState] {
  const { chromiaSession } = useChromia();

  const state: GammaChainState = {
    isInitialized: !!chromiaSession,
  };

  const actions: GammaChainActions = {
    getTokens: async (pageSize: number) => {
      if (!chromiaSession) {
        throw new Error("Chromia session not initialized");
      }

      const client = createMegaYoursClient(chromiaSession);
      return client.getTokenBalances(chromiaSession.account.id, pageSize);
    },
    getMetadata: async (project: Project, collection: string, tokenId: bigint) => {
      if (!chromiaSession) {
        throw new Error("Chromia session not initialized");
      }
      const client = createMegaYoursClient(chromiaSession);
      const metadata = await client.getMetadata(project, collection, tokenId);
      return metadata;
    },
    transferToken: async (toBlockchainRid: string, project: Project, collection: string, tokenId: bigint) => {
      if (!chromiaSession) {
        throw new Error("Chromia session not initialized");
      }

      console.log(`Transferring token ${tokenId} from ${chromiaSession.account.id} to ${toBlockchainRid}`);
      const client = createMegaYoursClient(chromiaSession);
      const targetChain = await createClient({ directoryNodeUrlPool: env.NEXT_PUBLIC_DIRECTORY_NODE_URL_POOL, blockchainRid: toBlockchainRid });
      return client.transferCrosschain(targetChain, client.account.id, project, collection, tokenId, BigInt(1))
    },
    getTransferHistory: async (pageSize: number) => {
      if (!chromiaSession) {
        throw new Error("Chromia session not initialized");
      }
      const client = createMegaYoursClient(chromiaSession);
      return client.getTransferHistoryByAccount(chromiaSession.account.id, undefined, pageSize);
    }
  };

  return [actions, state];
}