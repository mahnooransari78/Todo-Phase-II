"""Database migration for AI-powered Todo Chatbot feature

Revision ID: 001_add_chatbot_tables
Revises:
Create Date: 2026-01-16 18:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
import uuid
from datetime import datetime

# revision identifiers
revision = '001_add_chatbot_tables'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create conversations table
    op.create_table('conversation',
        sa.Column('id', sqlmodel.sql.sqltypes.GUID(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_conversation_user_id', 'conversation', ['user_id'])
    op.create_index('ix_conversation_updated_at', 'conversation', ['updated_at'])

    # Create messages table
    op.create_table('message',
        sa.Column('id', sqlmodel.sql.sqltypes.GUID(), nullable=False),
        sa.Column('conversation_id', sqlmodel.sql.sqltypes.GUID(), nullable=False),
        sa.Column('sender', sa.Enum('user', 'assistant', name='sender_enum'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('tool_calls', sa.Text(), nullable=True),
        sa.Column('tool_responses', sa.Text(), nullable=True),
        sa.Column('error', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversation.id'], )
    )
    op.create_index('ix_message_conversation_id', 'message', ['conversation_id'])
    op.create_index('ix_message_timestamp', 'message', ['timestamp'])


def downgrade() -> None:
    # Drop messages table
    op.drop_index('ix_message_timestamp')
    op.drop_index('ix_message_conversation_id')
    op.drop_table('message')

    # Drop conversations table
    op.drop_index('ix_conversation_updated_at')
    op.drop_index('ix_conversation_user_id')
    op.drop_table('conversation')

    # Drop enum
    op.execute("DROP TYPE IF EXISTS sender_enum;")