import type { UserProfile } from '@/types/UserProfile';

let userProfileDummy: UserProfile = {
    id: "user-1",
    name: "Ana Fellow",
    email: "ana.fellow@devfellowship.dev",
    age: 24,
    avatarUrl: "https://i.pravatar.cc/64?u=user-1",
};

export function getUserProfileDummy() : UserProfile {
    return userProfileDummy;
}

export function setUserProfileDummy(next: UserProfile) : void {
    userProfileDummy = next;
}
