"""Reconnect after clean EOF and explicitly release a finite retry iterator."""

import asyncio
import itertools

from web_stream import ConnectionClosedError, connect, serve


async def main():
    sessions = itertools.count(1)

    async def greet(conn):
        await conn.send(f"session {next(sessions)}")
        # Returning closes this session; the client opens another one.

    async with serve(greet, "127.0.0.1", 0) as server:
        # Opening failures use connect's retry policy. Failures in the loop
        # body need an application decision, as demonstrated below.
        attempts = connect(f"webstream://127.0.0.1:{server.port}").__aiter__()
        completed = 0
        try:
            async for conn in attempts:
                try:
                    async for message in conn:
                        print(message)
                except ConnectionClosedError:
                    # This read-only greeting protocol can safely reconnect.
                    # Do not blindly replay sends with an unknown outcome.
                    continue
                completed += 1
                if completed == 2:
                    break
        finally:
            # Early break alone does not await async-generator finalization.
            await attempts.aclose()


if __name__ == "__main__":
    asyncio.run(main())
