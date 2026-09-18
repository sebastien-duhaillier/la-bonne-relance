from hmac import compare_digest
from typing import Annotated

from fastapi import Header, HTTPException, status

from app.config import get_settings


def verify_internal_api_key(
    api_key: Annotated[
        str | None,
        Header(alias="X-Internal-API-Key"),
    ] = None,
) -> None:
    settings = get_settings()
    expected_key = settings.internal_api_key.get_secret_value()

    if api_key is None or not compare_digest(api_key, expected_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Clé API interne invalide.",
        )