import { SuiParsedData } from "@mysten/sui/dist/cjs/client";
import { suiClient } from "../suiClient";

/**
 * Gets the object id of a Weapon that is attached to a Hero object by the hero's object id.
 * We need to get the Hero object, and find the value of the corresponding nested field.
 */
export const getWeaponIdOfHero = async (
  heroId: string
): Promise<string | null> => {
  const hero = await suiClient
    .getObject({
      id: heroId,
      options: {
        showContent: true,
      },
    })
    .then((res) => res.data);
  const { fields } = hero?.content as Extract<
    SuiParsedData,
    { dataType: "moveObject" }
  >;
  const {
    weapon: {
      fields: {
        id: { id },
      },
    },
  } = fields as {
    weapon: { fields: { id: { id: string | null } } };
  };
  return id;
};