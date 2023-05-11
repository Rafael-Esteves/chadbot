import axios from "axios";

export class API {
  constructor() {
    if (window.location.pathname.includes("/main")) {
      if (
        localStorage.getItem("tinder_api_key") &&
        localStorage.getItem("customer_id")
      ) {
        this.token = localStorage.getItem("tinder_api_key");
        this.customer_id = localStorage.getItem("customer_id");
      } else window.location.href = "/";
    } else {
      this.token = "";
    }
    this.instance = axios.create({
      baseURL: window.location.origin,
    });
  }

  //stripe
  getCustomer = async (phone) => {
    const response = await this.instance.post("/api/get-customer", {
      phone: phone,
    });
    return response.data;
  };

  getSubscription = async () => {
    const response = await this.instance.post("/api/get-subscription", {
      customer_id: this.customer_id,
    });
    return response.data;
  };

  getPortalUrl = async () => {
    const response = await this.instance.post("/api/get-portal-url", {
      customer_id: this.customer_id,
    });
    return response.data;
  };

  //pre auth

  sendSms = async (phone) => {
    return await this.instance.post("/api/send-sms", {
      phone: phone,
    });
  };

  getToken = async (code, phone) => {
    const response = await this.instance.post("/api/get-token", {
      code: code,
      phone: phone,
    });
    return response.data.data;
  };

  //after auth
  tinderReqAuth = async (path, body = {}) => {
    const response = await this.instance
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

  getMatches = async (next_page_token = null) => {
    const resp = await this.tinderReqAuth("/api/get-matches", {
      next_page_token: next_page_token,
    });
    return resp;
  };

  getProfile = async (person_id) => {
    return await this.tinderReqAuth("api/get-profile", {
      person_id: person_id,
    });
  };

  getMessages = async (match_id) => {
    return await this.tinderReqAuth("api/get-messages", {
      match_id: match_id,
    });
  };

  sendMessage = async (match_id, message) => {
    return await this.tinderReqAuth("api/send-message", {
      match_id: match_id,
      message: message,
    });
  };

  getSelf = async () => {
    return await this.tinderReqAuth("api/get-self");
  };

  likeRecs = async () => {
    return await this.tinderReqAuth("api/like-recs");
  };

  //openAI
  generateMessage = async (chat_body) => {
    const resp = await this.instance
      .post("api/generate-message", {
        chat_body: chat_body,
      })
      .catch((err) => {
        throw err;
      });
    return resp.data;
  };
}
