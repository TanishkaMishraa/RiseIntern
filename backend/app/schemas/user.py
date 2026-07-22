from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    skills: list[str] = []
    education: str | None = None
    location: str | None = None
    is_active: bool = True
    is_verified: bool = False


class UserUpdate(BaseModel):
    name: str | None = None
    skills: list[str] | None = None
    education: str | None = None
    location: str | None = None
