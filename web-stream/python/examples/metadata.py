"""Preserve message opcodes and explicitly own a shared Runtime."""

import asyncio

from web_stream import (
    ConnectionClosedOK,
    Limits,
    Runtime,
    WEB_STREAM_OPCODE_BINARY,
    WEB_STREAM_OPCODE_METADATA,
    WEB_STREAM_OPCODE_TEXT,
    connect,
    serve,
)


async def echo_messages(conn):
    try:
        while True:
            message = await conn.recv_message()
            if message.opcode == WEB_STREAM_OPCODE_TEXT:
                await conn.send_text(message.data.decode("utf-8"))
            elif message.opcode == WEB_STREAM_OPCODE_BINARY:
                await conn.send_binary(message.data)
            elif message.opcode == WEB_STREAM_OPCODE_METADATA:
                await conn.send_metadata(message.data)
    except ConnectionClosedOK:
        pass  # Transport failures still propagate to the server's error handler.


async def main():
    limits = Limits(max_message_size=1024, receive_buffer_limit=4096,
                    write_buffer_limit=4096)
    # Close clients and listeners before leaving their Runtime's context.
    async with Runtime() as runtime:
        async with serve(echo_messages, "127.0.0.1", 0,
                         runtime=runtime, limits=limits) as server:
            async with connect(f"webstream://127.0.0.1:{server.port}",
                               runtime=runtime, limits=limits) as conn:
                await conn.send_metadata(b"metadata")
                message = await conn.recv_message()
                print(message.opcode, message.data)


if __name__ == "__main__":
    asyncio.run(main())
