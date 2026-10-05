"use client"

const LiveChatSupport = ({
    children = "Live Chat Support"
}) => {
    const handleOpenLiveChat = () => {
        if (window.LC_API && typeof window.LC_API.open_chat_window === 'function') {
            window.LC_API.open_chat_window();
        } else {
            console.error("Live Chat widget not initialized or method not found.");
        }
    };

    return (
        <button
            onClick={handleOpenLiveChat}
            className="primaryButton"
        >
            {children}
        </button>
    );
};

export default LiveChatSupport;