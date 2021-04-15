const DEXclientContract = {
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
                "inputs": [],
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
                "name": "connectPair",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "statusConnection",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "createNewEmptyWalletByOwner",
                "inputs": [
                    {
                        "name": "rootAddr",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "createStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "createNewPairByOwner",
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
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "createStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "setNewEmptyWallet",
                "id": "0x7",
                "inputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getWalletByRoot",
                "inputs": [
                    {
                        "name": "rootAddr",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "wallet",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "getAddressWTON",
                "inputs": [],
                "outputs": [
                    {
                        "name": "wallet",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "setPair",
                "id": "0x3",
                "inputs": [
                    {
                        "name": "arg0",
                        "type": "address"
                    },
                    {
                        "name": "arg1",
                        "type": "address"
                    },
                    {
                        "name": "arg2",
                        "type": "address"
                    },
                    {
                        "name": "arg3",
                        "type": "address"
                    },
                    {
                        "name": "arg4",
                        "type": "address"
                    },
                    {
                        "name": "arg5",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setPairDepositA",
                "id": "0x8",
                "inputs": [
                    {
                        "name": "arg0",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setPairDepositB",
                "id": "0x9",
                "inputs": [
                    {
                        "name": "arg0",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getPair",
                "inputs": [
                    {
                        "name": "value0",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "pairRootA",
                        "type": "address"
                    },
                    {
                        "name": "pairReserveA",
                        "type": "address"
                    },
                    {
                        "name": "clientDepositA",
                        "type": "address"
                    },
                    {
                        "name": "pairRootB",
                        "type": "address"
                    },
                    {
                        "name": "pairReserveB",
                        "type": "address"
                    },
                    {
                        "name": "clientDepositB",
                        "type": "address"
                    },
                    {
                        "name": "curPair",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "sendTokens",
                "inputs": [
                    {
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "tokens",
                        "type": "uint128"
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "transmitter",
                        "type": "address"
                    },
                    {
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "name": "body",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "sendTokens2",
                "inputs": [
                    {
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "tokens",
                        "type": "uint128"
                    },
                    {
                        "name": "grams",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "transmitter",
                        "type": "address"
                    },
                    {
                        "name": "receiver",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "sendTokens3",
                "inputs": [
                    {
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "name": "tokens",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "transmitter",
                        "type": "address"
                    },
                    {
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "name": "body",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "getPairClientWallets",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "walletA",
                        "type": "address"
                    },
                    {
                        "name": "walletB",
                        "type": "address"
                    },
                    {
                        "name": "pairReturn",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "getAllDataPreparation",
                "inputs": [],
                "outputs": [
                    {
                        "name": "pairKeysR",
                        "type": "address[]"
                    },
                    {
                        "name": "rootKeysR",
                        "type": "address[]"
                    }
                ]
            },
            {
                "name": "showContractAddress",
                "inputs": [],
                "outputs": [
                    {
                        "name": "dexclient",
                        "type": "address"
                    },
                    {
                        "name": "dexclientUINT256",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "makeABdepositToPair",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    },
                    {
                        "name": "qtyA",
                        "type": "uint128"
                    },
                    {
                        "name": "qtyB",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "makeDepositStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "makeAdepositToPair",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    },
                    {
                        "name": "qtyA",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "makeDepositStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "makeBdepositToPair",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    },
                    {
                        "name": "qtyB",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "makeDepositStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "returnDepositFromPair",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "returnDepositStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "processLiquidity",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    },
                    {
                        "name": "qtyA",
                        "type": "uint128"
                    },
                    {
                        "name": "qtyB",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "processLiquidityStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "returnAllLiquidity",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "returnLiquidityStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "processSwapA",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    },
                    {
                        "name": "qtyA",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "processSwapStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "processSwapB",
                "inputs": [
                    {
                        "name": "pairAddr",
                        "type": "address"
                    },
                    {
                        "name": "qtyB",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "processSwapStatus",
                        "type": "bool"
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
                "name": "setWrapper",
                "id": "0x89",
                "inputs": [
                    {
                        "name": "arg0",
                        "type": "address"
                    },
                    {
                        "name": "arg1",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "wrapTON",
                "inputs": [
                    {
                        "name": "qtyTONgrams",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "processWrapStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "unwrapTON",
                "inputs": [],
                "outputs": [
                    {
                        "name": "processUnwrapStatus",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "callbackUnwrapTON",
                "id": "0x24",
                "inputs": [
                    {
                        "name": "value0",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "rootDEX",
                "inputs": [],
                "outputs": [
                    {
                        "name": "rootDEX",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "wTONroot",
                "inputs": [],
                "outputs": [
                    {
                        "name": "wTONroot",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "wTONwrapper",
                "inputs": [],
                "outputs": [
                    {
                        "name": "wTONwrapper",
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
            }
        ],
        "data": [
            {
                "key": 1,
                "name": "rootDEX",
                "type": "address"
            },
            {
                "key": 2,
                "name": "wTONroot",
                "type": "address"
            },
            {
                "key": 3,
                "name": "wTONwrapper",
                "type": "address"
            }
        ],
        "events": []
    },
    tvc: "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",
};
module.exports = { DEXclientContract };