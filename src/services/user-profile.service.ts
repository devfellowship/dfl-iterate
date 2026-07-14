import { userProfileDummy } from '@/test-utils/user-profile.dummy';
import { UserProfile } from '@/types/UserProfile';


export async function getUserProfile(): Promise<UserProfile> {
    const SIMULATED_LATENCY_MS = 400;
    const simulateNetworkDelay = () =>
    new Promise<void>((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    await simulateNetworkDelay();
    const userProfileData = userProfileDummy;

    if (!userProfileData) {
        throw new Error('User Profile data is not available.');
    }

    return userProfileData;
}