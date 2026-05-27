from datetime import timezone
from dateutil import parser


def parse_api_datetime(value):
    """Parse ISO string from client and store as UTC naive datetime."""
    if value is None:
        return None
    dt = parser.isoparse(value)
    if dt.tzinfo is not None:
        return dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt


def format_api_datetime(dt):
    """Serialize UTC naive datetime for API/FullCalendar (always with Z suffix)."""
    if dt is None:
        return None
    return dt.isoformat() + "Z"
