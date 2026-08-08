from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from settings import Settings

engine = create_engine(Settings().DATABASE_URL)

def get_session(): # pragma: no cover

    """
    When the tests are run, this line will never be covered. 
    Because the tests will replace this block with a fixture at runtime here. 
    A way to escape from this and explain to the coverage that this block should not be considered 
    in the coverage is to add the comment # pragma: no cover. This will make him ignore this block in the count.
    """
    
    with Session(engine) as session:
        yield session