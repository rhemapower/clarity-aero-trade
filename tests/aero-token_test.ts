import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure can create token with valid params",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const result = chain.mineBlock([
      Tx.contractCall("aero-token", "create-token", 
        [types.uint(1), 
         types.ascii("Boeing 737"),
         types.ascii("N12345"),
         types.ascii("Boeing")], 
        deployer.address)
    ]).receipts[0].result;
    
    assertEquals(result.expectOk(), true);
  },
});

Clarinet.test({
  name: "Ensure non-owner cannot create token",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get("wallet_1")!;
    const result = chain.mineBlock([
      Tx.contractCall("aero-token", "create-token",
        [types.uint(1),
         types.ascii("Boeing 737"),
         types.ascii("N12345"), 
         types.ascii("Boeing")],
        wallet1.address)
    ]).receipts[0].result;

    assertEquals(result.expectErr(), 100);
  },
});
