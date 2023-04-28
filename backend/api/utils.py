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


def string_to_int_range(value: str | None, default: int, min: int = None, max: int = None):
    """
    Converts a string to an integer and checks if it is within the specified range
    """
    if not isinstance(value, int):
        if value and value.isdigit():
            value = int(value)
        else:
            value = default
    if min and value < min:
        value = min
    elif max and value > max:
        value = max
    return value
