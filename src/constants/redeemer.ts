const redeemer = {
    mint: {
        data: {
            alternative: 0,
            fields: [],
        },
        tag: "MINT",
    },
    burn: {
        data: {
            alternative: 1,
            fields: [],
        },
        tag: "BURN",
    },
    update: {
        data: {
            alternative: 0,
            feilds: [],
        },
        tag: "UPDATE",
    },
    remove: {
        data: {
            alternative: 1,
            feilds: [],
        },
        tag: "REMOVE",
    },
} as const;

export default redeemer;
