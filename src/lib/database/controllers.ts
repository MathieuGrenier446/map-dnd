import { 
  collection, 
  addDoc, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";

// WRITING TO FIRESTORE
// Function to add a new document to a collection
export async function addDocument(collectionName: string, data: object) {
    try {
      // Add timestamp
      const docData = {
        ...data,
        createdAt: serverTimestamp()
      };
      
      // Add document to collection
      const docRef = await addDoc(collection(db, collectionName), docData);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }
  
  // Function to update a document
  export async function updateDocument(collectionName: string, docId: string, data: object) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  }
  
  // Function to delete a document
  export async function deleteDocument(collectionName: string, docId: string) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  }
  
  // SUBSCRIBING TO FIRESTORE
  // Function to subscribe to all documents in a collection
  export function subscribeToCollection(collectionName: string, callback: (data: object[])=>void) {
    const collectionRef = collection(db, collectionName);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const documents: object[] = [];
      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(documents);
    }, (error) => {
      console.error("Error subscribing to collection: ", error);
    });
    
    // Return unsubscribe function to stop listening when needed
    return unsubscribe;
  }