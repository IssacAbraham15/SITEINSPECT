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
        Name: doc.Name, 
        Location: doc.Location,
        Progress: doc.Progress,
        Image: doc.Image
    }));
    }
    catch (error:any) {
        throw new Error(error)
    }
    
}

export const getConstructsBySiteId = async (siteName: string) => {
    try {
        const collectionId = siteName.toLowerCase().replace(/\s+/g, '').slice(0, 36);
        const siteSpecificDatabaseId = `${siteName.toLowerCase().replace(/\s+/g, '')}-db`.slice(0, 36);

        const constructs = await databases.listDocuments(
            appwriteConfig.databaseId,
            collectionId
        );

        const constructData = await Promise.all(
            constructs.documents.map(async (doc: Models.Document) => {
                // Truncate and format the constructId to meet Appwrite's requirements
                const constructId = `${siteName.toUpperCase().replace(/\s+/g, '')}-${doc.Id}`.slice(0, 36);

                
                const inspections = await databases.listDocuments(
                    siteSpecificDatabaseId,
                    constructId,
                    [
                        Query.orderDesc("InspectionDate"),
                        Query.limit(1),
                    ]
                );

                const latestInspection = inspections.documents[0];
                const lastInspectionDate = latestInspection?.InspectionDate || null;
                const progress = latestInspection?.Progress || null;

                return {
                    id: doc.Id,
                    constructType: doc.ConstructType,
                    lastInspection: lastInspectionDate,
                    progress: progress,
                };
            })
        );

        return constructData;
    } catch (error: any) {
        console.error("Error fetching constructs with inspection data:", error);
        throw new Error(error);
    }
};

interface InspectionData {
  id: string;
  height: number;
  width: number;
  date: string;
  progress: number;
  notes: string;
  image: string | null; // Image can be null if not available
}

export async function getLatestInspectionData(siteName: string, constructId: string): Promise<{ latest: InspectionData; secondLatest?: InspectionData }> {
  try {
    // Construct the database and collection IDs
    const databaseId = `${siteName.toLowerCase().replace(/\s+/g, '')}-db`.slice(0, 36);
    const collectionId = `${siteName.toUpperCase().replace(/\s+/g, '')}-${constructId.toUpperCase()}`.slice(0, 36);

    // Query the collection for documents, sorted by inspection date (descending)
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.orderDesc('InspectionDate'),
      Query.limit(2), // Fetch only the two most recent documents
    ]);

    const [latestDoc, secondLatestDoc] = response.documents;

    const latest = {
      id: latestDoc.ID,
      height: latestDoc.Height, 
      width: latestDoc.Width,
      date: latestDoc.InspectionDate,
      progress: latestDoc.Progress,
      notes: latestDoc.Notes || "...", // Default to "..." if Notes are missing
      image: latestDoc.Image || null, // Default to null if no image is available
    };

    const secondLatest = secondLatestDoc
      ? {
          id: secondLatestDoc.ID,
          height: secondLatestDoc.Height,
          width: secondLatestDoc.Width,
          date: secondLatestDoc.InspectionDate,
          progress: secondLatestDoc.Progress,
          notes: secondLatestDoc.Notes || "...", // Default for missing Notes
          image: secondLatestDoc.Image || null, // Default to null for missing Image
        }
      : undefined;

    return { latest, secondLatest };
  } catch (error) {
    console.error('Error fetching inspection data:', error);
    throw new Error('Failed to retrieve inspection data');
  }
}



export async function getAllInspectionDates(siteName: string, constructId: string): Promise<string[]> {
  try {
    const databaseId = `${siteName.toLowerCase().replace(/\s+/g, '')}-db`.slice(0, 36); // Format database name based on site name
    const collectionId = `${siteName.toUpperCase().replace(/\s+/g, '')}-${constructId.toUpperCase()}`.slice(0, 36); // Format collection ID as "<SITE>-<CONSTRUCT>"

    // Retrieve all documents, selecting only the 'date' field for efficiency
    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.select(['InspectionDate']),
      Query.orderDesc('InspectionDate'), // Sort dates in descending order
    ]);

    // Extract and format the dates, ensuring each date appears only once
    const dates = response.documents.map(doc => doc.InspectionDate);
    const uniqueDates = Array.from(new Set(dates)); // Remove any duplicates
    return uniqueDates;
    
  } catch (error) {
    console.error('Error fetching all inspection dates:', error);
    return [];
  }
}

export async function getInspectionDataByDate(siteName: string, constructId: string, date: string): Promise<InspectionData | null> {
    try {
        const databaseId = `${siteName.toLowerCase().replace(/\s+/g, '')}-db`.slice(0, 36);
        const collectionId = `${siteName.toUpperCase().replace(/\W+/g, '')}-${constructId.toUpperCase()}`.slice(0, 36);

        const response = await databases.listDocuments(databaseId, collectionId, [
            Query.equal('InspectionDate', date), // Query for the specific date
        ]);

        if (response.documents.length === 0) {
            return null; // No inspection data found for the given date
        }

        const doc = response.documents[0]; // Assuming we want the first document found
        const latest = {
            id: doc.ID,
            height: doc.Height, 
            width: doc.Width,
            date: doc.InspectionDate,
            progress: doc.Progress,
            notes: doc.Notes || "...", // Default to "..." if Notes are missing
            image: doc.Image || null, // Default to null if no image is available
        };

        return latest;
    } catch (error) {
        console.error('Error fetching inspection data by date:', error);
        throw new Error('Failed to retrieve inspection data by date');
    }
}

export const addInspectionData = async (siteName: string, constructId: string, inspectionData: any) => {
  const databaseId = `${siteName.toLowerCase().replace(/\s+/g, '')}-db`.slice(0, 36);
  const collectionId = `${siteName.toUpperCase().replace(/\W+/g, '')}-${constructId.toUpperCase()}`.slice(0, 36);

  try {
    const response = await databases.createDocument(databaseId, collectionId, 'unique()', inspectionData);
    return response;
  } catch (error) {
    console.error("Error adding new inspection data:", error);
    return null;
  }
};