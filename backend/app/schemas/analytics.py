from pydantic import BaseModel


class ListingApplicationCount(BaseModel):
    title: str
    applications: int


class RecruiterAnalytics(BaseModel):
    applicationsPerListing: list[ListingApplicationCount]


class SignupPoint(BaseModel):
    date: str
    count: int


class AdminAnalytics(BaseModel):
    totalUsers: int
    totalListings: int
    totalApplications: int
    signupsOverTime: list[SignupPoint]
