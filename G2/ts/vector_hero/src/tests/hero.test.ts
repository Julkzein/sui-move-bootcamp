import { ENV } from "../env";
import { createHero, getHero } from "../helpers/hero";

describe("Hero", () => {
  it("should create a hero with attributes", async () => {
    const result = await createHero("Hero 1", [
      "fire",
      "water",
      "earth",
      "air",
    ]);
    expect(result.effects?.status.status).toBe("success");
    expect(result.effects?.created?.length).toBe(1);

    let hero = result.effects?.created?.[0];
    expect(hero).toBeDefined();

    const heroData = await getHero(hero?.reference.objectId!);
    expect(heroData).toBeDefined();
    // @ts-ignore
    expect(heroData.data?.content?.fields.name).toBe("Hero 1");
    // @ts-ignore
    expect(heroData.data?.content?.fields.attributes.length).toBe(4);

    // @ts-ignore
    const attributes = heroData.data?.content?.fields.attributes;
    expect(attributes).toBeDefined();
    expect(attributes?.length).toBe(4);

    const expectedAttributes = ["fire", "water", "earth", "air"];
    expect(attributes).toEqual(
      expect.arrayContaining(
        expectedAttributes.map((name) =>
          expect.objectContaining({
            fields: {
              level: "100",
              name: name,
            },
            type: `${ENV.PACKAGE_ID}::hero::Attribute`,
          })
        )
      )
    );
  });
});