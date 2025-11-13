
import click
from flask.cli import with_appcontext
from app import app, db
from models import User

@click.group()
def cli():
    pass

@click.command(name='show_users')
@with_appcontext
def show_users():
    """Prints all users from the database."""
    users = User.query.all()
    if not users:
        print("No users found in the database.")
        return

    print("--- Users in Database ---")
    for user in users:
        print(f"ID: {user.id}, Name: {user.name}, Username: {user.username}, Email: {user.email}, Role: {user.role}")
    print("-------------------------")

cli.add_command(show_users)

if __name__ == "__main__":
    cli()
