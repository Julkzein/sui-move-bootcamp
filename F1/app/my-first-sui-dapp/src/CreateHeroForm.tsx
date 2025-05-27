import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button } from "@radix-ui/themes";
import { useQueryClient } from "@tanstack/react-query";

export const CreateHeroForm = () => {
  const queryClient = useQueryClient();
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction, isPending } =
    useSignAndExecuteTransaction();

  const handleMint = async () => {
    if (!account) {
      alert("Connect your wallet");
      return;
    }
    const tx = new Transaction();

    const hero = tx.moveCall({
      target: `0xcea1a1977caf1451af7f89f7fd248a8913776f69081e00211080471057047a0a::hero::new_hero`,
      arguments: [
        tx.pure.string("My Hero!"),
        tx.pure.u64(10),
        tx.object("0xcea1a1977caf1451af7f89f7fd248a8913776f69081e00211080471057047a0a::hero::Hero"),
      ],
      typeArguments: [],
    });
    const weapon = tx.moveCall({
      target: `0xcea1a1977caf1451af7f89f7fd248a8913776f69081e00211080471057047a0a::hero::new_weapon`,
      arguments: [tx.pure.string("My Weapon!"), tx.pure.u64(100)],
      typeArguments: [],
    });

    tx.moveCall({
      target: `0xcea1a1977caf1451af7f89f7fd248a8913776f69081e00211080471057047a0a::hero::equip_weapon`,
      arguments: [hero, weapon],
      typeArguments: [],
    });

    tx.transferObjects([hero], account.address);

    await signAndExecuteTransaction({
      transaction: tx,
    }).then(async (resp) => {
      await suiClient.waitForTransaction({ digest: resp.digest });
      await queryClient.invalidateQueries({
        queryKey: ["testnet", "getOwnedObjects"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["testnet", "getObject"],
      });
    });
  };

  if (!account) {
    return <div>Wallet not connected</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <Button onClick={handleMint}>Mint Hero</Button>;
};
