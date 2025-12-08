import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // This is the standard endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // <--- You will paste your ID here in Step 3

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client); // For storing images
export default client;