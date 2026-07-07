import { userProfileDummy } from '@/test-utils/user-profile.dummy';


export async function getUserProfile() { 
    await new Promise(resolve => setTimeout(resolve, 300));
    return userProfileDummy;
}