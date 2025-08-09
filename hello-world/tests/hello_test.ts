import { Clarinet, Tx, Chain, Account } from "https://deno.land/x/clarinet/index.ts";

Clarinet.test({
  name: "Ensure say-hi returns Hello, world!",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!; // use ! because we know it exists

    let block = chain.mineBlock([
      Tx.contractCall("hello", "say-hi", [], deployer.address),
    ]);

    block.receipts[0].result.expectOk().expectUtf8("Hello, world!");
  },
});
