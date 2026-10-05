export function getMetaData(value) {
    const metaData = [
        {
            id: 1,
            label: "Full Name",
            type: "text",
            placeholder: "Please enter your full name",
            name: "wallet_name",
            autoComplete: "off",
            required: true
        },
        {
            id: 2,
            label: "Phone Number",
            type: "text",
            placeholder: "Please enter your phone number",
            name: "wallet_phone",
            autoComplete: "off",
            pattern: "^[0-9]{6,14}$",
            onInput: function (event) {
                const value = event.target.value;
                event.target.value = value.replace(/\D/g, '');
            },
            required: true
        },
        {
            id: 3,
            label: "Wallet Address",
            type: "text",
            placeholder: "Please enter your wallet address",
            name: "wallet_address",
            hasQrcode: true,
            autoComplete: "off",
            required: true
        },
        {
            id: 4,
            label: "Currency",
            type: "radio",
            options: [
                { value: "USDT", label: "USDT" },
                { value: "USDC", label: "USDC" },
                { value: "ETH", label: "ETH" },
                { value: "BTC", label: "BTC" }
            ],
            name: "currency",
            autoComplete: "off",
            required: true
        },
        {
            id: 5,
            label: "Network Chain",
            type: "radio",
            options: [
                { value: "TRC 20", label: "TRC 20" },
                { value: "ERC 20", label: "ERC 20" },
                { value: "BTC", label: "BTC" }
            ],
            name: "network_type",
            autoComplete: "off",
            required: true
        }
    ];

    return metaData;
}

