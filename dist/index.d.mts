interface components {
  schemas: {
    ArtistClubBlacklistMemberDto: {
      address?: string | null
      alias?: string | null
    }
    ArtistClubDto: {
      artist?: string | null
      artistAlias?: string | null
      contract?: string | null
      name?: string | null
      description?: string | null
      bannerUri?: string | null
      thumbnailUri?: string | null
      /** Format: int64 */
      memberCount?: number
      /** Format: int64 */
      stakingAkaDao?: number
      /** Format: int64 */
      pendingAkaDao?: number
      /** Format: int64 */
      totalMaxAkaDao?: number
      /** Format: int64 */
      singleMinAkaDao?: number
      /** Format: int64 */
      singleMaxAkaDao?: number
      /** Format: int64 */
      reward?: number
      periodRewards?: {
        [key: string]: number | undefined
      } | null
      /** Format: int64 */
      totalReward?: number
      /** Format: date-time */
      createTime?: string
    }
    ArtistClubIncomeRecordDto: {
      operationHash?: string | null
      /** Format: date-time */
      timestamp?: string
      from?: string | null
      fromAlias?: string | null
      /** Format: int64 */
      incomeAmount?: number
    }
    ArtistClubIncomeRecordsDto: {
      records: components["schemas"]["ArtistClubIncomeRecordDto"][]
    }
    ArtistClubMemberDto: {
      address?: string | null
      alias?: string | null
      /** Format: int64 */
      stakingAkaDao?: number
      /** Format: int64 */
      pendingAkaDao?: number
      /** Format: int64 */
      reward?: number
      /** Format: date-time */
      joinTime?: string
    }
    ArtistClubMembersDto: {
      members: components["schemas"]["ArtistClubMemberDto"][]
      /** Format: int64 */
      count: number
    }
    ArtistClubStakeDto: {
      artist?: string | null
      artistAlias?: string | null
      clubContract?: string | null
      clubName?: string | null
      clubThumbnailUri?: string | null
      /** Format: int64 */
      clubStakingAkaDao?: number
      /** Format: int64 */
      clubPendingAkaDao?: number
      /** Format: int64 */
      stakingAkaDao?: number
      /** Format: int64 */
      pendingAkaDao?: number
      /** Format: int64 */
      reward?: number
      /** Format: date-time */
      joinTime?: string
    }
    ArtistClubStakesDto: {
      stakes?: components["schemas"]["ArtistClubStakeDto"][] | null
      /** Format: int64 */
      count?: number
    }
    ArtistClubsDto: {
      artistClubs: components["schemas"]["ArtistClubDto"][]
      /** Format: int64 */
      count: number
    }
    AuctionDto: {
      contract?: string | null
      /** Format: int32 */
      auctionId?: number
      token?: components["schemas"]["Fa2TokenDto"]
      /** Format: int64 */
      auctionAmount?: number
      /** Format: int64 */
      startPrice?: number
      /** Format: int64 */
      directPrice?: number
      /** Format: int64 */
      currentBidPrice?: number
      /** Format: int64 */
      currentStorePrice?: number
      currentBidder?: string | null
      bidHistories?: components["schemas"]["BidHistoryDto"][] | null
      /** Format: int32 */
      raisePercentage?: number
      issuer?: string | null
      alias?: string | null
      /** Format: date-time */
      issueTime?: string
      /** Format: date-time */
      dueTime?: string
      title?: string | null
      description?: string | null
    }
    AuctionsDto: {
      auctions: components["schemas"]["AuctionDto"][]
      /** Format: int64 */
      count: number
    }
    BidHistoryDto: {
      /** Format: int64 */
      bidPrice?: number
      bidder?: string | null
      alias?: string | null
      /** Format: date-time */
      timestamp?: string
    }
    BundleDto: {
      contract?: string | null
      /** Format: int32 */
      bundleId?: number
      bundleItems?: components["schemas"]["BundleItemDto"][] | null
      /** Format: int64 */
      bundleAmount?: number
      /** Format: int64 */
      bundleTotal?: number
      /** Format: int64 */
      xtzPerBundle?: number
      issuer?: string | null
      alias?: string | null
      /** Format: date-time */
      issueTime?: string
      title?: string | null
      description?: string | null
    }
    BundleItemDto: {
      /** Format: int64 */
      amount?: number
      token?: components["schemas"]["Fa2TokenDto"]
    }
    BundlesDto: {
      bundles: components["schemas"]["BundleDto"][]
      /** Format: int64 */
      count: number
    }
    Fa2TokenAttribute: {
      name?: string | null
      value?: string | null
    }
    Fa2TokenDto: {
      contract?: string | null
      /** Format: int32 */
      tokenId?: number
      creators?: string[] | null
      aliases?: string[] | null
      /** @deprecated */
      royalties?: number[] | null
      royaltyShares?: {
        [key: string]: number | undefined
      } | null
      royaltyShareAliases?: {
        [key: string]: string | undefined
      } | null
      owners?: {
        [key: string]: number | undefined
      } | null
      ownerAliases?: {
        [key: string]: string | undefined
      } | null
      /** Format: int64 */
      amount?: number
      /** Format: int64 */
      highestSoldPrice?: number | null
      /** Format: date-time */
      highestSoldTime?: string | null
      /** Format: int64 */
      recentlySoldPrice?: number | null
      /** Format: date-time */
      recentlySoldTime?: string | null
      sale?: Record<string, unknown> | null
      metadataUri?: string | null
      name?: string | null
      description?: string | null
      mimeType?: string | null
      tags?: string[] | null
      artifactUri?: string | null
      displayUri?: string | null
      thumbnailUri?: string | null
      rights?: string | null
      rightUri?: string | null
      attributes?: components["schemas"]["Fa2TokenAttribute"][] | null
      additionalInfo?: Record<string, unknown> | null
    }
    Fa2TokenRecordDto: {
      /** Format: date-time */
      timestamp?: string
      contract?: string | null
      /** Format: int32 */
      tokenId?: number | null
      tokenName?: string | null
      tokenThumbnailUri?: string | null
      from?: string | null
      fromAlias?: string | null
      to?: string | null
      toAlias?: string | null
      address?: string | null
      alias?: string | null
      /** Format: int64 */
      amount?: number
      /** Format: int64 */
      price?: number | null
      saleContract?: string | null
      /** Format: int32 */
      saleId?: number | null
      saleTitle?: string | null
      type?: string | null
    }
    Fa2TokenRecordsDto: {
      records: components["schemas"]["Fa2TokenRecordDto"][]
    }
    Fa2TokensDto: {
      tokens: components["schemas"]["Fa2TokenDto"][]
      /** Format: int64 */
      count: number
    }
    GachaDto: {
      contract?: string | null
      /** Format: int32 */
      gachaId?: number
      gachaItems?: components["schemas"]["GachaItemDto"][] | null
      lastPrizeItems?: components["schemas"]["GachaItemDto"][] | null
      /** Format: int64 */
      gachaAmount?: number
      /** Format: int64 */
      gachaTotal?: number
      /** Format: int64 */
      xtzPerGacha?: number
      issuer?: string | null
      alias?: string | null
      /** Format: date-time */
      issueTime?: string
      /** Format: date-time */
      cancelTime?: string
      title?: string | null
      description?: string | null
    }
    GachaItemDto: {
      /** Format: int64 */
      amount?: number
      /** Format: int64 */
      total?: number
      token?: components["schemas"]["Fa2TokenDto"]
    }
    GachaRecordDto: {
      /** Format: date-time */
      timestamp?: string
      contract?: string | null
      /** Format: int32 */
      tokenId?: number
      tokenName?: string | null
      collector?: string | null
      alias?: string | null
      /** Format: int64 */
      amount?: number
    }
    GachaRecordsDto: {
      records: components["schemas"]["GachaRecordDto"][]
    }
    GachasDto: {
      gachas: components["schemas"]["GachaDto"][]
      /** Format: int64 */
      count: number
    }
    HotFa2TokenDto: {
      token?: components["schemas"]["Fa2TokenDto"]
      /** Format: int64 */
      volume?: number
    }
    HotFa2TokensDto: {
      tokens: components["schemas"]["HotFa2TokenDto"][]
    }
    OfferDto: {
      contract?: string | null
      /** Format: int32 */
      offerId?: number
      token?: components["schemas"]["Fa2TokenDto"]
      /** Format: int64 */
      offerAmount?: number
      /** Format: int64 */
      xtzPerToken?: number
      issuer?: string | null
      alias?: string | null
      /** Format: date-time */
      issueTime?: string
    }
    OffersDto: {
      offers: components["schemas"]["OfferDto"][]
      /** Format: int64 */
      count: number
    }
    SwapDto: {
      contract?: string | null
      /** Format: int32 */
      swapId?: number
      token?: components["schemas"]["Fa2TokenDto"]
      /** Format: int64 */
      swapAmount?: number
      /** Format: int64 */
      xtzPerToken?: number
      revenueShares?: {
        [key: string]: number | undefined
      } | null
      issuer?: string | null
      alias?: string | null
      /** Format: date-time */
      issueTime?: string
    }
    SwapsDto: {
      swaps: components["schemas"]["SwapDto"][]
      /** Format: int64 */
      count: number
    }
    TopCreatorDto: {
      creator?: string | null
      alias?: string | null
      /** Format: int64 */
      volume?: number
    }
    TopCreatorsDto: {
      topCreators: components["schemas"]["TopCreatorDto"][]
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}

type Token = components["schemas"]["Fa2TokenDto"];
type TezosAddress = `KT${string}` | `tz${string}`;
declare enum MediaLevel {
    "thumbnail" = 0,
    "display" = 1,
    "artifact" = 2
}
declare enum MediaType {
    "BMP" = "image/bmp",
    "GIF" = "image/gif",
    "JPEG" = "image/jpeg",
    "PNG" = "image/png",
    "SVG" = "image/svg+xml",
    "WEBP" = "image/webp",
    "MP4" = "video/mp4",
    "OGV" = "video/ogg",
    "QUICKTIME" = "video/quicktime",
    "WEBM" = "video/webm",
    "GLB" = "model/gltf-binary",
    "GLTF" = "model/gltf+json",
    "MP3" = "audio/mpeg",
    "OGA" = "audio/ogg",
    "PDF" = "application/pdf",
    "X_DIRECTORY" = "application/x-directory",
    "ZIP" = "application/zip",
    "ZIP1" = "application/x-zip-compressed",
    "ZIP2" = "multipart/x-zip"
}
type WalletProps = {
    wallet: string;
    alias?: string;
    full?: boolean;
    digits?: number;
};

declare const showWallet: ({ wallet, alias, full, digits, }: WalletProps) => string;
declare const getIpfsSrc: (gateway: string, url: string) => string;
declare const lookUpWallet: (identifier: string) => Promise<string>;

type WalletStatus = "connected" | "disconnected" | "connecting" | "disconnecting";

declare class AkaSwapUser {
    private walletStatus;
    private walletAddress;
    private identifier;
    getWalletStatus(): WalletStatus;
    getWalletAddress(): string | null;
    getIdentifier(): string | null;
    connectWallet(): Promise<void>;
    disconnectWallet(): Promise<void>;
}
declare const akaSwapUser: AkaSwapUser;

export { MediaLevel, MediaType, type TezosAddress, type Token, type WalletProps, type WalletStatus, akaSwapUser, getIpfsSrc, lookUpWallet, showWallet };
