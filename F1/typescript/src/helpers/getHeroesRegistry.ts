import { suiClient } from "../suiClient";
import { ENV } from "../env";
import { SuiParsedData } from "@mysten/sui/client";

interface HeroesRegistry {
  ids: string[];
  counter: number;
}
/**
 * Gets the Heroes ids in the Hero Registry.
 * We need to get the Hero Registry object, and return the contents of the ids vector.
 */
export const getHeroesRegistry = async (): Promise<HeroesRegistry> => {
  const registry = await suiClient
    .getObject({
      id: ENV.HEROES_REGISTRY_ID,
      options: {
        showContent: true,
      },
    })
    .then((res) => res.data);
  const { fields } = registry?.content as Extract<
    SuiParsedData,
    { dataType: "moveObject" }
  >;
  const { counter, ids } = fields as {
    counter: string;
    ids: string[];
  };
  return {
    ids,
    counter: parseInt(counter),
  };
};