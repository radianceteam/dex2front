const DEXrootContract = {
    abi: {
        "ABI version": 2,
        "header": [
            "pubkey",
            "time",
            "expire"
        ],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                    {
                        "name": "wTONroot",
                        "type": "address"
                    },
                    {
                        "name": "wTONwrapper",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "sendTransfer",
                "inputs": [
                    {
                        "name": "dest",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint128"
                    },
                    {
                        "name": "bounce",
                        "type": "bool"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setDEXclientCode",
                "inputs": [
                    {
                        "name": "code",
                        "type": "cell"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setDEXpairCode",
                "inputs": [
                    {
                        "name": "code",
                        "type": "cell"
                    }
                ],
                "outputs": []
            },
            {
                "name": "computeDEXclientAddr",
                "inputs": [
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "createDEXclient",
                "inputs": [
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "deployedAddress",
                        "type": "address"
                    },
                    {
                        "name": "statusCreate",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "computeDEXpairAddr",
                "inputs": [
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    },
                    {
                        "name": "createId",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "computeDEXpairAddrWithId",
                "inputs": [
                    {
                        "name": "pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "userId",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    },
                    {
                        "name": "createId",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "createDEXpair",
                "id": "0x111",
                "inputs": [
                    {
                        "name": "root0",
                        "type": "address"
                    },
                    {
                        "name": "root1",
                        "type": "address"
                    },
                    {
                        "name": "createId",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getPairByRoots01",
                "inputs": [
                    {
                        "name": "root0",
                        "type": "address"
                    },
                    {
                        "name": "root1",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "getPairByRoots10",
                "inputs": [
                    {
                        "name": "root1",
                        "type": "address"
                    },
                    {
                        "name": "root0",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "getRootsByPair",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "root0",
                        "type": "address"
                    },
                    {
                        "name": "root1",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "getBalanceTONgrams",
                "inputs": [],
                "outputs": [
                    {
                        "name": "balanceTONgrams",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "codeDEXclient",
                "inputs": [],
                "outputs": [
                    {
                        "name": "codeDEXclient",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "codeDEXpair",
                "inputs": [],
                "outputs": [
                    {
                        "name": "codeDEXpair",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "wrappedTONroot",
                "inputs": [],
                "outputs": [
                    {
                        "name": "wrappedTONroot",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "TONwrapper",
                "inputs": [],
                "outputs": [
                    {
                        "name": "TONwrapper",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "test1",
                "inputs": [],
                "outputs": [
                    {
                        "name": "test1",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "test2",
                "inputs": [],
                "outputs": [
                    {
                        "name": "test2",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "test3",
                "inputs": [],
                "outputs": [
                    {
                        "name": "test3",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "test4",
                "inputs": [],
                "outputs": [
                    {
                        "name": "test4",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "test5",
                "inputs": [],
                "outputs": [
                    {
                        "name": "test5",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "pairs",
                "inputs": [],
                "outputs": [
                    {
                        "components": [
                            {
                                "name": "root0",
                                "type": "address"
                            },
                            {
                                "name": "root1",
                                "type": "address"
                            }
                        ],
                        "name": "pairs",
                        "type": "map(address,tuple)"
                    }
                ]
            },
            {
                "name": "pairKeys",
                "inputs": [],
                "outputs": [
                    {
                        "name": "pairKeys",
                        "type": "address[]"
                    }
                ]
            },
            {
                "name": "clients",
                "inputs": [],
                "outputs": [
                    {
                        "name": "clients",
                        "type": "map(address,uint256)"
                    }
                ]
            },
            {
                "name": "clientKeys",
                "inputs": [],
                "outputs": [
                    {
                        "name": "clientKeys",
                        "type": "address[]"
                    }
                ]
            }
        ],
        "data": [],
        "events": []
    },
    tvc: "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",
};
module.exports = { DEXrootContract };
