from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8e31bd7d657c"
down_revision: Union[str, Sequence[str], None] = "0b8d5b9553ec"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "groups",
        sa.Column("group_id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("professor_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("academic_year", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("(CURRENT_TIMESTAMP)"),
            nullable=False,
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(["professor_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("group_id"),
        sa.UniqueConstraint("name"),
    )

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("classroom_id", sa.Integer(), nullable=True)
        )
        batch_op.create_foreign_key(
            "fk_user_classroom",
            "groups",
            ["classroom_id"],
            ["group_id"],
        )
        batch_op.drop_column("classroom")


def downgrade() -> None:
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("classroom", sa.VARCHAR(), nullable=True)
        )
        batch_op.drop_constraint(
            "fk_user_classroom",
            type_="foreignkey",
        )
        batch_op.drop_column("classroom_id")

    op.drop_table("groups")