import asyncio
import wish

# Certs created for the tls_echo_server example (adjust paths if needed)
CERTS_DIR = "/home/ysnysnysn/net_http/wish/cpp/certs"

async def main():
    print("Connecting to WiSH server...")
    async with wish.connect(
        "wish://127.0.0.1:8080",
        ca_file=f"{CERTS_DIR}/ca.crt",
        cert_file=f"{CERTS_DIR}/client.crt",
        key_file=f"{CERTS_DIR}/client.key",
    ) as ws:
        print("Connected!")
        await ws.send("Hello from Python!")
        print("Sent: 'Hello from Python!'")
        msg = await ws.recv()
        print(f"Received echo: {msg!r}")

if __name__ == "__main__":
    asyncio.run(main())
