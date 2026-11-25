"""Exchange text and binary with a local server; see examples/README.md."""

import asyncio

from web_stream import connect, serve


async def echo(conn):
    async for message in conn:
        await conn.send(message)


async def main():
    async with serve(echo, "127.0.0.1", 0) as server:
        async with connect(f"webstream://127.0.0.1:{server.port}") as conn:
            await conn.send("hello")
            print(await conn.recv())
            await conn.send(b"binary")
            print(await conn.recv())


if __name__ == "__main__":
    asyncio.run(main())
