import { adminCreateHero, adminCreateArena, getHero, userAddHeroToTheArena, getHeroFromArena } from "../helpers/hero";

describe("Hero", () => {
  it("should create a hero add them to the arena and verify that it's no more accessible off-chain", async () => {
    const heroResult = await adminCreateHero("Hero 1");
    expect(heroResult.effects?.status.status).toBe("success");
    expect(heroResult.effects?.created?.length).toBe(1);
    const hero = heroResult.effects?.created?.[0];
    expect(hero).toBeDefined();
    const heroId = hero?.reference.objectId!;


    const arenaResult = await adminCreateArena();
    expect(arenaResult.effects?.status.status).toBe("success");
    expect(arenaResult.effects?.created?.length).toBe(1);
    const arena = arenaResult.effects?.created?.[0];
    expect(arena).toBeDefined();
    const arenaId = arena?.reference.objectId!;

    const userAddHeroToTheArenaResult = await userAddHeroToTheArena(
      arenaId,
      heroId
    );
    expect(userAddHeroToTheArenaResult.effects?.status.status).toBe("success");

    const heroData = await getHero(heroId);
    expect(heroData.error?.code).toBe("deleted");
  });

  it("should create a hero add them to the arena be able to access it through the arena", async () => {
    const heroResult = await adminCreateHero("Hero 1");
    expect(heroResult.effects?.status.status).toBe("success");
    expect(heroResult.effects?.created?.length).toBe(1);
    const hero = heroResult.effects?.created?.[0];
    expect(hero).toBeDefined();
    const heroId = hero?.reference.objectId!;


    const arenaResult = await adminCreateArena();
    expect(arenaResult.effects?.status.status).toBe("success");
    expect(arenaResult.effects?.created?.length).toBe(1);
    const arena = arenaResult.effects?.created?.[0];
    expect(arena).toBeDefined();
    const arenaId = arena?.reference.objectId!;

    const userAddHeroToTheArenaResult = await userAddHeroToTheArena(
      arenaId,
      heroId
    );
    expect(userAddHeroToTheArenaResult.effects?.status.status).toBe("success");

    const heroData = await getHeroFromArena(arenaId);

    // console.log(JSON.stringify(heroData, null, 2));
    // @ts-ignore
    expect(heroData.data!.owner.ObjectOwner).toBe(arenaId);
    // @ts-ignore
    expect(heroData.data!.content.fields.value.fields.id.id).toBe(heroId);
    // @ts-ignore
    expect(heroData.data!.content.fields.value.fields.name).toBe("Hero 1");
  });
});