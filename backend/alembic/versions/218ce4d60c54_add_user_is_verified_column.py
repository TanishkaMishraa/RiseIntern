"""add user is_verified column

Revision ID: 218ce4d60c54
Revises: 30ad81556226
Create Date: 2026-07-22 15:37:39.829803

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '218ce4d60c54'
down_revision: Union[str, None] = '30ad81556226'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # server_default backfills existing rows, which is what makes this safe
    # against a populated production table (plain NOT NULL with no default
    # fails on both SQLite and Postgres once rows exist). Left in place
    # rather than dropped afterward — SQLite has no ALTER COLUMN support to
    # drop it, and it's harmless: it matches the ORM-level default (False)
    # applied on new inserts anyway.
    op.add_column(
        "users",
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.false()),
    )


def downgrade() -> None:
    op.drop_column("users", "is_verified")
