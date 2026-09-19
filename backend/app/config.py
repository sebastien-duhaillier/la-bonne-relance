from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    supabase_url: str
    supabase_secret_key: SecretStr
    internal_api_key: SecretStr

    brevo_api_key: SecretStr
    brevo_sender_email: str
    brevo_sender_name: str = "La Bonne Relance"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()