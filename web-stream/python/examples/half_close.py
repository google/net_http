"""Finish a request with EOF, then receive a final response."""

import asyncio

from web_stream import connect, serve


async def count_bytes(conn):
    total = 0
    async for chunk in conn:
        total += len(chunk)
    # Clean inbound EOF ends iteration, but sending is still available.
    await conn.send(f"received {total} bytes")
    # The server closes this connection when the handler returns.


async def main():
    async with serve(count_bytes, "127.0.0.1", 0) as server:
        async with connect(f"webstream://127.0.0.1:{server.port}") as conn:
            await conn.send(b"hello")
            await conn.send(b" world")
            await conn.write_eof()
            print(await conn.recv())
            async for message in conn:
                print(message)  # This protocol has no further responses.
            await conn.wait_closed()


if __name__ == "__main__":
    asyncio.run(main())
