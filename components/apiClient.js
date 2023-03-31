import axios from "axios";

export class API {
  constructor() {
    if (localStorage.getItem("tinder_api_key"))
      this.token = localStorage.getItem("tinder_api_key");
    else window.location.href = "/";
  }
  tinderReq = async (path, body = {}) => {
    console.log({
      token: this.token,
      ...body,
    });
    const response = await axios
      .post(path, {
        token: this.token,
        ...body,
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);

          if (error.response.status == 401) {
            localStorage.removeItem("tinder_api_key");
            window.location.href = "/";
          }

          throw error.response.status;
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
        throw {
          status: 500,
          message: "Internal Server Error",
        };
      });
    return response.data;
  };

  getMatches = async () => {
    return await this.tinderReq("/api/get-matches");
  };

  getProfile = async (person_id) => {
    return await this.tinderReq("api/get-profile", {
      person_id: person_id,
    });
  };

  getMessages = async (match_id) => {
    return await this.tinderReq("api/get-messages", {
      match_id: match_id,
    });
  };

  sendMessage = async (match_id, message) => {
    return await this.tinderReq("api/send-message", {
      match_id: match_id,
      message: message,
    });
  };

  getSelf = async () => {
    return await this.tinderReq("api/get-self");
  };

  generateMessage = async (chat_body) => {
    const resp = await axios
      .post("api/generate-message", {
        chat_body: chat_body,
      })
      .catch((err) => {
        throw err;
      });
    return resp.data;
  };
}
