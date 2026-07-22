from app.tasks.emails import enqueue_email


def send_verification_email(to: str, name: str, verify_url: str) -> None:
    enqueue_email(
        to=to,
        subject="Verify your RiseIntern account",
        body=f"Hi {name},\n\nPlease verify your account: {verify_url}",
    )


def send_password_reset_email(to: str, name: str, reset_url: str) -> None:
    enqueue_email(
        to=to,
        subject="Reset your RiseIntern password",
        body=(
            f"Hi {name},\n\nWe received a request to reset your password. "
            f"This link expires in 30 minutes and can only be used once: {reset_url}\n\n"
            "If you didn't request this, you can safely ignore this email."
        ),
    )


def send_application_status_email(to: str, name: str, internship_title: str, status: str) -> None:
    enqueue_email(
        to=to,
        subject=f"Your application status changed — {internship_title}",
        body=f"Hi {name},\n\nYour application for '{internship_title}' is now: {status}.",
    )
