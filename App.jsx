const sender = Ethers.send("eth_requestAccounts", [])[0];

if (!sender)
  return (
    <Web3Connect
      className="LidoStakeFormSubmitContainer"
      connectLabel="Connect with Web3"
    />
  );

return <p>Account: {sender}</p>;
