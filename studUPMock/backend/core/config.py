from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding='utf-8',
        extra="ignore",
        )
    DATABASE_URL: str = Field(init = False)
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPRIE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7



settings = Settings()