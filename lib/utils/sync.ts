async function syncChange<T>(change: T) {
    try {
        await fetch("/api/bsync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(change)
        });
    } catch (err) {
        // TODO: send toast notification
        console.log("Queued by SW:", change);
    }
}

export { syncChange };