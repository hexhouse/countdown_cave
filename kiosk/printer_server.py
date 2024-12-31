import asyncio
import websockets

import serial
import sys

ports = [serial.Serial(p, dsrdtr=True, timeout=1) for p in sys.argv[1:]]

async def serve_ws(websocket):
    i = 0

    try:
        await websocket.send('{}')
        while True:
            data = await websocket.recv()
            if data:
                try:
                    ports[i].write(data)
                    i = (i + 1) % len(ports)
                except:
                    sys.exit(1)
            else:
                await websocket.send('{}')
    except websockets.exceptions.ConnectionClosedOK:
        pass

async def main():
    async with websockets.serve(serve_ws, "127.0.0.1", 10018):
        await asyncio.Future()
asyncio.run(main())
