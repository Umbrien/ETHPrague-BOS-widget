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

const hexNumberDateToHuman = (hexNumber) => {
  const date = new Date(parseInt(hexNumber, 16) * 1000);
  return date
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/\//g, ".");
};

const getSnapshot = (id) => {
  const encodedData = iface.encodeFunctionData("snapshots", [id]);

  return Ethers.provider()
    .call({
      to: contract,
      data: encodedData,
    })
    .then((result) => {
      const decoded = iface.decodeFunctionResult("snapshots", result);

      const handler = decoded.handler[0];
      const description = decoded.description;
      const date = hexNumberDateToHuman(decoded.created);

      return { handler, description, date };
    });
};

State.init({
  isLogged: !!sender,
  packageId: 1,
  packageInfo: null,
});

const requestHandler = (request, response, Utils) => {
  switch (request.type) {
    case "is-logged":
      isLoggedHandler(request, response, Utils);
      break;
    case "is-admin":
      isAdminHandler(request, response, Utils);
      break;
    case "get-wallet-address":
      getWalletAddressHandler(request, response, Utils);
      break;
    case "make-me-admin":
      makeMeAdminHandler(request, response, Utils);
      break;
    case "make-me-user":
      makeMeUserHandler(request, response, Utils);
      break;
    case "create-package":
      createPackageHandler(request, response, Utils);
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

const getWalletAddressHandler = (request, response, Utils) => {
  console.log("[BOS] get-wallet-address");
  response(request).send(sender);
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
      response(request).send(false);
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
      response(request).send(false);
    });
};

const createPackageHandler = (request, response, Utils) => {
  console.log("[BOS] create-package");
  const suschain = new ethers.Contract(
    contract,
    abiObj,
    Ethers.provider().getSigner()
  );

  suschain
    .addPackageSnapshot(0, request.payload)
    .then((result) => {
      console.log("[BOS] create-package result", result);
      response(request).send(true);
    })
    .catch((err) => {
      console.log("[BOS] create-package error", err);
      response(request).send(false);
    });
};

const externalAppUrl = "http://localhost:4000/";

const handlePackageIdInput = (e) => {
  State.update({ packageId: e.target.value, packageInfo: null });
};

const handleGetPackageInfo = () => {
  if (state.packageId) {
    getSnapshot(state.packageId).then((result) => {
      State.update({ packageInfo: result });
    });
  }
};

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
        onChange={handlePackageIdInput}
      />
      {state.packageInfo === null ? (
        <button onClick={handleGetPackageInfo}>Get package info</button>
      ) : (
        <a
          href={`${externalAppUrl}create-package/qr-code-creation?id=${state.packageId}&name=${state.packageInfo.handler}&description=${state.packageInfo.description}&date=${state.packageInfo.date}`}
          target="_blank"
        >
          Print package
        </a>
      )}
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
