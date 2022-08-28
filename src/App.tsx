import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableHighlight,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";
import * as InAppPurchases from "expo-in-app-purchases";
import Toast from "react-native-root-toast";

import { RadioGroup } from "./components/RadioGroup";
import { likeTweet, retweetTweet } from "./utils/twitterApi";

const PRODUCTS_IDS = Platform.select({
  ios: ["like", "retweet"],
  android: ["like", "retweet"],
})!;

export default function App() {
  const [processing, setProcessing] = useState(false);
  const [tweetId, setTweetId] = useState<string>("");
  const [purchaseId, setPurchaseId] = useState<"like" | "retweet">("like");

  const initIAP = async () => {
    // Connect to store
    try {
      await InAppPurchases.connectAsync();
    } catch (e) {
      /* already connected or some other error */
    }

    // Setup purchase listener
    InAppPurchases.setPurchaseListener(
      ({ responseCode, results, errorCode }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          results?.forEach(async (purchase) => {
            if (!purchase.acknowledged) {
              const { productId } = purchase;

              try {
                if (productId === PRODUCTS_IDS[0]) {
                  await likeTweet(tweetId);
                } else if (productId === PRODUCTS_IDS[1]) {
                  await retweetTweet(tweetId);
                }

                // Finish the transaction on platform's end
                InAppPurchases.finishTransactionAsync(purchase, true);
              } catch (e) {
                Toast.show(
                  "Something went wrong. We couldn't like or retweet your tweet"
                );
              }
            }
          });
        } else if (
          responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED
        ) {
          Toast.show("Why did you cancel! 😢");
        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
          Toast.show(
            "User does not have permissions to buy but requested parental approval (iOS only)"
          );
        } else {
          Toast.show("Something went wrong. Error code: " + errorCode);
        }

        setProcessing(false);
      }
    );
  };

  useEffect(() => {
    initIAP();
  }, []);

  const submit = async () => {
    if (tweetId === "") {
      Toast.show("Please enter a tweet id");
    }

    try {
      const { responseCode, results } = await InAppPurchases.getProductsAsync(
        PRODUCTS_IDS
      );

      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        setProcessing(true);
        await InAppPurchases.purchaseItemAsync(purchaseId);
      } else {
        Toast.show("Something went wrong. Error code: " + responseCode);
      }
    } catch (e) {
      Toast.show("Something went wrong");
    }
  };

  return (
    <RootSiblingParent>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.innerContainer}>
            <View>
              <View style={styles.headerContainer}>
                <Text style={styles.header}>Like my tweet</Text>
                <Text style={styles.subHeader}>
                  I can either like or retweet a single tweet for as little as
                  one or two dollars
                </Text>
              </View>

              <RadioGroup
                value={purchaseId}
                onChange={setPurchaseId}
                options={[
                  { value: "like", text: "Like = 0.99$" },
                  { value: "retweet", text: "Retweet = 1.99$" },
                ]}
              />

              <TextInput
                style={styles.textInput}
                value={tweetId}
                onChangeText={setTweetId}
                spellCheck={false}
                placeholder="Enter Tweet Id"
              />
            </View>

            {processing ? (
              <Text>Processing</Text>
            ) : (
              <TouchableHighlight
                style={styles.submitButton}
                onPress={() => {
                  submit();
                }}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableHighlight>
            )}
          </SafeAreaView>
        </TouchableWithoutFeedback>

        <ExpoStatusBar style="auto" />
      </KeyboardAvoidingView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : undefined,
  },
  innerContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    flex: 1,
    justifyContent: "space-between",
  },

  headerContainer: {
    marginBottom: 40,
  },
  header: {
    fontSize: 36,
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
  },

  textInput: {
    height: 40,
    borderBottomWidth: 1,
    marginTop: 44,
  },

  submitButton: {
    marginTop: 24,
    paddingVertical: 18,
    borderRadius: 4,
    backgroundColor: "#1DA1F2",
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
