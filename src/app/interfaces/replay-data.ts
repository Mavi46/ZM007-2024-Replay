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

export interface ApiUserProfile {
    _id?: { $oid: string } | string;
    name: string;
    email: string;
    status: string;
    linkedIn?: string[];
    qrScanned: boolean;
    facebookData?: string[];
}

export interface UserProfile {
    id: string; // MongoDb Id
    name: string;
    email: string;
    status: string;
    linkedIn?: string[];
    qrScanned: boolean;
    facebookData?: string[];
}