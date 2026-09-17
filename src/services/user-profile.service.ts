import { getUserProfileDummy, setUserProfileDummy } from '@/test-utils/user-profile.dummy';
import type { UserProfile } from '@/types/UserProfile';

const SIMULATED_LATENCY_MS = 400;
const simulateNetworkDelay = () =>
    new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

export async function getUserProfile(): Promise<UserProfile> {
    await simulateNetworkDelay();
    const userProfileData:UserProfile = getUserProfileDummy();
    if (!userProfileData) {
        throw new Error('User Profile data is not available.');
    }
    return userProfileData;
}

export async function updateUserProfile(next: UserProfile): Promise<UserProfile> {
    await simulateNetworkDelay();
    setUserProfileDummy(next);
    return next;
}