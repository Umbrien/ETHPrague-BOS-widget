const sender = Ethers.send("eth_requestAccounts", [])[0];

State.init({
  isLogged: !!sender,
});

const requestHandler = (request, response, Utils) => {
  switch (request.type) {
    case "is-logged":
      isLoggedHandler(request, response, Utils);
      break;
  }
};

const isLoggedHandler = (request, response, Utils) => {
  response(request).send(!!sender);
};

const externalAppUrl = "http://localhost:4000/";

return (
  <>
    <a href={externalAppUrl + "scan-package/qr-code-scanning"} target="_blank">
      Scan package
    </a>
    <div>
      <input
        type="text"
        placeholder="Package ID"
        value={state.packageId}
        onChange={(e) => State.update({ packageId: e.target.value })}
      />
      <a
        href={externalAppUrl + "create-package/qr-code-creation"}
        target="_blank"
      >
        Print package
      </a>
    </div>
    {!sender && (
      <Web3Connect
        className="LidoStakeFormSubmitContainer"
        connectLabel="Connect with Web3"
      />
    )}
    <Widget
      src="wendersonpires.near/widget/NearSocialBridgeCore"
      props={{
        externalAppUrl,
        path: props.path,
        initialViewHeight: 740,
        initialPayload: {
          packageId: 0,
        },
        requestHandler,
      }}
    />
  </>
);
