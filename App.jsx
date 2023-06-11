const contract = "0xAB1b0f09494d208D403a00ae905DeEea47807012";

const abiObj = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "AdminAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "AdminRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "Log",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "addr", type: "address" },
            ],
            internalType: "struct SupplyChain.Department",
            name: "handler",
            type: "tuple",
          },
          { internalType: "uint256", name: "parent", type: "uint256" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint256", name: "created", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        indexed: false,
        internalType: "struct SupplyChain.PackageSnapshot",
        name: "snapshot",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "PackageSnapshotAdded",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "parent", type: "uint256" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "addPackageSnapshot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "admins",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "makeMeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "makeMeUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "snapshotNumber",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "snapshots",
    outputs: [
      {
        components: [
          { internalType: "address", name: "addr", type: "address" },
        ],
        internalType: "struct SupplyChain.Department",
        name: "handler",
        type: "tuple",
      },
      { internalType: "uint256", name: "parent", type: "uint256" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "created", type: "uint256" },
      { internalType: "bool", name: "exists", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const iface = new ethers.utils.Interface(abiObj);

const sender = Ethers.send("eth_requestAccounts", [])[0];

const getAdmins = () => {
  const encodedData = iface.encodeFunctionData("admins", [sender]);

  return Ethers.provider()
    .call({
      to: contract,
      data: encodedData,
    })
    .then((result) => {
      return iface.decodeFunctionResult("admins", result)[0];
    });
};

State.init({
  isLogged: !!sender,
});

const requestHandler = (request, response, Utils) => {
  switch (request.type) {
    case "is-logged":
      isLoggedHandler(request, response, Utils);
      break;
    case "is-admin":
      isAdminHandler(request, response, Utils);
      break;
    case "make-me-admin":
      makeMeAdminHandler(request, response, Utils);
      break;
    case "make-me-user":
      makeMeUserHandler(request, response, Utils);
      break;
  }
};

const isLoggedHandler = (request, response, Utils) => {
  console.log("[BOS] sender", sender);
  response(request).send(!!sender);
};

const isAdminHandler = (request, response, Utils) => {
  console.log("[BOS] get-admins");
  getAdmins().then((isAdmin) => {
    response(request).send(isAdmin);
  });
};

const makeMeAdminHandler = (request, response, Utils) => {
  console.log("[BOS] make-me-admin");
  const suschain = new ethers.Contract(
    contract,
    abiObj,
    Ethers.provider().getSigner()
  );

  suschain
    .makeMeAdmin()
    .then((result) => {
      console.log("[BOS] make-me-admin result", result);
      response(request).send(true);
    })
    .catch((err) => {
      console.log("[BOS] make-me-admin error", err);
    });
};

const makeMeUserHandler = (request, response, Utils) => {
  console.log("[BOS] make-me-user");
  const suschain = new ethers.Contract(
    contract,
    abiObj,
    Ethers.provider().getSigner()
  );

  suschain
    .makeMeUser()
    .then((result) => {
      console.log("[BOS] make-me-user result", result);
      response(request).send(true);
    })
    .catch((err) => {
      console.log("[BOS] make-me-user error", err);
    });
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
        initialViewHeight: 1240,
        initialPayload: {
          packageId: 0,
        },
        requestHandler,
      }}
    />
  </>
);
