import uuid


def genUniqueID(collisionMap: dict = {}) -> str:
    """
    Generates a unique ID

    Parameters:
        collisionMap: A map of IDs that are already in use to prevent collisions
    Returns:
        return (str): 8 characters long random string
    """
    while True:
        uid = str(uuid.uuid4())[:8]
        if uid not in collisionMap:
            return uid
