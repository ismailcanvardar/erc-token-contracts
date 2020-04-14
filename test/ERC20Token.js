const ERC20Token = artifacts.require("./ERC20Token.sol");

contract("ERC20Token", accounts => {
  const account_one = accounts[0];
  const account_two = accounts[1];

  it("check initialization values", async () => {
    let tokenInstance = await ERC20Token.deployed();
    let tokenName = await tokenInstance.name();
    let tokenSymbol = await tokenInstance.symbol();
    let tokenDecimals = await tokenInstance.decimals();

    assert.equal(tokenName, "Token", "token's name is incorrect");
    assert.equal(tokenSymbol, "TKN", "token's symbol is incorrect");
    assert.equal(tokenDecimals, 18, "incorrect decimals");
  });

  it("check totalSupply and creator's balance", async () => {
    let tokenInstance = await ERC20Token.deployed();
    let totalSupply = await tokenInstance.totalSupply();
    let balanceOfAccountOne = await tokenInstance.balanceOf.call(account_one);

    assert.equal(totalSupply, 1000000, "totalSupply isn't equal 1000000");
    assert.equal(
      balanceOfAccountOne.toNumber(),
      1000000,
      "first account's balance is not equal to 1000000"
    );
  });

  it("transfer token", async () => {
    const amount = 1000;

    let tokenInstance = await ERC20Token.deployed();

    let balance = await tokenInstance.balanceOf.call(account_one);
    let account_one_starting_balance = balance.toNumber();

    balance = await tokenInstance.balanceOf.call(account_two);
    let account_two_starting_balance = balance.toNumber();

    let isTransferSucceeded = await tokenInstance.transfer.call(
      account_two,
      amount,
      {
        from: account_one,
      }
    );

    assert.equal(
      isTransferSucceeded,
      true,
      "transfer method should return true"
    );

    await tokenInstance.transfer(account_two, amount, {
      from: account_one,
    });

    balance = await tokenInstance.balanceOf.call(account_one);
    let account_one_ending_balance = balance.toNumber();

    balance = await tokenInstance.balanceOf.call(account_two);
    let account_two_ending_balance = balance.toNumber();

    assert.equal(
      account_one_ending_balance,
      account_one_starting_balance - amount,
      "there was an error occured while transfering"
    );

    assert.equal(
      account_two_ending_balance,
      account_two_starting_balance + amount,
      "there was an error occured while transfering"
    );
  });

  it("approve tokens for delegated transfer", async () => {
    const amount = 1000;

    let tokenInstance = await ERC20Token.deployed();

    let isApproveSucceeded = await tokenInstance.approve.call(
      account_two,
      amount,
      {
        from: account_one,
      }
    );

    assert.equal(isApproveSucceeded, true, "approve method should return true");

    tokenInstance
      .approve(account_two, amount, {
        from: account_one,
      })
      .then((receipt) => {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Approval",
          'should be the "Approval" event'
        );
        assert.equal(
          receipt.logs[0].args.owner,
          account_one,
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args.spender,
          account_two,
          1,
          "logs the account the tokens are transferred to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          amount,
          "Logs the transfer amount."
        );
        return tokenInstance.allowance(account_one, account_two);
      })
      .then((allowance) => {
        assert.equal(
          allowance.toNumber(),
          amount,
          "Stores the amount of the delegated transfer."
        );
      });
  });

  it("handles delegated token transfers", async () => {
    let tokenInstance = await ERC20Token.deployed();
    let fromAccount = accounts[2];
    let toAccount = accounts[3];
    let spendingAccount = accounts[4];

    tokenInstance
      .transfer(fromAccount, 100, { from: account_one })
      .then(() => {
        // Approve spendingAccount to spend 10 tokens form fromAccount
        return tokenInstance.approve(spendingAccount, 10, {
          from: fromAccount,
        });
      })
      .then((receipt) => {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Approval",
          'should be the "Approval" event'
        );
        assert.equal(
          receipt.logs[0].args.owner,
          fromAccount,
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args.spender,
          spendingAccount,
          1,
          "logs the account the tokens are transferred to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          10,
          "Logs the transfer amount."
        );
        // Try transferring something larger than the sender's balance
        return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {
          from: spendingAccount,
        });
      })
      .then(assert.fail)
      .catch((error) => {
        assert(
          error.message.indexOf("revert") >= 0,
          "cannot transfer value larger than balance"
        );
        // Try transferring something larger than the approved amount
        return tokenInstance.transferFrom(fromAccount, toAccount, 20, {
          from: spendingAccount,
        });
      })
      .then(assert.fail)
      .catch((error) => {
        assert(
          error.message.indexOf("revert") >= 0,
          "cannot transfer value larger than approved amount"
        );
        // Try transferring something larger than the sender's balance
        return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {
          from: spendingAccount,
        });
      })
      .then((success) => {
        assert.equal(success, true);
        // Try transferring something larger than the sender's balance
        return tokenInstance.transferFrom(fromAccount, toAccount, 10, {
          from: spendingAccount,
        });
      })
      .then((receipt) => {
        // assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Transfer",
          'should be the "Transfer" event'
        );
        assert.equal(
          receipt.logs[0].args.from,
          fromAccount,
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args.to,
          toAccount,
          1,
          "logs the account the tokens are transferred to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          10,
          "logs the transfer amount"
        );
        return tokenInstance.balanceOf(fromAccount);
      })
      .then((balance) => {
        assert.equal(
          balance.toNumber(),
          90,
          "deducts the amount from the sending account"
        );
        return tokenInstance.balanceOf(toAccount);
      })
      .then((balance) => {
        assert.equal(
          balance.toNumber(),
          10,
          "adds the amount from the receiving account"
        );
        return tokenInstance.allowance(fromAccount, spendingAccount);
      })
      .then((allowance) => {
        assert.equal(
          allowance.toNumber(),
          0,
          "deducts the amount from the allowance"
        );
      });
  });
});
