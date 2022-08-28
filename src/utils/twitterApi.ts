import axios from "axios";

const apiBaseUrl = "https://my-twitter-api.vercel.app/api/";

export const likeTweet = async (tweetId: string) => {
  try {
    await axios.post("like", undefined, {
      params: { id: tweetId },
      baseURL: apiBaseUrl,
    });
  } catch (error) {
    console.log(error);
  }
};

export const isTweetLiked = async (tweetId: string) => {
  try {
    const {
      data: { liked },
    } = await axios.get<{ liked: boolean }>("liked", {
      params: { id: tweetId },
      baseURL: apiBaseUrl,
    });

    return liked;
  } catch (error) {
    console.log(error);
  }
};

export const retweetTweet = async (tweetId: string) => {
  try {
    await axios.post("retweet", undefined, {
      params: { id: tweetId },
      baseURL: apiBaseUrl,
    });
  } catch (error) {
    console.log(error);
  }
};

export const isTweetRetweeted = async (tweetId: string) => {
  try {
    const {
      data: { retweeted },
    } = await axios.get<{ retweeted: boolean }>("retweeted", {
      params: { id: tweetId },
      baseURL: apiBaseUrl,
    });

    return retweeted;
  } catch (error) {
    console.log(error);
  }
};
