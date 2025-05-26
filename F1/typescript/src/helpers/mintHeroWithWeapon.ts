import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { ENV } from "../env";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";
import { getAddress } from "./getAddress";

/**
 * Builds, signs, and executes a transaction for:
 * * minting a Hero NFT
 * * minting a Sword NFT
 * * attaching the Sword to the Hero
 * * transferring the Hero to the signer
 */
export const mintHeroWithWeapon =
  async (): Promise<SuiTransactionBlockResponse> => {
    const tx = new Transaction();

    const hero = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::new_hero`,
      arguments: [
        tx.pure.string("Batman"),
        tx.pure.u64(100),
        tx.object(ENV.HEROES_REGISTRY_ID),
      ],
    });
    const weapon = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::new_weapon`,
      arguments: [
        tx.pure.string("Batmobile"),
        tx.pure.u64(100), // attack
      ],
    });
    tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::equip_weapon`,
      arguments: [hero, weapon],
    });
    tx.transferObjects([hero], getAddress({ secretKey: ENV.USER_SECRET_KEY }));

    return suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: getSigner({ secretKey: ENV.USER_SECRET_KEY }),
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
  };