from app.core.email import send_email


def send_verification_email(to: str, name: str, verify_url: str) -> None:
    send_email(
        to=to,
        subject="Verify your RiseIntern account",
        body=f"Hi {name},\n\nPlease verify your account: {verify_url}",
    )


def send_application_status_email(to: str, name: str, internship_title: str, status: str) -> None:
    send_email(
        to=to,
        subject=f"Your application status changed — {internship_title}",
        body=f"Hi {name},\n\nYour application for '{internship_title}' is now: {status}.",
    )
