import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { CUSTOMER_TO_LEADER_COLLECTION, FIREBASE_CONFIG } from "@/constants/FirebaseConfig";
import { PushNotificationRecord } from "@/models/PushNotificationRecord";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      throw new Error(
        "Permission not granted to get push token for push notification!"
      );
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      throw new Error(`${e}`);
    }
  } else {
    throw new Error("Must use physical device for push notifications");
  }
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}
export async function sendPushNotification(expoPushToken: string, contractId: string, fullName: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Có hợp đồng chờ kí',
    body: `Có hợp đồng mới chờ kí từ ${fullName}`,
    data: { contractId },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function sendPushNotificationOrder(expoPushToken: string, orderId: string, customerNote: string | null) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Có một đơn hàng mới',
    body: `${orderId} ${customerNote}`,
    data: { orderId, customerNote },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export const saveNotificationToFirestore = async (notification: any, leaderId: string) => {

  const db = InitializeFirestoreDb();

  console.log("Saving notification to Firestore: 11", notification);

  if (!leaderId) {
    console.error("Leader ID is missing. Notification cannot be saved. 11");
    return;
  }

  try {
    const docRef = doc(db, "UserNotificationCollection", leaderId);

    await setDoc(
      docRef,
      {
        notifications: arrayUnion({
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          timestamp: new Date().toString(),
          read: false,
        }),
      },
      { merge: true }
    );

    console.log("Notification saved successfully! 11");
  } catch (error) {
    console.error("Error saving notification: 11", error);
  }
};

export function InitializeFirestoreDb(): Firestore {
  const app = initializeApp(FIREBASE_CONFIG);
  const db = getFirestore(app);
  return db;
}


// export async function AddPushNotificationRecord(
//   db: Firestore,
//   pnRecord: PushNotificationRecord
// ) {
//   try {
//     const docRef = await addDoc(
//       collection(db, LEADER_TO_WORKER_COLLECTION),
//       pnRecord
//     );
//     console.log("docRef:", docRef);
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// }

export async function GetLatestPushNotificationRecordByLeaderId(
  db: Firestore,
  leaderId: string
): Promise<PushNotificationRecord | null> {
  try {
    const pnQuery = query(
      collection(db, CUSTOMER_TO_LEADER_COLLECTION), // Replace with your Firestore collection name
      where("leaderId", "==", leaderId),
      orderBy("date", "desc"), // Order by date in descending order
      limit(1) // Limit to the most recent record
    );
    const querySnapshot = await getDocs(pnQuery);

    if (!querySnapshot.empty) {
      const latestRecord = querySnapshot.docs[0].data();
      console.log("Latest Record:", latestRecord);
      return latestRecord as PushNotificationRecord;
    } else {
      console.log("No records found for leaderId:", leaderId);
      return null;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}