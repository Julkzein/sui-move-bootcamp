import { SuiObjectChange, SuiObjectChangeCreated } from "@mysten/sui/client";
import { ENV } from "../env";

interface Args {
  objectChanges: SuiObjectChange[];
}

interface Response {
  heroesIds: string[];
  weaponsIds: string[]
}

/**
 * Parses the provided SuiObjectChange[].
 * Extracts the IDs of the created Heroes and Weapons NFTs, filtering by objectType.
 */
export const parseCreatedObjectsIds = ({ objectChanges }: Args): Response => {
  // TODO: Implement the function
  const weaponsIds = objectChanges
    .filter(
      (item) => item.type === "created" && item.objectType === `${ENV.PACKAGE_ID}::hero::Weapon`
    )
    .map((item) => (item as SuiObjectChangeCreated).objectId);

  const heroesIds = objectChanges
    .filter(
      (item) => item.type === "created" && item.objectType === `${ENV.PACKAGE_ID}::hero::Hero`
    )
    .map((item) => (item as SuiObjectChangeCreated).objectId);

  return {
    weaponsIds,
    heroesIds,
  };
};
