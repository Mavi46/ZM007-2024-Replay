export interface Period {
    start_date: string;
    end_date: string;
}

export interface Location {
    city: string;
    region: string;
    country: string;
}

export interface Experience {
    job_title: string;
    company: string;
    period: Period;
    location: Location;
    description: string;
    skills: string[];
}

export interface Course {
    course_name: string;
    period: Period;
}

export interface LinkedInText {
    content: string;
}

export interface UserProfile {
    name: string;
    email: string;
    status: string;
    text1: string;
    text2: string;
    text3: string;
}