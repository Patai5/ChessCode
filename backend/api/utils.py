import uuid
from typing import Any


def genUniqueID(collisionMap: dict[str, Any] = {}) -> str:
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


def string_to_int_range(value: str | None, default: int, min: int | None, max: int | None = None) -> int:
    """
    Converts a string to an integer and checks if it is within the specified range
    """
    numberValue = default
    if value and value.isdigit():
        numberValue = int(value)

    if min and numberValue < min:
        return min

    if max and numberValue > max:
        return max

    return numberValue
