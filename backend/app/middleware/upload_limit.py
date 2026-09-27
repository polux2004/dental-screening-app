from collections import deque

from starlette.responses import JSONResponse

from app.config import settings


class UploadLimitMiddleware:
    """Limit the complete multipart request before FastAPI parses its form."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or scope["method"] != "POST" or scope["path"] != "/detect/":
            await self.app(scope, receive, send)
            return

        # Allow a small margin for multipart headers and form fields.
        body_limit = settings.max_upload_bytes + 64 * 1024
        headers = dict(scope["headers"])
        try:
            declared_size = int(headers.get(b"content-length", b"0"))
        except ValueError:
            declared_size = 0
        if declared_size > body_limit:
            await self._reject(scope, receive, send)
            return

        messages = deque()
        received_size = 0
        while True:
            message = await receive()
            if message["type"] == "http.disconnect":
                return
            messages.append(message)
            received_size += len(message.get("body", b""))
            if received_size > body_limit:
                await self._reject(scope, receive, send)
                return
            if not message.get("more_body", False):
                break

        async def replay():
            if messages:
                return messages.popleft()
            return await receive()

        await self.app(scope, replay, send)

    @staticmethod
    async def _reject(scope, receive, send):
        response = JSONResponse(
            {"error": "La solicitud supera el tamaño máximo permitido para una imagen."},
            status_code=413,
        )
        await response(scope, receive, send)
