import { Transaction } from "@mysten/sui/transactions";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";
import { ENV } from "../env";

export const adminCreateHero = async (name: string) => {
  const adminSigner = getSigner({ secretKey: ENV.ADMIN_SECRET_KEY });
  const userSigner = getSigner({ secretKey: ENV.USER_SECRET_KEY });
  const tx = new Transaction();

  let type_para = tx.moveCall({
    target: `0x1::type_name::get`, 
    typerArguments: ["0x2::coin::COIN<0x2::sui::SUI>"],
    arguments: []
  }); 

  // mint and transfer the hero to the user
  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
    signer: adminSigner,
  });

  await suiClient.waitForTransaction({
    digest: result.digest,
  });

  return result;
};

export const adminCreateArena = async () => {
  const adminSigner = getSigner({ secretKey: ENV.ADMIN_SECRET_KEY });
  const tx = new Transaction();

  // create the arena

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
    signer: adminSigner,
  });

  await suiClient.waitForTransaction({
    digest: result.digest,
  });

  return result;
};

export const userAddHeroToTheArena = async (
  arenaId: string,
  heroId: string
) => {
  const userSigner = getSigner({ secretKey: ENV.USER_SECRET_KEY });
  const tx = new Transaction();

  // add the hero to the arena

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
    signer: userSigner,
  });

  await suiClient.waitForTransaction({
    digest: result.digest,
  });

  return result;
};

export const adminDeleteArena = async (arenaId: string) => {
  const adminSigner = getSigner({ secretKey: ENV.ADMIN_SECRET_KEY });
  const tx = new Transaction();

  // delete the arena

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    options: {
      showObjectChanges: true,
      showEffects: true,
    },
    signer: adminSigner,
  });

  await suiClient.waitForTransaction({
    digest: result.digest,
  });

  return result;
};

export const getHero = async (heroId: string) => {
  // fetch the hero data

  return hero;
};

export const getArena = async (arenaId: string) => {
  // fetch the arena data
  return arena;
};