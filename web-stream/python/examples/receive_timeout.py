"""Cancel a waiting receive with a deadline, then receive again."""

import asyncio

from web_stream import connect, serve


async def main():
    allow_reply = asyncio.Event()

    async def reply(conn):
        # Gate delivery so the first receive times out without a timing race.
        await allow_reply.wait()
        await conn.send("still usable")

    async with serve(reply, "127.0.0.1", 0) as server:
        async with connect(f"webstream://127.0.0.1:{server.port}") as conn:
            try:
                await asyncio.wait_for(conn.recv(), timeout=0.01)
            except asyncio.TimeoutError:
                print("receive timed out")
            finally:
                allow_reply.set()
            print(await asyncio.wait_for(conn.recv(), timeout=2.0))


if __name__ == "__main__":
    asyncio.run(main())
