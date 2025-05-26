import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const CreateHeroForm = () => {
  const queryClient = useQueryClient();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  const [name, setName] = useState("");

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!account) {
      window.alert("Please connect your wallet first");
      return;
    }

    const tx = new Transaction();
    const hero = tx.moveCall({
      target: `0x639b81953dd3790ceaee2721bb5608517d101ef1911062d48bf0726296251e11::hero::new_hero`,
      arguments: [
        tx.pure.string(name),
        tx.pure.u64(100),
        tx.object(
          "0x1678dd23b8e348e2bd52753f268af04fda889cd5bb8736d1d6d6a92530344e7b",
        ),
      ],
    });
    tx.transferObjects([hero], account.address);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: async (result) => {
          console.log("executed tx:", result);
          await suiClient.waitForTransaction({ digest: result.digest });
          await queryClient.invalidateQueries({
            queryKey: ["testnet", "getOwnedObjects"],
          });
          await queryClient.invalidateQueries({
            queryKey: ["testnet", "getObject"],
          });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>I am the create hero form</div>
      <input
        name="name"
        type="text"
        placeholder="Hero Name"
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setName(event.target.value)
        }
      />
      <button type="submit">Create Hero</button>
    </form>
  );
};