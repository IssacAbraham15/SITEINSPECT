import { data } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Avatars, Client, Databases, ID, Models, Query, Storage, } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.csit321.siteinspect',
    projectId: '67042ded000030656081',
    databaseId: '6704301d0007b1672925',
    userCollectionId: '67043042002423fc2312',
    storageId: '670431570009294870c0',
    onGoingSitesId: '6716ba5b00276587e410',
    completedSitesID:'6716ebfb000a8630b1c8'
}



// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)
    ;


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


export async function getUsername() {
    const currentAccount = await account.get();
    const username = Query.equal("username", currentAccount.name)

    return username
}

// Register User

export async function createUser(email: string, password: string, username: string) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error:any) {
        throw new Error(error);
    }
}

export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error:any) {
        throw new Error(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function Logout() {
    try {
        await account.deleteSession('current');
        await AsyncStorage.removeItem('user'); // Remove the user data from AsyncStorage on logout
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getOnGoingSites = async () => {
    try {
        const sites = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.onGoingSitesId,
        )

        return sites.documents.map((doc: Models.Document) => ({
        $id: doc.$id,
        Name: doc.Name, // Ensure these fields exist in the Document
        Location: doc.Location,
        Progress: doc.Progress,
        Image: doc.image
    }));
    }
    catch (error:any) {
        throw new Error(error)
    }
    
}

export const getcompletedSites = async () => {
    try {
        const sites = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.completedSitesID,
        )

        return sites.documents.map((doc: Models.Document) => ({
        $id: doc.$id,
        Name: doc.Name, // Ensure these fields exist in the Document
        Location: doc.Location,
        Progress: doc.Progress,
        Image: doc.Image
    }));
    }
    catch (error:any) {
        throw new Error(error)
    }
    
}
