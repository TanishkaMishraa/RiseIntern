from pydantic import BaseModel


class CsvImportError(BaseModel):
    row: int
    message: str


class CsvImportResult(BaseModel):
    created: int
    skipped: int
    errors: list[CsvImportError] = []
