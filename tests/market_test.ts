import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure can list token for sale",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    
    // First create token
    chain.mineBlock([
      Tx.contractCall("aero-token", "create-token",
        [types.uint(1),
         types.ascii("Boeing 737"),
         types.ascii("N12345"),
         types.ascii("Boeing")],
        deployer.address)
    ]);

    // Then list for sale
    const listResult = chain.mineBlock([
      Tx.contractCall("market", "list-for-sale",
        [types.uint(1), types.uint(1000000)],
        deployer.address)
    ]).receipts[0].result;

    assertEquals(listResult.expectOk(), true);
  },
});

Clarinet.test({
  name: "Ensure can purchase listed token",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const buyer = accounts.get("wallet_1")!;

    // Setup: Create and list token
    chain.mineBlock([
      Tx.contractCall("aero-token", "create-token",
        [types.uint(1),
         types.ascii("Boeing 737"), 
         types.ascii("N12345"),
         types.ascii("Boeing")],
        deployer.address),
      Tx.contractCall("market", "list-for-sale",
        [types.uint(1), types.uint(1000000)],
        deployer.address)
    ]);

    // Purchase token
    const purchaseResult = chain.mineBlock([
      Tx.contractCall("market", "purchase",
        [types.uint(1)],
        buyer.address)
    ]).receipts[0].result;

    assertEquals(purchaseResult.expectOk(), true);
  },
});
