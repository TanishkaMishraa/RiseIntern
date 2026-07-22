from pydantic import BaseModel


class ListingApplicationCount(BaseModel):
    title: str
    applications: int


class FunnelStage(BaseModel):
    status: str
    count: int


class PopularSkill(BaseModel):
    skill: str
    count: int


class RecruiterAnalytics(BaseModel):
    applicationsPerListing: list[ListingApplicationCount]
    funnel: list[FunnelStage]
    popularSkills: list[PopularSkill]


class SignupPoint(BaseModel):
    date: str
    count: int


class AdminAnalytics(BaseModel):
    totalUsers: int
    totalListings: int
    totalApplications: int
    signupsOverTime: list[SignupPoint]
